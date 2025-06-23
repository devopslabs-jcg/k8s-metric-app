import threading
from kubernetes import client, config, watch
from . import socketio
from .utils import pod_to_dict

def stream_pod_events():
    """파드 이벤트를 스트리밍하고 클라이언트에 전송"""
    w = watch.Watch()
    v1 = client.CoreV1Api()
    for event in w.stream(v1.list_pod_for_all_namespaces, _request_timeout=3600):
        try:
            event_type = event['type']
            pod_obj = event['object']
            pod_dict = pod_to_dict(pod_obj)
            
            socketio.emit(f'pod_{event_type.lower()}', pod_dict)
            print(f"Sent Event: pod_{event_type.lower()} for {pod_dict['name']}")
        except Exception as e:
            print(f"Error processing pod event: {e}")

def start_watcher(app):
    with app.app_context():
        print("Initializing Kubernetes watcher...")
        try:
            config.load_incluster_config()
            print("Watcher: Loaded in-cluster K8s config.")
        except config.ConfigException:
            try:
                config.load_kube_config()
                print("Watcher: Loaded local K8s kubeconfig.")
            except config.ConfigException:
                print("Watcher: Could not load any K8s config. Watcher will not start.")
                return
        
        # 파드 감시 스레드 시작
        threading.Thread(target=stream_pod_events, daemon=True).start()
