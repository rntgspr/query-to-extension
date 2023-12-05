import type { QueryKey, QueryClient } from "@tanstack/react-query";

type MappedQueryListenerMessage<K, T = any, M = any> = {
  queryKey: K;
  data?: T;
  meta?: M;
};

type MappedQueryListener<K> = (context: MappedQueryListenerMessage<K>) => void;

type MappedQuery<K> = {
  queryKey: K;
  listenerFn: MappedQueryListener<K>;
  broadcast?: boolean;
};

type QueryMap<K> = Array<MappedQuery<K>>;

export function registerQueriesMap<K = QueryKey, M = any>(
  queriesMap: QueryMap<K>,
  mutationFn: (variables: any) => Promise<M>
): Promise<void>;

type ConnectionOptions = {
  connectionName: string;
};

export function connectContextToExtension(
  client: QueryClient,
  options?: ConnectionOptions
): Promise<void>;

declare module "query-to-extension";
