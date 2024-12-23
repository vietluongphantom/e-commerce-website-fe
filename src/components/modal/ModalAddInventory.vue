<template>
  <div>
    <div>
      <a-button @click="showModal" class="flex w-[140px] h-[40px] items-center text-[16px] bg-[#0397D6] text-[#fff] p-4 rounded-md mr-3">
        <span class="mr-2">Nhập hàng</span>
        <AddIcon class="w-[20px] h-[20px]"></AddIcon>
      </a-button>
    </div>
    <a-modal v-model:open="open" title="Nhập hàng vào kho" @ok="handleOk" class="p-6 rounded-lg">
      <div class="space-y-4">
        <!-- Chọn nhà cung cấp -->
        <div>
          <label for="warehouse" class="block text-sm font-medium text-gray-700">Chọn nhà cung cấp</label>
          <a-select
            v-model:value="inventory.supplier_id"
            id="warehouse"
            show-search
            placeholder="Chọn nhà cung cấp"
            :options="name"
            style="width: 100%"
            class="mt-2"
            :filter-option="(input, option) => option.label.toLowerCase().includes(input.toLowerCase())"
            @change="handleChangeWarehouse"
          ></a-select>
        </div>

        <!-- Chọn sản phẩm -->
        <div>
          <label for="product" class="block text-sm font-medium text-gray-700">Chọn sản phẩm</label>
          <a-select
            v-model:value="inventory.product_id"
            id="product"
            show-search
            placeholder="Chọn sản phẩm"
            :options="product"
            style="width: 100%"
            class="mt-2"
            :filter-option="(input, option) => option.label.toLowerCase().includes(input.toLowerCase())"
            @change="handleChangeProduct"
            @search="debouncedFetchBrand"
          ></a-select>
        </div>

        <!-- Chọn mã sản phẩm -->
        <div>
          <label for="sku" class="block text-sm font-medium text-gray-700">Chọn mã sản phẩm</label>
          <a-select
            v-model:value="inventory.sku_code"
            id="sku"
            show-search
            placeholder="Chọn mã sản phẩm"
            :options="productItem"
            style="width: 100%"
            class="mt-2"
            :filter-option="(input, option) => option.label.toLowerCase().includes(input.toLowerCase())"
            @change="handleChangeWareProductItem"
          ></a-select>
        </div>

        <!-- Số lượng -->
        <div>
          <label for="quantity" class="block text-sm font-medium text-gray-700">Số lượng</label>
          <a-input id="quantity" v-model:value="inventory.quantity" placeholder="Nhập số lượng..." class="mt-2" />
        </div>

        <!-- Vị trí -->
        <div>
          <label for="location" class="block text-sm font-medium text-gray-700">Vị trí</label>
          <a-input id="location" v-model:value="inventory.location" placeholder="Nhập vị trí để hàng..." class="mt-2" />
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { SearchIcon, AddIcon, EditIcon, TrashIcon } from '@/assets/icons/icon.js';
import { useWarehouseStore } from '@/stores/warehouseStore';
import { useProductStore } from '@/stores/productSellerStore';
import { useProductItemStore } from '@/stores/productItemStore';
import { useInventoryStore } from '@/stores/inventoryStore';
import debounce from 'lodash/debounce';
import apiServices from '@/domain/apiServices';

const inventoryStore = useInventoryStore();
const productStore = useProductStore();
const warehouseStore = useWarehouseStore();
const productItemStore = useProductItemStore();
const name = ref();
const product = ref();
const productItem = ref();
const inventory = reactive({
  supplier_id: '',
  // supplier: '',
  location: '',
  product_id: '',
  quantity: '',
  sku_code: ''
});

const open = ref(false);

const showModal = () => {
  open.value = true;
};

const handleOk = (e) => {
  inventoryStore.addInventory(inventory);
  open.value = false;
};

const handleChangeWarehouse = (id) => {
  inventory.supplier_id = id;
};
const handleChangeWareProductItem = (id) => {
  inventory.sku_code = id;
};

const handleChangeProduct = async (id) => {
  inventory.product_id = id;
  await productItemStore.getListProductItemByProductId(id);
  console.log('Anbcbđb dddd', productItemStore.productItems);
  productItem.value = productItemStore.productItems.map((productItem) => ({
    value: productItem.sku_code,
    label: productItem.sku_code
  }));
};

const debouncedFetchBrand = debounce((searchText) => {
  fetchProducts(searchText);
}, 500);

const fetchProducts = async (searchText = '') => {
  const response = await apiServices.getListProductS(1, 10, searchText);
  console.log('có vào kl');
  product.value = response.data.data.productResponses.map((product) => ({
    value: product.id,
    label: product.name
  }));
};
// const debouncedFetchWarehouse = debounce((searchText) => {
//     useWarehouseStore.fetchWarehouses(searchText);
// }, 1000);

onMounted(async () => {
  await warehouseStore.fetchWarehouses();
  name.value = warehouseStore.warehouses.map((warehouse) => ({
    value: warehouse.id,
    label: warehouse.name
  }));
  await productStore.fetchProducts();
  product.value = productStore.products.map((product) => ({
    value: product.id,
    label: product.name
  }));
});
</script>

<style scoped lang="scss">
.modal {
  &__border {
    border: 3px solid #9e9e9e;
    outline: none;
    &:focus {
      border: 3px solid #3884e1;
    }
  }
}
// ::v-deep .ant-modal-body{
//   width: 250px!important;
//   padding: 20px
// }
</style>
