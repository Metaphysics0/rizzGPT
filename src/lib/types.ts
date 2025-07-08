import type { SupportedApps } from "./constants/supported-apps.constant";

export interface RizzGPTFormData {
  source?: SupportedApps;
  duration: number;
  objective: string;
  notes: string;
}

export interface GeneratedResponse {
  explanation: string;
  responses: string[];
}

export interface Option {
  id: string;
  name: string;
  icon: string;
}

export interface ObjectiveOption {
  id: string;
  name: string;
  emoji: string;
}
