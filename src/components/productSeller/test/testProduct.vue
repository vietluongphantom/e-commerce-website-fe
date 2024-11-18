<template>
  <div class="relative w-[30%]">
    <div @click="toggleDropdown" @blur="hideDropdown" tabindex="0" class="border border-gray-300 rounded px-3 py-2 cursor-pointer">
      {{ selectedItem ? selectedItem.name : 'Chọn sản phẩm' }}
    </div>

    <div
      v-if="showDropdown"
      ref="dropdownList"
      class="absolute left-0 right-0 mt-2 bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-y-auto"
    >
      <ul>
        <li v-for="item in items" :key="item.id" @click="selectItem(item)" class="px-4 py-2 hover:bg-gray-100 cursor-pointer">
          {{ item.name }}
        </li>
      </ul>
      <div v-if="loading" class="px-4 py-2 text-center">Loading...</div>
      <div ref="loadMoreTrigger" class="h-4"></div> <!-- Element để theo dõi khi đến cuối danh sách -->
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { useScroll, useThrottleFn } from '@vueuse/core';
import apiServices from '@/domain/apiServices';

const showDropdown = ref(false);
const items = ref([]);
const loading = ref(false);
const currentPage = ref(1);
const selectedItem = ref(null);
const loadMoreTrigger = ref(null);

// Hàm tải dữ liệu từ API
const loadMoreItems = async () => {
  if (loading.value) return;

  loading.value = true;
  try {
    const response = await apiServices.getAllCategory(currentPage.value, 10, '');
    if (response.data && response.data.data && Array.isArray(response.data.data.content)) {
      items.value.push(...response.data.data.content); // Duy trì các mục đã tải
      console.log(items.value);
      currentPage.value++;
    }
  } catch (error) {
    console.error('Error loading items:', error);
  } finally {
    loading.value = false;
  }
};

// Lắng nghe sự kiện cuộn
const { isScrolling } = useScroll(loadMoreTrigger);

// Sử dụng useThrottleFn để giảm số lần gọi hàm
const loadMoreItemsThrottled = useThrottleFn(() => {
  if (!loading.value && isScrolling.value) {
    loadMoreItems();
  }
}, 200);

watch(isScrolling, (newVal) => {
  if (newVal) {
    loadMoreItemsThrottled();
  }
});

// Ẩn dropdown khi mất focus
const hideDropdown = () => {
  setTimeout(() => {
    showDropdown.value = false;
  }, 200);
};

// Hiển thị dropdown khi click
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
  if (showDropdown.value && items.value.length === 0) {
    loadMoreItems();
  }
};

// Lựa chọn một item từ danh sách
const selectItem = (item) => {
  selectedItem.value = item;
  showDropdown.value = false;
};
</script>

<style scoped>
/* Add custom styles if necessary */
</style>
