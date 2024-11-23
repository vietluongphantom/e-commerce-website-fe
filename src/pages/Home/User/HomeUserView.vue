<template>
  <div class="home">
    <Slider></Slider>
    <div class="sidebar-container">
      <a-layout-content>
        <!-- Nội dung trang chính -->
      </a-layout-content>
    </div>
    <div class="home__box">
      <div class="container">
        <div class="home__inner">
          <div class="home__left">
            <a-button type="primary" style="margin-bottom: 16px" @click="toggleMenu" class="home__fillter ml-3">
              <MenuUnfoldOutlined v-if="!state.menuVisible" />
              <MenuFoldOutlined v-else />
              Bộ lọc
            </a-button>
            <span class="home__title">Tất cả sản phẩm</span>
          </div>
          <div class="home-right">
            <span class="home__label">Sắp xếp theo</span>
            <select v-model="selectedOption" id="example-select" style="width: 200px" class="home__select" @change="handleChange">
              <option value="">Mặc định</option>
              <option value="asc">Giá tăng dần</option>
              <option value="desc">Giá giảm dần</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <div class="home__boxTwo">
      <div class="container">
        <div class="home__innerTwo">
          <div style="width: 256px" v-if="state.menuVisible" class="mt-8 rounded-lg">
            <a-layout-sider class="sidebar-shop filter" width="250px rounded-lg">
              <a-menu mode="inline" theme="light" class="bg-[#ffff] z-50 flex flex-col rounded-lg">
                <!-- Danh mục -->
                <a-sub-menu key="categories" title="Danh mục" class="font-semibold text-[18px]">
                  <a-menu-item-group>
                    <a-checkbox-group
                      v-model="selectedCategories"
                      @change="onCategoryChange"
                      class="flex flex-col p-3 pl-5 max-h-[300px] overflow-x-auto"
                    >
                      <a-checkbox class="font-normal mb-3" v-for="category in categories.categories" :key="category.id" :value="category.id">
                        {{ category.name }}
                      </a-checkbox>
                    </a-checkbox-group>
                  </a-menu-item-group>
                </a-sub-menu>

                <!-- Danh mục -->
                <a-sub-menu key="brands" title="Thương hiệu" class="bg-[#ffff] z-50 font-semibold text-[18px]">
                  <a-menu-item-group class="bg-[#ffff] z-50">
                    <a-checkbox-group v-model="selectedBrand" @change="onBrandChange" class="flex flex-col p-3 pl-5 max-h-[300px] overflow-x-auto">
                      <a-checkbox class="font-normal mb-3" v-for="brand in brands.brands" :key="brand.id" :value="brand.id">
                        {{ brand.name }}
                      </a-checkbox>
                    </a-checkbox-group>
                  </a-menu-item-group>
                </a-sub-menu>

                <!-- Size -->
                <a-sub-menu key="size" title="Đánh giá" class="font-semibold text-[18px]">
                  <a-menu-item-group>
                    <div v-for="(rateValue, index) in rate" :key="index" class="rate-item flex flex-col pl-5 max-h-[300px] overflow-x-auto">
                      <a-rate v-model:value="rate[index]" @click="handleRateChange(index)" :disabled="true" />
                    </div>
                  </a-menu-item-group>
                </a-sub-menu>

                <!-- Price -->
                <a-sub-menu key="price" title="Khoảng Giá" class="font-semibold text-[18px]">
                  <a-menu-item-group class="pl-5">
                    <a-input-group compact class="pl-5">
                      <a-input style="width: 100px" v-model="fromPrice" placeholder="Từ" @input="inputFromPrice" />
                      <a-input style="width: 100px" v-model="toPrice" placeholder="Đến" @input="toFormPrice" />
                    </a-input-group>
                    <a-button type="primary" @click="applyPrice" class="ml-5 mt-4 bg-[#326E51]">Áp dụng</a-button>
                  </a-menu-item-group>
                </a-sub-menu>
              </a-menu>
            </a-layout-sider>
            <!-- <a-menu
              class="home__item"
              v-model:openKeys="state.openKeys"
              v-model:selectedKeys="state.selectedKeys"
              mode="inline"
              theme="dark"
              :inline-collapsed="state.collapsed"
              :items="items"
              @click="handleClick"
            ></a-menu> -->
          </div>

          <div class="home__items">
            <ListProduct :filter="filter"></ListProduct>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Slider from '@/components/slider/TheSlider.vue';
import ListProduct from '@/components/listProduct/ListProduct.vue';
import { ref, onMounted } from 'vue';
import { useCategory } from '@/stores/CategoryStore';
import { useBrand } from '@/stores/BrandStore';
import { reactive, watch } from 'vue';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons-vue';

const category = useCategory();
const categories = reactive({
  categories: category.category
});

const brandStore = useBrand();
const brands = reactive({
  brands: brandStore.brand
});

const rate = ref([5, 4, 3, 2, 1]);
const selectedOption = ref('');
const selectedCategories = ref([]);
const selectedBrand = ref([]);
const fromPrice = ref('');
const toPrice = ref('');
const rateValues = ref('');

const applyPrice = () => {
  console.log('Apply price filter', fromPrice.value, toPrice.value);
  filter.fromPrice = fromPrice.value;
  filter.toPrice = toPrice.value;
};

const inputFromPrice = (event) => {
  fromPrice.value = event.target.value;
};

const toFormPrice = (event) => {
  toPrice.value = event.target.value;
};

//test

const filter = reactive({
  selectedCategories: selectedCategories.value,
  selectedBrand: selectedBrand.value,
  selectStar: rateValues.value,
  fromPrice: fromPrice.value,
  toPrice: toPrice.value,
  sort: selectedOption.value
});

const state = reactive({
  menuVisible: false,
  collapsed: false,
  selectedKeys: [0],
  openKeys: ['sub1'],
  preOpenKeys: ['sub1']
});

watch(
  () => state.openKeys,
  (_val, oldVal) => {
    state.preOpenKeys = oldVal;
  }
);
const onBrandChange = (value) => {
  console.log('Thương hiệu được chọn:', value);
  selectedBrand.value = value;
  filter.selectedBrand = value;
};

const onCategoryChange = (checkedValues) => {
  selectedCategories.value = checkedValues;
  filter.selectedCategories = checkedValues;
  console.log('Danh mục được chọn:', checkedValues);
};

const toggleMenu = function () {
  state.menuVisible = !state.menuVisible;
  if (!state.menuVisible) {
    state.preOpenKeys = state.openKeys;
    state.openKeys = [];
  } else {
    state.openKeys = state.preOpenKeys;
  }
};

const handleClick = function (e) {
  const selectedKey = e.key;
  const selectedIndex = state.selectedKeys.indexOf(selectedKey);
  if (selectedIndex > -1) {
    state.selectedKeys.splice(selectedIndex, 1);
  } else {
    state.selectedKeys.push(selectedKey);
  }
};

const handleRateChange = function (index) {
  rateValues.value = rate.value[index];
  filter.selectStar = rate.value[index];
};

const handleChange = function (value) {
  filter.sort = value.target.value;
};

const radioStyle = reactive({
  height: '30px',
  lineHeight: '30px'
});
onMounted(async () => {
  await category.fetchCategory();
  categories.categories = category.category;
  await brandStore.fetchBrand();
  brands.brands = brandStore.brand;
});
</script>

<style scoped lang="scss">
@import './homeUser.scss';

.sidebar-container {
  display: flex;
}

.sidebar-shop {
  background: #fff;
  height: 100vh;
  overflow: auto;
}

.size-tag {
  margin: 2px;
}

.rate-item {
  margin-bottom: 8px;
}

.filter {
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
}
</style>
