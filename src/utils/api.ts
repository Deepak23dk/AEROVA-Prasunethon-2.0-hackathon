const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const API_KEY = 'aerova-hackathon-2026';

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const headers = {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY,
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMsg = `HTTP Error ${response.status}`;
    try {
      const errJson = await response.json();
      errorMsg = errJson.detail || errorMsg;
    } catch {
      // ignore
    }
    throw new Error(errorMsg);
  }

  return response.json();
}

export interface SparklinePoint {
  time: string;
  aqi: number;
}

export interface ForecastData {
  zone: string;
  current_aqi: number;
  current_no2: number;
  current_traffic: number;
  forecast: SparklinePoint[];
  risk_level: 'green' | 'amber' | 'red';
  offset: number;
  noise_factor: number;
}

export interface MonitorData {
  zone: string;
  anomaly: boolean;
  residual: number;
  threshold: number;
  forecasted_aqi: number;
  actual_aqi: number;
}

export interface AgentStep {
  agent: 'Monitor' | 'Orchestrator' | 'Alert' | 'Policy';
  timestamp: string;
  thought: string;
}

export interface OrchestrateData {
  zone: string;
  dispatched_action: 'ALERT' | 'POLICY' | 'NONE';
  accuracy_before: number;
  accuracy_after: number;
  steps: AgentStep[];
}

export interface ShapleyContribution {
  feature: string;
  value: number;
  type: 'risk-increasing' | 'risk-reducing';
}

export interface ExplainData {
  zone: string;
  contributions: ShapleyContribution[];
  sum_contributions: number;
  residual: number;
}

export interface PersonalizeData {
  profile: string;
  risk_score: number;
  risk_level: 'HIGH' | 'LOW';
  advisory: string;
  formula: string;
}

export const api = {
  getForecast: (zone: string): Promise<ForecastData> => 
    fetchWithAuth(`/api/forecast/${zone}`),
    
  injectDrift: (zone: string, duration = 5): Promise<{ zone: string; drift_injected: boolean; message: string }> => 
    fetchWithAuth(`/api/inject-drift/${zone}`, {
      method: 'POST',
      body: JSON.stringify({ duration }),
    }),
    
  getMonitor: (zone: string): Promise<MonitorData> => 
    fetchWithAuth(`/api/agent/monitor/${zone}`),
    
  orchestrate: (zone: string, monitorData: MonitorData): Promise<OrchestrateData> => 
    fetchWithAuth(`/api/agent/orchestrate/${zone}`, {
      method: 'POST',
      body: JSON.stringify(monitorData),
    }),
    
  getExplain: (zone: string): Promise<ExplainData> => 
    fetchWithAuth(`/api/explain/${zone}`),
    
  getPersonalize: (profile: string): Promise<PersonalizeData> => 
    fetchWithAuth(`/api/personalize/${profile}`),
};
