import os
import re
import pandas as pd
from flask import Flask, request, jsonify
from spellchecker import SpellChecker

# Load the CSV file containing spam text messages
df = pd.read_csv('SPAM text message 20170820 - Data.csv')

# Use the 'Message' column as the corpus
# Extract the 'Message' column from the DataFrame and convert it to a list of strings
corpus = df['Message'].tolist()

# Combine all messages into one large text string
# Join all the messages into a single string, with each message separated by a space
combined_text = ' '.join(corpus)

# Function to clean and tokenize text
# This function converts the text to lowercase and finds all word tokens (sequences of alphanumeric characters)
def preprocess_text(text):
    tokens = re.findall(r'\b\w+\b', text.lower())
    return tokens

# Tokenize and preprocess the combined corpus text
# Apply the preprocess_text function to the combined text
tokenized_corpus = preprocess_text(combined_text)

# Initialize the spell checker
spell = SpellChecker()
# Load word frequencies from the tokenized corpus into the spell checker
spell.word_frequency.load_words(tokenized_corpus)

# Function to correct spelling using the spell checker
# This function takes a text string, splits it into words, corrects each word, and then joins the corrected words back into a single string
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
    # Get the input JSON data
    data = request.json
    text_to_correct = data.get('text', '')
    # Correct the spelling of the input text
    corrected_text = correct_spelling(text_to_correct)
    # Return the corrected text as a JSON response
    return jsonify({'corrected_text': corrected_text})

# Route to correct spelling in an uploaded file
@app.route('/upload', methods=['POST'])
def upload_file():
    # Check if a file is part of the request
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    # Check if a file was selected
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if file:
        # Read the file content
        text = file.read().decode('utf-8')
        # Correct the spelling in the file content
        corrected_text = correct_spelling(text)
        # Define the path for saving the corrected file
        corrected_file_path = os.path.join('uploads', 'corrected_' + file.filename)
        # Save the corrected text to the new file
        with open(corrected_file_path, 'w') as corrected_file:
            corrected_file.write(corrected_text)
        # Return the path of the corrected file as a JSON response
        return jsonify({'corrected_file': corrected_file_path})

# Main function to run the Flask app
if __name__ == '__main__':
    # Ensure the uploads directory exists
    os.makedirs('uploads', exist_ok=True)
    # Run the Flask app in debug mode
    app.run(debug=True)

