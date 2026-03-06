from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import pytesseract
from PIL import Image
from gtts import gTTS
import os

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@app.route("/ocr", methods=["POST"])
def ocr():

    file = request.files["image"]

    filepath = os.path.join(UPLOAD_FOLDER, file.filename)

    file.save(filepath)

    text = pytesseract.image_to_string(Image.open(filepath))

    return jsonify({"text":text})


@app.route("/tts", methods=["POST"])
def tts():

    data = request.json

    text = data["text"]

    language = data.get("language","en")

    speech = gTTS(text, lang=language)

    audio_file = "speech.mp3"

    speech.save(audio_file)

    return send_file(audio_file, as_attachment=False)


if __name__ == "__main__":
    app.run(debug=True)