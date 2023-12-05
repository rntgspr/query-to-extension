import addDefaultFunctions from "./addDefaultFunctions";

export default async function connectContextToExtension(queryClient, options) {
  addDefaultFunctions(queryClient);

  const port = chrome.runtime.connect({
    name: options.connectionName,
    includeTlsChannelId: true,
  });

  const queryCache = queryClient.getQueryCache();

  queryCache.subscribe((queryEvent) => {
    const {
      query: { queryHash, queryKey, state },
    } = queryEvent;

    if (
      queryEvent?.type === "updated" &&
      queryEvent?.action?.type === "fetch"
    ) {
      port.postMessage({
        connectionName: options.connectionName,
        type: "updated",
        queryHash,
        queryKey,
        state,
      });
    }
  });

  port.onMessage.addListener((message) => {
    const { type, queryHash, queryKey, state } = message;

    const query = queryCache.get(queryHash);

    if (type === "updated") {
      if (query) {
        query.setState(state);
        return;
      }

      queryCache.build(
        queryClient,
        {
          queryKey,
          queryHash,
        },
        state
      );
    } else if (type === "removed" && query) {
      queryCache.remove(query);
    }
  });

  return queryClient;
}
