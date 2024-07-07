import os
import re
import pandas as pd
from flask import Flask, request, jsonify
from spellchecker import SpellChecker

# Load the CSV file
df = pd.read_csv('SPAM text message 20170820 - Data.csv')

# Use 'Message' column as corpus
corpus = df['Message'].tolist()

# Combine all messages into one large text
combined_text = ' '.join(corpus)

# Function to clean and tokenize text
def preprocess_text(text):
    tokens = re.findall(r'\b\w+\b', text.lower())
    return tokens

# Tokenize and preprocess the corpus
tokenized_corpus = preprocess_text(combined_text)

# Initialize spell checker
spell = SpellChecker()
spell.word_frequency.load_words(tokenized_corpus)

# Function to correct spelling using spell checker
def correct_spelling(text):
    corrected_words = []
    for word in text.split():
        corrected_word = spell.correction(word)
        corrected_words.append(corrected_word)
    return ' '.join(corrected_words)

# Initialize Flask app
app = Flask(__name__)

# Route to correct spelling of input text
@app.route('/correct', methods=['POST'])
def correct_text():
    data = request.json
    text_to_correct = data.get('text', '')
    corrected_text = correct_spelling(text_to_correct)
    return jsonify({'corrected_text': corrected_text})

# Route to correct spelling in an uploaded file
@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if file:
        # Read the file content
        text = file.read().decode('utf-8')
        # Correct the spelling in the text
        corrected_text = correct_spelling(text)
        # Save corrected text to a new file
        corrected_file_path = os.path.join('uploads', 'corrected_' + file.filename)
        with open(corrected_file_path, 'w') as corrected_file:
            corrected_file.write(corrected_text)
        return jsonify({'corrected_file': corrected_file_path})

# Main function to run the Flask app
if __name__ == '__main__':
    # Ensure the uploads directory exists
    os.makedirs('uploads', exist_ok=True)
    app.run(debug=True)

