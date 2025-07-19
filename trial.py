import keras_cv
import tensorflow as tf
import numpy as np
from PIL import Image
import matplotlib.pyplot as plt

# Load the pretrained model
model = keras_cv.models.DeepFakeDetector()

# Load image
image = Image.open("normal.jpg").resize((256, 256))
image = np.array(image) / 255.0  # Normalize
image = tf.expand_dims(image, 0)  # Add batch dimension

# Predict
score = model(image).numpy()[0][0]  # Confidence score (0: Real, 1: Fake)

if score > 0.5:
    print(f"Fake/AI-generated image detected (Confidence: {score:.2f})")
else:
    print(f"Real image detected (Confidence: {score:.2f})")
