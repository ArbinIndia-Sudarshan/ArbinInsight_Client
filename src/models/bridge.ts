export type BeaconPayload = {
  appId: string;
  version: string;
  stationName: string;
  machineName: string;
  apiBaseUrl: string;
  apiPort: number;
  isOnline: boolean;
  timestampUtc: string;
};
