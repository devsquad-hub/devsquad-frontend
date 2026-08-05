export type LoadState<T> =
  | { kind: "ready"; data: T }
  | { kind: "empty"; data: T }
  | { kind: "error"; error: unknown };

export async function loadState<T>(
  loader: () => Promise<T>,
  isEmpty: (value: T) => boolean,
): Promise<LoadState<T>> {
  try {
    const data = await loader();
    return isEmpty(data) ? { kind: "empty", data } : { kind: "ready", data };
  } catch (error) {
    return { kind: "error", error };
  }
}
