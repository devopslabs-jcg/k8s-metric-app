from flask import Blueprint, jsonify
from kubernetes import client, config
from .utils import pod_to_dict

bp = Blueprint('api', __name__, url_prefix='/api')

@bp.route('/initial-pods')
def get_initial_pods():
    try:
        config.load_incluster_config()
    except config.ConfigException:
        config.load_kube_config()
        
    v1 = client.CoreV1Api()
    try:
        pods_list = v1.list_pod_for_all_namespaces(watch=False)
        pods = [pod_to_dict(p) for p in pods_list.items]
        return jsonify(pods)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
