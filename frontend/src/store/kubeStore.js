import { create } from 'zustand';

const useKubeStore = create((set) => ({
  pods: [],
  initialize: (pods) => set({ pods }),
  handleEvent: (type, data) => set((state) => {
    const event = type.split('_')[1];
    let newPods = [...state.pods];
    const index = newPods.findIndex(p => p.uid === data.uid);

    if ((event === 'added' || event === 'modified') && index === -1) {
      newPods.push(data);
    } else if (event === 'modified' && index > -1) {
      newPods[index] = { ...newPods[index], ...data };
    } else if (event === 'deleted') {
      newPods = newPods.filter(p => p.uid !== data.uid);
    }
    return { pods: newPods.sort((a,b) => new Date(b.creation_timestamp) - new Date(a.creation_timestamp)) };
  }),
}));

export default useKubeStore;
