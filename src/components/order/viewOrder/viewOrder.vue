

<template>
    <div class="container mx-auto px-4 py-8">
      
        <h1 class="text-4xl font-bold text-center text-gray-800 mb-8 uppercase tracking-wide">
            Chi Tiết Đơn Hàng
        </h1>

      
        <div class="bg-white shadow-lg rounded-lg overflow-hidden">
      
            <div class="p-6 bg-gray-50 border-b">
                <div class="grid md:grid-cols-2 gap-4">
                    <div>
                        <div class="flex items-center mb-2">
                            <span class="font-semibold text-gray-600 mr-2">Mã đơn hàng:</span>
                            <span class="text-blue-600 font-bold">{{ orderDetail?.id }}</span>
                        </div>
                        <div class="flex items-center mb-2">
                            <span class="font-semibold text-gray-600 mr-2">Trạng thái:</span>
                            <span :class="{
                                'text-yellow-600': orderDetail?.status === 'PENDING',
                                'text-green-600': orderDetail?.status === 'COMPLETED',
                                'text-red-600': orderDetail?.status === 'CANCELLED'
                            }" class="font-bold">
                                {{ orderDetail?.status }}
                            </span>
                        </div>
                        <div class="flex items-center">
                            <span class="font-semibold text-gray-600 mr-2">Người mua:</span>
                            <span>{{ orderDetail?.buyer }}</span>
                        </div>
                    </div>
                    <div>
                        <div class="flex items-center mb-2">
                            <span class="font-semibold text-gray-600 mr-2">Địa chỉ:</span>
                            <span>{{ orderDetail?.address }} - {{ orderDetail?.address_detail }}</span>
                        </div>
                        <div class="flex items-center mb-2">
                            <span class="font-semibold text-gray-600 mr-2">Số điện thoại:</span>
                            <span>{{ orderDetail?.receiver_phone }}</span>
                        </div>
                        <div class="flex items-center">
                            <span class="font-semibold text-gray-600 mr-2">Ngày tạo:</span>
                            <span>{{ formatDate(orderDetail?.created_at) }}</span>
                        </div>
                    </div>
                </div>
            </div>

        
            <div class="p-6">
                <h2 class="text-2xl font-semibold text-gray-800 mb-4">Danh Sách Sản Phẩm</h2>
                <a-table v-if="orderItems.length > 0" :columns="columns" :data-source="orderItems" :pagination="false"
                    class="w-full">
                    <template #bodyCell="{ column, record }">
                        <template v-if="column.dataIndex === 'unitPrice'">
                            <span class="text-blue-600 font-bold">{{ formatCurrency(record.unitPrice) }}</span>
                        </template>
                        <template v-if="column.dataIndex === 'total'">
                            <span class="text-green-600 font-bold">{{ formatCurrency(record.unitPrice * record.quantity)
                                }}</span>
                        </template>
                    </template>
                </a-table>

             
                <a-empty v-else description="Không có sản phẩm trong đơn hàng" />
            </div>

      
            <div class="bg-gray-100 p-6 text-right">
                <p class="text-2xl font-bold text-red-600">
                    Tổng giá trị: {{ formatCurrency(orderDetail?.total_price || 0) }}
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useOrderStore } from '@/stores/orderDetailStore';


const columns = [
    {
        title: 'Mã sản phẩm',
        dataIndex: 'productItemId',
        key: 'productItemId',
    },
    {
        title: 'Số lượng',
        dataIndex: 'quantity',
        key: 'quantity',
    },
    {
        title: 'Đơn giá',
        dataIndex: 'unitPrice',
        key: 'unitPrice',
    },
    {
        title: 'Tổng tiền',
        dataIndex: 'total',
        key: 'total',
    },
];


const orderStore = useOrderStore();
const route = useRoute();
const router = useRouter();


const orderDetail = computed(() => orderStore.orders);


const orderItems = computed(() => {
    return orderDetail.value?.orderItems || [];
});


const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(value);
};


const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('vi-VN');
};


onMounted(async () => {
    try {
     
        const id = route.params.id;

     
        await orderStore.getOrder(id);
    } catch (error) {
        console.error('Lỗi khi tải chi tiết đơn hàng:', error);
 
        router.push({ name: 'order-list' });
    }
});
</script>