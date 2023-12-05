export function getConnectionId(tab) {
  return [
    ...(tab?.windowId ? [tab?.windowId] : []),
    ...(tab?.id ? [tab?.id] : []),
  ].join(":");
}
