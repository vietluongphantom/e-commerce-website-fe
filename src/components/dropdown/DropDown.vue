<template>
  <a-dropdown v-model:open="visible">
    <a class="ant-dropdown-link" @click.prevent>
      <div class="ml-4 flex items-center">
        <img src="@/assets/images/admin_logo.png" class="w-[50px] h-[40px]" />
        <div>
          <p class="text-[13px]">{{ email }}</p>
          <p class="text-[12px] text-[#7A7A7A]">Seller</p>
        </div>
      </div>
      <DownOutlined />
    </a>
    <template #overlay>
      <a-menu @click="handleMenuClick">
        <a-menu-item key="1">Đăng xuất</a-menu-item>
        <a-menu-item key="2">Thông tin tài khoản</a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import router from '@/router/index.js';
import apiServices from '@/domain/apiServices';

const authStore = useAuthStore();
console.log(authStore.user);
const visible = ref(false);
const email = ref('');

const handleMenuClick = ({ key }) => {
  if (key === '1') {
    authStore.logout();
    router.push({ name: 'LoginSeller' });
  } else if (key === '2') {
    router.push({ name: 'view-profile' });
  }
};

async function getUserEmail(role) {
  const response = await apiServices.getUser(role);
  email.value = response.data.data.email;
}
onMounted(() => {
  getUserEmail('seller');
});
</script>
