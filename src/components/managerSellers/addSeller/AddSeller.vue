<template>
  <div class="flex justify-center items-center h-full">
    <div class="container flex p-8 bg-[#fff] w-[70%] justify-between rounded-lg">
      <div class="w-[45%]">
        <img src="@/assets/images/view_profile_2.png" class="w-full h-full object-contain" />
      </div>

      <div class="w-[46%]">
        <h2 class="text-[23px] font-semibold mb-4">Thêm mới người bán</h2>
        <form @submit.prevent="submitForm">
          <div>
            <label for="fullName">Full Name</label>
            <input type="text" id="fullName" v-model="form.fullName" placeholder="Enter your full name" />
          </div>

          <div>
            <label for="email">Email</label>
            <input type="email" id="email" v-model="form.email" placeholder="Enter your email" />
          </div>

          <div>
            <label for="phone">Phone</label>
            <input type="text" id="phone" v-model="form.phone" placeholder="Enter your phone number" />
          </div>

          <div>
            <label for="gender">Gender</label>
            <select id="gender" v-model="form.gender">
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label for="password">Password</label>
            <input type="password" id="password" v-model="form.password" placeholder="Enter your password" />
          </div>

          <!-- Submit Button -->
          <div>
            <button type="submit">Submit</button>
          </div>
        </form>

        <button @click="handleBack" class="text-[#69C3A3] underline font-medium text-[17px] mt-3">Quay lại</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue';
// import { useSellersStore } from '@/stores/accountSellerStore';
// import router from '@/router/index.js';

// const sellersStore = useSellersStore();

const form = reactive({
  fullName: '',
  email: '',
  password: '',
  phone: '',
  gender: ''
});

onMounted(() => {});
</script>

<style scoped lang="scss">
.container {
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
}
</style>
