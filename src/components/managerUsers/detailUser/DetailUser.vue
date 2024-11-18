<template>
  <div class="flex justify-center items-center h-full">
    <div class="container flex p-8 bg-[#fff] w-[70%] justify-between rounded-lg">
      <div class="w-[45%]">
        <img src="@/assets/images/view_profile_2.png" class="w-full h-full object-contain" />
      </div>

      <div class="w-[46%]">
        <h2 class="text-[23px] font-semibold mb-4">Thông tin người mua</h2>
        <div class="form-group">
          <label class="block text-[16px] mb-2">Họ và tên</label>
          <input
            class="outline-none border-2 border-[#D2D2D2] p-1 pl-2 rounded-md w-[90%] mb-4 text-[#696969]"
            type="text"
            v-model="userDetails.full_name"
            readonly
          />
        </div>

        <div class="form-group">
          <label class="block text-[16px] mb-2">Email:</label>
          <input
            class="outline-none border-2 border-[#D2D2D2] p-1 pl-2 rounded-md w-[90%] mb-4 text-[#696969]"
            type="text"
            v-model="userDetails.email"
            readonly
          />
        </div>

        <div class="form-group">
          <label class="block text-[16px] mb-2">Số điện thoại:</label>
          <input
            class="outline-none border-2 border-[#D2D2D2] p-1 pl-2 rounded-md w-[90%] mb-4 text-[#696969]"
            type="text"
            v-model="userDetails.phone"
            readonly
          />
        </div>

        <div class="form-group">
          <label class="block text-[16px] mb-2">Giới tính:</label>
          <input
            class="outline-none border-2 border-[#D2D2D2] p-1 pl-2 rounded-md w-[90%] mb-4 text-[#696969]"
            type="text"
            v-model="userDetails.gender"
            readonly
          />
        </div>

        <button @click="handleBack" class="text-[#69C3A3] underline font-medium text-[17px] mt-3">Quay lại</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useUsersStore } from '@/stores/accountUserStore';
import router from '@/router/index.js';
import { useRoute } from 'vue-router';

const route = useRoute();
const id = route.params.id;

const usersStore = useUsersStore();
const userDetails = computed(() => usersStore.userDetails);

const handleBack = () => {
  router.push({ name: 'admin-menu-6' });
};

onMounted(() => {
  usersStore.getUserById(id);
});
</script>

<style scoped lang="scss">
.container {
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
}
</style>
