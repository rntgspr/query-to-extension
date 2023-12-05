import { zipQueryKey } from "./zipQueryKey";

export function convertQueryMap(queriesMapModel) {
  return new Map(
    queriesMapModel.map((item) => [
      JSON.stringify(zipQueryKey(item.queryKey)),
      item,
    ])
  );
}
