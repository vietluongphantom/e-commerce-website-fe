<template>
  <div class="product flex p-8 justify-between bg-[#ffff]">
    <div class="w-[65%]">
      <!-- Thông tin sản phẩm -->
      <h2 class="text-[22px] font-bold mb-8">Thông tin sản phẩm</h2>
      <input class="input input--one w-full uppercase" placeholder="Sản phẩm A"   v-model="product.name" />
      
      <!-- Mô tả sản phẩm -->
      <h2 class="pt-6 pb-3 text-[16px] font-normal">Mô tả sản phẩm</h2>
      <textarea
        class="input textarea textarea--one w-full h-[200px] p-3 outline-none"
        placeholder="Nhập mô tả sản phẩm"
        v-model="product.description"
      ></textarea>
      
      <!-- Ảnh mô tả sản phẩm -->
      <h3 class="pt-6 pb-3 text-[16px] font-normal mb-3">Ảnh mô tả sản phẩm</h3>
      <div class="flex w-full flex-wrap">
        <div class="relative w-[60px] h-[60px] mr-5" v-for="(image, index) in imagesView" :key="index">
          <img :src="image" class="product__thumbnail w-full h-full mr-10" />
          <CloseIcon @click="removeImage(index)" class="absolute w-[20px] h-[20px] top-[-10px] right-[-6px]"></CloseIcon>
        </div>
      </div>
      
      <!-- Nút chọn ảnh -->
      <div
        class="mt-8 px-3 z-30 py-3 bg-rose-400 rounded-md text-white relative font-semibold font-sans after:-z-20 after:absolute after:h-1 after:w-1 after:bg-rose-800 after:left-5 overflow-hidden after:bottom-0 after:translate-y-full after:rounded-md after:hover:scale-[300] after:hover:transition-all after:hover:duration-700 after:transition-all after:duration-700 transition-all duration-700 [text-shadow:3px_5px_2px_#be123c;] hover:[text-shadow:2px_2px_2px_#fda4af] text-[16px] w-[150px]"
      >
        <p class="text-center text-[#fff] font-medium">Chọn ảnh</p>
        <input type="file" class="absolute inset-0 opacity-0" @change="handleImageUpload" />
      </div>
    </div>

    <div class="w-[30%] mt-[65px] flex flex-col justify-between">
      <div>
        <!-- Trạng thái sản phẩm -->
            <select v-model="product.status" class="input input--one w-full">
            <option value="1">Mở bán</option>
            <option value="0">Dừng bán</option>
            </select>
        <!-- Nhãn hiệu sản phẩm -->
      <div>
        <p class="pt-6 pb-3 text-[16px] font-normal">Nhãn hiệu sản phẩm</p>
        <a-select
          v-model:value="brand"
          show-search
          placeholder="Chọn nhãn hiệu"
          style="width: 100%"
          :options="brands"
          :filter-option="(input, option) => option.label.toLowerCase().includes(input.toLowerCase())"
          @search="fetchBrand"
          @change="handleChangeOne"
        ></a-select>
      </div>

        
        <!-- Danh mục sản phẩm -->
        <div>
            <p class="pt-6 pb-3 text-[16px] font-normal">Danh mục sản phẩm</p>
            <a-select
            v-model:value="product.categoryIds"
            mode="multiple"
            show-search
            placeholder="Chọn danh mục"
            style="width: 100%"
            :options="categories" 
            :filter-option="(input, option) => option.label.toLowerCase().includes(input.toLowerCase())"
            @search="fetchCategory"
            @change="handleChangeTwo"
            ></a-select>
        </div>
      </div>

      <!-- Nút Cập nhật và Quay lại -->
      <div class="flex justify-between mt-9">
        <button class="button button--one" @click="handleClick">Cập nhật</button>
        <button class="button button--two underline">Quay lại</button>
      </div>
    </div>
  </div>
</template>


<script setup>
import { CloseIcon } from '@/assets/icons/icon.js';
import apiServices from '@/domain/apiServices';
import Swal from 'sweetalert2';
import { useRoute } from 'vue-router';
import { ref, onMounted, reactive } from 'vue';
import { useProductStore } from '@/stores/productSellerStore';
import {useImageStore} from '@/stores/imageStore';
const productStore = useProductStore();
const imageStore = useImageStore();
const brands = ref([]);
const brand = ref(productStore.product.brand_name);
const category = ref([]);
const defaultCategory = ref()
const categories = ref([]);
const route = useRoute();
const id = ref(route.params.id);
// const imgUrl = []
// const imgFile = []
var newImgFIle = []
var fileText

const product = reactive({
  name: productStore.product.name,
  description: productStore.product.description,
  status: productStore.product.status,
  brandId: productStore.product.brand_id,
  categoryIds:null,
  images: productStore.product.images,
  images_text:[]
});

const imagesView = ref([]);

const fetchBrand = async (searchText="") => {
  const response = await apiServices.getAllBrand(1, 10, searchText);
  brands.value = response.data.data.content.map((category) => ({
    value: category.id,
    label: category.name
  }));
};

const fetchCategory = async (searchText="") => {
  const response = await apiServices.getAllCategory(1, 10, searchText);
  categories.value = response.data.data.content.map((category) => ({
    value: category.id,
    label: category.name
  }));
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
  imagesView.value.splice(index, 1);
}

async function handleImageUpload(event) {
  const files = event.target.files;
  if (files.length === 0) return;
  
  if (product.images.length >= MAX_IMAGES) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Bạn đã tải lên vượt quá số ảnh!'
    });
    return;
  }

  const remainingSlots = MAX_IMAGES - product.images.length;
  const filesToUpload = Math.min(files.length, remainingSlots);
  for (let i = 0; i < filesToUpload; i++) {
    const file = files[i];
    product.images.push(file);
    // Tạo URL dữ liệu cho ảnh để hiển thị trong giao diện
    const reader = new FileReader();
    reader.onload = (e) => {
      const imagePreviewUrl = e.target.result;
      imagesView.value.push(imagePreviewUrl); 
    };
    reader.readAsDataURL(file);
  }
  await imageStore.upLoadImage(event.target.files);
  fileText.push(imageStore.image)
}

const handleClick = async() => {
  product.images = []
  fileText = fileText.filter(item => item);
  product.images = fileText
  fileText = []
   productStore.updateProduct(product,id.value);
};

onMounted(async () => {
    await productStore.fetchProduct(id.value);
    // defaultCategory.value= productStore.product.categories.map((category) => ({
    //     value: category.id,
    //     label: category.name
    // }));
      product.categoryIds = productStore.product.categories.map((category) => {
    return category.id;})

    // newImgFIle = [...productStore.product.images];
    fileText = [...productStore.product.images];
    imagesView.value = [...productStore.product.images];
    product.images = productStore.product.images
    // product.categoryIds = productStore.product.categories.map((category) => category.id);
    await fetchCategory();
    await fetchBrand();
});
</script>
<style scoped lang="scss">
@import './style.scss';
</style>