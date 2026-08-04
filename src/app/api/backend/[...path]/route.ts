import { auth } from "@clerk/nextjs/server";
import { type NextRequest } from "next/server";
import { buildBackendUrl } from "@/lib/backend-url";

const forwardedHeaders = ["accept", "content-type", "if-match"];
const maxRequestBytes = 1_048_576;

async function forward(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  let url: string;

  try {
    url = buildBackendUrl(
      process.env.BACKEND_URL ?? "http://localhost:8080",
      path,
      request.nextUrl.searchParams.toString(),
    );
  } catch {
    return Response.json(
      {
        title: "Rota inválida",
        status: 404,
        detail: "O recurso solicitado não existe.",
        code: "backend_path_not_allowed",
      },
      { status: 404 },
    );
  }

  const { getToken } = await auth();
  const token = await getToken();
  if (!token) {
    return Response.json(
      {
        title: "Autenticação necessária",
        status: 401,
        detail: "Entre para continuar.",
        code: "authentication_required",
      },
      { status: 401 },
    );
  }

  const headers = new Headers();
  for (const name of forwardedHeaders) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }
  headers.set("authorization", `Bearer ${token}`);

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > maxRequestBytes) return requestTooLarge();
  const body =
    request.method === "GET" || request.method === "HEAD"
      ? undefined
      : await request.arrayBuffer();
  if (body && body.byteLength > maxRequestBytes) return requestTooLarge();

  const response = await fetch(url, {
    method: request.method,
    headers,
    body,
    redirect: "manual",
  });

  const responseHeaders = new Headers();
  const contentType = response.headers.get("content-type");
  if (contentType) responseHeaders.set("content-type", contentType);
  const location = response.headers.get("location");
  if (location?.startsWith("/api/v1/")) {
    responseHeaders.set(
      "location",
      location.replace("/api/v1/", "/api/backend/v1/"),
    );
  }

  return new Response(response.body, {
    status: response.status,
    headers: responseHeaders,
  });
}

function requestTooLarge() {
  return Response.json(
    {
      title: "Requisição muito grande",
      status: 413,
      detail: "O conteúdo excede o limite de 1 MB.",
      code: "request_too_large",
    },
    { status: 413 },
  );
}

export const GET = forward;
export const POST = forward;
export const PUT = forward;
export const PATCH = forward;
export const DELETE = forward;
