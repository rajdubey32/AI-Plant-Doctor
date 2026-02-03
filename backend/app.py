from flask import Flask, request, jsonify
from flask_cors import CORS
import os, json, uuid

from model_loader import predict_disease
from chatbot import get_answer
from gemini_ai import ask_gemini   # optional

app = Flask(__name__, static_folder="static")
CORS(app)

UPLOAD = "uploads"
os.makedirs(UPLOAD, exist_ok=True)

with open("data/plant_disease.json", "r", encoding="utf-8") as f:
    DISEASE_DATA = json.load(f)

# helper: disease_key → plant name
def get_plant_name(disease_key: str):
    return disease_key.split("___")[0].lower()


# Image Prediction API
@app.route("/predict", methods=["POST"])
def predict():
    try:
        if "image" not in request.files:
            return jsonify({"error": True, "message": "No image uploaded"}), 400

        img = request.files["image"]
        lang = request.form.get("language", "en")

        filename = f"{uuid.uuid4().hex}_{img.filename}"
        path = os.path.join(UPLOAD, filename)
        img.save(path)

        disease_key = predict_disease(path)

        if not disease_key:
            return jsonify({"error": True, "message": "Prediction failed"}), 500

        if disease_key not in DISEASE_DATA:
            return jsonify({"error": True, "message": "Disease not found"}), 404

        info_en = DISEASE_DATA[disease_key]["en"]
        info_hi = DISEASE_DATA[disease_key]["hi"]

        plant = get_plant_name(disease_key)

        healthy_preview = f"/static/healthy/{plant}/healthy.jpg"

        return jsonify({
            "prediction": {
                "disease_name_en": info_en["name"],
                "disease_name_hi": info_hi["name"],
                "confidence": 95,
                "plant": plant
            },
            "treatment": {
                "traditional_treatment": info_en["home_remedy"] if lang == "en" else info_hi["home_remedy"],
                "modern_treatment": info_en["doctor_remedy"] if lang == "en" else info_hi["doctor_remedy"]
            },
            "healthy_preview": healthy_preview
        })

    except Exception as e:
        print("❌ Predict Error:", e)
        return jsonify({"error": True, "message": "Internal Server Error"}), 500


# Chatbot API
@app.route("/chat", methods=["POST", "OPTIONS"])
def chat():
    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200

    data = request.json or {}
    msg = data.get("message", "")
    language = data.get("language", "en")

    if not msg:
        return jsonify({"reply": "Please type a message"}), 400

    answer = ask_gemini(msg, language)
    return jsonify({"reply": answer})


if __name__ == "__main__":
    app.run(debug=True)
