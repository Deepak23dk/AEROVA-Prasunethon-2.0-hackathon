# Live Demo Script: Aerova (FAXAQ)

This script maps out a 3-to-5 minute live presentation path designed to wow technical judges on implementation, innovations, usability, and real-world impact.

---

## ⏱️ Step-by-Step Live Flow (Total: 4 mins)

### Step 1: Landing Page & Hook (30 secs)
1.  **Action**: Start on the Landing Cover screen.
2.  **Narrative**: 
    > "Welcome to Aerova. This is an autonomous environmental risk monitoring and self-healing system based on the FAXAQ research paper. It addresses a major real-world problem: how to maintain model prediction accuracy in smart cities when local environmental patterns drift, without violating citizen privacy."
3.  **Action**: Click **Launch Dashboard** to transition into the main cockpit screen.

### Step 2: City Ops Dashboard & UX Features (1 min)
1.  **Action**: Point to the **GIS Smart City Zone Map**. Click on **Zone A**, **Zone B**, and **Zone C** to show the telemetry, forecast charts, and gauges updating.
2.  **Action**: Click and drag the widgets (e.g., drag the GIS Map to the right or the AQI ring to the bottom) to reorder them.
3.  **Narrative**: 
    > "Operators can monitor micro-climate telemetry across city zones. The dashboard is fully modular; widgets can be dragged and rearranged in real-time, persisting their layout during the session. Telemetry loads with loading skeletons to prevent layout shift."
4.  **Action**: Toggle the **Light/Dark Mode** button in the top-right to show polish.

### Step 3: Drift Injection & Agent Sandbox (1.5 mins)
1.  **Action**: Navigate to the **Agent ReAct Sandbox** tab.
2.  **Action**: Click **Simulate Pollution Spike**.
3.  **Narrative**: 
    > "Now we will simulate a localized pollution and traffic spike in Zone B. This triggers data drift—making standard static models useless. Let's watch the autonomous agents self-heal the system."
4.  **Observations**:
    *   **Monitor Agent** status goes to acting, the badge pulses a red glow, and residual jumps to `44.5` (exceeding the threshold of `25.0`).
    *   The console displays the ReAct trace: Observe $\rightarrow$ Reason $\rightarrow$ Act $\rightarrow$ Re-observe.
    *   An **Alert Agent** toast notification slides in the top-right corner.
    *   The **Mitigation Performance Chart** shows accuracy dropping to `35.9%`, then the **Policy Agent** triggers localized Federated retraining, and the accuracy animates recovering to `77.4%` over 3 seconds.
    *   The static model stays flat at `35.9%`, highlighting the recovery delta.
5.  **Narrative**: 
    > "Our agentic pipeline detected the drift, broadcasted a health advisory via the Alert Agent, and triggered a targeted local retrain. The model accuracy successfully recovered from 35.9% to 77.4% while a static model remained broken."

### Step 4: Personal Risk Guard & SHAP (45 secs)
1.  **Action**: Navigate to the **Personal Risk Guard** tab.
2.  **Action**: Click through the three profiles: **Child with Asthma** (`0.566` high), **Healthy Adult** (`0.206` low), and **Elderly Cardio** (`0.526` high).
3.  **Action**: Hover over the **Hover for Risk Formula** tooltip to display the personalization formula.
4.  **Action**: Click **Why is my risk high?** to slide down the **SHAP Attribution Chart**.
5.  **Action**: Click the **Download PDF** icon next to the advisory.
6.  **Narrative**: 
    > "For citizens, Aerova provides demographic-specific risk coefficients and actionable preventative advisories. Click 'Why is my risk high' to reveal exact Shapley values. The sum of these attributions equals the model output exactly. Citizens can export this advisory as a PDF report instantly."

### Step 5: Federated Network View & Privacy (15 secs)
1.  **Action**: Navigate to the **Federated Network** tab.
2.  **Action**: Click on one of the City Client nodes to show the tooltip: *"0% of raw records leave this node."*
3.  **Narrative**: 
    > "By running decentralized local model training, we achieve a high model accuracy of 82.6% (identical to centralized training) while ensuring zero raw environmental logs leave regional nodes."
