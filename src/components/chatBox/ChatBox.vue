<template>
  <div v-if="isOpen" class="chat-box">
    <div class="bg-white border-b border-gray-300 w-full shadow">
      <div class="lg:container mx-auto p-4">
        <div class="grid grid-cols-3 gap-4">
          <div class="col-span-1 min-w-[250px]">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <!-- <img src="@/assets/images/chart.png" class="w-12 h-12 rounded-full border-2 border-blue-400" alt="User" /> -->
                <span class="font-semibold text-xl pl-1">Nhắn tin</span>
              </div>
            </div>
          </div>
          <div class="col-span-2 text-right">
            <button class="bg-red-500 text-white px-4 py-2 rounded-md" @click="$emit('close')" >close</button>
          </div>
        </div>
      </div>
    </div>

    <div class="lg:container mx-auto  px-4 mb-4">
      <div class="grid grid-cols-3 gap-4">
        <div class="col-span-1 min-w-[150px] bg-white p-4 shadow-md rounded-md">
          <input
            type="text"
            placeholder="Search"
            class="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:border-red-400 mb-4"
          />
          <div class="max-h-96 overflow-y-auto">
            <div 
              v-for="shop in shopStore.shopList.data"
              :key="shop.id"
              class="flex p-2 items-center mb-3 cursor-pointer rounded-md hover:bg-gray-100">
              <div class="relative">
                <img :src="shop.user.avatar" class="w-12 h-12 rounded-full border-2 border-blue-400" alt="User" />
                <div class="absolute h-3 w-3 bg-slate-400 rounded-full -top-1.5 -left-1.5 ml-2"></div>
              </div>
              <button class="ml-3" @click="getListMessage(shop.user.id)">
                <p class="font-semibold">{{shop.user.email.split('@')[0]}}</p>
                <!-- <p class="text-gray-500">Hello</p> -->
              </button>
            </div>
          </div>
        </div>
        <div class="col-span-2 bg-slate-50 shadow-md rounded-md">
          <div>
            <!-- <div v-if="isChatOpen"> -->
            <div class="flex items-center justify-between mb-4 bg-slate-200 px-4 pt-2 pb-2 rounded-tl-md rounded-tr-md">
              <div class="flex items-center">
                <img :src="shopInfo?.avatar" class="w-12 h-12 rounded-full" alt="User Image" />
                <div class="ml-3">
                  <p class="font-semibold">{{shopInfo?.email.split('@')[0]}}</p>
                  <!-- <p class="text-gray-5{00">Hello</p> -->
                </div>
              </div>
            </div>
            <!-- chat body -->
            <div  
             class="overflow-y-auto max-h-64 min-h-[19rem] px-4 " ref="chatContainer">
             <div
                v-for="message in listMessage"
             >
              <div v-if="message.recipientId !== idShop" class="flex items-center mb-4">
                <img :src="shopInfo?.avatar" class="w-6 h-6 rounded-full border-2 border-white mr-1" alt="User Image" />
                <div class="relative group text-sm p-2 shadow bg-white rounded-md max-w-xs">
                  {{message.content}}
                  <div class="absolute top-1/2 -translate-y-1/2 left-full ml-1 hidden group-hover:block bg-gray-600 py-1 px-1.5 rounded z-50 text-white w-max">12:00</div>
                </div>
              </div>

              <div v-if="message.recipientId === idShop" class="flex items-center justify-end mb-4">
                 
                <div class="relative group text-sm p-2 shadow bg-indigo-100 rounded-md max-w-xs">
                  {{message.content}}
                  <div class="absolute top-1/2 -translate-y-1/2 right-full mr-1 hidden group-hover:block bg-gray-600 py-1 px-1.5 rounded z-50 text-white w-max">12:00</div>
                </div>
                <!-- <img src="@/assets/images/chart.png" class="w-6 h-6 rounded-full border-2 border-white mr-1" alt="User Image" /> -->
              </div>
              </div>
            </div>
            <div class="flex items-center p-4 bg-white rounded-bl-md rounded-br-md">
              <input
                type="text"
                placeholder="Search"
                v-model="message"
                class="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:border-red-400"
              />
              <button 
                  class="bg-blue-600 text-white px-4 py-2 rounded-md disabled:bg-gray-400 ml-2"
                  :disabled="!message.trim()"
                  @click="sendNewMessage"
                 >Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount, ref, watch, nextTick  } from 'vue';
import { useChatStore } from '@/stores/chatStore';
import { useShopStore } from '@/stores/shopStore';
import { connectToSocket, createNewMessage } from '@/domain/socketServices';
// import { connectToSocket, sendMessage } from '@/services/stompService';
const listMessage = ref([]);
const idShop = ref(null);
const chatStore = useChatStore();
const shopNewStore = useShopStore();
const chatContainer = ref(null);
const shopInfo = ref(null);

// Props
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: true,
  },
  shopStore: {
    type: Object,
    default: () => ({}),
  },
  idShop: { // Thêm prop này
    type: [String, Number],
    default: null,
  },
});

const scrollToBottom = () => {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    }
  });
};

function handleSendMessage() {
  if (newMessage.value.trim() === '' || recipientId.value.trim() === '') return;
  sendMessage(newMessage.value, recipientId.value);
  newMessage.value = '';
}

function handleReceivedMessage(message) {
  listMessage.value.push({
    content: message.content,
    senderId: message.senderId,
    recipientId: message.recipientId,
    // timestamp: new Date().toISOString(),
  });
  scrollToBottom();
}


watch(
  () => listMessage.value,
  () => {
    scrollToBottom();
  }
);

watch(
  () => props.idShop,
  async (newId) => {
    if (newId) {
      await chatStore.fetchAllMessage(newId);
      await shopNewStore.getInfoShop(newId);
      shopInfo.value = shopNewStore.shopInfo
      idShop.value = newId
      listMessage.value = chatStore.AllMessage;
      scrollToBottom();
    }
  }
);


// Emit sự kiện
const emit = defineEmits(['close']);

// Reactive state
const message = ref('');
const messages = ref([]); // Giả sử lưu trữ tin nhắn local

// Đóng chat box
const closeChat = () => {
  emit('close'); // Phát sự kiện 'close' cho cha
};


const sendNewMessage = () => {
  // chatStore.createNewMessage(message.value,3);
  createNewMessage(message.value,idShop.value );
    listMessage.value.push({
    content: message.value,
    senderId: message.senderId,
    recipientId: idShop.value,
    // timestamp: new Date().toISOString(),
  });
  scrollToBottom();
  message.value =""
};

const getListMessage = async (id) => {
  await chatStore.fetchAllMessage(id);
  await shopNewStore.getInfoShop(id);
  shopInfo.value = shopNewStore.shopInfo
  idShop.value = id
  listMessage.value = chatStore.AllMessage
};

onMounted(() => {
  // Kết nối STOMP và subscribe tin nhắn
  connectToSocket(handleReceivedMessage);
});
</script>

<style scoped>
.chat-box {
  position: fixed;
  bottom: 100px;
  right: 20px;
  width: 600px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
}
</style>
