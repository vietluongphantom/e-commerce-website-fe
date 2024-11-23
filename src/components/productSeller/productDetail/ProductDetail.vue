<template>
  <div class="product flex p-8 justify-between bg-[#ffff]">
    <div class="w-[65%]">
      <h2 class="text-[22px] font-bold mb-8">Thông tin sản phẩm</h2>
      <input class="input input--one w-full uppercase" readonly :value="productStore.product.name ? productStore.product.name : 'Sản phẩm A'" />
      <h2 class="pt-6 pb-3 text-[16px] font-normal">Mô tả sản phẩm</h2>
      <textarea
        class="input textarea textarea--one w-full h-[200px] p-3 outline-none"
        v-model="productStore.product.description"
        readonly
      ></textarea>
      <h3 class="pt-6 pb-3 text-[16px] font-normal mb-3">Ảnh mô tả sản phẩm</h3>

      <div class="flex w-full flex-wrap">
        <div class="relative w-[100px] h-[100px] mr-5" v-for="(image, index) in productStore.product.images" :key="index">
          <img :src="image" class="product__thumbnail w-full h-full mr-10" />
        </div>
      </div>
    </div>

    <div class="w-[30%] mt-[65px]">
      <select v-model="productStore.product.status" class="input input--one w-full" disabled>
        <option value="1"  >Mở bán</option>
        <option value="0"  >Dừng bán</option>
      </select>
      <p class="pt-6 pb-3 text-[16px] font-normal">Nhãn hiệu sản phẩm:</p>
        <a-tag
          color="blue"
          style="margin-right: 5px"
        >
          {{ productStore.product.brand_name }}
        </a-tag>
    <p class="pt-6 pb-3 text-[16px] font-normal">Danh mục sản phẩm:</p>
    <div class="flex flex-wrap">
      <a-tag
        v-for="(category, index) in productStore.product.categories"
        :key="index"
        color="blue"
        style="margin-right: 5px; margin-bottom: 5px;"
      >
        {{ category.name }}
      </a-tag>

    </div>
      <label class=" block mt-5 mb-3 text-[16px]" for="input-price" >Số lượt bán:</label>
      <input class="input input--one w-full" readonly :value="productStore.product.total_sold ? productStore.product.total_sold : 0 " type="number" id="input-price"  min="0" />
<label class="block mt-5 mb-3 text-[16px]" for="sale-price">Rate star:</label>
<div class="flex items-center">
  <div style="font-size: 20px; margin-left: 20px;">
    {{ productStore.product.average_rate }} 
  </div>
  <div v-for="index in 5" :key="index" class="relative" style="font-size: 20px;">
    <!-- Ngôi sao xám -->
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="#d3d3d3"
    >
      <path d="M12 .587l3.668 7.568L24 9.748l-6 6.007 1.396 8.663L12 18.907 4.604 24.418 6 15.755 0 9.748l8.332-1.593z"/>
    </svg>

    <!-- Ngôi sao vàng -->
    <svg
      v-if="index <= Math.floor(productStore.product.average_rate)"
      class="absolute top-0 left-0"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="#FFD700"
    >
      <path d="M12 .587l3.668 7.568L24 9.748l-6 6.007 1.396 8.663L12 18.907 4.604 24.418 6 15.755 0 9.748l8.332-1.593z"/>
    </svg>

    <!-- Ngôi sao cuối cùng hiển thị màu vàng tương ứng với phần thập phân -->
    <svg
      v-if="index === Math.ceil(productStore.product.average_rate) && productStore.product.average_rate % 1 !== 0"
      class="absolute top-0 left-0"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
    >
      <defs>
        <clipPath :id="'clip-' + index">
          <rect
            :width="(productStore.product.average_rate % 1) * 24"
            height="24"
          />
        </clipPath>
      </defs>
      <!-- Ngôi sao xám -->
      <path d="M12 .587l3.668 7.568L24 9.748l-6 6.007 1.396 8.663L12 18.907 4.604 24.418 6 15.755 0 9.748l8.332-1.593z" fill="#d3d3d3"/>
      <!-- Phần màu vàng của ngôi sao -->
      <path
        d="M12 .587l3.668 7.568L24 9.748l-6 6.007 1.396 8.663L12 18.907 4.604 24.418 6 15.755 0 9.748l8.332-1.593z"
        fill="#FFD700"
        :clip-path="'url(#clip-' + index + ')'"
      />
    </svg>
  </div>
      <div style="font-size: 20px; margin-left: 10px;">
      <text>({{productStore.product.quantity_rate}} đánh giá)</text>
    </div>
</div>




      
      
      <div class="flex justify-between mt-9">
        <button class="button button--two underline"> Quay lại</button>
      </div>
    </div>
  </div>
</template>

<script setup>

import { ref, onMounted } from 'vue';
import { CloseIcon } from '@/assets/icons/icon.js';
import { useRoute } from 'vue-router';
import { useProductStore } from '@/stores/productSellerStore';


const productStore = useProductStore();
const status = ref('open');
const route = useRoute();
const id = ref(route.params.id);


const imagePreviews = ref([
  'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
  'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg',
  'https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg'
]);

const brands = ref([
  { value: 'apple', label: 'Apple' },
  { value: 'samsung', label: 'Samsung' },
  { value: 'sony', label: 'Sony' },
  { value: 'lg', label: 'LG' }
]);

const categories = ref(['Electronics', 'Fashion', 'Home Appliances', 'Books', 'Toys']);

function removeImage(index) {
  imagePreviews.value.splice(index, 1);
}

function handleImageUpload(event) {
  const files = event.target.files;
  for (let i = 0; i < files.length; i++) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreviews.value.push(e.target.result);
    };
    reader.readAsDataURL(files[i]);
  }
}

onMounted(async () => {
  await productStore.fetchProduct(id.value);
  console.log("productStore",productStore.product.status)
});
</script>
<style scoped lang="scss">
@import './style.scss';
</style>
