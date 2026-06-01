import React, { useEffect, useRef, useState } from "react";
import * as tmImage from "@teachablemachine/image";

function App() {
  const [fsr, setFsr] = useState(0);
  const [teeth, setTeeth] = useState("Weak Teeth");
  const [gas, setGas] = useState(0);
  const [breath, setBreath] = useState("Fresh");
  const [prediction, setPrediction] = useState("");

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
      const URL =
        "https://teachablemachine.withgoogle.com/models/VBUDfflU8/";
      const model = await tmImage.load(
        URL + "model.json",
        URL + "metadata.json"
      );
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
      result += `${p.className}: ${p.probability.toFixed(2)} \n`;
    });

    setPrediction(result);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f6f8",
        padding: "30px",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          marginBottom: "30px",
          fontWeight: "600",
          color: "#1f2937",
        }}
      >
        IoT + ML Dashboard
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >
        {/* Sensor Card */}
        <div
          style={{
            background: "#fff",
            borderRadius: "16px",
            padding: "20px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
          }}
        >
          <h2 style={{ marginBottom: "15px", color: "#111827" }}>
            Sensor Data
          </h2>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              fontSize: "16px",
            }}
          >
            <div
              style={{
                padding: "12px",
                borderRadius: "10px",
                background: "#f9fafb",
              }}
            >
              <strong>FSR:</strong> {fsr} — {teeth}
            </div>

            <div
              style={{
                padding: "12px",
                borderRadius: "10px",
                background: "#f9fafb",
              }}
            >
              <strong>Gas:</strong> {gas} — {breath}
            </div>
          </div>
        </div>

        {/* Camera Card */}
        <div
          style={{
            background: "#fff",
            borderRadius: "16px",
            padding: "20px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
            textAlign: "center",
          }}
        >
          <h2 style={{ marginBottom: "15px", color: "#111827" }}>
            Camera + ML
          </h2>

          <video
            ref={videoRef}
            width="300"
            autoPlay
            style={{
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
            }}
          ></video>

          <br />

          <button
            onClick={captureAndPredict}
            style={{
              marginTop: "15px",
              padding: "10px 18px",
              borderRadius: "10px",
              border: "none",
              background: "#2563eb",
              color: "#fff",
              fontWeight: "500",
              cursor: "pointer",
              transition: "0.2s",
            }}
            onMouseOver={(e) =>
              (e.target.style.background = "#1d4ed8")
            }
            onMouseOut={(e) =>
              (e.target.style.background = "#2563eb")
            }
          >
            Capture & Predict
          </button>

          <canvas
            ref={canvasRef}
            width="300"
            height="300"
            style={{
              marginTop: "15px",
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
            }}
          ></canvas>

          <div
            style={{
              marginTop: "15px",
              textAlign: "left",
              background: "#f9fafb",
              padding: "12px",
              borderRadius: "10px",
              fontSize: "14px",
              whiteSpace: "pre-wrap",
            }}
          >
            <strong>Prediction:</strong>
            <pre style={{ margin: 0 }}>{prediction}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
