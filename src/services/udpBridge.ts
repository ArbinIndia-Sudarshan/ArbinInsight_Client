import type { BeaconPayload } from "../models/bridge";

export type UdpBridgeState = {
  beacon: BeaconPayload | null;
  isConnected: boolean;
  error: string | null;
};

export type UdpBridgeHandlers = {
  onBeacon: (payload: BeaconPayload) => void;
  onStatusChange: (state: Pick<UdpBridgeState, "isConnected" | "error">) => void;
};

const DEFAULT_WS_URL = "ws://localhost:8121";

export function connectUdpBridge(
  handlers: UdpBridgeHandlers,
  wsUrl: string = DEFAULT_WS_URL,
) {
  const socket = new WebSocket(wsUrl);
  let closedByClient = false;

  socket.onopen = () => {
    handlers.onStatusChange({ isConnected: true, error: null });
  };

  socket.onmessage = (event) => {
    const payload = parseBridgeMessage(String(event.data));
    if (payload) {
      handlers.onBeacon(payload);
    } else {
      handlers.onStatusChange({
        isConnected: socket.readyState === WebSocket.OPEN,
        error: "Received invalid UDP bridge payload.",
      });
    }
  };

  socket.onerror = () => {
    handlers.onStatusChange({
      isConnected: false,
      error: "Unable to connect to the UDP bridge.",
    });
  };

  socket.onclose = () => {
    if (!closedByClient) {
      handlers.onStatusChange({
        isConnected: false,
        error: "UDP bridge connection closed.",
      });
    }
  };

  return {
    close: () => {
      closedByClient = true;
      socket.close();
    },
  };
}

function parseBridgeMessage(raw: string): BeaconPayload | null {
  const cleaned = raw.replace(/^UDP:\s*/, "").trim();
  if (!cleaned) return null;

  try {
    return JSON.parse(cleaned) as BeaconPayload;
  } catch {
    return null;
  }
}
