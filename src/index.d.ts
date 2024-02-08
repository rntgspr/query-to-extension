import type { QueryKey, QueryClient } from "@tanstack/react-query";

export type MappedQueryListenerMessage<T = any, M = any> = {
  queryKey: QueryKey;
  data?: T;
  meta?: M;
};

type MappedQueryListener = (context: MappedQueryListenerMessage) => void;

type MappedQuery = {
  queryKey: QueryKey;
  listenerFn: MappedQueryListener;
  broadcast?: boolean;
};

type QueryMap = Array<MappedQuery>;

export function registerQueriesMap<M = any>(
  queriesMap: QueryMap,
  mutationFn: (message: any) => Promise<M>
): Promise<void>;

type ConnectionOptions = {
  connectionName: string;
};

export function connectContextToExtension(
  client: QueryClient,
  options?: ConnectionOptions
): Promise<void>;

declare module "query-to-extension";
