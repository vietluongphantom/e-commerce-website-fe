<template>
  <div class="bg-[#FAD4BD] flex justify-center items-center h-screen">
    <div class="verify__box bg-[#fff] w-[35%] p-[20px] text-center flex flex-col items-center rounded-lg">
      <img src="@/assets/images/email_5.jpg" class="w-[120px] h-[120px] mt-[30px] mb-[30px]" />
      <h3 class="text-[32px] font-semibold mb-[20px]">Verify Account</h3>
      <p class="mb-6 text-[#9E9E9E]">We have sent the verification code to your email address</p>
      <input class="w-[200px] h-[40px] border-2 border-[#9E9E9E] rounded-2xl text-center" placeholder="******" v-model="verificationCode" />
      <button class="verify__button mt-6 w-[200px] h-[40px] text-[#fff] bg-[#FB884B] font-semibold rounded-2xl mb-4" @click="confirmCode">
        Confirm
      </button>
      <button class="text-[#EE4D2D] text-[16px] underline mt-3" @click="resendOTP">Resend OTP</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import authService from '@/domain/authServices';
import Swal from 'sweetalert2';

import { useRoute } from 'vue-router';
import router from '@/router/index.js';

const route = useRoute();
const email = route.params.email;
const role = route.params.role;
const verificationCode = ref();

const confirmCode = async () => {
  console.log(email, role, verificationCode.value);
  const response = await authService.checkOTP(role, email, verificationCode.value);
  console.log(response);
  if (response.data.code === 200) {
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Register successfully',
      showConfirmButton: false,
      timer: 1500
    });
    router.push({ path: `/login/${role}` });
  } else if (response.data.code == 500) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Invalid OTP',
      footer: '<a href="#">Why do I have this issue?</a>'
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
