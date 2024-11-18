// src/utils/ModalStore.js
import { reactive, provide, inject } from 'vue';

const ModalSymbol = Symbol('ModalSymbol');

export function createModalStore() {
  const state = reactive({
    isModalVisible: false,
    currentItemId: null,
  });

  const showModal = (id) => {
    state.currentItemId = id; // Lưu ID vào store
    state.isModalVisible = true;
  };

  const hideModal = () => {
    state.isModalVisible = false;
    state.currentItemId = null; // Reset ID khi ẩn modal
  };

  return {
    state,
    showModal,
    hideModal
  };
}

export function useModalStore() {
  const store = inject(ModalSymbol);
  if (!store) {
    throw new Error('ModalStore is not provided');
  }
  return store;
}

export function ModalProvider({ children }) {
  const store = createModalStore();
  provide(ModalSymbol, store);
  return children;
}
