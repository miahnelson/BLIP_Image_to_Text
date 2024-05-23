from flask import Flask, request, render_template, jsonify
from PIL import Image
from transformers import BlipProcessor, BlipForConditionalGeneration
import torch
import base64
from io import BytesIO
from huggingface_hub import HfApi
import os

app = Flask(__name__)

MODEL_DIR = "models"

# Create the model directory if it doesn't exist
if not os.path.exists(MODEL_DIR):
    os.makedirs(MODEL_DIR)

# Function to search for BLIP models on Hugging Face
def search_blip_models():
    api = HfApi()
    models = api.list_models(filter="blip", sort="downloads", direction=-1)
    blip_models = []
    for model in models:
        if model.downloads >= 50 and model.likes >= 5:  # Only include models with at least 100 downloads and 2 likes
            model_info = {
                'model_id': model.modelId,
                'downloads': model.downloads,
                'likes': model.likes,
            }
            blip_models.append(model_info)
    return blip_models

@app.route('/')
def index():
    blip_models = search_blip_models()
    return render_template('upload.html', blip_models=blip_models)

@app.route('/upload', methods=['POST'])
def upload_file():
    data = request.json
    image_data = base64.b64decode(data['image'].split(',')[1])
    image = Image.open(BytesIO(image_data))

    blip_model_ids = data['blip_models']
    
    results = []

    for model_id in blip_model_ids:
        model_path = os.path.join(MODEL_DIR, model_id.replace('/', '_'))

        if not os.path.exists(model_path):
            blip_processor = BlipProcessor.from_pretrained(model_id)
            blip_model = BlipForConditionalGeneration.from_pretrained(model_id)
            blip_processor.save_pretrained(model_path)
            blip_model.save_pretrained(model_path)
        else:
            blip_processor = BlipProcessor.from_pretrained(model_path)
            blip_model = BlipForConditionalGeneration.from_pretrained(model_path)

        # BLIP processing
        blip_inputs = blip_processor(images=image, return_tensors="pt")
        with torch.no_grad():
            blip_output = blip_model.generate(**blip_inputs)
        blip_prompt = blip_processor.decode(blip_output[0], skip_special_tokens=True)
        
        results.append({
            'model_id': model_id,
            'blip_prompt': blip_prompt
        })

    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True)
