import type { Machine } from "../models/machine";

export async function fetchMachines(): Promise<Machine[]> {
  const response = await fetch("/api/machines");

  if (!response.ok) {
    throw new Error(`Machines request failed with status ${response.status}`);
  }

  return (await response.json()) as Machine[];
}
