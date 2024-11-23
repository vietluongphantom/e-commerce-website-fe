<template>
  <div>
    <EditIcon class="w-[15px] h-[15px]" type="primary" @click="showModal"/>
    <!-- <a-button type="primary" @click="showModal">+ Thêm mới</a-button> -->
    <a-modal title="Basic Modal" @ok="handleOk" v-model:visible="visible">
       <p>Mã sản phẩm</p>
      <a-input v-model:value="formData.sku_code" placeholder="Basic usage" />
        <div v-for="(item, index) in attributeProductStore.attributes" :key="index">
        <p class="pt-6 pb-3 text-[16px] font-normal">{{ item.name }}</p>
        <a-select
            v-model:value="formData.list_product_item[index]"
            show-search
            placeholder="Chọn giá trị"
            style="width: 100%"
            :options="attributeValues[index]"
            :filter-option="(input, option) => option.label.toLowerCase().includes(input.toLowerCase())"
            @change="handleLoadAttributeValue(index)"
            @click="fetchAttributeValue(item.id,index)"
        ></a-select>
        </div>
      <p style="margin-top: 10px;">Giá bán</p>
      <a-input v-model:value="formData.price" placeholder="Basic usage" />
      <p style="margin-top: 10px;">Giá nhập</p>
      <a-input v-model:value="formData.import_price" placeholder="Basic usage" />
    </a-modal>
  </div>
</template>
<script setup>
import { onMounted, reactive,ref, watch, defineProps, defineComponent } from 'vue';
import { useAttributeProductStore } from '@/stores/attributeProductStore';// Đảm bảo rằng bạn đã nhập store đúng cách
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
  productItemStore.productItem.list_product_item
  for (let index = 0; index < attributeProductStore.attributes.length; index++) {
        for (let index2 = 0; index2 < attributeProductStore.attributes.length; index2++) {
          console.log("ab",productItemStore.productItem.list_product_item[index].product_attributes_id, attributeProductStore.attributes[index2].id)
          if(productItemStore.productItem.list_product_item[index].product_attributes_id == attributeProductStore.attributes[index2].id){
            formData.list_product_item[index]=productItemStore.productItem.list_product_item[index2].value;
          }
        }
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
  await attributeProductStore.fetchAttributeProduct(route.params.id);
});
</script>
