import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { hemoglobin, sugar, cholesterol, age, gender } = await req.json();

  // ----- RISK -----
  let risk: "Low" | "Moderate" | "High";
  if (hemoglobin < 12 || sugar > 160 || cholesterol > 240) {
    risk = "High";
  } else if (hemoglobin < 13 || sugar > 140 || cholesterol > 200) {
    risk = "Moderate";
  } else {
    risk = "Low";
  }

  // ----- DETAILS -----
  const details: string[] = [];

  if ((gender === "male" && hemoglobin < 13) || (gender === "female" && hemoglobin < 12)) {
    details.push("Low hemoglobin → possible anemia");
  } else {
    details.push("Hemoglobin is normal");
  }

  if (sugar > 140) {
    details.push("High blood sugar → diabetes risk");
  } else if (sugar < 70) {
    details.push("Low blood sugar → hypoglycemia risk");
  } else {
    details.push("Blood sugar is normal");
  }

  if (cholesterol > 240) {
    details.push("High cholesterol → heart risk");
  } else if (cholesterol >= 200) {
    details.push("Borderline cholesterol → monitor diet");
  } else {
    details.push("Cholesterol is normal");
  }

  // ----- RECOMMENDATION -----
  let recommendation: string[];

  if (risk === "Low") {
    recommendation = [
      "Maintain a balanced diet",
      "Exercise regularly (30 mins daily)",
      "Do regular health checkups",
    ];
  } else if (risk === "Moderate") {
    recommendation = [
      "Reduce sugar and processed foods",
      "Increase physical activity",
      "Monitor your health regularly",
      "Consult a doctor if needed",
    ];
  } else {
    recommendation = [
      "Consult a doctor immediately",
      "Avoid high sugar and fatty foods",
      "Follow a strict diet plan",
      "Start controlled exercise",
      "Take medical tests if advised",
    ];
  }

  return NextResponse.json({ risk, details, recommendation });
}