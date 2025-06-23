from flask import Flask
from flask_socketio import SocketIO
from flask_cors import CORS
from config import Config
import threading
import os

socketio = SocketIO(cors_allowed_origins="*")

def create_app(debug=False):
    app = Flask(__name__)
    app.debug = debug
    app.config.from_object(Config)
    CORS(app)
    socketio.init_app(app, async_mode='eventlet')

    from . import routes
    app.register_blueprint(routes.bp)

    from .watcher import start_watcher
    if not app.debug or os.environ.get('WERKZEUG_RUN_MAIN') == 'true':
        threading.Thread(target=start_watcher, args=(app,), daemon=True).start()

    return app
