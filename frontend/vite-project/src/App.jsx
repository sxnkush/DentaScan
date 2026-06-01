import React, { useEffect, useRef, useState } from "react";
import * as tmImage from "@teachablemachine/image";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: #0a0f14;
    min-height: 100vh;
  }

  .ds-root {
    min-height: 100vh;
    background: #0a0f14;
    padding: 2rem 1.5rem 3rem;
    font-family: 'Syne', sans-serif;
    color: #e2e8f0;
  }

  .ds-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 1080px;
    margin: 0 auto 2.5rem;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .ds-logo {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .ds-logo-icon {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #0d9488, #0891b2);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
  }

  .ds-logo-text {
    font-size: 1.4rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: #f1f5f9;
  }

  .ds-logo-text span {
    color: #2dd4bf;
  }

  .ds-status-pill {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #0f1923;
    border: 1px solid #1e3040;
    border-radius: 100px;
    padding: 6px 14px;
    font-size: 0.75rem;
    font-family: 'DM Mono', monospace;
    color: #64748b;
  }

  .ds-status-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #2dd4bf;
    box-shadow: 0 0 6px #2dd4bf;
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }

  .ds-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.25rem;
    max-width: 1080px;
    margin: 0 auto;
  }

  @media (max-width: 720px) {
    .ds-grid { grid-template-columns: 1fr; }
  }

  .ds-card {
    background: #0f1923;
    border: 1px solid #1a2940;
    border-radius: 18px;
    padding: 1.5rem;
    position: relative;
    overflow: hidden;
  }

  .ds-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, #0d9488 50%, transparent);
    opacity: 0.5;
  }

  .ds-card-title {
    font-size: 0.7rem;
    font-family: 'DM Mono', monospace;
    letter-spacing: 0.12em;
    color: #475569;
    text-transform: uppercase;
    margin-bottom: 1.25rem;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .ds-card-title::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #1a2940;
  }

  .ds-metric-row {
    display: flex;
    flex-direction: column;
    gap: 0.875rem;
  }

  .ds-metric {
    background: #0a0f14;
    border: 1px solid #1a2940;
    border-radius: 12px;
    padding: 1rem 1.25rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .ds-metric-left {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .ds-metric-label {
    font-size: 0.7rem;
    font-family: 'DM Mono', monospace;
    letter-spacing: 0.08em;
    color: #475569;
    text-transform: uppercase;
  }

  .ds-metric-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: #f1f5f9;
    font-family: 'DM Mono', monospace;
    letter-spacing: -0.02em;
  }

  .ds-badge {
    font-size: 0.72rem;
    font-family: 'DM Mono', monospace;
    padding: 4px 10px;
    border-radius: 6px;
    font-weight: 500;
    white-space: nowrap;
    letter-spacing: 0.04em;
  }

  .ds-badge-teal {
    background: rgba(13,148,136,0.15);
    color: #2dd4bf;
    border: 1px solid rgba(13,148,136,0.3);
  }

  .ds-badge-amber {
    background: rgba(245,158,11,0.15);
    color: #fbbf24;
    border: 1px solid rgba(245,158,11,0.3);
  }

  .ds-badge-red {
    background: rgba(239,68,68,0.15);
    color: #f87171;
    border: 1px solid rgba(239,68,68,0.3);
  }

  .ds-divider {
    width: 1px;
    height: 40px;
    background: #1a2940;
    flex-shrink: 0;
  }

  .ds-cam-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .ds-video-wrap {
    position: relative;
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid #1a2940;
    width: 100%;
    max-width: 300px;
    aspect-ratio: 1;
    background: #050a0f;
  }

  .ds-video-wrap video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .ds-video-overlay {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .ds-corner {
    position: absolute;
    width: 16px;
    height: 16px;
    border-color: #0d9488;
    border-style: solid;
    opacity: 0.7;
  }

  .ds-corner-tl { top: 8px; left: 8px; border-width: 2px 0 0 2px; border-radius: 3px 0 0 0; }
  .ds-corner-tr { top: 8px; right: 8px; border-width: 2px 2px 0 0; border-radius: 0 3px 0 0; }
  .ds-corner-bl { bottom: 8px; left: 8px; border-width: 0 0 2px 2px; border-radius: 0 0 0 3px; }
  .ds-corner-br { bottom: 8px; right: 8px; border-width: 0 2px 2px 0; border-radius: 0 0 3px 0; }

  .ds-scan-line {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, #2dd4bf 50%, transparent);
    animation: scanline 3s linear infinite;
    opacity: 0.6;
  }

  @keyframes scanline {
    0% { top: 0%; }
    100% { top: 100%; }
  }

  .ds-btn {
    width: 100%;
    max-width: 300px;
    padding: 12px;
    background: linear-gradient(135deg, #0d9488, #0891b2);
    color: #f0fffe;
    border: none;
    border-radius: 10px;
    font-family: 'Syne', sans-serif;
    font-weight: 600;
    font-size: 0.875rem;
    letter-spacing: 0.04em;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.15s;
    text-transform: uppercase;
  }

  .ds-btn:hover { opacity: 0.88; }
  .ds-btn:active { transform: scale(0.98); }

  .ds-canvas-wrap {
    position: relative;
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid #1a2940;
    width: 100%;
    max-width: 300px;
    background: #050a0f;
  }

  .ds-canvas-wrap canvas {
    display: block;
    width: 100%;
    height: auto;
  }

  .ds-pred-box {
    width: 100%;
    max-width: 300px;
    background: #050a0f;
    border: 1px solid #1a2940;
    border-radius: 12px;
    padding: 1rem;
  }

  .ds-pred-label {
    font-size: 0.65rem;
    font-family: 'DM Mono', monospace;
    letter-spacing: 0.1em;
    color: #475569;
    text-transform: uppercase;
    margin-bottom: 8px;
  }

  .ds-pred-output {
    font-family: 'DM Mono', monospace;
    font-size: 0.78rem;
    color: #2dd4bf;
    white-space: pre-wrap;
    line-height: 1.7;
    min-height: 2.5em;
  }

  .ds-pred-empty {
    color: #1e3040;
    font-style: italic;
  }

  .ds-footer {
    max-width: 1080px;
    margin: 2rem auto 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.7rem;
    font-family: 'DM Mono', monospace;
    color: #1e3040;
    gap: 1.5rem;
    flex-wrap: wrap;
  }
`;

function getBadgeClass(type, value) {
  if (type === "breath") {
    if (value === "Fresh") return "ds-badge-teal";
    if (value === "Mild Odor") return "ds-badge-amber";
    return "ds-badge-red";
  }
  if (type === "teeth") {
    if (value === "Strong Teeth") return "ds-badge-teal";
    if (value === "Moderate") return "ds-badge-amber";
    return "ds-badge-red";
  }
  return "ds-badge-teal";
}

function App() {
  const [fsr, setFsr] = useState(0);
  const [teeth, setTeeth] = useState("Weak Teeth");
  const [gas, setGas] = useState(0);
  const [breath, setBreath] = useState("Fresh");
  const [prediction, setPrediction] = useState("");
  const [lastUpdate, setLastUpdate] = useState("—");

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const SERVER_URL = "https://dentascan.onrender.com/data";

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(SERVER_URL);
        const data = await res.json();
        setFsr(data.fsr);
        setGas(data.gas);
        setTeeth(data.teeth);
        setBreath(data.breath);
        setLastUpdate(new Date().toLocaleTimeString());
      } catch (err) {
        console.log(err);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      });
  }, []);

  const modelRef = useRef(null);

  useEffect(() => {
    async function loadModel() {
      const URL = "https://teachablemachine.withgoogle.com/models/VBUDfflU8/";
      const model = await tmImage.load(URL + "model.json", URL + "metadata.json");
      modelRef.current = model;
    }
    loadModel();
  }, []);

  const captureAndPredict = async () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, 300, 300);
    const predictions = await modelRef.current.predict(canvas);
    let result = "";
    predictions.forEach((p) => {
      result += `${p.className}: ${p.probability.toFixed(2)}\n`;
    });
    setPrediction(result);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="ds-root">
        {/* Header */}
        <header className="ds-header">
          <div className="ds-logo">
            <div className="ds-logo-icon">🦷</div>
            <span className="ds-logo-text">Denta<span>Scan</span></span>
          </div>
          <div className="ds-status-pill">
            <span className="ds-status-dot" />
            LIVE · updated {lastUpdate}
          </div>
        </header>

        {/* Main Grid */}
        <div className="ds-grid">

          {/* Sensor Card */}
          <div className="ds-card">
            <div className="ds-card-title">Sensor Readings</div>
            <div className="ds-metric-row">

              <div className="ds-metric">
                <div className="ds-metric-left">
                  <span className="ds-metric-label">FSR Pressure</span>
                  <span className="ds-metric-value">{fsr}</span>
                </div>
                <div className="ds-divider" />
                <span className={`ds-badge ${getBadgeClass("teeth", teeth)}`}>{teeth}</span>
              </div>

              <div className="ds-metric">
                <div className="ds-metric-left">
                  <span className="ds-metric-label">Gas Sensor</span>
                  <span className="ds-metric-value">{gas}</span>
                </div>
                <div className="ds-divider" />
                <span className={`ds-badge ${getBadgeClass("breath", breath)}`}>{breath}</span>
              </div>

            </div>
          </div>

          {/* Camera + ML Card */}
          <div className="ds-card">
            <div className="ds-card-title">Camera · ML Analysis</div>
            <div className="ds-cam-section">

              <div className="ds-video-wrap">
                <video ref={videoRef} autoPlay playsInline muted />
                <div className="ds-video-overlay">
                  <div className="ds-scan-line" />
                  <div className="ds-corner ds-corner-tl" />
                  <div className="ds-corner ds-corner-tr" />
                  <div className="ds-corner ds-corner-bl" />
                  <div className="ds-corner ds-corner-br" />
                </div>
              </div>

              <button className="ds-btn" onClick={captureAndPredict}>
                ⬡ &nbsp;Capture & Analyse
              </button>

              <div className="ds-canvas-wrap">
                <canvas ref={canvasRef} width="300" height="300" />
              </div>

              <div className="ds-pred-box">
                <div className="ds-pred-label">Model Output</div>
                {prediction ? (
                  <pre className="ds-pred-output">{prediction}</pre>
                ) : (
                  <pre className="ds-pred-output ds-pred-empty">Awaiting capture…</pre>
                )}
              </div>

            </div>
          </div>

        </div>

        <footer className="ds-footer">
          <span>IoT + ML · DentaScan v1.0</span>
          <span>·</span>
          <span>Sensor polling: 2s</span>
          <span>·</span>
          <span>Model: Teachable Machine</span>
        </footer>
      </div>
    </>
  );
}

export default App;
