<template>
  <div class="header">
    <!-- <div class="header__inner">
      <UserIcon class="icon__user mt-[10px] mb-[10px]"></UserIcon>
      <div v-if="!authStore.isLoggedIn" class="mt-[10px] mb-[10px]">
        <button class="button mr-2" @click="goToLogin">Đăng nhập</button>
        <span class="header__separator mr-2">/</span>
        <button class="button" @click="goToRegister">Đăng ký</button>
      </div>
      <div v-if="authStore.isLoggedIn" class="flex">
        <button class="button" @click="logout">Đăng xuất</button>
      </div>
    </div> -->

    <div class="header__inner">
      <DropDown></DropDown>
    </div>

    <div class="header__search">
      <div class="container flex items-center">
        <img src="@/assets/images/Logo_bcvt.png" class="header__images cursor-pointer" @click="homeClick" />


        <div class="header__input-container">
          <input type="text" placeholder="Nhập từ khóa tìm kiếm..." class="header__input" @focus="handleFocus"
            v-model="inputValue" @blur="hideList()" @keyup.enter="search" />
          <button class="button__microphone" @click="startRecording">
            <Mic class="icon__microphone"></Mic>
          </button>
          <button class="button__search" @click="search">
            <SearchIcon class="icon__search"></SearchIcon>
          </button>
          <div v-if="isRecording" class="popup">
            <Spin></Spin>
          </div>
        </div>

        <button class="button__cart flex items-center mr-3" @click="handleCartClick">
          <div class="icon__wrapper flex relative">
            <CartIcon class="icon__cart" />
            <span
              class="cart__count absolute top-[-12px] right-[1px] text-[#fff] bg-[#F11A27] rounded-full min-w-[25px] min-h-[25px] flex items-center justify-center text-[12px]">{{
              cartCount }}</span>
          </div>
          <span class="header__title">Giỏ hàng</span>
        </button>

        <button @click="handleFollowOrdersClick" class="button__store">
          <StoreIcon class="icon__store"></StoreIcon>
          <span class="header__title">Theo dõi đơn hàng</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { SearchIcon, StoreIcon, CartIcon, Microphone, Mic } from '@/assets/icons/icon.js';
import { Spin } from '@/components/spin/spin.vue'
import { useAuthStore } from '@/stores/authStore';
import router from '@/router/index.js';
import { productStore } from '@/stores/products';
import { computed, onMounted } from 'vue';
// import Modal from '@/components/modal/ModalView.vue';
import DropDown from '@/components/dropdown/dropdownuser.vue'
import { ref } from 'vue';
import { eventBus } from '@/utils/eventBusHeader.js';

const inputValue = ref('');
const authStore = useAuthStore();

const store = productStore();

const cartCount = computed(() => store.itemCount);


const search = () => {
  eventBus.searchQuery = inputValue.value;
  console.log('test console log header', eventBus.searchQuery);
};
const isRecording = ref(false); // Trạng thái ghi âm



const startRecording = () => {
  if (!("webkitSpeechRecognition" in window)) {
    alert("Trình duyệt của bạn không hỗ trợ Web Speech API.");
    return;
  }

  const recognition = new webkitSpeechRecognition(); // Khởi tạo
  recognition.lang = "vi-VN"; // Ngôn ngữ tiếng Việt
  recognition.interimResults = false; // Chỉ lấy kết quả cuối
  recognition.maxAlternatives = 1;

  // Bắt đầu ghi âm
  recognition.start();

  // Hiển thị popup khi bắt đầu ghi âm
  isRecording.value = true;
  console.log("Bắt đầu ghi âm...");

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript; // Kết quả ghi âm
    inputValue.value = transcript; // Hiển thị kết quả trên thanh input
    console.log("Kết quả ghi âm:", transcript);
  };

  recognition.onerror = (event) => {
    console.error("Lỗi ghi âm:", event.error);
  };

  recognition.onend = () => {
    console.log("Ghi âm đã kết thúc.");
    // Ẩn popup khi ghi âm kết thúc
    isRecording.value = false;
  };
};


const goToLogin = () => {
  router.push({ path: '/login/user' });
};

const goToRegister = () => {
  router.push({ path: '/register' });
};

const logout = () => {
  authStore.logout();
  router.push({ name: 'login-user' });
};

const handleCartClick = () => {
  router.push({ name: 'list-cart' });
};

const homeClick = () => {
  router.push({ name: 'Home user' });
};

const handleFollowOrdersClick = () => {
  router.push({ name: 'list-order' });
};

onMounted(async () => {
  await store.fetchCart();
});



</script>


<style scoped lang="scss">
@import './header.scss';
</style>
