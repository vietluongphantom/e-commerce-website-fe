<template>
  <div class="product flex p-8 justify-between bg-[#ffff]">
    <div class="w-[65%]">
      <h2 class="text-[22px] font-bold mb-8">Thông tin sản phẩm</h2>
      <input class="input input--one w-full" placeholder="Sản phẩm A" v-model="product.name" />
      <h2 class="pt-6 pb-3 text-[16px] font-normal">Mô tả sản phẩm</h2>
      <textarea
        class="input textarea textarea--one w-full h-[100px] p-3 outline-none"
        placeholder="Nhập mô tả sản phẩm"
        v-model="product.description"
      ></textarea>
      <h3 class="pt-6 pb-3 text-[16px] font-normal mb-3">Ảnh mô tả sản phẩm</h3>

      <div class="flex w-full flex-wrap">
        <div class="relative w-[60px] h-[60px] mr-5" v-for="(image, index) in imagesView" :key="index">
          <img :src="image" class="product__thumbnail w-full h-full mr-10" />
          <CloseIcon @click="removeImage(index)" class="absolute w-[20px] h-[20px] top-[-10px] right-[-6px]"></CloseIcon>
        </div>
      </div>

      <div
        class="mt-8 px-3 z-30 py-2 bg-rose-400 rounded-md text-white relative font-semibold font-sans after:-z-20 after:absolute after:h-1 after:w-1 after:bg-rose-800 after:left-5 overflow-hidden after:bottom-0 after:translate-y-full after:rounded-md after:hover:scale-[300] after:hover:transition-all after:hover:duration-700 after:transition-all after:duration-700 transition-all duration-700 [text-shadow:3px_5px_2px_#be123c;] hover:[text-shadow:2px_2px_2px_#fda4af] text-[16px] w-[110px]"
      >
        <p class="text-center text-[#fff] font-medium">Chọn ảnh</p>
        <input type="file" class="absolute inset-0 opacity-0" @change="handleImageUpload" />
      </div>
    </div>

    <div class="w-[30%]">
      <div class="w-full flex justify-end mb-[20px]">
        <button class="button button--one" @click="handleClick">Tạo mới</button>
      </div>
      <select v-model="status" class="input input--one w-full">
        <option value="1">Mở bán</option>
        <option value="0">Dừng bán</option>
      </select>

      <div>
        <p class="pt-6 pb-3 text-[16px] font-normal">Nhãn hiệu sản phẩm</p>
        <a-select
          v-model:value="brand"
          show-search
          placeholder="Chọn nhãn hiệu"
          style="width: 100%"
          :options="brands"
          :filter-option="(input, option) => option.label.toLowerCase().includes(input.toLowerCase())"
          @change="handleChangeOne"
          @search="debouncedFetchBrand"
        ></a-select>
      </div>

      <div>
        <p class="pt-6 pb-3 text-[16px] font-normal">Danh mục sản phẩm</p>
        <a-select
          v-model:value="category"
          mode="multiple"
          show-search
          placeholder="Chọn danh mục"
          style="width: 100%"
          :options="categories"
          :filter-option="(input, option) => option.label.toLowerCase().includes(input.toLowerCase())"
          @search="debouncedFetchCategory"
          @change="handleChangeTwo"
        ></a-select>
      </div>

      <div class="w-full flex justify-end mb-[20px]">
        <button class="button button--two underline mt-[150px]">Quay lại</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { CloseIcon } from '@/assets/icons/icon.js';
import apiServices from '@/domain/apiServices';
import Swal from 'sweetalert2';

import { ref, onMounted, reactive } from 'vue';
import { useProductStore } from '@/stores/productSellerStore';
import debounce from 'lodash/debounce';
import {useImageStore} from '@/stores/imageStore';



const imageStore = useImageStore();
const productStore = useProductStore();
const brands = ref([]);
const brand = ref('');
const category = ref([]);
const categories = ref([]);
const status = ref('1');
var fileText =[]
var fileTexts = []
const product = reactive({
  name: '',
  description: '',
  status: '1',
  brandId: '',
  categoryIds: [],
  images: []
});

const imagesView = ref([]);

const fetchBrand = async (searchText="") => {
  const response = await apiServices.getAllBrand(1, 10, searchText);
  brands.value = response.data.data.content.map((category) => ({
    value: category.id,
    label: category.name
  }));
};

const fetchCategory = async (searchText='') => {
  // console.log(searchText);
  const response = await apiServices.getAllCategory(1, 10, searchText);
  categories.value = response.data.data.content.map((category) => ({
    value: category.id,
    label: category.name
  }));
  console.log("category đâu r",response )
};

const handleChangeOne = (selectedBrand) => {
  product.brandId = selectedBrand;
};

const handleChangeTwo = (selectedCategories) => {
  product.categoryIds = selectedCategories;
};

const MAX_IMAGES = 8;

function removeImage(index) {
  product.images.splice(index, 1);
  fileText.splice(index,1)
  // fileText = fileText.filter(item => item);
  imagesView.value.splice(index, 1);
}

async function handleImageUpload(event) {
  console.log("event.target.files", event.target.files)
  const files = event.target.files;
  if (files.length === 0) return;

  const remainingSlots = MAX_IMAGES - product.images.length;

  if (remainingSlots <= 0) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Bạn đã tải lên vượt quá số ảnh!'
    });
    return;
  }

  const filesToUpload = Math.min(files.length, remainingSlots);

  for (let i = 0; i < filesToUpload; i++) {
    console.log("dem i", i)
    const file = files[i];
    product.images.push(file);

    // Tạo URL dữ liệu cho ảnh để hiển thị trong giao diện
    const reader = new FileReader();
    reader.onload = (e) => {
      console.log("eeeeeeeeeeeeeeeeeeeeê", e.target.result)
      const imagePreviewUrl = e.target.result;
      imagesView.value.push(imagePreviewUrl);
    };
    // console.log("file này hiển thị đúng không", file.size())
    reader.readAsDataURL(file);
  }
  await imageStore.upLoadImage(event.target.files);
  fileText.push(imageStore.image)
  // event.target.value = '';
}

const handleClick = () => {
  product.images = []
  fileText = fileText.filter(item => item);
  product.images = fileText
  productStore.addProduct(product);
};

const debouncedFetchCategory = debounce((searchText) => {
  fetchCategory(searchText);
}, 1000);

const debouncedFetchBrand = debounce((searchText) => {
  fetchBrand(searchText);
}, 1000);

onMounted(async () => {
  await fetchBrand();
  await fetchCategory();
});
</script>
<style scoped lang="scss">
@import './style.scss';
</style>