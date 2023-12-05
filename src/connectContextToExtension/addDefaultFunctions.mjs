export default function addDefaultFunctions(client) {
  let defaultOptions = client.getDefaultOptions();

  // setting default functions for queries
  const queries = {
    ...defaultOptions?.queries,
    queryFn: (context) => client.getQueryData(context.queryKey),
  };

  // setting default functions for mutations
  const mutations = {
    ...defaultOptions?.mutations,
    mutationFn: async (variables) =>
      await chrome.runtime.sendMessage({
        variables,
      }),
  };

  defaultOptions = {
    ...defaultOptions,
    queries,
    mutations,
  };

  // setting default options, returning client
  client?.setDefaultOptions(defaultOptions);

  return client;
}
