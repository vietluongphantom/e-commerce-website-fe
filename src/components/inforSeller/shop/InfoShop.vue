<template>
  <div class="flex justify-center">
    <div class="shop flex justify-between bg-[#ffff] w-[85%] p-10">
      <div class="w-[42%]">
        <img src="@/assets/images/shop_info3.png" />
      </div>

      <div class="w-[50%]">
        <h2 class="text-[24px] font-semibold mb-3">Shop Information Edit</h2>
        <form @submit.prevent="handleEditShop">
          <div class="w-full">
            <label for="name">Tên Shop</label>
            <input class="w-[60%]" v-model="shopInfo.name" id="name" type="text" />
          </div>

          <div class="w-full mt-3">
            <label for="mail">Email</label>
            <input class="w-[60%]" v-model="shopInfo.mail" id="mail" type="email" />
          </div>

          <div class="w-full mt-3">
            <label for="phone">Số Điện thoại</label>
            <input class="w-[60%]" v-model="shopInfo.phone" id="phone" type="text" />
          </div>

          <div class="flex w-full justify-between mt-3">
            <div class="w-[45%]">
              <label for="country">Quốc gia</label>
              <input class="w-full" v-model="shopInfo.country" id="country" type="text" />
            </div>
            <div class="w-[45%]">
              <label for="province">Tỉnh:</label>
              <input class="w-full" v-model="shopInfo.province" id="province" type="text" />
            </div>
          </div>

          <div class="flex w-full justify-between mt-3">
            <div class="w-[45%]">
              <label for="district">Huyện</label>
              <input class="w-full" v-model="shopInfo.district" id="district" type="text" />
            </div>
            <div class="w-[45%]">
              <label for="commune">Xã</label>
              <input class="w-full" v-model="shopInfo.commune" id="commune" type="text" />
            </div>
          </div>

          <div class="mt-3">
            <label for="addressDetail">Địa chỉ chi tiết</label>
            <textarea v-model="shopInfo.address_detail" id="addressDetail"></textarea>
          </div>
          <button class="button button--one" type="submit">Cập nhật</button>
        </form>

        <button @click="handleBack" class="text-[17px] text-[#63B899] underline mt-3 font-medium">Back</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useInfoStore } from '@/stores/infoStore';
import router from '@/router/index.js';

const infoStore = useInfoStore();

const shopInfo = ref(infoStore.shopInfo);

const fetchShopInfo = async () => {
  await infoStore.fetchShopInfo();
  shopInfo.value = infoStore.shopInfo;
};

const handleBack = function() {
  router.push({ name: 'view-profile' });
}

const handleEditShop = async() => {
  await infoStore.updateShopInfo(shopInfo.value);
  router.push({ name: 'view-profile' });
}

onMounted(() => {
  fetchShopInfo();
});
</script>

<style scoped lang="scss">
@import './shop.scss';
</style>
