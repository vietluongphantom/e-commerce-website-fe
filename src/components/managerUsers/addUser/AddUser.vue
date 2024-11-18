<template>
  <div class="flex justify-center items-center h-full">
    <div class="container flex p-8 bg-[#fff] w-[70%] justify-between rounded-lg">
      <div class="w-[45%]">
        <img src="@/assets/images/profile_2.png" class="w-full h-full object-contain" />
      </div>

      <div class="w-[46%]">
        <h2 class="text-[23px] font-semibold mb-4">Thêm mới người mua</h2>
        <form @submit.prevent="submitForm">
          <div>
            <label for="fullName" class="text-[16px] font-medium mb-1 block">Họ tên</label>
            <input
              type="text"
              id="fullName"
              v-model="formUser.fullName"
              placeholder="Nhập tên của bạn"
              class="outline-none border-2 border-[#D2D2D2] p-1 pl-2 rounded-md w-[90%] mb-4 text-[#696969]"
            />
          </div>

          <div>
            <label for="email" class="text-[16px] font-medium mb-1 block">Email</label>
            <input
              type="email"
              id="email"
              v-model="formUser.email"
              placeholder="Nhập emai của bạn"
              class="outline-none border-2 border-[#D2D2D2] p-1 pl-2 rounded-md w-[90%] mb-4 text-[#696969]"
            />
          </div>

          <div>
            <label for="phone" class="text-[16px] font-medium mb-1 block">Số điện thoại</label>
            <input
              type="text"
              id="phone"
              v-model="formUser.phone"
              placeholder="Nhập số điện thoại"
              class="outline-none border-2 border-[#D2D2D2] p-1 pl-2 rounded-md w-[90%] mb-4 text-[#696969]"
            />
          </div>

          <div>
            <label for="gender" class="text-[16px] font-medium mb-1 block">Giới tính</label>
            <select
              id="gender"
              v-model="formUser.gender"
              class="outline-none border-2 border-[#D2D2D2] p-1 pl-2 rounded-md w-[90%] mb-4 text-[#696969]"
            >
              <option value="MALE">Nam</option>
              <option value="FEAMLE">Nữ</option>
              <option value="OTHER">Khác</option>
            </select>
          </div>

          <div>
            <label for="password" class="text-[16px] font-medium mb-1 block">Password</label>
            <input
              type="password"
              id="password"
              v-model="formUser.password"
              placeholder="*******"
              class="outline-none border-2 border-[#D2D2D2] p-1 pl-2 rounded-md w-[90%] mb-4 text-[#696969]"
            />
          </div>

          <div>
            <button class="button w-[90%] text-[#fff] bg-[#63B899] font-medium rounded-xl text-[17px] p-1 mt-3" type="submit">Submit</button>
          </div>
        </form>

        <button @click="handleBack" class="text-[#69C3A3] underline font-medium text-[17px] mt-3">Quay lại</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue';
import { useUsersStore } from '@/stores/accountUserStore';
import router from '@/router/index.js';

const usersStore = useUsersStore();

const formUser = reactive({
  fullName: '',
  email: '',
  password: '',
  phone: '',
  gender: 'MALE'
});

const submitForm = () => {
  usersStore.addUser(formUser);
};

const handleBack = () => {
  router.push({ name: 'admin-menu-6' });
};

onMounted(() => {});
</script>

<style scoped lang="scss">
.container {
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
}

.button {
  &:hover {
    background-color: #fff;
    color: #63b899;
    box-shadow:
      0 0 10px #63b899,
      0 0 20px #63b899;
  }
}
</style>
