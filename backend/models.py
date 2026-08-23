from pydantic import BaseModel, Field
from enum import Enum
from typing import List, Dict

class ZoneEnum(str, Enum):
    Zone_A = "Zone_A"
    Zone_B = "Zone_B"
    Zone_C = "Zone_C"

class ProfileEnum(str, Enum):
    asthma_child = "asthma_child"
    healthy_adult = "healthy_adult"
    elderly_cardio = "elderly_cardio"

class SparklinePoint(BaseModel):
    time: str
    aqi: float

class ForecastResponse(BaseModel):
    zone: ZoneEnum
    current_aqi: float
    current_no2: float
    current_traffic: float
    forecast: List[SparklinePoint]
    risk_level: str  # green, amber, red
    offset: float
    noise_factor: float

class DriftRequest(BaseModel):
    duration: int = Field(default=5, ge=1, le=50, description="Number of requests the drift will persist")

class DriftResponse(BaseModel):
    zone: ZoneEnum
    drift_injected: bool
    message: str

class MonitorResponse(BaseModel):
    zone: ZoneEnum
    anomaly: bool
    residual: float
    threshold: float = 25.0
    forecasted_aqi: float
    actual_aqi: float

class AgentStep(BaseModel):
    agent: str  # Monitor, Orchestrator, Alert, Policy
    timestamp: str
    thought: str

class OrchestrateRequest(BaseModel):
    zone: ZoneEnum
    anomaly: bool
    residual: float

class OrchestrateResponse(BaseModel):
    zone: ZoneEnum
    dispatched_action: str  # ALERT, POLICY, NONE
    accuracy_before: float
    accuracy_after: float
    steps: List[AgentStep]

class ShapleyContribution(BaseModel):
    feature: str
    value: float
    type: str  # risk-increasing (orange) or risk-reducing (green)

class ExplainResponse(BaseModel):
    zone: ZoneEnum
    contributions: List[ShapleyContribution]
    sum_contributions: float
    residual: float = 0.0

class PersonalizeResponse(BaseModel):
    profile: ProfileEnum
    risk_score: float = Field(..., ge=0.0, le=1.0)
    risk_level: str  # HIGH, LOW, HIGH
    advisory: str
    formula: str
