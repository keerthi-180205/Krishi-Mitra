import json
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras import layers
from tensorflow.keras.applications import MobileNetV2
from PIL import Image

# --- Global variables to hold our loaded model and labels ---
model = None
class_labels = None

# --- This is the new, correct way to load your model ---
def load_ai_model(weights_path, labels_path):
    """
    This function re-builds your model architecture from your notebook
    and then loads the saved weights into it.
    """
    global model, class_labels

    # --- 1. Define Model Architecture (Copied from your notebook) ---
    
    IMAGE_SIZE = (224, 224)
    NUM_CLASSES = 15 
    
    base_model = MobileNetV2(
        input_shape=IMAGE_SIZE + (3,),
        include_top=False, 
        weights='imagenet'
    )
    base_model.trainable = False 

    model_scaffolding = Sequential([
        layers.Input(shape=IMAGE_SIZE + (3,)),
        layers.Rescaling(1./255),
        base_model,
        layers.GlobalAveragePooling2D(),
        layers.Dropout(0.2),
        layers.Dense(NUM_CLASSES, activation='softmax', name="Krishi_Mitra_Model")
    ], name="Krishi_Mitra_Sequential")
    
    # --- 2. Load the Weights into the Scaffolding ---
    print(f"Loading model weights from {weights_path}...")
    model_scaffolding.load_weights(weights_path)
    print("Model weights loaded successfully.")
    
    # --- 3. Save the complete model to our global variable ---
    model = model_scaffolding
    
    # --- 4. Load the class labels ---
    print(f"Loading class labels from {labels_path}...")
    with open(labels_path, 'r') as f:
        class_labels = json.load(f) # This loads it as a LIST
    print("Class labels loaded successfully.")
    print("--- Model is fully loaded and ready! ---")


def preprocess_image(image_file):
    """
    Reads an image file, preprocesses it,
    and returns it in the format your model expects.
    """
    img = Image.open(image_file.stream).convert('RGB')
    img = img.resize((224, 224)) 
    img_array = np.array(img)
    img_array = np.expand_dims(img_array, axis=0) 
    
    return img_array

def predict_disease(image_array):
    """
    Runs the prediction on the preprocessed image.
    """
    global model, class_labels
    
    if model is None or class_labels is None:
        raise RuntimeError("Model is not loaded. Call load_ai_model() first.")
    
    # 1. Make the prediction
    predictions = model.predict(image_array)
    
    # 2. Get the top prediction
    class_index = np.argmax(predictions[0]) # This is an integer, e.g., 5
    confidence = float(np.max(predictions[0]))
    
    # 3. --- THIS IS THE FIX ---
    # We access the LIST using the integer index, not a string
    class_name = class_labels[class_index] 
    
    # 4. Return a clean dictionary for your frontend
    return {
        'disease': class_name.replace('_', ' '),
        'confidence': round(confidence * 100, 2)
    }