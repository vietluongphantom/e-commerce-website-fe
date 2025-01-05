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
// const tempValues = ref
const formData = reactive({
    price: null,
    sku_code: '',
    product_id: productId, // Trực tiếp sử dụng `props.idProduct`
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
 
// Sử dụng `watch` để theo dõi sự thay đổi của `props.idProduct`
watch(() => props.idProduct, fetchAttribute, { immediate: true });
watch(() => props.attributeProp, fetchAttribute, { immediate: true });
const visible = ref(false);

const showModal = () => {
  visible.value = true;
};

const handleOk = async (e) => {
    formData.list_product_item  =[]
      visible.value = false;
      for (let index = 0; index < tempAttributeValues.value.length; index++) {
      formData.list_product_item.push({"attribute_value_id":tempAttributeValues.value[index]})
      }

      formData.product_id = route.params.id
      await productItemStore.updateProductItem(formData)
      window.location.reload();
      visible.value = false;
};

onMounted(async () => {
  console.log("bam vao day cho anh")
  await attributeProductStore.fetchAttributeProduct(route.params.id);
  await productItemStore.fetchProductItem(props.idProductItem)
  
  // for (let index = 0; index < attributeProductStore.attributes.length; index++) {
  //   for (let index2 = 0; index2 < attributeProductStore.attributes.length; index2++) {
  //     if(productItemStore.productItem.list_product_item[index].product_attributes_id == attributeProductStore.attributes[index2].id){
  //       formData.list_product_item[index]=productItemStore.productItem.list_product_item[index2].value;
  //     }
  //   }
  // }
});
</script>
