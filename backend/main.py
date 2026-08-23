import time
from fastapi import FastAPI, Request, Depends, HTTPException, status, Path
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from backend.config import DEMO_API_KEY, API_KEY_HEADER
from backend.models import (
    ZoneEnum, ProfileEnum, ForecastResponse, DriftRequest,
    DriftResponse, MonitorResponse, OrchestrateResponse,
    ExplainResponse, PersonalizeResponse
)
from backend import services

# Initialize SlowAPI rate limiter
limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title="Aerova (FAXAQ) Research API",
    description="Backend service simulating agentic drift detection and federated mitigation for Aerova.",
    version="1.0.0"
)

# Wire Rate Limiter exception handler
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Configure CORS for local development and production URLs
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify Vercel domains. Using * for hackathon flexibility.
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Key Validation Middleware
@app.middleware("http")
async def api_key_middleware(request: Request, call_next):
    # Permit preflight pre-requests and interactive swagger documentation
    if request.method == "OPTIONS" or not request.url.path.startswith("/api"):
        return await call_next(request)
        
    api_key_header_val = request.headers.get(API_KEY_HEADER)
    if api_key_header_val != DEMO_API_KEY:
        return JSONResponse(
            status_code=status.HTTP_401_UNAUTHORIZED,
            content={"detail": f"Unauthorized: Missing or invalid API key in header '{API_KEY_HEADER}'"}
        )
    
    return await call_next(request)

# Endpoints
@app.get("/api/forecast/{zone}", response_model=ForecastResponse)
@limiter.limit("60/minute")
def get_forecast(
    request: Request, 
    zone: ZoneEnum = Path(..., description="The city zone identifier (Zone_A, Zone_B, Zone_C)")
):
    """
    Returns synthetic forecast and current AQI index per zone,
    incorporating paper-specific offsets and noise.
    """
    try:
        return services.get_zone_forecast(zone.value)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/inject-drift/{zone}", response_model=DriftResponse)
@limiter.limit("10/minute")
def inject_drift(
    request: Request,
    zone: ZoneEnum = Path(..., description="The city zone to inject drift into"),
    drift_req: DriftRequest = None
):
    """
    Simulates injection of covariate data drift (NO2 and traffic spike) into the selected zone.
    Rate limited to prevent abuse.
    """
    duration = drift_req.duration if drift_req else 5
    try:
        return services.inject_drift_into_zone(zone.value, duration)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/agent/monitor/{zone}", response_model=MonitorResponse)
def monitor_zone(
    request: Request,
    zone: ZoneEnum = Path(..., description="The zone to monitor for residual drift")
):
    """
    Computes model residuals vs threshold of 25.0. Returns True anomaly if drift was injected.
    """
    try:
        return services.monitor_zone(zone.value)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/agent/orchestrate/{zone}", response_model=OrchestrateResponse)
def orchestrate_react(
    request: Request,
    zone: ZoneEnum = Path(..., description="The zone that triggered the anomaly"),
    payload: MonitorResponse = None
):
    """
    Executes the simulated ReAct Orchestrator loop (Observe -> Reason -> Act -> Re-observe)
    to retrain models locally and recover accuracy from 35.9% to 77.4%.
    """
    if not payload or not payload.anomaly:
        raise HTTPException(status_code=400, detail="Cannot orchestrate recovery without active anomaly.")
    try:
        # Simulate slight server reasoning overhead for UX realism (200ms)
        time.sleep(0.2)
        return services.orchestrate_react_loop(zone.value, payload.residual)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/explain/{zone}", response_model=ExplainResponse)
def explain_zone_shapley(
    request: Request,
    zone: ZoneEnum = Path(..., description="The zone to explain risk features for")
):
    """
    Returns exact local Shapley values (SHAP) attributions for ozone, temperature, humidity, etc.
    """
    try:
        return services.get_shapley_explain(zone.value)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/personalize/{profile}", response_model=PersonalizeResponse)
def personalize_profile_risk(
    request: Request,
    profile: ProfileEnum = Path(..., description="Citizen health risk profile identifier")
):
    """
    Calculates and returns personalized risk assessment metrics and guidance based on medical profile.
    """
    try:
        return services.get_personalized_risk(profile.value)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
