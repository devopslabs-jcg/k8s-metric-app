# app.py
from flask import Flask

app = Flask(__name__)

@app.route('/health')
def health_check():
    return "Metric App (Python) is Running!"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
