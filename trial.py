from transformers import AutoImageProcessor, AutoModelForImageClassification
from PIL import Image
import torch

# Load model and processor
model = AutoModelForImageClassification.from_pretrained("orion/fake-image-detector")
processor = AutoImageProcessor.from_pretrained("orion/fake-image-detector")

# Load image
image = Image.open("normal.jpg")

# Prepare and predict
inputs = processor(images=image, return_tensors="pt")
outputs = model(**inputs)

# Get result
logits = outputs.logits
predicted_class = torch.argmax(logits, dim=1).item()

# Interpret result
if predicted_class == 1:
    print("Fake / AI-generated image")
else:
    print("Real image")
