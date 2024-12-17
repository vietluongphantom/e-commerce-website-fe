<template>
  
  <button @click="toggleChat">
    <div class="fixed bottom-28 right-14 w-[65px] h-[65px] p-4 rounded-full animate-pulse">
      <Messenger></Messenger>
    </div>
  </button>

<ChatBox :isOpen="isChatOpen" :shopStore="shopStore" @close="toggleChat" />

  <div class="fixed bottom-6 right-10 w-[65px] h-[65px] bg-[#69CFA0] p-4 rounded-full animate-pulse">
    <CallIcon></CallIcon>
  </div>

</template>

<script setup>
import { CallIcon, Messenger} from '@/assets/icons/icon.js';
import ChatBox from "@/components/chatBox/ChatBox.vue";
import { computed, onMounted, ref, watch  } from 'vue';
import { useShopStore } from '@/stores/shopStore';

const shopStore = useShopStore();
const isChatOpen = ref(false);



// const formatDate = (dateString) => {
//     if (!dateString) return '';
//     return new Date(dateString).toLocaleString('vi-VN');
// };

const toggleChat = () => {
  isChatOpen.value = !isChatOpen.value;
};

onMounted(async () => {
  await shopStore.fetchShopList();
  console.log("wait shopStore.fetchShopList();",shopStore.shopList.data)
});
</script>
