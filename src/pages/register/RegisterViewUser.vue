<template>
  <div class="flex justify-center p-8 bg-[#EFEFEF]">
    <div class="w-[70%] bg-[#ffff] flex rounded-md item overflow-hidden">
      <div class="gradient-custom w-[30%] flex flex-col items-center justify-center">
        <img src="@/assets/images/user.png" class="w-[60px] object-cover" />
        <p class="mt-4 text-[22px] font-medium">Trang đăng ký</p>
      </div>

      <div class="w-[70%] p-10 item">
        <h3 class="text-[20px] font-medium mb-1">Vui lòng điền thông tin của bạn</h3>
        <hr class="border-none bg-[#8A8A8A] h-[2px]" />

        <div class="mt-6 mb-8">
          <form @submit.prevent="handleSubmit">
            <div class="flex justify-between">
              <div class="form-group w-[46%]">
                <label for="full_name">Họ và tên</label>
                <input class="w-full" type="text" id="full_name" v-model="formData.full_name" required />
              </div>

              <div class="form-group w-[46%]">
                <label for="email">Email</label>
                <input class="w-full" type="email" id="email" v-model="formData.email" required />
              </div>
            </div>

            <div class="flex justify-between">
              <div class="form-group w-[46%]">
                <label for="password">Mật khẩu</label>
                <input class="w-full" type="password" id="password" v-model="formData.password" required />
              </div>

              <div class="form-group w-[46%]">
                <label for="confirmPassword">Nhập lại mật khẩu</label>
                <input class="w-full" type="password" id="confirmPassword" v-model="formData.confirmPassword" required />
              </div>
            </div>

            <div class="flex justify-between">
              <div class="form-group w-[46%]">
                <label for="phone">Số điện thoai</label>
                <input class="w-full" type="text" id="phone" v-model="formData.phone" required />
              </div>

              <div class="form-group w-[46%]">
                <label for="gender">Giới tính</label>
                <select class="w-full" id="gender" v-model="formData.gender" required>
                  <option value="MALE">Nam</option>
                  <option value="FEMALE">Nữ</option>
                  <option value="OTHER">Khác</option>
                </select>
              </div>
            </div>

            <div class="flex justify-between">
              <div class="form-group w-[46%]">
                <label for="country">Quốc gia</label>
                <input class="w-full" type="text" id="country" v-model="formData.country" required />
              </div>
              <div class="form-group w-[46%]">
                <label for="province">Tỉnh thành</label>
                <input class="w-full" type="text" id="province" v-model="formData.province" required />
              </div>
            </div>

            <div class="flex justify-between">
              <div class="form-group w-[46%]">
                <label for="district">Huyện</label>
                <input class="w-full" type="text" id="district" v-model="formData.district" required />
              </div>
              <div class="form-group w-[46%]">
                <label for="commune">Xã</label>
                <input class="w-full" type="text" id="commune" v-model="formData.commune" required />
              </div>
            </div>

            <div class="form-group w-full">
              <label for="address_detail">Địa chỉ chi tiết</label>
              <textarea class="w-full" type="text" id="address_detail" v-model="formData.address_detail" required />
            </div>

            <div class="w-full justify-between flex items-center mt-8">
              <label class="text-[18px] text-[#F08177]">
                <input type="checkbox" @change="handleCheckboxChange" class="w-[16px] h-[16px] mr-2" />
                Người bán
              </label>
              <button @click="handleSubmit" class="bg-[#EF8076] text-[#fff] font-medium text-[18px] p-6 pt-2 pb-2 rounded-lg" type="submit">
                Đăng ký
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import Swal from 'sweetalert2';


const registerStore = useAuthStore();

const formData = reactive({
  full_name: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
  gender: 'MALE',
  role: 'user',
  country: '',
  province: '',
  district: '',
  commune: '',
  address_detail: ''
});

const handleCheckboxChange = (event) => {
  formData.role = event.target.checked ? 'seller' : 'user';
};

const handleSubmit = async () => {
  if (formData.password !== formData.confirmPassword) {
    Swal.fire({
      title: 'Passwords do not match!',
      text: 'Please check your password and confirm password.',
      icon: 'error'
    });
    return;
  }
  registerStore.register(formData);
};


</script>

<style scoped lang="scss">
@import './register.scss';
</style>
