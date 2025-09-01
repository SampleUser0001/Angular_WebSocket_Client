// Read runtime-configured WebSocket endpoint from a global set in public/env.js
export const environment = {
  production: true,
  // Cast to any to avoid TS complaints if the type is not declared globally.
  websocketUrl: (window as any).SERVER_URL as string
};
