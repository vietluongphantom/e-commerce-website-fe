<template>
<div class="product-item">
  <div class="product-item__container">
    <div class="product-item__title">Thông tin chi tiết {{productStore.product.name}} theo mã sản phẩm</div>

   <a-table :columns="columns1" :data-source="attributeValue.attribute" :pagination="false">

    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'name'">
        <a>
          {{ record.attribute }}
        </a>
      </template>
      <template v-else-if="column.key === 'tags'">
        <span>
          <a-tag
            v-for="tag in record.values"
            :key="tag"
            :color="tag.value === 'loser' ? 'volcano' : tag.value.length > 5 ? 'geekblue' : 'green'"
          >
            {{ tag.value }}
          </a-tag>
        </span>
      </template>
      <template v-else-if="column.key === 'action'">
        <span>
          <a-button @click="handleClickAddValues(record.id)" type="primary" block style="width: 100px; font-size: 12px; margin: 2px;">thêm giá trị</a-button>
          <a-button @click="deleteAttribute(record.id)" danger block style="width: 100px; font-size: 12px; margin: 2px;">xoá thuộc tính</a-button>
        </span>
      </template>
    </template>
  </a-table>
    <!-- Kết thúc bảng thuộc tính và giá trị -->
    <div class="product-item__add-attribute-container">
      <a-button @click="handleClickAddAttribute" style="width: 200px; font-size: 12px; " type="primary" block>Thêm thuộc tính</a-button>
    </div>
<div class="relative-container">
  <div class="button-container">
    <Modal></Modal>
  </div>
</div>

    <a-table :columns="columns2" :data-source="productItem.productItems">
    <template #headerCell="{ column }">
      <template v-if="column.key === 'stt'">
        <span>
          <smile-outlined />
          STT
        </span>
      </template>
    </template>
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'total_sold'">
        <a>
          {{ record.total_sold || 0 }}
        </a>
      </template>
      <template v-else-if="column.key === 'tags'">
        <span>
          <a-tag
            v-for="tag in record.list_product_item"
            :key="tag"
            :color="tag.value === 'loser' ? 'volcano' : tag.value.length > 5 ? 'geekblue' : 'green'"
          >
            {{ tag.value }}
          </a-tag>
        </span>
      </template>
      <template v-else-if="column.key === 'action'">
        <span class="flex">
            <a-divider type="vertical" />
            <ModalEditProductItem :idProductItem="record.id" :attributeProp="attributeProductStore">
            </ModalEditProductItem>
            <a-divider type="vertical" />
            <a href="#" @click.prevent="deleteItem(record.id)">
            <TrashIcon class="w-[15px] h-[15px]" />
            </a>
        </span>
      </template>
    </template>
  </a-table>
  </div>
</div>

</template>

<script setup>

import { ref, computed, onMounted , reactive} from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useAttributeProductStore } from '@/stores/attributeProductStore';
import Swal from 'sweetalert2';
import { useRoute } from 'vue-router';
import { SearchIcon, AddIcon, EditIcon, TrashIcon, EyeIcon } from '@/assets/icons/icon.js';
import { useProductStore } from '@/stores/productSellerStore';
import { useAttributeValuesStore } from '@/stores/attributeValuesStore';
import {useProductItemStore} from '@/stores/productItemStore';
import Modal from '@/components/modal/ModalProductItem.vue';
import ModalEditProductItem from '@/components/modal/ModalEditProductItem.vue';
const productStore = useProductStore();
const attributeProductStore = useAttributeProductStore();
const attributeValuesStore = useAttributeValuesStore();
const productItemStore = useProductItemStore();

const inputValue = ref('');
const route = useRoute();
const id = ref(route.params.id);
const attribute = reactive({
  name:'',
  product_id:id,
})



const values = reactive({
  value:'',
  attribute_id:null,
})

const productItem = reactive({
      productItems: productItemStore.productItems,
})
const showModal = () => {
  open.value = true;
};

const open = ref(false);

const handleOk = (e) => {
  console.log(e);
  open.value = false;
};

const columns1 = [
  {
    title: 'Thuộc tính',
    dataIndex: 'address',
    key: 'name',
  },
  {
    title: 'Giá trị',
    key: 'tags',
    dataIndex: 'tags',
  },
  {
    title: 'Action',
    key: 'action',
  },
];


const columns2 = [
  {
    name: 'STT',
    dataIndex: 'stt',
    key: 'stt',
  },
  {
    title: 'Mã sản phẩm',
    dataIndex: 'sku_code',
    key: 'sku_code',
  },
  
  {
    title: 'giá trị thuộc tính',
    key: 'tags',
    dataIndex: 'list_product_item',
  }
  ,
  {
    title: 'Số lượng',
    dataIndex: 'quantity',
    key: 'quantity',
  }
  ,
  {
    title: 'Tổng bán',
    dataIndex: 'total_sold',
    key: 'total_sold',
  },
  {
    title: 'Giá bán',
    key: 'price',
    dataIndex: 'price',
  }
  ,
  {
    title: 'Giá nhập',
    key: 'import_price',
    dataIndex: 'import_price',
  },
  {
    title: 'Action',
    key: 'action',
  },
];

const attributeValue = reactive({
  attribute: productStore.product.attribute_and_value
});


const handleClickAddAttribute = async (id) => {
  const { value: text, isConfirmed  } = await Swal.fire({
    input: 'textarea',
    inputLabel: 'Nhập tên thuộc tính mới',
    inputPlaceholder: 'Thuộc tính a...',
    inputAttributes: {
      'aria-label': 'Thuộc tính a...'
    },
    showCancelButton: true
  });
    if (isConfirmed && text) {
    inputValue.value = text;
    attribute.name = text
    await attributeProductStore.addAttributeProduct(attribute, route.params.id);
    await productStore.fetchProduct(route.params.id);
    attributeValue.attribute = productStore.product.attribute_and_value
    console.log("productStore.product.attribute_and_value",productStore.product.attribute_and_value)
  }
};


const handleClickAddValues = async (id) => {
  const { value: text, isConfirmed  } = await Swal.fire({
    input: 'textarea',
    inputLabel: 'Nhập tên giá trị mới',
    inputPlaceholder: 'Giá trị a...',
    inputAttributes: {
      'aria-label': 'Giá trị a...'
    },
    showCancelButton: true
  });
    if (isConfirmed && text) {
    inputValue.value = text;
    values.value = text;
    values.attribute_id = id
    await attributeValuesStore.addAttributeValues(values, route.params.id);
    await productStore.fetchProduct(route.params.id);
    attributeValue.attribute = productStore.product.attribute_and_value;
  }
};


const deleteItem = async (id) => {
    await productItemStore.deleteProductItem(id,route.params.id);
    await productItemStore.fetchProductItems(route.params.id);
    productItem.productItems  = productItemStore.productItems
    
};


const deleteAttribute = async (id) => {
    await attributeProductStore.deleteAttributeProduct(id);
    await productStore.fetchProduct(route.params.id);
    attributeValue.attribute = productStore.product.attribute_and_value;
    productItem.productItems  = productItemStore.productItems
};

onMounted(async () => {
  await productStore.fetchProduct(id.value);
  attributeValue.attribute = productStore.product.attribute_and_value
  await productItemStore.fetchProductItems(id.value);
  productItem.productItems = productItemStore.productItems
});

</script>
<style scoped lang="scss">
.button-container {
  display: flex;
  justify-content: flex-end;
  width: 100%; /* Đảm bảo phần tử cha chiếm toàn bộ chiều rộng */
}
::v-deep .ant-modal-mask {
  background-color: rgba(0, 0, 0, 0.5); /* Đặt độ mờ của lớp phủ */
}


@import './productItem.scss';
</style>
