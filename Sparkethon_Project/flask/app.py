from flask import Flask, render_template, request, jsonify
import pickle
from utils import generate_output
from flask_cors import CORS
from flask import make_response

app = Flask(__name__)
CORS(app, supports_credentials=True)

# Ensure CORS headers are added to all responses
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')  # Change to frontend origin in prod
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

# Load ML models
with open("models/label_encoder_box.pkl", "rb") as f:
    box_encoder = pickle.load(f)

with open("models/box_category_classifier.pkl", "rb") as f:
    classifier = pickle.load(f)

with open("models/filler_amount_regressor.pkl", "rb") as f:
    regressor = pickle.load(f)

# Route for HTML form (GET + POST)
@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        try:
            row = {
                "Item_L": float(request.form["item_l"]),
                "Item_W": float(request.form["item_w"]),
                "Item_H": float(request.form["item_h"]),
                "Bin_L": float(request.form["bin_l"]),
                "Bin_W": float(request.form["bin_w"]),
                "Bin_H": float(request.form["bin_h"]),
                "Weather": request.form.get("weather", "")
            }

            output = generate_output(row, box_encoder, classifier, regressor)
            return render_template("result.html", output=output)

        except Exception as e:
            return f"<h3>Error: {e}</h3>"

    return render_template("index.html")


# ✅ ML prediction API route (used by React frontend)
@app.route("/predict", methods=["POST", "OPTIONS"])
def predict():
    if request.method == "OPTIONS":
        return make_response(jsonify({"status": "CORS preflight"}), 200)

    try:
        data = request.get_json()
        items = data.get("items", [])

        if not items:
            return jsonify({"error": "No items provided"}), 400

        # Aggregate item dimensions to get total volume
        total_volume = 0
        for item in items:
            width = float(item.get("width", 10))
            height = float(item.get("height", 10))
            depth = float(item.get("depth", 10))
            quantity = int(item.get("quantity", 1))
            total_volume += width * height * depth * quantity

        # Assume cubic box — find cube root of volume and add 20% buffer
        side = round((total_volume ** (1 / 3)) * 1.2, 2)

        # Predicted box dimensions
        box_l = box_w = box_h = side

        # Use average dimensions of items to represent the "item row"
        total_l = sum(float(item.get("depth", 10)) for item in items)
        avg_w = sum(float(item.get("width", 10)) for item in items) / len(items)
        avg_h = sum(float(item.get("height", 10)) for item in items) / len(items)

        row = {
            "Item_L": total_l,
            "Item_W": avg_w,
            "Item_H": avg_h,
            "Bin_L": box_l,
            "Bin_W": box_w,
            "Bin_H": box_h,
            "Weather": "sunny"
        }

        output = generate_output(row, box_encoder, classifier, regressor)

        # Include the predicted box dimensions in the output
        output["Box_Dimensions"] = f"{box_l}x{box_w}x{box_h} inches"

        return jsonify(output)

    except Exception as e:
        print("Prediction error:", e)
        return jsonify({"error": str(e)}), 500



if __name__ == "__main__":
    app.run(debug=True)