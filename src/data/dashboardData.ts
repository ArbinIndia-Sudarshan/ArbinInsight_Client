import type { Period } from "../models/dashboard";

export const periods: Period[] = ["Daily", "Weekly", "Monthly", "Yearly"];

export const activity = [
  { time: "19:30", text: "Test Passed on Channel 5" },
  { time: "18:20", text: "Test Failed on Channel 8" },
  { time: "17:30", text: "System Check Completed" },
  { time: "16:55", text: "Maintenance Window Closed" },
  { time: "15:40", text: "Operator Session Refreshed" },
];

export const heatmapColors = Array.from({ length: 66 }, (_, index) => {
  const warm = [6, 13, 20, 27, 35, 44, 51, 59];
  const alert = [17, 31, 40];

  if (alert.includes(index)) return "#df4b43";
  if (warm.includes(index)) return "#f3bb3d";
  return "#4ba95a";
});
