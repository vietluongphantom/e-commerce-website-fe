<template>
  <div>
    <!-- Nút thêm mới -->
    <a-button 
      type="primary" 
      class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark"
      @click="showModal"
    >
      + Thêm mới
    </a-button>
  
    <!-- Modal -->
    <a-modal 
      v-model:visible="visible" 
      title="Thêm sản phẩm mới"
      ok-text="Lưu"
      cancel-text="Hủy"
      class="rounded-lg p-6"
      @ok="handleOk"
    >
      <!-- Mã sản phẩm -->
      <div class="mb-4">
        <label for="sku" class="block text-sm font-medium text-gray-700">Mã sản phẩm</label>
        <a-input
          id="sku"
          v-model:value="formData.sku_code"
          placeholder="Nhập mã sản phẩm..."
          class="mt-2"
        />
      </div>
  
      <!-- Thuộc tính sản phẩm -->
      <div v-for="(item, index) in attributeProductStore.attributes" :key="index" class="mb-4">
        <label 
          :for="`attribute-${index}`" 
          class="block text-sm font-medium text-gray-700"
        >
          {{ item.name }}
        </label>
        <a-select
          v-model:value="idValue[index]"
          :id="`attribute-${index}`"
          show-search
          placeholder="Chọn nhãn hiệu"
          style="width: 100%"
          class="mt-2"
          :options="attributeValues[index]"
          :filter-option="(input, option) => option.label.toLowerCase().includes(input.toLowerCase())"
          @change="handleLoadAttributeValue(index)"
          @click="fetchAttributeValue(item.id, index)"
        ></a-select>
      </div>
  
      <!-- Giá bán -->
      <div class="mb-4">
        <label for="price" class="block text-sm font-medium text-gray-700">Giá bán</label>
        <a-input
          id="price"
          v-model:value="formData.price"
          placeholder="Nhập giá bán..."
          class="mt-2"
        />
      </div>
  
      <!-- Giá nhập -->
      <div class="mb-4">
        <label for="import-price" class="block text-sm font-medium text-gray-700">Giá nhập</label>
        <a-input
          id="import-price"
          v-model:value="formData.import_price"
          placeholder="Nhập giá nhập hàng..."
          class="mt-2"
        />
      </div>
    </a-modal>
  </div>
  
</template>
<script setup>
import { onMounted, reactive,ref, watch, defineProps, defineComponent } from 'vue';
import { useAttributeProductStore } from '@/stores/attributeProductStore';// Đảm bảo rằng bạn đã nhập store đúng cách
import {useAttributeValuesStore} from '@/stores/attributeValuesStore';
import {useProductItemStore} from '@/stores/productItemStore';
import { eventBusProductItem } from '@/utils/eventBusHeader.js'; 
import { useRoute } from 'vue-router';
const idValue = ref([])
const route = useRoute();
const props = defineProps({
  idProduct: {
    type: Object,
    default: () => ({})
  }
});

const productItemStore = useProductItemStore();
const attributeProductStore =  useAttributeProductStore();
const attributeValuesStore = useAttributeValuesStore();
const productData = ref({ dataSource: [] });
const attributeValues = ref([])
const tempAttributeValues = ref([])
const temp =ref()
const productId = ref()
const propsCopy  = ref()
const formData = reactive({
    price: null,
    sku_code: '',
    product_id: productId, 
    import_price: null,
    list_product_item: [],
});


const fetchAttribute = async () => {
};

const handleLoadAttributeValue = async (index) => {
    tempAttributeValues.value[index] = idValue.value[index]
}

const fetchAttributeValue = async (id,index) => {
    await attributeValuesStore.fetchAttributeValues(id)
    temp.value = attributeValuesStore.attributeValues.map((value) => ({
    value: value.id,
    label: value.value
  }));
    attributeValues.value[index] = temp.value
    console.log("attributeValues.value", attributeValues.value[index])
}
 
watch(() => props.idProduct, fetchAttribute, { immediate: true });

const visible = ref(false);

const showModal = async () => {
  visible.value = true;
    await attributeProductStore.fetchAttributeProduct(route.params.id);
};

const handleOk = async (e) => {
    formData.list_product_item  =[]
      visible.value = false;
      for (let index = 0; index < tempAttributeValues.value.length; index++) {
          formData.list_product_item.push({"attribute_value_id":tempAttributeValues.value[index]})
      }
      formData.product_id = route.params.id
      await productItemStore.addProductItem(formData, route.params.id)
      window.location.reload();
      visible.value = false;
};

onMounted(async () => {
  await attributeProductStore.fetchAttributeProduct(route.params.id);
  console.log("culi chạy việc vặt", formData.product_id );
});
</script>
