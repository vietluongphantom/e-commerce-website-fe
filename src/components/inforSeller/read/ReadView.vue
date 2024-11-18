<template>
  <div class="flex justify-between">
    <div class="information__box w-[46%] p-3 bg-[#ffff]">
      <div class="flex flex-col items-center justify-center">
        <img class="w-[50px] h-[50px] mb-2 mt-2" src="@/assets/images/avata_2.png" />
        <hr class="w-[80%] h-[3px] bg-[#69C3A3]" />
      </div>

      <div class="mt-3 p-6">
        <form @submit.prevent="handleEdit">
          <div class="flex w-full justify-between mb-3">
            <div class="mr-3 w-[60%]">
              <label for="fullName">Họ và tên</label>
              <input class="w-full" v-model="userInfo.full_name" id="fullName" type="text" readonly />
            </div>
            <div class="mr-3 w-[20%]">
              <label for="gender">Giới tính</label>
              <input class="w-full" v-model="userInfo.gender" id="gender" readonly />
            </div>
          </div>

          <div class="w-full">
            <label for="tax">Mã số thuế</label>
            <input class="w-[45%]" v-model="userInfo.tax" id="tax" type="text" readonly />
          </div>

          <div class="flex w-full justify-between mt-3">
            <div class="w-[45%]">
              <label for="cccd">Số CCCD</label>
              <input class="w-full" v-model="userInfo.cccd" id="cccd" type="text" readonly />
            </div>
            <div class="w-[45%]">
              <label for="phone">Số điện thoại</label>
              <input class="w-full" v-model="userInfo.phone" id="phone" type="text" readonly />
            </div>
          </div>

          <div class="mt-3 w-full">
            <label for="email">Email</label>
            <input class="w-[60%]" v-model="userInfo.email" id="email" type="email" readonly />
          </div>

          <div class="flex w-full justify-between mt-3">
            <div class="w-[45%]">
              <label for="country">Quốc gia</label>
              <input class="w-full" v-model="userInfo.country" id="country" type="text" readonly />
            </div>
            <div class="w-[45%]">
              <label for="province">Tỉnh</label>
              <input class="w-full" v-model="userInfo.province" id="province" type="text" readonly />
            </div>
          </div>

          <div class="flex w-full justify-between mt-3">
            <div class="w-[45%]">
              <label for="district">Huyện</label>
              <input class="w-full" v-model="userInfo.district" id="district" type="text" readonly />
            </div>
            <div class="w-[45%]">
              <label for="commune">Xã</label>
              <input class="w-full" v-model="userInfo.commune" id="commune" type="text" readonly />
            </div>
          </div>

          <div class="mt-3">
            <label for="addressDetail">Địa chỉ chi tiết</label>
            <textarea class="block" v-model="userInfo.address_detail" id="addressDetail" type="text" readonly />
          </div>
          <button class="button" type="submit">Chỉnh sửa</button>
        </form>
      </div>
    </div>

    <div class="information__box w-[46%] p-3 bg-[#ffff]">
      <div class="flex flex-col items-center justify-center">
        <img class="w-[50px] h-[50px] mb-2 mt-2" src="@/assets/images/shop_icon.png" />
        <hr class="w-[80%] h-[3px] bg-[#69C3A3]" />
      </div>

      <div class="mt-3 p-6">
        <form @submit.prevent="handleEditShop">
          <div class="w-full">
            <label for="name">Tên Shop</label>
            <input class="w-[60%]" v-model="shopInfo.name" id="name" type="text" readonly />
          </div>

          <div class="w-full mt-3">
            <label for="mail">Email</label>
            <input class="w-[60%]" v-model="shopInfo.mail" id="mail" type="email" readonly />
          </div>

          <div class="w-full mt-3">
            <label for="phone">Số điện thoại</label>
            <input class="w-[60%]" v-model="shopInfo.phone" id="phone" type="text" readonly />
          </div>

          <div class="flex w-full justify-between mt-3">
            <div class="w-[45%]">
              <label for="country">Quốc gia</label>
              <input class="w-full" v-model="shopInfo.country" id="country" type="text" readonly />
            </div>
            <div class="w-[45%]">
              <label for="province">Tỉnh</label>
              <input class="w-full" v-model="shopInfo.province" id="province" type="text" readonly />
            </div>
          </div>

          <div class="flex w-full justify-between mt-3">
            <div class="w-[45%]">
              <label for="district">Huyện</label>
              <input class="w-full" v-model="shopInfo.district" id="district" type="text" readonly />
            </div>
            <div class="w-[45%]">
              <label for="commune">Xã</label>
              <input class="w-full" v-model="shopInfo.commune" id="commune" type="text" readonly />
            </div>
          </div>

          <div class="mt-3">
            <label for="addressDetail">Địa chỉ chi tiết</label>
            <textarea class="textarea--one" v-model="shopInfo.address_detail" id="addressDetail" readonly></textarea>
          </div>
          <button class="button button--one" type="submit">Chỉnh sửa</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useInfoStore } from '@/stores/infoStore';
import router from '@/router/index.js';
// Sử dụng store
const infoStore = useInfoStore();

const userInfo = ref(infoStore.userInfo);
const shopInfo = ref(infoStore.shopInfo);

const fetchUserInfo = async () => {
  await infoStore.fetchUserInfo();
  userInfo.value = infoStore.userInfo;
};

const fetchShopInfo = async () => {
  await infoStore.fetchShopInfo();
  shopInfo.value = infoStore.shopInfo;
};

const handleEdit = function () {
  router.push({ name: 'view-personal' });
};

const handleEditShop = function () {
  router.push({ name: 'view-shopInfo' });
};

onMounted(() => {
  fetchUserInfo();
  fetchShopInfo();
});
</script>
<style scoped lang="scss">
@import './readview.scss';
</style>
