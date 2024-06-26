from flask import Flask, request, redirect,jsonify, url_for, render_template, send_from_directory, send_file
from werkzeug.utils import secure_filename
import os
from textblob import TextBlob
import io
from flask_cors import CORS

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'txt'}
app = Flask(__name__)
CORS(app)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1000 * 1000
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/spellcheck', methods=['POST'])
def spellcheck():
    data = request.get_json()
    
    if not data or 'text' not in data:
        return jsonify({'error': 'No text provided'}), 400
    
    text = data['text']
    blob = TextBlob(text)
    corrected_text = blob.correct()
    
    return jsonify({
        'original_text': text,
        'corrected_text': str(corrected_text)
    })

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
           
@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file:
        text = file.read().decode('utf-8')
        blob = TextBlob(text)
        corrected_text = blob.correct()
        
        # Create a BytesIO stream for the corrected text
        corrected_stream = io.BytesIO()
        corrected_stream.write(str(corrected_text).encode('utf-8'))
        corrected_stream.seek(0)
        
        return send_file(corrected_stream, mimetype='text/plain', as_attachment=True, download_name='corrected_text.txt')
    

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)