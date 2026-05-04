"use client";
import { useState } from "react";

export default function Home() {
  const [form, setForm] = useState({
    hemoglobin: "",
    sugar: "",
    cholesterol: "",
    age: "",
    gender: "male",
  });

  const [result, setResult] = useState(null);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...form,
        hemoglobin: Number(form.hemoglobin),
        sugar: Number(form.sugar),
        cholesterol: Number(form.cholesterol),
        age: Number(form.age),
      }),
    });

    const data = await res.json();
    setResult(data);
  };

  const inputStyle = {
    width: "100%",
    padding: 10,
    margin: "8px 0",
    borderRadius: 5,
    border: "1px solid #ccc",
    color: "#000",
    background: "#fff",
  };

  const buttonStyle = {
    width: "100%",
    padding: 10,
    marginTop: 10,
    background: "#0070f3",
    color: "white",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f6f8",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          background: "white",
          padding: 30,
          borderRadius: 10,
          width: "100%",
          maxWidth: "700px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ textAlign: "center", color: "#0070f3" }}>
          AI Lab Analyzer
        </h2>

        <input name="hemoglobin" placeholder="Hemoglobin" onChange={handleChange} style={inputStyle} />
        <input name="sugar" placeholder="Blood Sugar" onChange={handleChange} style={inputStyle} />
        <input name="cholesterol" placeholder="Cholesterol" onChange={handleChange} style={inputStyle} />
        <input name="age" placeholder="Age" onChange={handleChange} style={inputStyle} />

        <select name="gender" onChange={handleChange} style={inputStyle}>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        <button onClick={handleSubmit} style={buttonStyle}>
          Analyze
        </button>

        {result && (
  <div style={{
    marginTop: 20,
    padding: 20,
    borderRadius: 12,
    background: "#ffffff",
    border: "1px solid #ddd",
    color: "#000"   // 👈 FORCE TEXT COLOR
  }}>
    <h3 style={{ color: "#000" }}>AI Health Report</h3>

    <p style={{
      fontSize: 22,
      fontWeight: "bold",
      color:
        result.risk === "Low"
          ? "#16a34a"
          : result.risk === "Moderate"
          ? "#f59e0b"
          : "#dc2626"
    }}>
      {result.risk} Risk
    </p>

    {result.details && (
      <div style={{ marginTop: 10 }}>
        <b style={{ color: "#000" }}>Analysis:</b>
        <ul style={{ marginTop: 5 }}>
          {result.details.map((item, i) => (
            <li key={i} style={{ color: "#000" }}>{item}</li>
          ))}
        </ul>
      </div>
    )}

    {result.recommendation && (
  <div style={{ marginTop: 10 }}>
    <b style={{ color: "#000" }}>Recommendation:</b>

    <ul style={{ marginTop: 8, paddingLeft: 20 }}>
      {result.recommendation.map((item, i) => (
        <li key={i} style={{ color: "#000", marginBottom: 6 }}>
          {item}
        </li>
      ))}
    </ul>
  </div>
)}
  </div>
)}
      </div>
    </div>
  );
}