export function actionRequest(
  payload?: Record<string, unknown>,
  method = "POST",
): RequestInit {
  if (!payload) return { method };

  return {
    method,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  };
}
