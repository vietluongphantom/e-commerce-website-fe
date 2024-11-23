<!-- src/components/forgotForm.vue -->
<template>
  <div class="forgot">
    <div class="forgot__container">
      <div class="forgot__items--one">
        <h3 class="forgot__title">Forgot password</h3>

        <form @submit.prevent="handleSubmit">
          <div class="forgot__boxOne">
            <label for="email">Email</label>
            <input type="email" id="email" v-model="email" required />
          </div>

          <button type="submit" class="button button--one">Reset password</button>
        </form>
      </div>

      <div class="forgot__items--two">
        <div class="pl-4 pr-4">
          <h3>No worries , we'll send you reset instructions</h3>
          <h4>Already have an account?</h4>
          <button class="button button--two">Sign In</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
// import authService from '@/domain/authServices';
import router from '@/router/index.js';

const email = ref('');

const handleSubmit = async () => {
  try {
    router.push({ path: `/verification` });
    // const response = await authService.forgot(email.value);

    // router.push({ path: `/veirfication` });
    // if (response.data.success) {
    //   alert('A reset link has been sent to your email.');
    // } else {
    //   alert('Error: ' + response.data.message);
    // }
  } catch (error) {
    console.error(error);
    alert('An error occurred while trying to reset the password.');
  }
};
</script>

<style scoped lang="scss">
@import './forgotPassword.scss';
</style>
