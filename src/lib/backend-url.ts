export function buildBackendUrl(
  origin: string,
  segments: string[],
  query: string,
): string {
  if (
    segments[0] !== "v1" ||
    segments.some(
      (segment) =>
        !segment ||
        segment === "." ||
        segment === ".." ||
        segment.includes("/"),
    )
  ) {
    throw new Error("backend_path_not_allowed");
  }

  const base = origin.replace(/\/$/, "");
  const path = segments.map(encodeURIComponent).join("/");
  return `${base}/api/${path}${query ? `?${query}` : ""}`;
}
