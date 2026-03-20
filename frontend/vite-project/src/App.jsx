import React, { useEffect, useRef, useState } from "react";
import * as tmImage from "@teachablemachine/image";

function App() {
  const [fsr, setFsr] = useState(0);
  const [teeth, setTeeth] = useState("Weak Teeth");
  const [gas, setGas] = useState(0);
  const [breath, setBreath] = useState("Fresh")
  const [prediction, setPrediction] = useState("");

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const SERVER_URL = "https://dentascan.onrender.com/data";

  // 🔹 Fetch sensor data
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

  // 🔹 Start camera
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      });
  }, []);

  // 🔹 Load ML model
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

  // 🔹 Capture + Predict
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
    <div style={{ textAlign: "center", fontFamily: "Arial" }}>
      <h1>IoT + ML Dashboard</h1>

      {/* 🔹 Sensor Data */}
      <h2>Sensor Data</h2>
      <p>FSR: {fsr + " " + teeth}</p>
      <p>Gas: {gas + " " + breath}</p>

      <hr />

      {/* 🔹 Camera */}
      <h2>Camera + ML</h2>
      <video ref={videoRef} width="300" autoPlay></video>
      <br />
      <button onClick={captureAndPredict}>Capture & Predict</button>

      <br />
      <canvas ref={canvasRef} width="300" height="300"></canvas>

      <h3>Prediction:</h3>
      <pre>{prediction}</pre>
    </div>
  );
}

export default App;