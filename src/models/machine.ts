import type { MachineTone } from "./dashboard";

export type MachineStatus = "Running" | "Idle" | "Unsafe" | "Down" | "Offline";
export type ChannelStatus = "Running" | "Idle" | "Unsafe" | "Active" | "Failed" | "Completed";
export type TestResult = "Passed" | "Failed" | "Unsafe" | "In Progress";

export type MeasurementValue = {
  name: string;
  value: number;
  unit: string;
};

export type MachineOverviewMetrics = {
  uptimeHours: number;
  downtimeHours: number;
  runningHours: number;
  batteriesTested: number;
  passed: number;
  failed: number;
  usagePercent: number;
  channelsInUse: number;
  totalChannels: number;
};

export type ChannelTestDetails = {
  batteryId: string;
  chemistry: string;
  cycleCount: number;
  temperatureC: number;
  internalResistanceMOhm: number;
  stateOfHealth: number;
  startedAt: string;
  updatedAt: string;
  notes: string;
  measurements: MeasurementValue[];
};

export type MachineChannel = {
  id: string;
  name: string;
  testName: string;
  slot: number;
  status: ChannelStatus;
  result: TestResult;
  progress: number;
  voltage: number;
  current: number;
  capacityAh: number;
  energyWh: number;
  durationMinutes: number;
  details: ChannelTestDetails;
};

export type Machine = {
  id: string;
  name: string;
  status: MachineStatus;
  tone: MachineTone;
  operator: string;
  ipAddress: string;
  lastSeenUtc?: string;
  channelsLabel: string;
  currentLabel: string;
  voltageLabel: string;
  capacityLabel: string;
  capacityValue: string;
  percent: number;
  metrics: MachineOverviewMetrics;
  channels: MachineChannel[];
};
