# query-to-extension

Plugin that connects react-query to chrome extension service worker.

Current version stills in beta, use at your own risk.

Typing still needs to be well implemented.

### file that runs in your popup, pages or scripts
Connect your react-query instance (Queryclient) to the extension service worker
listeners.

```javascript
// queryClient.ts
import { QueryClient } from "@tanstack/react-query";
import { connectContextToExtension } from "query-to-extension";

const queryClient = new QueryClient(/* ... */);

connectContextToExtension(queryClient, {
  // here you can define your own connection name
  connectionName: "chrome-extension-boilerplate-script",
});

export default queryClient;
```

### file that runs in your service worker
Register queries in your service worker runtime, using chrome extension api.
Sets an arrangement of listeners for each described query and one for mutations,
data sent to listeners, will return back as a query value.

```javascript
// service-wroker.ts
import { registerQueriesMap } from "query-to-extension";

import { QUERY_COUNTER, QUERY_DATA } from "../queryIds";

// receives message from interface and delivery it back directly to query `data`;
/* (context: MappedQueryListenerMessage) => Promise<any> */
import serviceData from "./serviceData";
import serviceCounter from "./serviceCounter";

// receives the same data as mutation receives as message directly from interface and delivery
// it back to mutation function;
/* (context: any) => Promise<any> */
import mutationFn from "./mutationFn";

type MyQueryMap = Parameters<typeof registerQueriesMap>[0];

// you can pass the necessary mutation response type
type MutationResponseType = {
  /* ... */
};

const queriesMap = [
  {
    queryKey: QUERY_DATA,
    listenerFn: serviceData,
    broadcast: true,
  },
  {
    queryKey: QUERY_COUNTER,
    listenerFn: serviceCounter,
    broadcast: true,
  },
  /* ... */
] as MyQueryMap;

registerQueriesMap<MutationResponseType>(queriesMap, mutationFn);
```

### Component implementation:
Your component imlplementation is even simpler, all query fucntion complexity now
goes to the service worker runtime and you don't need to worry about it in the
component.

```javascript
/* ... rest of your component ... */

const queryData = useQuery({
  queryKey: [...QUERY_DATA, { from: "popup" }],
  initialData: -1,
  // no query function is necessary here, service worker listener will replace it
});

/* ... rest of your component ... */
```