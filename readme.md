
# Flask Image to Text App

## Description

This Flask application allows users to paste images and analyze them using pre-trained models to extract text.

## File Structure

```
flask_app/
│
├── app.py
├── requirements.txt
├── README.md
├── templates/
│   └── upload.html
├── static/
│   ├── css/
│   │   └── styles.css
│   └── js/
│       └── scripts.js
└── __init__.py
```

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/flask_image_to_text.git
   cd flask_image_to_text
   ```

2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   source venv/bin/activate
   ```

3. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Running the Application

1. Ensure the virtual environment is activated.

2. Run the Flask application:
   ```bash
   flask run
   ```

3. Open your web browser and navigate to `http://127.0.0.1:5000/`.

## Usage

1. Paste an image into the designated box.

2. Select the models you want to use for analysis.

3. Click "Analyze Image" to process the image and extract text.

4. View and copy the results as needed.

## License

This project is licensed under the MIT License.
