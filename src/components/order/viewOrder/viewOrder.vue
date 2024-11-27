<template>
    <div class="app">
      <h2> hihihi</h2>
    </div>
   
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { CloseIcon } from '@/assets/icons/icon.js';
import { useRoute } from 'vue-router';
import { useOrderStore } from '@/stores/orderStore';

const orderStore = useOrderStore();
const status = ref('open');
const route = useRoute();
const id = ref(route.params.id);

onMounted(async () => {
    await orderStore.fetchOrder(id.value);
    console.log("orderStore", orderStore.order.status)
});
</script>


<style scoped>
.app {
    text-align: center;
    margin-top: 50px;
}

button {
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
}

p {
    margin-top: 20px;
    font-size: 20px;
    color: #4caf50;
}
</style>