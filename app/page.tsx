"use client";
import { useState } from "react";

type AnalysisResult = {
  risk: "Low" | "Moderate" | "High";
  details: string[];
  recommendation: string[];
};

export default function Home() {
  const [form, setForm] = useState({
    hemoglobin: "",
    sugar: "",
    cholesterol: "",
    age: "",
    gender: "male",
  });

  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          hemoglobin: Number(form.hemoglobin),
          sugar: Number(form.sugar),
          cholesterol: Number(form.cholesterol),
          age: Number(form.age),
        }),
      });

      if (!res.ok) throw new Error("Failed to analyze. Please try again.");
      const data: AnalysisResult = await res.json();
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: 10,
    margin: "8px 0",
    borderRadius: 5,
    border: "1px solid #ccc",
    color: "#000",
    background: "#fff",
    boxSizing: "border-box",
  };

  const buttonStyle: React.CSSProperties = {
    width: "100%",
    padding: 10,
    marginTop: 10,
    background: loading ? "#aaa" : "#0070f3",
    color: "white",
    border: "none",
    borderRadius: 5,
    cursor: loading ? "not-allowed" : "pointer",
  };

  const riskColor =
    result?.risk === "Low"
      ? "#16a34a"
      : result?.risk === "Moderate"
      ? "#f59e0b"
      : "#dc2626";

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
          maxWidth: 700,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ textAlign: "center", color: "#0070f3" }}>
          AI Lab Analyzer
        </h2>

        <input
          name="hemoglobin"
          placeholder="Hemoglobin"
          type="number"
          onChange={handleChange}
          style={inputStyle}
        />
        <input
          name="sugar"
          placeholder="Blood Sugar"
          type="number"
          onChange={handleChange}
          style={inputStyle}
        />
        <input
          name="cholesterol"
          placeholder="Cholesterol"
          type="number"
          onChange={handleChange}
          style={inputStyle}
        />
        <input
          name="age"
          placeholder="Age"
          type="number"
          onChange={handleChange}
          style={inputStyle}
        />

        <select name="gender" onChange={handleChange} style={inputStyle}>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        <button onClick={handleSubmit} disabled={loading} style={buttonStyle}>
          {loading ? "Analyzing..." : "Analyze"}
        </button>

        {error && (
          <p style={{ color: "#dc2626", marginTop: 12 }}>{error}</p>
        )}

        {result && (
          <div
            style={{
              marginTop: 20,
              padding: 20,
              borderRadius: 12,
              background: "#ffffff",
              border: "1px solid #ddd",
              color: "#000",
            }}
          >
            <h3 style={{ color: "#000" }}>AI Health Report</h3>

            <p style={{ fontSize: 22, fontWeight: "bold", color: riskColor }}>
              {result.risk} Risk
            </p>

            {result.details.length > 0 && (
              <div style={{ marginTop: 10 }}>
                <b style={{ color: "#000" }}>Analysis:</b>
                <ul style={{ marginTop: 5 }}>
                  {result.details.map((item: string, i: number) => (
                    <li key={i} style={{ color: "#000" }}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.recommendation.length > 0 && (
              <div style={{ marginTop: 10 }}>
                <b style={{ color: "#000" }}>Recommendation:</b>
                <ul style={{ marginTop: 8, paddingLeft: 20 }}>
                  {result.recommendation.map((item: string, i: number) => (
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