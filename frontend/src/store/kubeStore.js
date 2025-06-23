// src/store/kubeStore.js

import { create } from 'zustand';

// set, get을 사용하여 스토어의 현재 상태를 가져올 수 있게 합니다.
const useKubeStore = create((set, get) => ({
  pods: [],
  initialize: (pods) => set({ pods }),
  handleEvent: (type, data) => set((state) => {
    const event = type.split('_')[1];
    let newPods = [...state.pods];
    const podData = { ...data, id: data.metadata.uid }; // DataGrid의 'id'로 사용하기 위해 uid를 id로 복사

    const index = newPods.findIndex(p => p.id === podData.id);

    if (event === 'added' && index === -1) {
      // 'added' 이벤트일 때 'isNew: true' 플래그를 추가합니다.
      // DataGrid는 새로운 row를 추가할 때만 애니메이션을 적용할 수 있으므로,
      // 'added' 이벤트에서만 isNew 플래그를 추가하는 것이 중요합니다.
      newPods.push({ ...podData, isNew: true });
    } else if (event === 'modified' && index > -1) {
      // 수정된 Pod의 상태를 업데이트합니다.
      // 기존의 isNew 플래그는 유지합니다.
      const existingPod = newPods[index];
      newPods[index] = { ...existingPod, ...podData };
    } else if (event === 'deleted') {
      // 삭제된 Pod를 필터링합니다.
      newPods = newPods.filter(p => p.id !== podData.id);
    }
    
    // 생성 시간의 내림차순으로 정렬합니다.
    return { pods: newPods.sort((a,b) => new Date(b.creation_timestamp) - new Date(a.creation_timestamp)) };
  }),

  // 'isNew' 플래그를 제거하는 함수를 스토어에 추가합니다.
  clearBlinkEffect: (id) => set((state) => ({
    pods: state.pods.map(pod => 
      pod.id === id ? { ...pod, isNew: false } : pod
    )
  })),
}));

export default useKubeStore;
