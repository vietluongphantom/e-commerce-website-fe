<template>
  <div class="grid grid-cols-4 gap-9">
    <div class="item col-span-2 rounded-lg overflow-hidden bg-[#fff]">
      <img src="@/assets/images/chart.png" />
    </div>

    <div class="item col-span-2 rounded-lg overflow-hidden bg-[rgb(255,255,255)] p-5">
      <div class=" grid grid-cols-2 gap-7 h-full">
        <div class="item__box p-5 bg-[#F0F4F8] rounded-lg">
          <div class="flex justify-between mb-2">
            <p class="text-[17px] font-medium">Người dùng</p>
            <UserIcon class="w-[30px] h-[30px] bg-[#475DE3] p-2 rounded-full"></UserIcon>
          </div>
          <p class="text-[30px] font-bold mb-2">90</p>
          <button class="text-[#9E9E9E]">Chi tiết</button>
        </div>

        <div class=" item__box p-5 bg-[#F0F4F8] rounded-lg">
          <div class="flex justify-between mb-2">
            <p class="text-[17px] font-medium">Người bán</p>
            <UserIcon class="w-[30px] h-[30px] bg-[#475DE3] p-2 rounded-full"></UserIcon>
          </div>
          <p class="text-[30px] font-bold mb-2">118</p>
          <button class="text-[#9E9E9E]">Chi tiết</button>
        </div>

        <div class="item__box p-5 bg-[#F0F4F8] rounded-lg">
          <div class="flex justify-between mb-2">
            <p class="text-[17px] font-medium">Đơn hàng</p>
            <OrderIcon class="w-[30px] h-[30px] bg-[#475DE3] p-2 rounded-full"></OrderIcon>
          </div>
          <p class="text-[30px] font-bold mb-2">118</p>
          <button class="text-[#9E9E9E]">Chi tiết</button>
        </div>

        <div class="item__box p-5 bg-[#F0F4F8] rounded-lg">
          <div class="flex justify-between mb-2">
            <p class="text-[17px] font-medium">Thống kê</p>
            <ChartIcon class="w-[30px] h-[30px] bg-[#475DE3] p-2 rounded-full"></ChartIcon>
          </div>
          <p class="text-[30px] font-bold mb-2">118</p>
          <button class="text-[#9E9E9E]">Chi tiết</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { UserIcon, OrderIcon, ChartIcon} from '@/assets/icons/icon.js';
</script>

<style scoped lang="scss">
@import './style.scss';
</style>
