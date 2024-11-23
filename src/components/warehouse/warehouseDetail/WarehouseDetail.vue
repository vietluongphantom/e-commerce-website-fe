<template>
  <div class="container flex flex-col bg-[#ffff] items-center w-[50%] p-4 rounded-lg">
    <div class="w-[50%]">
      <img src="@/assets/images/warehouse_2.png" class="object-cover w-full h-auto" />
    </div>
    <div class="w-[90%] p-4">
      <h1 class="text-[22px] font-semibold mb-5 mt-2">Thêm mới kho hàng</h1>
      <form @submit.prevent="handleSubmit">
        <label for="name">Tên kho</label>
        <input class="w-[45%]" id="name" v-model="form.name" type="text" placeholder="Kho A..." />

        <div class="flex justify-between">
          <div class="w-[45%]">
            <label for="country">Quốc gia</label>
            <input class="w-full" id="country" v-model="form.country" type="text" placeholder="Việt Nam..." />
          </div>

          <div class="w-[45%]">
            <label for="province">Tỉnh / Thành phố</label>
            <input class="w-full" id="province" v-model="form.province" type="text" placeholder="Hà Nội.." />
          </div>
        </div>

        <div class="flex justify-between">
          <div class="w-[45%]">
            <label for="district">Huyện / Quận</label>
            <input class="w-full" id="district" v-model="form.district" type="text" placeholder="Hoàng Mai.." />
          </div>

          <div class="w-[45%]">
            <label for="commune">Xã / Phường</label>
            <input class="w-full" id="commune" v-model="form.commune" type="text" placeholder="Đại Kim.." />
          </div>
        </div>

        <label for="address_detail">Địa chỉ chi tiết</label>
        <input class="w-full" id="address_detail" v-model="form.address_detail" type="text" placeholder="Số nhà.., Ngõ..." />

        <!-- Nút button -->
        <button class="button text-[17px] font-medium w-[40%] bg-[#69C3A3] text-[#fff] rounded-xl p-1 mt-6" type="submit">Thêm mới</button>
      </form>

      <button @click="handleBack" class="text-[17px] text-[#69C3A3] font-medium underline ml-[40%]">Quay lại</button>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useWarehouseStore } from '@/stores/warehouseStore';
import router from '@/router/index.js';

const warehouseStore = useWarehouseStore();

const form = reactive({
  name: '',
  country: '',
  province: '',
  district: '',
  commune: '',
  address_detail: ''
});

const handleSubmit = () => {
  warehouseStore.addWarehouse(form);
};

const handleBack = () => {
  warehouseStore.currentPage = 1;
  router.push({ name: 'menu-10' });
};
</script>

<style scoped lang="scss">
@import './style.scss';
</style>
