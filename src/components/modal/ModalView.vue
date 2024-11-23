<template>
  <div>
    <a-button type="primary" @click="showModal" class="inline">Đổi mật khẩu</a-button>
    <a-modal  v-model:open="open" title="" @ok="handleOk">
      <h3 class="text-[30px] font-semibold">Đổi mật khẩu</h3>
      <form @submit.prevent="handleSubmit" class="w-[250px]">
        <div class="form-group">
          <label for="oldPassword" class="text-[16px] block mb-2">Mật khẩu cũ</label>
          <input
            class="modal__border w-[200px] h-[30px] border rounded-md mb-4 p-2"
            type="password"
            id="oldPassword"
            v-model="form.oldPassword"
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
            v-model="form.newPassword"
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
            v-model="form.confirmPassword"
            required
            placeholder="******"
          />
        </div>
      </form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const open = ref(false);
const form = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
});

const showModal = () => {
  open.value = true;
};

const handleSubmit = () => {
  if (form.value.newPassword !== form.value.confirmPassword) {
    alert('Mật khẩu xác nhận không khớp với mật khẩu mới');
    return;
  }

  // Thực hiện các hành động đổi mật khẩu tại đây
  console.log('Đổi mật khẩu thành công với các thông tin:', form.value);
  open.value = false;
};

const handleOk = () => {
  handleSubmit();
};
</script>

<style scoped lang="scss">
.modal {
  &__border {
    border: 3px solid #9e9e9e;
    outline: none;
    &:focus {
      border: 3px solid #3884E1;
    }
  }
}

</style>
