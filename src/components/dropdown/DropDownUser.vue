<template>
  <span class="text-[#fff] mr-1">Xin chào, </span>
  <a-dropdown v-model:open="visible">
    <a class="ant-dropdown-link" @click.prevent>
      <div class="ml-4 flex items-center cursor-pointer">
        <UserIcon class="icon__user mt-[10px] mb-[10px] w-[25px] h-[25px]"></UserIcon>
        <div class="flex items-center">
          <p class="text-[14px] text-[#fff] mr-1">{{ email }}</p>
          <DropIcon class="w-[15px] h-[15px]"></DropIcon>
        </div>
      </div>
      <DownOutlined />
    </a>
    <template #overlay>
      <a-menu @click="handleMenuClick">
        <a-menu-item key="1">Đăng xuất</a-menu-item>
        <a-menu-item key="2">Thông tin tài khoản</a-menu-item>
        <a-menu-item key="3">Đổi mật khẩu</a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>

  <a-modal v-model:open="open" @ok="handleOk">
    <h3 class="text-[30px] font-semibold">Đổi mật khẩu</h3>
    <form @submit.prevent="handleSubmit" class="w-[250px]">
      <div class="form-group">
        <label for="oldPassword" class="text-[16px] block mb-2">Mật khẩu cũ</label>
        <input
          class="modal__border w-[200px] h-[30px] border rounded-md mb-4 p-2"
          type="password"
          id="oldPassword"
          v-model="form.old_password"
          required
          placeholder="******"
        />
      </div>
      <div class="form-group">
        <label for="newPassword" class="text-[16px] block mb-2">Mật khẩu mới</label>
        <input
          class="modal__border w-[200px] h-[30px] border rounded-md mb-4 p-2"
          type="password"
          id="newPassword"
          v-model="form.new_password"
          required
          minlength="6"
          placeholder="******"
        />
      </div>
      <div class="form-group">
        <label for="confirmPassword" class="text-[16px] block mb-2">Xác nhận mật khẩu mới</label>
        <input
          class="modal__border w-[200px] h-[30px] border rounded-md p-2"
          type="password"
          id="confirmPassword"
          v-model="form.confirm_password"
          required
          placeholder="******"
        />
      </div>
    </form>
  </a-modal>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import router from '@/router/index.js';
import apiServices from '@/domain/apiServices';
import { UserIcon, DropIcon } from '@/assets/icons/icon.js';
import Swal from 'sweetalert2';

const authStore = useAuthStore();
const visible = ref(false);
const email = ref('');

const handleMenuClick = ({ key }) => {
  if (key === '1') {
    authStore.logout();
    router.push({ name: 'login-user' });
  } else if (key === '2') {
    router.push({ name: 'view-profile-user' });
  } else if (key === '3') {
    open.value = true;
  }
};

async function getUserEmail(role) {
  const response = await apiServices.getUser(role);
  email.value = response.data.data.email;
  form.value.email = email.value;
}

const open = ref(false);
const form = ref({
  email: '',
  old_password: '',
  new_password: '',
  confirm_password: ''
});

const handleOk = async () => {
  if (form.value.new_password !== form.value.confirm_password) {
    Swal.fire({
      title: 'Mật khẩu mới không khớp nhau!',
      icon: 'question'
    });
    return;
  }
  console.log(form.value);
  const response = await apiServices.changePw(form.value);

  if (response.data.code === 200) {
    router.push({ name: 'Home user' });
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Cập nhật thành công!',
      showConfirmButton: false,
      timer: 1500
    });
    open.value = false;
  } else if (response.data.code === 500) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Mật khẩu cũ không chính xác!'
    });
  }
};

onMounted(() => {
  getUserEmail('user');
});
</script>

<style lang="scss" scoped>
.icon {
  &__user {
    width: 35px;
    height: 35px;
    color: #ffff;
    border-radius: 50%;
    padding: 0px 10px;
    border: 2px solid;
    margin-right: 10px;
  }
}
</style>
