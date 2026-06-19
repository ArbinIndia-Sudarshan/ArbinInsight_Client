import dgram from "dgram";
import { WebSocketServer } from "ws";

const UDP_PORT = 45678;
const WS_PORT = 8121;

const udp = dgram.createSocket("udp4");
const wss = new WebSocketServer({ port: WS_PORT });

udp.on("message", (msg) => {
  const text = msg.toString();

  console.log("UDP:", text);

  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(text);
    }
  });
});

udp.bind(UDP_PORT, () => {
  console.log(`Listening on UDP ${UDP_PORT}`);
});

console.log(`WebSocket on ws://localhost:${WS_PORT}`);
