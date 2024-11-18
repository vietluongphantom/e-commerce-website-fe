<template>
  <div class="container flex flex-col bg-[#ffff] items-center w-[50%] p-4 rounded-lg">
    <div class="w-[50%]">
      <img src="@/assets/images/edit_warehouse.png" class="object-cover w-full h-auto" />
    </div>
    <div class="w-[90%] p-4">
      <h1 class="text-[22px] font-semibold mb-5">Thông tin kho hàng</h1>
      <form @submit.prevent="submitForm">
        <label for="name">Tên kho</label>
        <input class="w-[45%]" id="name" v-model="formDetail.name" type="text" />

        <div class="flex justify-between">
          <div class="w-[45%]">
            <label for="country">Quốc gia</label>
            <input class="w-full" id="country" v-model="formDetail.country" type="text" />
          </div>

          <div class="w-[45%]">
            <label for="province">Tỉnh / Thành phố</label>
            <input class="w-full" id="province" v-model="formDetail.province" type="text" />
          </div>
        </div>

        <div class="flex justify-between">
          <div class="w-[45%]">
            <label for="district">Huyện</label>
            <input class="w-full" id="district" v-model="formDetail.district" type="text" />
          </div>

          <div class="w-[45%]">
            <label for="commune">Xã</label>
            <input class="w-full" id="commune" v-model="formDetail.commune" type="text" />
          </div>
        </div>

        <label for="address_detail">Địa chỉ chi tiết</label>
        <input class="w-full" id="address_detail" v-model="formDetail.address_detail" type="text" />

        <!-- Nút button -->
        <button class="button text-[17px] font-medium w-[40%] bg-[#69C3A3] text-[#fff] rounded-xl p-1 mt-6" type="submit">Cập nhật</button>
      </form>

      <button @click="handleBack" class="text-[17px] text-[#69C3A3] font-medium underline ml-[40%]">Quay lại</button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useWarehouseStore } from '@/stores/warehouseStore';
import { useRoute } from 'vue-router';
import router from '@/router/index.js';

const route = useRoute();
const id = route.params.id;

const warehouseStore = useWarehouseStore();
const formDetail = computed(() => warehouseStore.detail);

const submitForm = () => {
  // console.log(formDetail.value);
  warehouseStore.updateWarehouse(id, formDetail.value);
};

const handleBack = () => {
  warehouseStore.currentPage = 1;
  router.push({ name: 'menu-10' });
};

onMounted(() => {
  warehouseStore.detailWarehouse(id);
});
</script>

<style lang="scss" scoped>
@import './style.scss';
</style>
