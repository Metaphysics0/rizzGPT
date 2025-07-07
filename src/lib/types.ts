export interface RizzGPTFormData {
  source: string;
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
