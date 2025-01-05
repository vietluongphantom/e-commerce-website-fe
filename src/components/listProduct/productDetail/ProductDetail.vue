<template>
  <div v-if="productData.dataSource" class="bg-[#EFEFEF]">
    <div class="pt-14 pb-14">
      <div class="container bg-[#fff] p-12 rounded-md">
        <div class="flex justify-between">
          <div class="w-[45%]">
            <div v-if="productData?.dataSource?.images?.length > 0"
              class="border border-[#D6D6D6] rounded-lg overflow-hidden mb-6">
              <img :src="productData.dataSource.images[pos]" alt="Ảnh đại diện"
                class="w-full h-auto object-cover rounded-md aspect-square" />
            </div>
            <div class="flex">
              <img v-for="(image, index) in productData.dataSource.images" :key="index" :src="image" alt="Ảnh nhỏ"
                class="aspect-square w-16 h-16 object-cover cursor-pointer border border-gray-300 rounded-md hover:border-blue-500 mr-1"
                @click="selectImage(index)" />
            </div>
          </div>

          <div class="w-[50%]">
            <p class="text-[25px] font-medium">{{ productData.dataSource.name }}</p>
            <div class="mt-3 flex justify-between">
              <div class="flex items-center">
                <span v-if="productData.dataSource.average_rate > 0" class="underline text-[#FEC700] text-[18px] mr-1">
                  {{ productData.dataSource.average_rate }}
                </span>
                <ul class="flex items-center" v-if="productData.dataSource.average_rate > 0">
                  <StartIcon
                    v-for="index in Math.floor(productData.dataSource.average_rate)"
                    :key="index"
                    class="w-[20px] h-[20px]"
                  />
                </ul>
                <p v-else class="text-gray-500">Sản phẩm chưa có đánh giá</p>
              </div>

              <div>
                <span class="text-[17px] mr-2">{{ formatNumber(productData.dataSource.total_sold) }}</span>
                <span v-if="productData.dataSource.average_rate > 0" class="text-[16px] text-[#8A8A8A] italic">Đánh giá</span>
              </div>

              <div>
                <span class="text-[17px] mr-2"> {{ formatNumber(productData.dataSource.quantity_rate) }}</span>
                <span class="text-[16px] text-[#8A8A8A] italic">Đã bán</span>
              </div>
            </div>

            <p class="mt-6 text-[28px] text-[#F45449] font-medium">{{ formatCurrency(productData.price) }}</p>

            <div class="mt-3">
              <div v-for="(item, index) in productData.dataSource.attribute_and_value" :key="index">
                <h3 class="text-[16px] font-medium">{{ item.attribute }}</h3>
                <ul class="flex flex-wrap mt-3 mb-3">
                  <li v-for="value in item.values" :key="value.id">
                    <button
                      class="w-auto mr-5 text-[16px] text-[#868686] border border-[#D2D2D2] p-2 pl-3 pr-3 rounded-lg hover:border-[#F45449]"
                      :class="{
                        selected: isSelected(value.id, item.attribute),
                        'text-[#0397D6] font-medium border border-[#EE4D2D]': isSelected(value.id, item.attribute)
                      }" @click="selectValue(value, item.attribute)">
                      {{ value.value }}
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            <div class="flex items-center mt-10">
              <span class="text-[16px] mr-3 font-semibold">Số lượng</span>
              <button class="border border-[#D2D2D2] pl-2 pr-2 text-[18px]" @click="decreaseQuantity"
                :disabled="quantity <= 1">-</button>
              <input v-model.number="currentQuantity" type="number" @blur="validateInput" min="1"
                :max="productData.quantity"
                class="w-[40px] text-center outline-none border border-[#D2D2D2] text-[18px]" />
              <button class="border border-[#D2D2D2] pl-2 pr-2 text-[18px] mr-3" @click="increaseQuantity"
                :disabled="currentQuantity >= productData.quantity">
                +
              </button>
              <p class="text-[16px]">
                {{ productData.quantity > 0 ? productData.quantity + ' sản phẩm sẵn có' : 'Tạm hết sản phẩm' }}
              </p>
            </div>

            <div class="mt-10">
              <button class="bg-[#63B899] text-[#fff] p-3 pl-4 pr-4 rounded-lg text-[16px] font-medium mr-10"
                @click="handleAction">
                Thêm mới giỏ hàng
              </button>
              <!-- <button class="bg-[#63B899] text-[#fff] p-3 pl-4 pr-4 rounded-lg text-[16px] font-medium">Mua
                ngay</button> -->

                <a-button class="h-[48px] bg-[#63B899] text-[#fff] p-3 pl-4 pr-4 rounded-lg text-[16px] font-medium" type="primary" @click="showModal"
                >Đánh giá</a-button
              >
              <a-modal v-model:visible="isModalVisible" title="Cập nhật đánh giá" @ok="handleOk" @cancel="handleCancel">
                <a-form>
                  <a-form-item label="Rate">
                    <a-rate v-model:value="form.rate" />
                  </a-form-item>
                  <a-form-item label="Comment">
                    <a-textarea v-model:value="form.comment" rows="4" />
                  </a-form-item>
                </a-form>
              </a-modal>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container bg-[#fff] p-12 rounded-md mt-8">
      <h2 class="text-[22px] font-semibold mb-6">Có thể bạn cũng quan tâm</h2>
      <div v-if="recommendedProducts.length" class="grid grid-cols-5 gap-4">
        <div v-for="product in recommendedProducts" :key="product.product_id"
          class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
          @click="goToProductDetail(product.product_id)">
          <img :src="product.images && product.images.length ? product.images[0] : ''" :alt="product.name"
            class="w-full h-48 object-cover rounded-md mb-3" />
          <h3 class="text-[16px] font-medium mb-2 truncate">{{ product.name }}</h3>
          <p class="text-[#F45449] font-semibold">
            {{ formatCurrency(parseFloat(product.min_price)) }}
          </p>
          <div class="flex items-center mt-2">
            <span class="text-[#FEC700] mr-1">{{ product.average_rating }}</span>
            <StartIcon class="w-4 h-4 text-[#FEC700]"></StartIcon>
            <span class="text-gray-500 ml-2 text-sm">
              ({{ product.rating_quantity }})
            </span>
          </div>
        </div>
      </div>
      <div v-else class="text-center text-gray-500">
        Không có sản phẩm đề xuất
      </div>
    </div>


  </div>
  <div v-if="productData.dataSource" class="bg-[#EFEFEF]">
    <div class="pt-5 pb-5">
      <div class="container bg-[#fff] p-12 rounded-md">
        <div class="text-1xl font-bold rounded-md">{{ productData.dataSource.shop?.name ?? '' }}</div>
        <div class="flex items-center">
          <div class="mr-10">
            <!-- <img :src="shopStore.avatar ?? ''" class="w-16 h-16 rounded-full border-2 border-blue-400" alt="User" /> -->
          </div>
          <button class="flex items-center rounded-md p-2 hover:bg-red-100 hover:text-white transition" @click="chatNow(productData.dataSource.shop.userId)">
            <Chat class="w-10 h-10"></Chat>
            <div class="font-semibold">Chat ngay</div>
          </button>
        </div>
      </div>
    </div>
  </div>
  <div v-if="productData.dataSource" class="bg-[#EFEFEF]">
    <div class="pt-5 pb-5">
      <div class="container bg-[#fff] p-12 rounded-md">
        <div class="text-1xl font-bold rounded-md">MÔ TẢ SẢN PHẨM</div>
        <div>{{productData.dataSource.description}}</div>
      </div>
    </div>
  </div>
  <div class="pt-1 pb-14">
    <div class="container bg-[#fff] p-12 rounded-md">
      <h3 class="text-[20px] font-medium mb-3">ĐÁNH GIÁ SẢN PHẨM</h3>
      <div class="mb-5">
        <!-- <span class="text-[30px] font-semibold text-[#EE4D2D] mr-4">{{ productData.aveStart }}</span>
        <span class="text-[20px] text-[#EE4D2D] font-medium">trên 5</span>
        <ul class="flex">
          <li class="w-[25px] h-[25px]"><StartIcon></StartIcon></li>
          <li class="w-[25px] h-[25px]"><StartIcon></StartIcon></li>
          <li class="w-[25px] h-[25px]"><StartIcon></StartIcon></li>
          <li class="w-[25px] h-[25px]"><StartIcon></StartIcon></li>
          <li class="w-[25px] h-[25px]"><StartIcon></StartIcon></li>
        </ul> -->
      </div>

      <div>
        <div v-if="productData.comments?.length">
          <div v-for="comment in productData.comments" :key="comment.id" class="comment p-3">
            <div class="flex items-center">
              <img src="@/assets/images/user_1.png" class="w-[25px] h-[25px]" />
              <p class="ml-2 text-[16px]">{{ comment.fullName }}</p>
            </div>
            <p class="mt-2 text-[13px] text-[#7A7A7A]">{{ format(new Date(comment.createdAt), 'dd/MM/yyyy HH:mm:ss') }}</p>
            <a-rate :value="comment.rateStars" allow-half disabled />
            <p class="text-[#7A7A7A] mt-3 text-[15px] mb-3">{{ comment.content }}</p>
            <hr />
          </div>
        </div>

        <div v-else>
          <p>Hiện chưa có đánh giá.</p>
        </div>
      </div>
    </div>
  </div>
  <ChatBox class="fixed bottom-6 right-6 z-50" :isOpen="isChatOpen" :idShop="idShop" :shopStore="shopStore" @close="toggleChat" />
</template>

<script setup>
import { onMounted, computed, ref, watch, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProductDetailStore } from '@/stores/productDetailStore';
import { productStore } from '@/stores/products';
import { StartIcon, Chat } from '@/assets/icons/icon.js';
import Swal from 'sweetalert2';
import apiServices from '@/domain/apiServices';
import axios from 'axios';
const router = useRouter();
import { useChatStore } from '@/stores/chatStore';
import ChatBox from "@/components/chatBox/ChatBox.vue";
import { useShopStore } from '@/stores/shopStore';
import { format } from 'date-fns';


const shopStore = useShopStore();

const isChatOpen = ref(false);
const idShop = ref(null);
const route = useRoute();
const id = route.params.id;
const productDetail = useProductDetailStore();
const store = productStore();
const currentQuantity = ref(1);
const recommendedProducts = ref([]);


const chatStore = useChatStore();

const productData = computed(() => ({
  dataSource: productDetail.product,
  price: productDetail.price,
  quantity: productDetail.quantity,
  itemId: productDetail.itemId,
  comments: productDetail.comments
}));

function formatNumber(number) {
  if (number >= 1000 && number < 1000000) {
    return (number / 1000).toFixed(1).replace('.0', '') + 'k';
  } else if (number >= 1000000) {
    return (number / 1000000).toFixed(1).replace('.0', '') + 'M';
  } else {
    return number;
  }
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const selectedValues = ref({});

const isSelected = (valueId, attribute) => {
  return selectedValues.value[attribute] === valueId;
};

const allAttributesSelected = () => {
  const attributes = productData.value.dataSource.attribute_and_value.map((item) => item.attribute);
  return attributes.every((attribute) => selectedValues.value[attribute] !== undefined);
};

const selectValue = (value, attribute) => {
  console.log("productData.dataSource",productData)
  if (selectedValues.value[attribute] === value.id) {
    delete selectedValues.value[attribute];
  } else {
    selectedValues.value[attribute] = value.id;
  }

  if (allAttributesSelected()) {
    const attributeOrder = productData.value.dataSource.attribute_and_value.map((item) => item.attribute);
    const orderedValues = attributeOrder.map((attribute) => selectedValues.value[attribute]);
    const validValues = orderedValues.filter((value) => value !== undefined && value !== null);

    const valuesIds = validValues.join(',');

    productDetail.fetchProductItem(id, valuesIds);
  } else {
    productDetail.setQuantity();
  }
};

// const handleAction = async () => {
//   if (allAttributesSelected()) {
//     const res = await apiServices.addCart(productData.value.itemId, currentQuantity.value);
//     if (res.data.code === 200) {
//       Swal.fire({
//         title: 'Thành công!',
//         text: 'Sản phẩm đã được thêm vào giỏ hàng',
//         icon: 'success'
//       });
//       selectedValues.value = {};
//       currentQuantity.value = 1;
//       await store.fetchCart();
//       await productDetail.fetchProducts(id);
//     }
//   } else {
//     Swal.fire({
//       icon: 'error',
//       title: 'Oops...',
//       text: 'Bạn vui lòng chọn tất cả thuộc tính!'
//     });
//   }
// };

const handleAction = async () => {
  if (currentQuantity.value <= 0) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Phân loại sản phẩm tạm hết hàng!'
    });
    return;
  }

  if (allAttributesSelected()) {
    const res = await apiServices.addCart(productData.value.itemId, currentQuantity.value);
    if (res.data.code === 200) {
      Swal.fire({
        title: 'Thành công!',
        text: 'Sản phẩm đã được thêm vào giỏ hàng',
        icon: 'success'
      });
      selectedValues.value = {};
      currentQuantity.value = 1;
      await store.fetchCart();
      await productDetail.fetchProducts(id);
    }
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Bạn vui lòng chọn tất cả thuộc tính!'
    });
  }
};

const chatNow = async (id) => {
  idShop.value = id
  await chatStore.fetchAllMessage(id);
  await shopStore.fetchShopList();
  isChatOpen.value = true; 
};


const toggleChat = () => {
  isChatOpen.value = !isChatOpen.value;
};


watch(
  () => productData.value.quantity,
  (newQuantity) => {
    if (currentQuantity.value > newQuantity) {
      currentQuantity.value = newQuantity;
    }
  }
);

function increaseQuantity() {
  if (currentQuantity.value < productData.value.quantity) {
    currentQuantity.value++;
  }
}

function decreaseQuantity() {
  if (currentQuantity.value > 1) {
    currentQuantity.value--;
  }
}

function validateInput(event) {
  const input = event.target;
  let value = Number(input.value);
  if (value < 1) {
    value = 1;
  }

  if (value > productData.value.quantity) {
    value = productData.value.quantity;
  }
  currentQuantity.value = value;
}

const pos = ref(0);
const selectImage = (index) => {
  pos.value = index;
};

const form = reactive({
  rate: 0,
  comment: ''
});

const isModalVisible = ref(false);


const showModal = async () => {
  const res = await apiServices.checkPurchase(id);
  if (res.data.code === 200) {
    isModalVisible.value = true;
    const res2 = await apiServices.getCommentById(id);
    if (res2.data.code === 200) {
      console.log("log của commet",res2.data.data[0].id);
      form.rate = res2.data.data[0].rateStars;
      form.comment = res2.data.data[0].content;
    } else if (res2.data.code === 500) {
      form.rate = 0;
      form.comment = '';
    }
  } else if (res.data.code === 500) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Sản phẩm chưa có trong lịch sử mua hàng của bạn!'
    });
  }
};

const handleOk = async () => {
  Swal.fire({
    title: 'Loading...',
    text: 'Vui lòng chờ...',
    icon: 'info',
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });
  isModalVisible.value = false;
  const res2 = await apiServices.getCommentById(id);
  console.log("log của commet",res2);
  let res
  if (res2.data.code === 200) {
    res = await apiServices.updateComment(res2.data.data[0].id, form.comment, form.rate);
    console.log(res);
  } else if (res2.data.code === 500) {
    res = await apiServices.addComment(id, form.comment, form.rate);
  }
  Swal.close();
  if (res.data.code === 200) {
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Đánh giá thành công!',
      showConfirmButton: false,
      timer: 1500
    });
    await productDetail.fetchAveStart(id);
    await productDetail.fetchComments(id);
  }
};

const handleCancel = () => {
  isModalVisible.value = false;
};


const fetchRecommendedProducts = async (idProduct) => {
  try {
    const response = await axios.get(`http://localhost:3001/recommend?product_id=${idProduct}`);

    console.log('Full Response:', response.data);
    console.log('Recommendations:', response.data.recommendations);

    recommendedProducts.value = response.data.recommendations.map(product => ({
      ...product,
      average_rating: parseFloat(product.average_rating),
      rating_quantity: product.rating_quantity || 0
    }));

    console.log('Processed Recommended Products:', recommendedProducts.value);
  } catch (error) {
    console.error('Lỗi khi lấy sản phẩm đề xuất:', error);
    recommendedProducts.value = [];
  }
};



const goToProductDetail = async (productId) => {
  router.push({
    name: 'product-detail-user',
    params: { id: String(productId) }
  });

  // Fetch dữ liệu sản phẩm mới từ API
  await productDetail.fetchProducts(productId);
  console.log("productDetail.fetchProducts(id);",productDetail.value )
  await fetchRecommendedProducts(productId); // Cập nhật lại danh sách gợi ý
};

onMounted(async () => {
  try {
    console.log("mouted log",productDetail.value )
    await productDetail.fetchProducts(id);
    console.log("productDetail.fetchProducts(id);",productDetail.value )
    await productDetail.fetchAveStart(id);
    await productDetail.fetchComments(id);
    console.log("productDetail.fetchProducts(id);",productDetail.value )
    await fetchRecommendedProducts(id);
  } catch (error) {
    console.error('Lỗi khởi tạo:', error);
  }
});

</script>
