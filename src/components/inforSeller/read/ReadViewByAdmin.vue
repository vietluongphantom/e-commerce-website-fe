
<template>

    <div class="admin-view">
        <h1 class="title">Thông tin Người bán và Cửa hàng</h1>


        <div v-if="isLoading">
            <p>Đang tải dữ liệu...</p>
        </div>

        <div v-if="!isLoading && (!sellerInfo || !shopInfo)">
            <p>Không có dữ liệu để hiển thị. Vui lòng thử lại!</p>
        </div>


        <div v-if="!isLoading && sellerInfo" class="info-box">
            <h2>Thông tin Người bán</h2>
            <table class="info-table">
                <tr>
                    <th>Họ và tên</th>
                    <td>{{ sellerInfo.full_name || 'N/A' }}</td>
                </tr>
                <tr>
                    <th>Email</th>
                    <td>{{ sellerInfo.email || 'N/A' }}</td>
                </tr>
                <tr>
                    <th>Số điện thoại</th>
                    <td>{{ sellerInfo.phone || 'N/A' }}</td>
                </tr>
                <tr>
                    <th>Giới tính</th>
                    <td>{{ sellerInfo.gender }}</td>
                </tr>
                <tr>
                    <th>Mã số thuế</th>
                    <td>{{ sellerInfo.tax || 'N/A' }}</td>
                </tr>
                <tr>
                    <th>CCCD</th>
                    <td>{{ sellerInfo.cccd || 'N/A' }}</td>
                </tr>

                <tr>
                    <th>Quốc gia </th>
                    <td>{{ sellerInfo.country || 'N/A' }}</td>
                </tr>

                <tr>
                    <th>Tỉnh thành </th>
                    <td>{{ sellerInfo.province || 'N/A' }}</td>
                </tr>

                <tr>
                    <th>Quận </th>
                    <td>{{ sellerInfo.district || 'N/A' }}</td>
                </tr>

                <tr>
                    <th>Phường, Xã </th>
                    <td>{{ sellerInfo.commune || 'N/A' }}</td>
                </tr>

                <tr>
                    <th>Địa chỉ chi tiết</th>
                    <td>{{ sellerInfo.address_detail || 'N/A' }}</td>
                </tr>
            </table>
        </div>


        <div v-if="!isLoading && shopInfo" class="info-box">
            <h2>Thông tin Cửa hàng</h2>
            <table class="info-table">
                <tr>
                    <th>Tên Cửa hàng</th>
                    <td>{{ shopInfo.name || 'N/A' }}</td>
                </tr>
                <tr>
                    <th>Email</th>
                    <td>{{ shopInfo.mail || 'N/A' }}</td>
                </tr>
                <tr>
                    <th>Số điện thoại</th>
                    <td>{{ shopInfo.phone || 'N/A' }}</td>
                </tr>
                <!-- <tr>
                    <th>Địa chỉ chi tiết</th>
                    <td>{{ shopInfo.address_detail || 'N/A' }}</td>
                </tr> -->
            </table>
        </div>
    </div>
</template>

<script>
import { useInfoStoreByAdmin } from '@/stores/infoStoreByAdmin';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
export default {
    name: 'ReadViewSellerByAdmin',
    setup() {
        const route = useRoute();
        const sellerId = route.params.id; // Giả sử route của bạn là /seller/:id
        const infoStore = useInfoStoreByAdmin(); // Sử dụng store Pinia
        const sellerInfo = ref(null);
        const shopInfo = ref(null);
        const isLoading = ref(true);

        // Fetch dữ liệu từ API khi component được mount
        onMounted(async () => {
            try {
                await infoStore.fetchSellerInfoByAdmin(sellerId);
                await infoStore.fetchShopInfoByAdmin(sellerId);
                sellerInfo.value = infoStore.sellerInfo;
                shopInfo.value = infoStore.shopInfo;
            } catch (error) {
                console.error('Lỗi khi tải thông tin:', error);
            } finally {
                isLoading.value = false;
            }
        });

        return {
            sellerInfo,
            shopInfo,
            isLoading
        };
    }
};
</script>

<style scoped>
.admin-view {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.title {
    text-align: center;
    font-size: 24px;
    margin-bottom: 20px;
    color: #333;
}

.info-box {
    margin-bottom: 20px;
}

.info-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
}

.info-table th,
.info-table td {
    padding: 10px;
    text-align: left;
    border-bottom: 1px solid #ddd;
}

.info-table th {
    width: 30%;
    background-color: #f4f4f4;
    font-weight: bold;
}
</style>
