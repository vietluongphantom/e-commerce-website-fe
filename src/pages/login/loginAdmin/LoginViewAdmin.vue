<!-- src/components/LoginForm.vue -->
<template>
  <div class="login">
    <div class="login__container">
      <div class="login__items--one">
        <h3 class="login__title">Sign In</h3>
        <form @submit.prevent="handleSubmit">
          <div class="login__boxOne">
            <label for="username">Email</label>
            <input class="mb-2" type="email" id="username" v-model="login.username" required />
            <label for="password">Password</label>
            <input type="password" id="password" v-model="login.password" required />
          </div>

          <button type="submit" class="button button--one">Sign In</button>
        </form>

        <div class="login__select">
          <div class="login__wrap">
            <button class="text-[16px] underline text-[#F45449]">Kênh người bán</button>
          </div>
        </div>
      </div>

      <div class="login__items--two">
        <div class="flex flex-col items-center justify-center">
          <h3>Welcome to login!</h3>
          <AdminIcon class="w-[70px] h-[70px] brightness-150 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] transition-all duration-300"></AdminIcon>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { AdminIcon } from '@/assets/icons/icon.js';

const authStore = useAuthStore();

const login = reactive({
  username: '',
  password: ''
});

const handleSubmit = async () => {
  console.log(login);
  await authStore.loginUser({
    username: login.username,
    password: login.password,
    role: 'admin'
  });
};
</script>

<style scoped lang="scss">
@use './style.scss';
</style>
