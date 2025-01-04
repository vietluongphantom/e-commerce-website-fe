<!-- src/components/forgotForm.vue -->
<template>
  <div class="forgot">
    <div class="forgot__container">
      <div class="forgot__items--one">
        <h3 class="forgot__title">quên mật khẩu</h3>

        <form @submit.prevent="handleSubmit">
          <div class="forgot__boxOne">
            <label for="email">Email</label>
            <input type="email" id="email" v-model="email" required />
          </div>

          <button type="submit" class="button button--one">lấy lại mật khẩu</button>
        </form>
      </div>

      <div class="forgot__items--two">
        <div class="pl-4 pr-4">
          <h3>Đừng lo , chúng tôi sẽ gửi bạn hướng dẫn</h3>
          <h4>Bạn đã có tài khoản?</h4>
          <button class="button button--two">Đăng nhập</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import authService from '@/domain/authServices';
import router from '@/router/index.js';
import { nextTick } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();  
const role = route.params.role;
const email = ref('');

const handleSubmit = async () => {
  console.log("role ", role)
  try {
    router.push({
      name: `verification-forgot-password`,
      params: {
        email: email.value,
        role: role
      }
    });
    await nextTick();
    const response = await authService.sendOTPForgetPassword(email.value);
    if (response.data.success) {
      alert('A reset link has been sent to your email.');
    } else {
      alert('Error: ' + response.data.message);
    }
  } catch (error) {
    console.error(error);
    alert('An error occurred while trying to reset the password.');
  }
};
</script>

<style scoped lang="scss">
@import './forgotPassword.scss';
</style>
