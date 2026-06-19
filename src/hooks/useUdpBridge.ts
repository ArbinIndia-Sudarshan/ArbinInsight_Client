import { useEffect, useState } from "react";
import type { BeaconPayload } from "../models/bridge";
import { connectUdpBridge, type UdpBridgeState } from "../services/udpBridge";

export function useUdpBridge(): UdpBridgeState {
  const [beacon, setBeacon] = useState<BeaconPayload | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const connection = connectUdpBridge({
      onBeacon: (payload) => {
        setBeacon(payload);
        setError(null);
      },
      onStatusChange: ({ isConnected: nextConnected, error: nextError }) => {
        setIsConnected(nextConnected);
        setError(nextError);
      },
    });

    return () => connection.close();
  }, []);

  return { beacon, isConnected, error };
}
