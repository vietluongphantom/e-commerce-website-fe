<template>
  <div class="">
    <div class="container">
      <div class="flex items-center pt-8">
        <!-- <img src="@/assets/images/cart_2.png" class="w-[140px] h-[70px] object-cover mr-2"> -->
        <h2 class="text-[26px] font-semibold m-0 text-[#2A7E6F]">Giỏ Hàng Của Bạn</h2>
      </div>
    </div>
  </div>

  <!--  :data-source="cartData.dataSource"-->
  <div class="mt-[30px] mb-[40px]">
    <div class="cart container">
      <a-table
        :columns="columns"
        :data-source="cartData.dataSource"
        row-key="id"
        :pagination="{
          total: cartData.totalElements,
          current: cartData.currentPage,
          pageSize: cartData.pageSize
        }"
       
      >
        <template v-slot:bodyCell="{ column, record }">
          <template v-if="column.key === 'checkbox'">
            <a-checkbox
              class="w-[25px] h-[25px] mr-3"
              v-model:checked="record.selected"
              @change="handleCheckboxChange(record.id, $event.target.checked)"
            />
          </template>

          <template v-else-if="column.key === 'attributes'">
            <div>
              <div v-for="attribute in record.productDetails.list_product_item" :key="attribute.id">
                <span class="text-[#8A8A8A] uppercase"> {{ attribute.value }}</span>
              </div>
            </div>
          </template>

          <template v-if="column.key === 'shop_name'">
            <div class="flex flex-col">
              {{ record.shopDetails.name }}
              <a-popover
                v-model:visible="visible[record.id]"
                placement="bottom"
                trigger="click"
                @visible-change="(newVisible) => handleVisibleChange(newVisible, record.shopId)"
              >
                <template #content>
                  <div class="overflow-y-auto max-h-60">
                    <div
                      v-for="discount in voucherData"
                      :key="discount.id"
                      :class="{
                        'border-2 border-[#F45449]': selectedDiscountIds[record.id] === discount.id,
                        'border border-[#EEEEEE]': selectedDiscountIds[record.id] !== discount.id
                      }"
                      class="mb-3 p-3 rounded-md text-[15px]"
                    >
                      <a href="#" @click="applyDiscount(record, discount.id)">
                        {{ discount.coupon_code }}
                        Giảm
                        <span v-if="discount.discount_type === 'FIXEDAMOUNT'" class="text-[18px] text-[#F45449]"
                          >-{{ discount.discount_value.toLocaleString() }}đ</span
                        >
                        <span v-else-if="discount.discount_type === 'PERCENTAGE'" class="text-[18px] text-[#F45449]"
                          >{{ discount.discount_value }}%</span
                        >
                        <p class="text-[13px] text-[#7A7A7A]">Đơn tối thiếu 0đ</p>
                        <p class="mt-2 text-[#7A7A7A]">HSD: {{ format(parseISO(discount.expired_at), 'dd/MM/yyyy HH:mm') }}</p>
                      </a>
                      <br />
                    </div>
                  </div>
                </template>
                <a href="#" @click.prevent class="text-[13px] text-[#FB884B] underline mt-2"> Mã giảm giá </a>
              </a-popover>
            </div>
          </template>

          <template v-else-if="column.key === 'product_name'">
            <a @click="handleProductClick(record)">{{ record.productDetails.name }}</a>
          </template>

          <template v-else-if="column.key === 'image'">
            <img :src="record.productDetails.image" alt="Product Image" class="w-[60px] h-[60px] object-cover rounded-md p-1" />
          </template>

          <template v-else-if="column.key === 'price'">
            {{ formatCurrency(record.totalPrice) }}
          </template>

          <template v-else-if="column.key === 'actions'">
            <a href="#" @click.prevent="deleteCart(record.id)">
              <TrashIcon class="w-[15px] h-[15px]"></TrashIcon>
            </a>
          </template>

          <template v-else-if="column.key === 'quantity'">
            <div class="quantity-controls">
              <button @click="decreaseQuantity(record)" class="text-[20px]">-</button>
              <input
                @keyup="onKeyUp(record.id, record.quantity, record)"
                v-model.number="record.quantity"
                min="1"
                style="width: 60px; text-align: center"
                class="outline-none"
              />
              <button @click="increaseQuantity(record)" class="text-[20px]">+</button>
            </div>
          </template>

          <template v-else>
            {{ record[column.dataIndex] }}
          </template>
        </template>
      </a-table>
    </div>
  </div>
  <!-- <div class="container">
    <div class="modal">
      <a-button type="primary" @click="showModal" class="custom-button"> Chọn địa chỉ giao hàng</a-button>
      <a-modal
        v-model:open="open"
        title="Vui lòng nhập thông tin giao hàng"
        :okButtonProps="{ style: { backgroundColor: '#ad171c' } }"
        @ok="handleOk"
      >
         <div class="custom-label">
          <a-form-item label="Họ tên người nhận " name="person" :rules="[{ required: true, message: 'Vui lòng nhập Tỉnh/Thành phố!' }]">
          </a-form-item>
          <a-input v-model:value.lazy="value1" autofocus placeholder="Nhập họ tên nguòi nhận" />
        </div>

        <div class="custom-label">
          <a-form-item label="Số điện thoại người nhận " name="person" :rules="[{ required: true, message: 'Vui lòng nhập Tỉnh/Thành phố!' }]">
          </a-form-item>
          <a-input v-model:value.lazy="value1" autofocus placeholder="Nhập số điện thoại nguòi nhận" />
        </div> -->
        <!-- <div class="custom-label">
          <a-form-item label="Chọn địa chỉ nhận hàng " name="person" :rules="[{ required: true, message: 'Vui lòng nhập Tỉnh/Thành phố!' }]">
          </a-form-item>
          <a-radio>Ngọc lãng, Ngọc Lâm, Mỹ Hào, Hưng Yên</a-radio>
          <a-radio>Ngọc lãng, Ngọc Lâm, Mỹ Hào, Hưng Yên</a-radio>
          <a-radio>{{address?.province}}, {{address?.district}}, {{address?.ward}}</a-radio>
        </div>
        <div style="display: flex; justify-content: center; align-items: center">
          <a-button type="primary" style="margin-top: 24px; margin-bottom: 24px; width: 100%; background-color: #ad171c" @click="showAddressFields"
            >Thêm địa chỉ giao hàng</a-button
          >
        </div>
        <div v-if="activeAddress">
          <div class="custom-label">
            <a-form-item label="Tỉnh/Thành phố" name="province" :rules="[{ required: true, message: 'Vui lòng nhập Tỉnh/Thành phố!' }]">
            </a-form-item>
            <a-select
              v-model:value="province"
              show-search
              placeholder="Chọn tỉnh/thành phố"
              style="width: 100%"
              :options="provinces"
              :filter-option="filterOption"
              @focus="handleFocus"
              @blur="handleBlur"
              @change="handleChangeProvince"
            ></a-select>
          </div>
          <div class="custom-label">
            <a-form-item label="Quận/Huyện" name="province" :rules="[{ required: true, message: 'Vui lòng nhập Tỉnh/Thành phố!' }]"> </a-form-item>
            <a-select
              v-model:value="district"
              show-search
              placeholder="Chọn quận/huyện"
              style="width: 100%"
              :options="districts"
              :filter-option="filterOption"
              @focus="handleFocus"
              @blur="handleBlur"
              @change="handleChangeDistrict"
            ></a-select>
          </div>
          <div class="custom-label">
            <a-form-item label="Phường/Xã" name="province" :rules="[{ required: true, message: 'Vui lòng nhập Tỉnh/Thành phố!' }]"> </a-form-item>
            <a-select
              v-model:value="ward"
              show-search
              placeholder="Chọn phương/xã"
              style="width: 100%"
              :options="wards"
              :filter-option="filterOption"
              @focus="handleFocus"
              @blur="handleBlur"
              @change="handleChangeWard"
            ></a-select>
          </div>
          <div class="custom-label">
            <a-form-item label="Địa chỉ cụ thể" name="province" :rules="[{ required: true, message: 'Vui lòng nhập Tỉnh/Thành phố!' }]">
            </a-form-item>
            <a-textarea v-model:value="detail" placeholder="Basic usage" :rows="4" />
          </div>
          <a-button type="primary" @click="addAddress" style="width: 30%; background-color: #ad171c">Thêm</a-button>
        </div>
      </a-modal>
    </div> -->
  <!-- </div>  -->

  <div class="cart__payment fixed left-0 bottom-0 w-full bg-[#EEEEEE]">
    <div class="container z-30 flex justify-end pt-[25px] pb-[25px] items-center">
      <span class="text-[22px] font-medium mr-4">Tổng thanh toán</span>
      <span class="text-[25px] text-[#F45449] font-medium mr-[40px]">{{ cartData.total }}</span>
      <button @click="handlePayment" class="text-[#fff] bg-[#2A7E6F] p-3 pl-5 pr-5 rounded-lg">Thanh toán online</button>
      <!-- <button @click="handlePayment" class="text-[#fff] bg-[#2A7E6F] p-3 pl-5 pr-5 rounded-lg ml-4">Thanh toán khi nhận</button> -->
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed, ref, reactive } from 'vue';
import { useCartStore } from '@/stores/cartStore';
import { TrashIcon } from '@/assets/icons/icon.js';
import { add, debounce } from 'lodash';
import apiServices from '@/domain/apiServices';
import authService from '@/domain/authServices';
import { format, parseISO } from 'date-fns';
import Swal from 'sweetalert2';
import { onUnmounted } from 'vue';
import authServices from '@/domain/authServices';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from "vue-toastification";


const toast = useToast();
const provinces = ref([]);
const province = ref();
const districts = ref([]);
const district = ref();
const wards = ref([]);
const ward = ref();
const detail = ref();
const router = useRouter();
const address = reactive({
  province: '',
  district:'',
  ward:'',
  detail:''
}
);




const cartStore = useCartStore();

const columns = [
  {
    title: 'Chọn',
    key: 'checkbox',
    dataIndex: 'id'
  },
  {
    title: 'Tên Shop',
    dataIndex: ['shopDetails', 'name'],
    key: 'shop_name'
  },
  {
    title: 'Sản phẩm',
    dataIndex: ['productDetails', 'name'],
    key: 'product_name',
    // slots: { customRender: 'name' }
  },

  {
    title: 'Hình ảnh',
    key: 'image',
    dataIndex: ['productDetails', 'image']
  },

  {
    title: 'Phân loại',
    key: 'attributes',
    dataIndex: ['productDetails', 'list_product_item']
  },
  {
    title: 'Số lượng',
    dataIndex: 'quantity',
    key: 'quantity'
  },
  {
    title: 'Giá',
    dataIndex: ['productDetails', 'price'],
    key: 'price_item',
    slots: { customRender: 'price' }
  },
  {
    title: 'Thành tiền',
    dataIndex: ['productDetails', 'price'],
    key: 'price'
  },
  {
    title: 'Thao tác',
    key: 'actions',
    scopedSlots: { customRender: 'actions' }
  }
];

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const cartData = computed(() => ({
  dataSource: cartStore.cartItems,
  totalElements: cartStore.totalElements,
  currentPage: cartStore.currentPage,
  pageSize: cartStore.pageSize,
  total: formatCurrency(cartStore.totalPrice)
}));

const handleTableChange = (pagination) => {
  cartStore.updatePagination({
    currentPage: pagination.current
  });
};

const selectedCartItems = ref([]);

const handleCheckboxChange = async (id, checked) => {
  const item = cartData.value.dataSource.find((item) => item.id === id);

  if (item) {
    if (checked) {
      if (!selectedCartItems.value.includes(id)) {
        selectedCartItems.value.push(id);
        cartStore.totalPrice += item.totalPrice;
      }
    } else {
      selectedCartItems.value = selectedCartItems.value.filter((itemId) => itemId !== id);
      cartStore.totalPrice -= item.totalPrice;
      await apiServices.addVoucher(id, null);
    }
    if (cartStore.totalPrice < 0) {
      cartStore.totalPrice = 0;
    }
  }
};

const deleteCart = (id) => {
  cartStore.deleteCart(id);
};

const updateQuantity = debounce((productId, quantity) => {
  if (productId && quantity > 0) {
     cartStore.updateCartItem(productId, quantity);
    //  apiServices.updateQuantityCart(productId, quantity);
  }
}, 0);

const decreaseQuantity = async (record) => {
  console.log("lốc", record)
  const item = cartStore.cartItems.find((i) => i.id === record.id);
  if (item && item.quantity > 1) {
    const previousTotalPrice = item.quantity * item.productDetails.price;
    item.quantity -= 1;
    const newTotalPrice = item.quantity * item.productDetails.price;

    if (item.selected) {
      cartStore.totalPrice -= previousTotalPrice - newTotalPrice;
    }
  }

  await updateQuantity(item.id, item.quantity);
  const res = await apiServices.getCartPrice(record.id);
  record.totalPrice = res.data.data;
};

const increaseQuantity = async (record) => {
  const item = cartStore.cartItems.find((i) => i.id === record.id);
  if (item) {
    const previousTotalPrice = item.quantity * item.productDetails.price;
    item.quantity += 1;
    const newTotalPrice = item.quantity * item.productDetails.price;

    if (item.selected) {
      cartStore.totalPrice += newTotalPrice - previousTotalPrice;
    }
  }

  await updateQuantity(item.id, item.quantity);
  const res = await apiServices.getCartPrice(record.id);
  record.totalPrice = res.data.data;
};

const timeoutId = ref(null);

function onKeyUp(productId, quantity, record) {
  console.log("lốc test", productId)
  if (timeoutId.value) {
    clearTimeout(timeoutId.value);
  }
  timeoutId.value = setTimeout(async () => {
    await updateQuantity(productId, quantity);
    const res = await apiServices.getCartPrice(record.id);
    console.log("lốc price", res.data.data)
    record.totalPrice = res.data.data;
  }, 100);
}

const visible = ref({});

const voucherData = ref({});

async function handleVisibleChange(newVisible, id) {
  visible.value[id] = newVisible;
  if (newVisible) {
    const response = await apiServices.getUserVoucher(id);
    voucherData.value = response.data.data;
  }
}

const selectedDiscountIds = ref({});
async function applyDiscount(record, discountId) {
  if (selectedDiscountIds.value[record.id] === discountId) {
    selectedDiscountIds.value[record.id] = null;
  } else {
    selectedDiscountIds.value[record.id] = discountId;
  }
  await apiServices.addVoucher(record.id, selectedDiscountIds.value[record.id]);
  const res = await apiServices.getCartPrice(record.id);
  record.totalPrice = res.data.data;

  // Tính lại tổng giá trị giỏ hàng
  cartStore.totalPrice = cartStore.cartItems
    .filter(item => item.selected)
    .reduce((sum, item) => sum + item.totalPrice, 0)
}

const handlePayment = async () => {
  Swal.fire({
    title: 'Loading...',
    text: 'Vui lòng chờ...',
    icon: 'info',
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });
  const res = await apiServices.payment(selectedCartItems.value);
  if (res.data.code === 200) {
    Swal.close();
    window.location.href = res.data.data.url;
  }else{
    Swal.close();
    toast.error(res.data.message, {
        timeout: 5000,
      });
  }
};

const open = ref(false);
const showModal = () => {
  open.value = true;
};
const handleOk = (e) => {
  open.value = false;
};

const activeAddress = ref(false);
const showAddressFields = (e) => {
  activeAddress.value = !activeAddress.value;
};

const handleChangeProvince = async (e) => {
  districts.value = [];
  district.value = [];
  wards.value = [];
  ward.value = [];
  const response = await authService.fetchAllDistrict(e);
  districts.value = response.data.data.map((district) => ({
    value: district.id,
    label: district.name
  }));
};

const handleChangeDistrict = async (e) => {
  wards.value = [];
  ward.value = [];
  const response = await authService.fetchAllWard(e);
  wards.value = response.data.data.map((ward) => ({
    value: ward.id,
    label: ward.name
  }));
};


const handleChangeWard= async (e) => {
};


const addAddress= async (e) => {
  address.province = provinces.value.find((d) => d.value === province.value)?.label;
  address.district = districts.value.find((d) => d.value === district.value)?.label;
  address.ward = wards.value.find((d) => d.value === ward.value)?.label;
  address.detail = detail.value
};

const handleProductClick= async (e) => {
  // console.log("eeeeeeeeeeeeeeeeeeeeeeeeeêeeeeeeeeeeê",e.productDetails.product_id  )
  let id = e.productDetails.product_id
  router.push({ name: 'product-detail-user', params: { id } });
};


onMounted(async () => {
  await cartStore.fetchCartItems();
  const response = await authService.fetchAllProvince();
  provinces.value = response.data.data.map((province) => ({
    value: province.id,
    label: province.name
  }));
});

onUnmounted(() => {
  cartStore.totalPrice = 0;
});

onUnmounted(() => {
  cartStore.totalPrice = 0;
  selectedCartItems.value = [];
});
</script>

<style scoped lang="scss">
@import './style.scss';
.modal {
  display: flex;
  justify-content: flex-end; /* Đẩy nút sang phải */
  padding: 10px; /* Khoảng cách giữa nút và viền  */
}
.custom-button {
  background-color: #ad171c;
}
.custom-button:hover {
  background-color: #f45678; /* Màu cam khi hover */
  border-color: #e14e2a;
}

:deep(.ant-form-item) {
  margin-bottom: 0px !important; /* Ghi đè margin-bottom */
}

.ant-btn .ant-btn-primary {
  background-color: #ad171c !important;
}

::v-deep :where(.css-dev-only-do-not-override-19iuou).ant-btn .ant-btn-primary {
  background-color: #ad171c !important;
}

::v-deep :where(.css-dev-only-do-not-override-19iuou).ant-btn-primary {
  color: #fff;
  background-color: #faad14 !important;
  box-shadow: 0 2px 0 rgba(5, 145, 255, 0.1);
}

.custom-label {
  margin-bottom: 24px;
}
</style>
