import tensorflow as tf
import numpy as np

model = tf.keras.models.load_model("models/model.h5")

LABELS = [
 'Apple___Apple_scab','Apple___Black_rot','Apple___Cedar_apple_rust','Apple___healthy',
 'Background_without_leaves','Blueberry___healthy','Cherry___Powdery_mildew','Cherry___healthy',
 'Corn___Cercospora_leaf_spot Gray_leaf_spot','Corn___Common_rust','Corn___Northern_Leaf_Blight',
 'Corn___healthy','Grape___Black_rot','Grape___Esca_(Black_Measles)',
 'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)','Grape___healthy',
 'Orange___Haunglongbing_(Citrus_greening)','Peach___Bacterial_spot','Peach___healthy',
 'Pepper,_bell___Bacterial_spot','Pepper,_bell___healthy',
 'Potato___Early_blight','Potato___Late_blight','Potato___healthy',
 'Raspberry___healthy','Soybean___healthy','Squash___Powdery_mildew',
 'Strawberry___Leaf_scorch','Strawberry___healthy',
 'Tomato___Bacterial_spot','Tomato___Early_blight','Tomato___Late_blight',
 'Tomato___Leaf_Mold','Tomato___Septoria_leaf_spot',
 'Tomato___Spider_mites Two-spotted_spider_mite','Tomato___Target_Spot',
 'Tomato___Tomato_Yellow_Leaf_Curl_Virus','Tomato___Tomato_mosaic_virus','Tomato___healthy'
]

def preprocess(img_path):
    img = tf.keras.utils.load_img(img_path, target_size=(160,160))
    img = tf.keras.utils.img_to_array(img)
    img = np.expand_dims(img, axis=0)
    return img

def predict_disease(img_path):
    img = preprocess(img_path)
    pred = model.predict(img)
    return LABELS[pred.argmax()]
