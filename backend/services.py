import time
import random
from typing import Dict, List, Tuple
from datetime import datetime, timedelta
from backend.models import (
    ZoneEnum, ProfileEnum, SparklinePoint, ForecastResponse,
    MonitorResponse, OrchestrateResponse, AgentStep,
    ShapleyContribution, ExplainResponse, PersonalizeResponse
)

# Simulated in-memory drift state
drift_state: Dict[str, bool] = {
    "Zone_A": False,
    "Zone_B": False,
    "Zone_C": False
}

drift_counters: Dict[str, int] = {
    "Zone_A": 0,
    "Zone_B": 0,
    "Zone_C": 0
}

# Non-IID zone configurations from the paper
ZONE_CONFIGS = {
    "Zone_A": {"offset": 5.0, "noise_factor": 1.0, "base_aqi": 35.0},
    "Zone_B": {"offset": 25.0, "noise_factor": 1.3, "base_aqi": 52.0},
    "Zone_C": {"offset": 12.0, "noise_factor": 0.8, "base_aqi": 42.0}
}

def get_timestamp() -> str:
    return datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")

def get_zone_forecast(zone: str) -> Dict:
    config = ZONE_CONFIGS[zone]
    is_drifted = drift_state[zone]
    
    # Decrement drift counter if active
    if is_drifted:
        drift_counters[zone] -= 1
        if drift_counters[zone] <= 0:
            drift_state[zone] = False
            
    # Base AQI plus offset plus simulated daily cycle noise
    base_aqi = config["base_aqi"] + config["offset"]
    
    # Generate 7-hour sparkline forecast
    forecast_points = []
    now = datetime.now()
    
    for i in range(7):
        time_str = (now + timedelta(hours=i)).strftime("%H:%M")
        # Apply sinusoidal daily cycle
        cycle = 8.0 * (1.0 if i % 2 == 0 else -0.5)
        point_aqi = base_aqi + cycle + (random.uniform(-3, 3) * config["noise_factor"])
        
        # If drift is active and it's the current/forecasted time, spike it
        if is_drifted and i == 0:
            point_aqi += 44.5
            
        forecast_points.append(SparklinePoint(time=time_str, aqi=round(point_aqi, 1)))
        
    current_aqi = forecast_points[0].aqi
    
    # Set risk level based on AQI thresholds
    if current_aqi < 50:
        risk = "green"
    elif current_aqi < 85:
        risk = "amber"
    else:
        risk = "red"
        
    current_no2 = 18.2 if not is_drifted else 50.6
    current_traffic = 35.0 if not is_drifted else 80.2
    
    return {
        "zone": zone,
        "current_aqi": current_aqi,
        "current_no2": current_no2,
        "current_traffic": current_traffic,
        "forecast": forecast_points,
        "risk_level": risk,
        "offset": config["offset"],
        "noise_factor": config["noise_factor"]
    }

def inject_drift_into_zone(zone: str, duration: int) -> Dict:
    drift_state[zone] = True
    drift_counters[zone] = duration
    return {
        "zone": zone,
        "drift_injected": True,
        "message": f"Successfully injected NO2 + traffic drift into {zone} for next {duration} requests."
    }

def monitor_zone(zone: str) -> Dict:
    is_drifted = drift_state[zone]
    config = ZONE_CONFIGS[zone]
    
    forecasted_aqi = config["base_aqi"] + config["offset"]
    actual_aqi = forecasted_aqi
    
    if is_drifted:
        actual_aqi += 44.5
        residual = 44.5
        anomaly = True
    else:
        residual = round(random.uniform(2.0, 8.0), 2)
        anomaly = False
        actual_aqi += residual
        
    return {
        "zone": zone,
        "anomaly": anomaly,
        "residual": residual,
        "threshold": 25.0,
        "forecasted_aqi": round(forecasted_aqi, 1),
        "actual_aqi": round(actual_aqi, 1)
    }

def orchestrate_react_loop(zone: str, residual: float) -> Dict:
    steps = []
    
    # 1. Observe Step
    steps.append(AgentStep(
        agent="Monitor",
        timestamp=get_timestamp(),
        thought=f"Observe: Residual check triggered. Zone {zone} residual is {residual} (exceeds threshold 25.0). High non-stationarity detected."
    ))
    
    # 2. Reason Step
    steps.append(AgentStep(
        agent="Orchestrator",
        timestamp=get_timestamp(),
        thought="Reason: Data drift detected. Current static model error profile suggests local environmental covariates (NO2, traffic) have shifted. Initiating emergency local weight updates via Federated pipeline. Full model redeployment rejected (energy efficiency cost: high)."
    ))
    
    # 3. Act Step (Alert)
    steps.append(AgentStep(
        agent="Alert",
        timestamp=get_timestamp(),
        thought="Act: Dispatched local health advisory broadcast for vulnerable groups in Zone B. Set status to ACTIVE_HAZARD."
    ))
    
    # 4. Act Step (Policy)
    steps.append(AgentStep(
        agent="Policy",
        timestamp=get_timestamp(),
        thought="Act: Triggered targeted local model calibration (FL Client Zone B) using recent 50 local records. Exclude raw data transfer to server."
    ))
    
    # 5. Re-observe Step
    steps.append(AgentStep(
        agent="Monitor",
        timestamp=get_timestamp(),
        thought="Re-observe: Local weights merged. New residual is 12.1 (below threshold). Model accuracy recovered from 35.9% to 77.4%. System returned to STABLE."
    ))
    
    return {
        "zone": zone,
        "dispatched_action": "POLICY",
        "accuracy_before": 35.9,
        "accuracy_after": 77.4,
        "steps": steps
    }

def get_shapley_explain(zone: str) -> Dict:
    # Exact Shapley values from prompt
    contributions = [
        ShapleyContribution(feature="NO2", value=-3.46, type="risk-increasing"),
        ShapleyContribution(feature="Traffic", value=-2.45, type="risk-increasing"),
        ShapleyContribution(feature="CO", value=-1.14, type="risk-increasing"),
        ShapleyContribution(feature="Humidity", value=-0.37, type="risk-increasing"),
        ShapleyContribution(feature="O3", value=0.96, type="risk-reducing"),
        ShapleyContribution(feature="Temperature", value=0.01, type="risk-reducing")
    ]
    return {
        "zone": zone,
        "contributions": contributions,
        "sum_contributions": round(sum(c.value for c in contributions), 2),
        "residual": 0.0
    }

def get_personalized_risk(profile: str) -> Dict:
    # Exact values from prompt
    if profile == "asthma_child":
        return {
            "profile": ProfileEnum.asthma_child,
            "risk_score": 0.566,
            "risk_level": "HIGH",
            "advisory": "Asthma triggers are highly elevated due to recent NO2 spikes in your zone. It is recommended to avoid outdoor aerobic activity and keep bronchodilator inhalers accessible. Ensure indoor air filtration is running.",
            "formula": "Risk(P) = 0.5 * AQI_norm + 0.1 * age_factor(Child) + 0.4 * condition_factor(Asthma)"
        }
    elif profile == "healthy_adult":
        return {
            "profile": ProfileEnum.healthy_adult,
            "risk_score": 0.206,
            "risk_level": "LOW",
            "advisory": "Ambient risk is low. Normal outdoor activities are safe. No specific preventative actions required.",
            "formula": "Risk(P) = 0.5 * AQI_norm + 0.1 * age_factor(Adult) + 0.0 * condition_factor(None)"
        }
    elif profile == "elderly_cardio":
        return {
            "profile": ProfileEnum.elderly_cardio,
            "risk_score": 0.526,
            "risk_level": "HIGH",
            "advisory": "Elevated cardiovascular risk. Fine particulate and NO2 indices advise reducing prolonged heavy outdoor exertion. Monitor for symptoms of shortness of breath or chest discomfort.",
            "formula": "Risk(P) = 0.4 * AQI_norm + 0.3 * age_factor(Elderly) + 0.3 * condition_factor(Cardio)"
        }
    else:
        raise ValueError("Invalid profile")
