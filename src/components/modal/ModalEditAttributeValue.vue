<template>
  <a-modal v-model:open="visible" title="Chỉnh sửa giá trị" @ok="handleOk" @cancel="handleCancel">
    <a-form>
      <a-form-item v-for="(value, index) in props.listValues" :key="index" :label="`Giá trị ${index + 1}`">
        <a-input v-model:value="editValues[index].value" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import { ref, watch } from 'vue';
import apiServices from '@/domain/apiServices';

import { useToast } from 'vue-toastification';
const toast = useToast();


const visible = ref(false);
const editValues = ref([]);


const showModal = (values) => {
  editValues.value = values.map(val => val); 
  visible.value = true;
};

const handleOk = async () => {
  console.log("làm chuyen qua day",editValues.value);
  const response = await apiServices.updateAllAttributeValue(editValues.value)
  if(response.data.code == 200){
    toast.success(`Cập nhật thành công`, {
      timeout: 5000
    });
  }else{
    toast.error(`Cập nhật thất bại`, {
      timeout: 5000
    });
  }
  visible.value = false;
};

const handleCancel = () => {
  visible.value = false;
};

const props = defineProps({
  listValues: {
    type: Array,
    default: () => [],
  }
});


watch(
  () => props.listValues,
  (newValues) => {
    editValues.value = [...newValues];
  },
  { immediate: true }
);


defineExpose({
  showModal,
});
</script>
