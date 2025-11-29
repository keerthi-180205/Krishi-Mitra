from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from model import load_ai_model, preprocess_image, predict_disease
from recommenders import recommend_crop, recommend_fertilizer
from gemini_client import get_gemini_response, get_assistant_response

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

try:
    load_ai_model('crop_classifier_v1.h5', 'class_labels.json')
except Exception as e:
    print(f"Error loading model: {e}")

@app.route('/')
def home():
    print("Home endpoint was reached.")
    return "Welcome to the Crop Disease Detection API! Use the /api/detect endpoint to make predictions."

@app.route('/api/test')
def test_endpoint():
    return "Test endpoint is working!"


@app.route('/api/detect', methods=['POST'])
def detect():
    print("Received request at /api/detect")
    if 'image' not in request.files:
        return jsonify({'error': 'No image file found in request'}), 400

    file = request.files['image']
    try:
        processed_image = preprocess_image(file)
        prediction = predict_disease(processed_image)
        
        # Get additional details from Gemini
        gemini_details = get_gemini_response(prediction['disease'])
        prediction['gemini_details'] = gemini_details
        
        print(f"Prediction result: {prediction}")
        return jsonify(prediction)
    except Exception as e:
        print(f"Error during prediction: {e}")
        return jsonify({'error': str(e)}), 500

print("[INFO] Loading Crop Recommender Endpoint...")
@app.route('/api/recommend-crop', methods=['POST'])
def crop_recommendation():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        recommendation = recommend_crop(data)
        if recommendation is None:
            return jsonify({'error': 'Invalid or incomplete input data.'}), 400

        return jsonify({'recommendation': recommendation})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/recommend-fertilizer', methods=['POST'])
def fertilizer_recommendation():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
            
        recommendation = recommend_fertilizer(data)
        if recommendation is None:
            return jsonify({'error': 'Invalid or incomplete input data.'}), 400

        return jsonify({'recommendation': recommendation})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/ask-assistant', methods=['POST'])
def ask_assistant():
    try:
        data = request.get_json()
        if not data or 'question' not in data:
            return jsonify({'error': 'No question provided'}), 400
            
        question = data['question']
        answer = get_assistant_response(question)
        
        return jsonify({'answer': answer})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)