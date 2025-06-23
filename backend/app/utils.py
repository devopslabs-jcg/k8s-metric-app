def pod_to_dict(pod):
    """Pod 객체를 프론트엔드로 보낼 표준 딕셔너리로 변환"""
    return {
        'uid': pod.metadata.uid,
        'name': pod.metadata.name,
        'namespace': pod.metadata.namespace,
        'status': pod.status.phase,
        'ip': pod.status.pod_ip,
        'node': pod.spec.node_name,
        'creation_timestamp': pod.metadata.creation_timestamp.isoformat()
    }
