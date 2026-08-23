# System Architecture: Aerova (FAXAQ)

Aerova is architected in a modular, highly decoupled 6-layer layout. This ensures scalability, security, privacy isolation, and real-time response capabilities suited for smart city environmental telemetry networks.

---

## 🛠️ The 6-Layer Architecture

### 1. Presentation Layer (Vite + React + TS)
*   **Purpose**: Citizen and operator facing cockpit dashboard.
*   **Technologies**: Vite, React, TypeScript, Tailwind CSS v4, Framer Motion, Recharts.
*   **Key Controls**:
    *   *Draggable widgets* using HTML5 drag-and-drop.
    *   *Real-time circular gauges* for visual AQI thresholds.
    *   *Demographics profile switcher* to display custom risk coefficient assessments.
    *   *Client-side PDF report generator* (`jspdf`) exporting preventative advisories.

### 2. API Routing & Security Layer (FastAPI)
*   **Purpose**: Manages communication, validation, rate limits, and access controls.
*   **Technologies**: FastAPI, Pydantic, SlowAPI.
*   **Security Mechanisms**:
    *   **Header Authentication**: Restricts endpoints to callers carrying the header `x-api-key: aerova-hackathon-2026`.
    *   **Rate Limiting**: Protects memory caches and simulation endpoints from DDoS vectors (`slowapi`).
    *   **Input Constraints**: Pydantic validates path parameters strictly. Malformed inputs return a `422 Unprocessable Entity` rather than server crashes.

### 3. Data & ML Pipeline Layer
*   **Purpose**: Manages local data telemetry caches and ML model state.
*   **Simulation Details**:
    *   Seeded with non-IID zone variations (`Zone_A` offset: 5, `Zone_B` offset: 25, `Zone_C` offset: 12) from the FAXAQ research paper.
    *   Under drift conditions, we inject a traffic and NO₂ spike ($1.3\times$ noise factor) resulting in a mean model residual of `44.5` (exceeding the warning threshold of `25.0`).

### 4. Agentic AI Layer (ReAct loop)
*   **Purpose**: Implements autonomous monitoring and mitigation triggers.
*   **Architecture**:
    *   **Monitor Agent**: Runs residual checks on incoming telemetry. If residual $> 25.0$, it flags an anomaly.
    *   **Orchestrator Agent**: Receives anomaly notifications, assesses resource overhead, and decides on localized mitigation policy (refines local weights rather than standard full network retrain).
    *   **Alert Agent**: Broadcasts local safety alerts to vulnerable citizen populations.
    *   **Policy Agent**: Coordinates model local calibration routines.

### 5. Federated Learning Layer
*   **Purpose**: Coordinates weights consolidation without exporting raw sensor data.
*   **Implementation**:
    *   Illustrates secure local client node training.
    *   Sends encrypted weights to a secure central aggregator.
    *   Ensures 0% of raw environmental logs leave regional client hardware.
    *   Maintains an accuracy metric of `82.6%` (nearly identical to centralized training at `82.5%`).

### 6. Explainability & Personalization Layer
*   **Purpose**: Connects predictive outputs to demographically targeted wellness recommendations.
*   **Attribution Model**:
    *   **SHAP Analysis**: Evaluates feature attributions mathematically (NO₂: -3.46, Traffic: -2.45, CO: -1.14, Humidity: -0.37, O₃: +0.96, Temp: +0.01) ensuring that the sum of attributions equals the model output exactly.
    *   **Personalization Formula**: $Risk(P) = w_1 \cdot AQI_{norm} + w_2 \cdot age\_factor(P) + w_3 \cdot condition\_factor(P)$.

---

## 📈 Scalability Pathway (From 3 to N Zones)
To scale this architecture from 3 zones to N zones (e.g., city-wide rollout):
1.  **Dynamic Broker Registry**: Transition from a static Enum validation list of zones on FastAPI to a database-driven zone registry cache (Redis).
2.  **Distributed MQTT Telemetry**: Ingest sensor feeds via a message broker (Kafka/RabbitMQ) with zone topics (`aerova/zones/+/telemetry`).
3.  **Federated Clients Node Clustering**: Deploy FL Client wrappers as Docker containers on edge servers. The secure central aggregator will coordinate updates via WebSockets.
