/// <reference types="chrome" />
import { convertQueryMap } from "./convertQueryMap";
import { getConnectionId } from "./getConnectionId";
import { getMappedQuery } from "./getMappedQuery";

let connections = new Map();
let queriesMap = new Map();

export default function registerQueriesMap(queriesMapObject, mutationFn) {
  queriesMap = convertQueryMap(queriesMapObject);

  chrome.runtime.lastError = undefined;
  chrome.runtime.onConnect.addListener((port) => {
    connections.set(getConnectionId(port?.sender?.tab), port);

    if (
      port.sender?.tab?.id !== undefined &&
      port.sender?.frameId !== undefined &&
      port.sender?.documentId !== undefined
    ) {
      port.onMessage.addListener((message) => {
        const query = getMappedQuery(queriesMap, message?.queryKey);

        if (query?.listenerFn && !message.variables) {
          query
            .listenerFn(message)
            .then((result) => {
              port.postMessage({
                ...message,
                state: {
                  ...message.state,
                  data: result,
                  status: "success",
                  fetchStatus: "idle",
                },
              });

              if (query?.broadcast) {
                chrome.tabs.query({}).then((activeTabs) => {
                  for (const tab of activeTabs) {
                    const portName = getConnectionId(tab);
                    const connectedPort = connections.get(portName);
                    if (connectedPort) {
                      connectedPort.postMessage({
                        ...message,
                        state: {
                          ...message.state,
                          data: result,
                          status: "success",
                          fetchStatus: "idle",
                        },
                      });
                    }
                  }
                });
              }
            })
            .catch((error) => {
              port.postMessage({
                ...message,
                state: {
                  ...message.state,
                  data: null,
                  status: "error",
                  fetchStatus: "idle",
                  error,
                },
              });
              throw error;
            });
        }
      });

      port.onDisconnect.addListener(() => {
        const portName = getConnectionId(port?.sender?.tab);
        connections.delete(portName);
      });
    }
  });

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.variables) {
      mutationFn(message).then((result) => {
        sendResponse(result);
        return result;
      });
    }

    return true;
  });
}
