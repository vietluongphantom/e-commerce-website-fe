<template>
  <div class="product mt-3">
    <div class="grid grid-cols-5 gap-5 p-5">
      <div
        v-for="product in productData.dataSource"
        :key="product.id"
        class="product__item rounded-md overflow-hidden cursor-pointer"
        @click="goToProductDetail(product.id)"
      >
        <div class="relative w-full overflow-hidden aspect-square">
          <img v-bind:src="product.images[0]" alt="Product Image" class="w-full h-full object-cover" />
          <div class="absolute top-0 right-0 p-2 text-[13px] bg-[#FE8383] text-[#ffff] rounded-md font-normal bg-opacity-80">
            -{{ product.average_rate }}%
          </div>
        </div>
        <div class="p-4">
          <h4 class="text-[15px] font-medium truncate mb-1">{{ product.name }}</h4>
          <p class="text-[18px] font-semibold text-[#EE4D2D]">
            <!-- {{ product.price }} -->
            {{ formatCurrency(product.min_price) }}
          </p>

          <div class="flex justify-between items-center mt-1 mb-1">
            <!-- <a-rate class="custom-rate w-[47%] flex" :value="product.average_rate" :disabled="true" /> -->
            <div class="flex items-center">
              <span class="text-[14px] mr-1 text-[#FEC700]">{{ product.average_rate }}</span>
              <StartIcon class="w-[14px] h-[14px]"></StartIcon>
            </div>
            <p class="italic font-normal text-[13px]">Đã bán {{ formatNumber(product.total_sold)}}</p>
          </div>
        </div>
      </div>
    </div>

    <a-pagination v-model:current="current" simple :total="50" class="mb-[30px] mt-[20px]" />
  </div>
</template>

<script setup>
import { computed, onMounted, watch, ref } from 'vue';
import { productStore } from '@/stores/products';
import router from '@/router/index.js';
import { StartIcon } from '@/assets/icons/icon.js';
import { eventBus } from '@/utils/eventBusHeader.js'; 

const searchQuery = ref(eventBus.searchQuery);

const store = productStore();
const props = defineProps({
  filter: {
    type: Object,
    default: () => ({})
  }
});

const productData = computed(() => ({
  dataSource: store.products,
  totalElements: store.totalElements,
  currentPage: store.currentPage,
  pageSize: store.pageSize
}));

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

// const fetchProducts = async () => {
//   await store.fetchProducts('',props.option,);
//   productData.dataSource = store.products
// };

// watch(() => props.option, fetchProducts, { immediate: true });

// watch(() => props.filter, fetchProducts, { immediate: true });

watch(() => eventBus.searchQuery, (newQuery) => {
    console.log("fetch for search")
  searchQuery.value = newQuery;
  store.fetchProducts(searchQuery.value,props.option);
  productData.dataSource = store.products
});


watch(
  () => props.filter,
  (newFilter, oldFilter) => {
    console.log('Filter changed:', newFilter);
    store.fetchProducts(searchQuery.value,newFilter.sort,newFilter.fromPrice,newFilter.toPrice,newFilter.selectedBrand.join(','), newFilter.selectedCategories.join(','),newFilter.selectStar);
    productData.dataSource = store.products
  },
  { deep: true }
);

// const fetchProducts = async () => {
//   await store.fetchProducts('',props.option,);
//   productData.dataSource = store.products
// };

// watch(() => props.option, fetchProducts, { immediate: true });

// watch(() => props.filter, fetchProducts, { immediate: true });

watch(() => eventBus.searchQuery, (newQuery) => {
    console.log("fetch for search")
  searchQuery.value = newQuery;
  store.fetchProducts(searchQuery.value,props.option);
  productData.dataSource = store.products
});


watch(
  () => props.filter,
  (newFilter, oldFilter) => {
    console.log('Filter changed:', newFilter);
    store.fetchProducts(searchQuery.value,newFilter.sort,newFilter.fromPrice,newFilter.toPrice,newFilter.selectedBrand.join(','), newFilter.selectedCategories.join(','),newFilter.selectStar);
    productData.dataSource = store.products
  },
  { deep: true }
);

const goToProductDetail = (id) => {
  router.push({ name: 'product-detail-user', params: { id } });
};

function formatNumber(number) {
  if (number >= 1000 && number < 1000000) {
    return (number / 1000).toFixed(1).replace('.0', '') + 'k';
  } else if (number >= 1000000) {
    return (number / 1000000).toFixed(1).replace('.0', '') + 'M';
  } else {
    return number;
  }
}
onMounted(async () => {
  await store.fetchProducts();
});
</script>

<style scoped lang="scss">
@import './listProduct.scss';
</style>