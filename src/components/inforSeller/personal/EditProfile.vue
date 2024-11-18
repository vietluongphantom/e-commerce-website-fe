<template>
  <div class="flex justify-center">
    <div class="profile flex justify-between bg-[#ffff] w-[85%]">
      <div class="w-[50%] flex items-center justify-center">
        <img class="w-[450px] h-[450px]" src="@/assets/images/edit_profile3.png" />
      </div>
      <div class="profile__box w-[55%] p-3 mr-11">
        <h2 class="mt-3 pl-6 text-[24px] font-semibold">Edit personal information</h2>

        <div class="p-6">
          <form @submit.prevent="handleUpdate">
            <div class="flex w-full justify-between mb-3">
              <div class="mr-3 w-[60%]">
                <label for="fullName">Họ và tên</label>
                <input class="w-full" v-model="userInfo.full_name" id="fullName" type="text" />
              </div>
              <div class="mr-3 w-[20%]">
                <label for="gender">Giới tính</label>
                <select class="w-full" v-model="userInfo.gender" id="gender">
                  <option value="FEMALE">Nữ</option>
                  <option value="MALE">Nam</option>
                  <option value="OTHER">Khác</option>
                </select>
              </div>
            </div>

            <div class="w-full">
              <label for="tax">Mã số thuế</label>
              <input class="w-[45%]" v-model="userInfo.tax" id="tax" type="text" />
            </div>

            <div class="flex w-full justify-between mt-3">
              <div class="w-[45%]">
                <label for="cccd">Số CCCD</label>
                <input class="w-full" v-model="userInfo.cccd" id="cccd" type="text" />
              </div>
              <div class="w-[45%]">
                <label for="phone">Số điện thoại</label>
                <input class="w-full" v-model="userInfo.phone" id="phone" type="text" />
              </div>
            </div>

            <div class="mt-3 w-full">
              <label for="email">Email</label>
              <input class="w-[60%]" v-model="userInfo.email" id="email" type="email" />
            </div>

            <div class="flex w-full justify-between mt-3">
              <div class="w-[45%]">
                <label for="country">Quốc gia</label>
                <input class="w-full" v-model="userInfo.country" id="country" type="text" />
              </div>
              <div class="w-[45%]">
                <label for="province">Tỉnh</label>
                <input class="w-full" v-model="userInfo.province" id="province" type="text" />
              </div>
            </div>

            <div class="flex w-full justify-between mt-3">
              <div class="w-[45%]">
                <label for="district">Huyện</label>
                <input class="w-full" v-model="userInfo.district" id="district" type="text" />
              </div>
              <div class="w-[45%]">
                <label for="commune">Xã</label>
                <input class="w-full" v-model="userInfo.commune" id="commune" type="text" />
              </div>
            </div>

            <div class="mt-3">
              <label for="addressDetail">Địa chỉ chi tiết:</label>
              <textarea class="block" v-model="userInfo.address_detail" id="addressDetail" type="text" />
            </div>
            <button class="button" type="submit">Cập nhật</button>
          </form>

          <button @click="handleBack" class="text-[17px] text-[#63B899] underline mt-3 font-medium">Back</button>
        </div>
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

const fetchUserInfo = async () => {
  await infoStore.fetchUserInfo();
  userInfo.value = infoStore.userInfo;
};

const handleUpdate = async () => {
  console.log('trước update');
  console.log(userInfo.value.gender);
  await infoStore.updateUserInfo(userInfo.value);
  router.push({ name: 'view-profile' });
};

const handleBack = function () {
  router.push({ name: 'view-profile' });
};

onMounted(() => {
  fetchUserInfo();
});
</script>
<style scoped lang="scss">
@import './profile.scss';
</style>
