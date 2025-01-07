<template>
  <div class="bg-[#FAD4BD] flex justify-center items-center h-screen">
    <div class="verify__box bg-[#fff] w-[35%] p-[20px] text-center flex flex-col items-center rounded-lg">
      <img src="@/assets/images/email_5.jpg" class="w-[120px] h-[120px] mt-[30px] mb-[30px]" />
      <h3 class="text-[32px] font-semibold mb-[20px]">Xác minh tài khoản</h3>
      <p class="mb-6 text-[#9E9E9E]">Chúng tôi đã gửi mã xác minh đến địa chỉ email của bạn</p>
      <input class="w-[200px] h-[40px] border-2 border-[#9E9E9E] rounded-2xl text-center" placeholder="******" v-model="verificationCode" />
      <button class="verify__button mt-6 w-[200px] h-[40px] text-[#fff] bg-[#FB884B] font-semibold rounded-2xl mb-4" @click="confirmCode">
        Xác nhận
      </button>
      <button class="text-[#EE4D2D] text-[16px] underline mt-3" @click="resendOTP">gửi lại OTP</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import authService from '@/domain/authServices';
import Swal from 'sweetalert2';

import { useRoute } from 'vue-router';
import router from '@/router/index.js';
import { useToast } from "vue-toastification";

const toast = useToast();
const route = useRoute();
const email = route.params.email;
const role = route.params.role;
const verificationCode = ref();

const confirmCode = async () => {
  try {
    console.log("vào đây vào đây")
    const response = await authService.checkOTP(role, email, verificationCode.value);
    if (response.data.code === 200) {
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'đăng ký thành công',
        showConfirmButton: false,
        timer: 1500
      });
      router.push({ path: `/login/${role}` });   
    }
  } catch (e) {
    toast.error("Mã xác nhận không đúng hoặc OTP đã hết hạn.", {
      timeout: 5000,
    });
  }
};

const resendOTP = async () => {
  const response = await authService.resendOTP(email);
  if (response.data.code == 429) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Too many OTP requests. Please wait before trying again.',
      footer: '<a href="#">Why do I have this issue?</a>'
    });
  }
};
</script>

<style scoped lang="scss">
.verify {
  &__button {
    &:hover {
      background-color: #ffff;
      color: #fb884b;
      box-shadow:
        0 0 10px #fb884b,
        0 0 20px #fb884b;
    }
  }
  &__box {
    box-shadow: 0 0 5px #fb884b;
  }
}
</style>
