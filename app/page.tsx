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

  const riskConfig = {
    Low: { color: "#22c55e", bg: "rgba(34,197,94,0.1)", border: "rgba(34,197,94,0.3)", label: "LOW RISK", icon: "✦" },
    Moderate: { color: "#f59e0b", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.3)", label: "MODERATE RISK", icon: "◈" },
    High: { color: "#ef4444", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.3)", label: "HIGH RISK", icon: "⚠" },
  };

  const cfg = result ? riskConfig[result.risk] : null;

  const fields = [
    { name: "hemoglobin", label: "Hemoglobin", unit: "g/dL", placeholder: "e.g. 14.5" },
    { name: "sugar", label: "Blood Sugar", unit: "mg/dL", placeholder: "e.g. 90" },
    { name: "cholesterol", label: "Cholesterol", unit: "mg/dL", placeholder: "e.g. 180" },
    { name: "age", label: "Age", unit: "yrs", placeholder: "e.g. 30" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500;600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #080c14;
          font-family: 'DM Sans', sans-serif;
        }

        .page {
          min-height: 100vh;
          background: #080c14;
          background-image:
            radial-gradient(ellipse 80% 50% at 50% -20%, rgba(56,139,253,0.12), transparent),
            radial-gradient(ellipse 60% 40% at 80% 80%, rgba(139,92,246,0.08), transparent);
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 48px 16px;
        }

        .header {
          text-align: center;
          margin-bottom: 48px;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.15em;
          color: #388bfd;
          border: 1px solid rgba(56,139,253,0.3);
          border-radius: 100px;
          padding: 4px 12px;
          margin-bottom: 20px;
        }

        .badge-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #388bfd;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        h1 {
          font-family: 'DM Sans', sans-serif;
          font-size: clamp(28px, 5vw, 42px);
          font-weight: 300;
          color: #e6edf3;
          letter-spacing: -0.02em;
          line-height: 1.15;
        }

        h1 span {
          font-weight: 600;
          background: linear-gradient(135deg, #388bfd, #a78bfa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .subtitle {
          margin-top: 10px;
          color: #7d8590;
          font-size: 14px;
          font-weight: 400;
          letter-spacing: 0.02em;
        }

        .card {
          width: 100%;
          max-width: 560px;
          background: rgba(13,17,23,0.8);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 32px;
          backdrop-filter: blur(20px);
        }

        .section-label {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.15em;
          color: #7d8590;
          text-transform: uppercase;
          margin-bottom: 16px;
        }

        .grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 12px;
        }

        .field {
          position: relative;
        }

        .field-label {
          font-size: 11px;
          color: #7d8590;
          font-weight: 500;
          margin-bottom: 6px;
          letter-spacing: 0.03em;
        }

        .input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-wrap input, .input-wrap select {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          padding: 10px 44px 10px 12px;
          font-size: 14px;
          color: #e6edf3;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
          appearance: none;
        }

        .input-wrap input::placeholder { color: #484f58; }

        .input-wrap input:focus, .input-wrap select:focus {
          border-color: rgba(56,139,253,0.5);
          background: rgba(56,139,253,0.05);
        }

        .unit {
          position: absolute;
          right: 10px;
          font-family: 'Space Mono', monospace;
          font-size: 9px;
          color: #484f58;
          pointer-events: none;
          letter-spacing: 0.05em;
        }

        .divider {
          height: 1px;
          background: rgba(255,255,255,0.06);
          margin: 20px 0;
        }

        .btn {
          width: 100%;
          padding: 14px;
          border-radius: 12px;
          border: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.03em;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
          overflow: hidden;
        }

        .btn-primary {
          background: linear-gradient(135deg, #388bfd, #7c3aed);
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(56,139,253,0.3);
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .loading-bar {
          position: absolute;
          bottom: 0; left: 0;
          height: 2px;
          background: rgba(255,255,255,0.4);
          animation: loading 1.5s ease-in-out infinite;
          width: 40%;
        }

        @keyframes loading {
          0% { left: -40%; }
          100% { left: 100%; }
        }

        .error {
          margin-top: 12px;
          padding: 10px 14px;
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.2);
          border-radius: 10px;
          color: #f87171;
          font-size: 13px;
        }

        .result-card {
          width: 100%;
          max-width: 560px;
          margin-top: 20px;
          border-radius: 20px;
          overflow: hidden;
          animation: slideUp 0.4s ease;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .risk-header {
          padding: 28px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .risk-label {
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.15em;
          margin-bottom: 6px;
        }

        .risk-value {
          font-size: 36px;
          font-weight: 600;
          letter-spacing: -0.02em;
          line-height: 1;
        }

        .risk-icon {
          font-size: 48px;
          opacity: 0.4;
        }

        .result-body {
          background: rgba(13,17,23,0.9);
          border: 1px solid rgba(255,255,255,0.08);
          border-top: none;
          border-radius: 0 0 20px 20px;
          padding: 24px 32px;
        }

        .result-section {
          margin-bottom: 24px;
        }

        .result-section:last-child { margin-bottom: 0; }

        .result-section-title {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.15em;
          color: #7d8590;
          text-transform: uppercase;
          margin-bottom: 12px;
        }

        .detail-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 8px 0;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          font-size: 13px;
          color: #c9d1d9;
          line-height: 1.5;
        }

        .detail-item:last-child { border-bottom: none; }

        .detail-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #388bfd;
          margin-top: 6px;
          flex-shrink: 0;
        }

        .rec-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 10px 12px;
          background: rgba(255,255,255,0.03);
          border-radius: 8px;
          margin-bottom: 6px;
          font-size: 13px;
          color: #c9d1d9;
          line-height: 1.5;
        }

        .rec-num {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          color: #7d8590;
          min-width: 16px;
          margin-top: 2px;
        }
      `}</style>

      <div className="page">
        <div className="header">
          <div className="badge">
            <div className="badge-dot" />
            AI-POWERED ANALYSIS
          </div>
          <h1>Lab <span>Analyzer</span></h1>
          <p className="subtitle">Enter your blood test values for an instant health assessment</p>
        </div>

        <div className="card">
          <div className="section-label">Patient Parameters</div>

          <div className="grid">
            {fields.map((f) => (
              <div className="field" key={f.name}>
                <div className="field-label">{f.label}</div>
                <div className="input-wrap">
                  <input
                    name={f.name}
                    placeholder={f.placeholder}
                    type="number"
                    onChange={handleChange}
                  />
                  <span className="unit">{f.unit}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="field">
            <div className="field-label">Biological Sex</div>
            <div className="input-wrap">
              <select name="gender" onChange={handleChange}>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          <div className="divider" />

          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? "Analyzing..." : "Run Analysis →"}
            {loading && <div className="loading-bar" />}
          </button>

          {error && <div className="error">{error}</div>}
        </div>

        {result && cfg && (
          <div className="result-card">
            <div className="risk-header" style={{ background: cfg.bg, borderTop: `1px solid ${cfg.border}`, borderLeft: `1px solid ${cfg.border}`, borderRight: `1px solid ${cfg.border}` }}>
              <div>
                <div className="risk-label" style={{ color: cfg.color }}>{cfg.label}</div>
                <div className="risk-value" style={{ color: cfg.color }}>{result.risk}</div>
              </div>
              <div className="risk-icon">{cfg.icon}</div>
            </div>

            <div className="result-body">
              {result.details.length > 0 && (
                <div className="result-section">
                  <div className="result-section-title">Analysis</div>
                  {result.details.map((item, i) => (
                    <div className="detail-item" key={i}>
                      <div className="detail-dot" />
                      {item}
                    </div>
                  ))}
                </div>
              )}

              {result.recommendation.length > 0 && (
                <div className="result-section">
                  <div className="result-section-title">Recommendations</div>
                  {result.recommendation.map((item, i) => (
                    <div className="rec-item" key={i}>
                      <span className="rec-num">0{i + 1}</span>
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}