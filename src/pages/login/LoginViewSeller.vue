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
          <p v-if="isCheckPassword" class="login__check">Password less than 6 characters</p>

          <button type="submit" class="button button--one">Sign In</button>
        </form>

        <div class="login__select">
          <div class="login__wrap">
            <input type="checkbox" v-model="login.rememberMe" id="rememberMe" name="rememberMe" />
            <label for="rememberMe">Remember Me</label>
          </div>
          <div>
            <button class="button button--three" @click="handleForgotClick">Forgot Password</button>
          </div>
        </div>
      </div>

      <div class="login__items--two">
        <div>
          <h3>Welcome to login, seller !</h3>
          <h4>Don't have an account?</h4>
          <button class="button button--two" @click="handleSignUpClick">Sign up</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, ref, computed } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import router from '@/router/index.js';

export default {
  setup() {
    const authStore = useAuthStore(); // Khởi tạo authStore trong setup
    const login = reactive({
      username: '',
      password: '',
      rememberMe: false
    });

    // console.log(login);

    const handleSubmit = async () => {
      console.log(login);
      try {
        await authStore.loginUser({
          username: login.username,
          password: login.password,
          role: 'seller'
        });
      } catch (error) {
        console.error('Login Error:', error);
      }
    };

    const handleSignUpClick = function () {
       router.push({ name: 'register-user' });
    };

    const handleForgotClick = function () {
      router.push({ path: 'forgotPassword' });
    };

    const testPassword = ref();
    const isCheckPassword = computed(() => {
      return testPassword.value && testPassword.value.length > 0 && testPassword.value.length < 6;
    });

    return {
      login,
      handleSubmit,
      handleSignUpClick,
      handleForgotClick,
      isCheckPassword
    };
  }
};
</script>

<style scoped lang="scss">
@use './login.scss';
</style>
