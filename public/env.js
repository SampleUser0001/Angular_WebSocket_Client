// This file is served as a static asset and loaded before the Angular app.
// Amplify build can overwrite this at build time to inject the runtime URL.
// Example (in amplify.yml build phase):
//   echo "window.SERVER_URL='wss://your-websocket-endpoint.example';" > public/env.js

// Default/fallback value. Replace at build time.
window.SERVER_URL = 'wss://example.websocket.endpoint';

