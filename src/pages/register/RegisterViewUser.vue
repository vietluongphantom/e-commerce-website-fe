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
                <label for="country">Tỉnh / thành phố</label>
                <a-select
                  v-model:value="formData.province"
                  show-search
                  placeholder="Chọn tỉnh/thành phố"
                  style="width: 100%"
                  :options="provinces"
                  @focus="handleFocus"
                  @blur="handleBlur"
                  @change="handleChangeProvince"
                  :filter-option="(input, option) => option.label.toLowerCase().includes(input.toLowerCase())"
                  required
                ></a-select>
              </div>
              <div class="form-group w-[46%]">
                <label for="district">Quận / huyện</label>
                <a-select
                v-model:value="formData.district"
                show-search
                placeholder="Chọn quận/huyện"
                style="width: 100%"
                :options="districts"
                :filter-option="(input, option) => option.label.toLowerCase().includes(input.toLowerCase())"
                @focus="handleFocus"
                @blur="handleBlur"
                @change="handleChangeDistrict"
                required
              ></a-select>
              </div>
            </div>

            <div class="flex justify-between">
              <div class="form-group w-[46%]">
                <label for="commune">Xã</label>
                <a-select
                v-model:value="formData.commune"
                show-search
                placeholder="Chọn phương/xã"
                style="width: 100%"
                :options="wards"
                :filter-option="(input, option) => option.label.toLowerCase().includes(input.toLowerCase())"
                @focus="handleFocus"
                @blur="handleBlur"
                @change="handleChangeWard"
                required
              ></a-select>
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
import { reactive, ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import Swal from 'sweetalert2';
import authService from '@/domain/authServices';
import { useToast } from "vue-toastification";


const toast = useToast();
const registerStore = useAuthStore();

const formData = reactive({
  full_name: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
  gender: 'MALE',
  role: 'user',
  country: 'Việt Nam',
  province: '',
  district: '',
  commune: '',
  address_detail: ''
});

const handleCheckboxChange = (event) => {
  formData.role = event.target.checked ? 'seller' : 'user';
};

const handleSubmit = async () => {
  const isValid = Object.values(formData).every((value) => value.trim() !== '');

  if (!isValid) {
    toast.error('Vui lòng điền đầy đủ tất cả các trường.', {
      timeout: 5000
    });
    return;
  }

  if (formData.password !== formData.confirmPassword) {
    toast.error('Mật khẩu  và xác nhận mật khẩu không giống nhau.', {
      timeout: 5000
    });
    return;
  }
  registerStore.register(formData);
};

const provinces = ref([]);
const districts = ref([]);
const wards = ref([]);

const handleChangeProvince = async (e, option) => {
  formData.province = option.label
  districts.value = [];
  formData.district = '';
  wards.value = [];
  formData.commune = '';
  const response = await authService.fetchAllDistrict(e);
  districts.value = response.data.data.map((district) => ({
    value: district.id,
    label: district.name
  }));
};

const handleChangeDistrict = async (e, option) => {
  formData.district = option.label
  wards.value = [];
  formData.commune = '';
  const response = await authService.fetchAllWard(e);
  wards.value = response.data.data.map((ward) => ({
    value: ward.id,
    label: ward.name
  }));
};


const handleChangeWard= async (e, option) => {
  formData.commune = option.label
};


onMounted(async () => {
  const response = await authService.fetchAllProvince();
  provinces.value = response.data.data.map((province) => ({
    value: province.id,
    label: province.name
  }));
});
</script>

<style scoped lang="scss">
@import './register.scss';
</style>
