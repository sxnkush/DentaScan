const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors({
  origin: "https://denta-scan.vercel.app",
  credentials: true
}));
app.use(express.json());

let sensorData = { fsr: 0, gas: 0 };

app.post('/data', (req, res) => {
  sensorData = req.body;
  console.log(sensorData);
  res.send("OK");
});

app.get('/data', (req, res) => {
  res.json(sensorData);
});

const PORT = 3000;
app.listen(PORT, () => console.log("Server running"));