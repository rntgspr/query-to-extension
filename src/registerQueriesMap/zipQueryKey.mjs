export function zipQueryKey(queryKey) {
  return queryKey.reduce(
    (result, item) => (typeof item === "string" ? [...result, item] : result),
    []
  );
}
