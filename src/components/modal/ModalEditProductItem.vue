<template>
<div>
  <!-- Icon chỉnh sửa -->
  <EditIcon class="w-[15px] h-[15px] text-primary cursor-pointer" @click="showModal" />
  <!-- Modal chỉnh sửa -->
  <a-modal
    v-model:visible="visible"
    title="Chỉnh sửa thông tin sản phẩm"
    ok-text="Lưu"
    cancel-text="Hủy"
    @ok="handleOk"
    class="rounded-lg p-6"
  >
    <!-- Mã sản phẩm -->
    <div class="mb-4">
      <label for="sku" class="block text-sm font-medium text-gray-700">Mã sản phẩm</label>
      <a-input
        id="sku"
        v-model:value="formData.sku_code"
        placeholder="Nhập mã sản phẩm"
        class="mt-2"
      />
    </div>

    <!-- Danh sách thuộc tính sản phẩm -->
    <div v-for="(item, index) in attributeProductStore.attributes" :key="index" class="mb-4">
      <label
        :for="`attribute-${index}`"
        class="block text-sm font-medium text-gray-700"
      >
        {{ item.name }}
      </label>
      <a-select
        v-model:value="formData.list_product_item[index]"
        :id="`attribute-${index}`"
        show-search
        placeholder="Chọn giá trị"
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
        placeholder="Nhập giá bán"
        class="mt-2"
      />
    </div>

    <!-- Giá nhập -->
    <div class="mb-4">
      <label for="import-price" class="block text-sm font-medium text-gray-700">Giá nhập</label>
      <a-input
        id="import-price"
        v-model:value="formData.import_price"
        placeholder="Nhập giá nhập"
        class="mt-2"
      />
    </div>
  </a-modal>
</div>

</template>
<script setup>
import { onMounted, reactive,ref, watch, defineProps, defineComponent } from 'vue';
import { useAttributeProductStore } from '@/stores/attributeProductStore';
import {useAttributeValuesStore} from '@/stores/attributeValuesStore';
import { SearchIcon, AddIcon, EditIcon, TrashIcon, EyeIcon } from '@/assets/icons/icon.js';
import {useProductItemStore} from '@/stores/productItemStore';
import { eventBusProductItem } from '@/utils/eventBusHeader.js'; 
import { useRoute } from 'vue-router';
import { useToast } from "vue-toastification";

const idValue = ref([])
const route = useRoute();
const props = defineProps({
  idProduct: {
    type: Object,
    default: () => ({})
  },
  idProductItem: {
  type: Number,
  required: true
},
  attributeProp:{
    type:Object,
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
  await productItemStore.fetchProductItem(props.idProductItem)
  formData.price = productItemStore.productItem.price
  formData.sku_code = productItemStore.productItem.sku_code
  formData.import_price = productItemStore.productItem.import_price
  formData.import_price = productItemStore.productItem.import_price
  formData.list_product_item = productItemStore.productItem.list_product_item
  for(let i= 0; i < productItemStore.productItem.list_product_item.length; i++){
    tempAttributeValues.value[i] = productItemStore.productItem.list_product_item[i]?.attribute_value_id
  }
};

const handleLoadAttributeValue = async (index) => {
    tempAttributeValues.value[index] = formData.list_product_item[index]
}

const fetchAttributeValue = async (id,index) => {
    await attributeValuesStore.fetchAttributeValues(id)
    temp.value = attributeValuesStore.attributeValues.map((value) => ({
    value: value.id,
    label: value.value
  }));
    attributeValues.value[index] = temp.value
}
 
watch(() => props.idProduct, fetchAttribute, { immediate: true });
watch(() => props.attributeProp, fetchAttribute, { immediate: true });
watch(() => props.idProductItem, fetchAttribute, { immediate: true });

const visible = ref(false);

const showModal = () => {
  visible.value = true;
};

const handleOk = async (e) => {
      visible.value = false;
      formData.list_product_item = []
      for (let index = 0; index < tempAttributeValues.value.length; index++) {
        formData.list_product_item.push({"attribute_value_id":tempAttributeValues.value[index]})
      }
      formData.product_id = route.params.id
      await productItemStore.updateProductItem(formData, props.idProductItem)
      formData.list_product_item = productItemStore.productItem.list_product_item
      // window.location.reload();
      visible.value = false;
};

onMounted(async () => {
  await attributeProductStore.fetchAttributeProduct(route.params.id);
  await productItemStore.fetchProductItem(props.idProductItem)
});
</script>
