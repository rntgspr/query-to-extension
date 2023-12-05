import { zipQueryKey } from "./zipQueryKey";

export function getMappedQuery(queriesMap, queryKey) {
  const query = queriesMap.get(JSON.stringify(zipQueryKey(queryKey ?? [])));
  return query;
}
