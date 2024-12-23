<template>
  <a-layout class="min-h-screen">
    <a-header class="header flex bg-[#EFF1F7] pt-[25px] pb-[25px] pl-8 pr-8 sticky z-50 top-0">
      <div>
        <img src="@/assets/images/logo_bcvt.png"
         :class="{
            'w-[70px] mr-[27px]': collapsed,
            'w-[200px] mr-[120px]': !collapsed
          }" class="h-[50px] object-cover object-left mr-10" />
      </div>
      <div class="flex items-center justify-between w-full">
        <div class="flex items-center">
          <a-button class="trigger p-2" @click="toggleCollapsed">
            <BarIcon class="w-[20px] h-[20px]"></BarIcon>
          </a-button>
          <input class="input--one ml-[30px] w-[270px] h-[35px] rounded-xl outline-none p-5"
            placeholder="Nhập từ khóa..." />
          <Button class="w-[30px] h-[30px] ml-4">
            <SearchIcon class="w-full h-full"></SearchIcon>
          </Button>
        </div>

        <div class="flex items-center">
          <BellIcon class="w-[27px] h-[27px]"></BellIcon>
          <Dropdown></Dropdown>
        </div>
      </div>
    </a-header>

    <a-layout class="flex">
      <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible>
        <a-menu v-model:openKeys="state.openKeys" v-model:selectedKeys="state.selectedKeys" mode="inline" theme="dark"
          :inline-collapsed="state.collapsed" :items="items" @click="handleMenuClick"></a-menu>
      </a-layout-sider>

      <a-layout-content class="flex-1 p-8 pt-10 bg-[#FBF6F0]">
        <router-view></router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
  <Call></Call>
</template>

<script setup>
import { ref, reactive, watch, h } from 'vue';
import { SearchIcon, BarIcon, BellIcon } from '@/assets/icons/icon.js';
import Dropdown from '@/components/dropdown/DropDown.vue';
import router from '@/router/index.js';
import Call from '@/components/call/TheCall.vue';
const collapsed = ref(false);
const toggleCollapsed = () => {
  collapsed.value = !collapsed.value;
};

import {
  PieChartOutlined,
  ShoppingCartOutlined,
  GiftOutlined,
  FileDoneOutlined,
  FileTextOutlined,
  BarChartOutlined
} from '@ant-design/icons-vue';

const state = reactive({
  collapsed: false,
  selectedKeys: ['1'],
  openKeys: ['sub1'],
  preOpenKeys: ['sub1']
});
const items = reactive([
  {
    key: '1',
    icon: () => h(PieChartOutlined),
    label: 'Trang chủ',
    title: 'Trang chủ'
  },
  {
    key: 'sub1',
    icon: () => h(ShoppingCartOutlined),
    label: 'Quản lý sản phẩm',
    title: 'Quản lý sản phẩm',
    children: [
      {
        key: '4',
        label: 'Danh sách sản phẩm',
        title: 'Danh sách sản phẩm'
      },
      {
        key: '5',
        label: 'Thêm mới sản phẩm',
        title: 'Thêm mới sản phẩm'
      }
    ]
  },
  {
    key: 'sub2',
    icon: () => h(GiftOutlined),
    label: 'Quản lý khuyến mãi',
    title: 'Quản lý khuyến mãi',
    children: [
      {
        key: '6',
        label: 'Danh sách khuyến mãi',
        title: 'Danh sách khuyến mãi'
      },
      {
        key: '7',
        label: 'Thêm mới khuyến mãi',
        title: 'Thêm mới khuyến mãi'
      }
    ]
  },
  {
    key: 'sub3',
    icon: () => h(FileDoneOutlined),
    label: 'Quản lý đơn hàng',
    title: 'Quản lý đơn hàng',
    children: [
      {
        key: '8',
        label: 'Quản lý đơn hàng',
        title: 'Quản lý đơn hàng'
      },
      // {
      //   key: '9',
      //   label: 'Thêm mới đơn hàng',
      //   title: 'Thêm mới đơn hàng'
      // }
    ]
  },
  {
    key: 'sub4',
    icon: () => h(FileTextOutlined),
    label: 'Quản lý nhà cung cấp',
    title: 'Quản lý nhà cung cấp',
    children: [
      {
        key: '10',
        label: 'Danh sách cung cấp',
        title: 'Danh sách cung cấp'
      },
      {
        key: '11',
        label: 'Thêm mới cung cấp',
        title: 'Thêm mới cung cấp'
      },
      {
        key: '15',
        label: 'Thống kê xuất hàng',
        title: 'Thống kê xuất hàng'
      },
      {
        key: '16',
        label: 'Thống kê nhập hàng',
        title: 'Thống kê nhập hàng'
      }
    ]
  },
  {
    key: 'sub5',
    icon: () => h(BarChartOutlined),
    label: 'Quản lý thông kê',
    title: 'Quản lý thông kê',
    children: [
      {
        key: '12',
        label: 'Quản lý hàng tồn kho',
        title: 'Quản lý hàng tồn kho'
      },
      {
        key: '13',
        label: 'Quản lý sản phẩm mua nhiều',
        title: 'Quản lý sản phẩm mua nhiều'
      },
      {
        key: '14',
        label: 'Quản lý doanh số sản phẩm',
        title: 'Quản lý doanh số sản phẩm'
      }
    ]
  }
]);
watch(
  () => state.openKeys,
  (_val, oldVal) => {
    state.preOpenKeys = oldVal;
  }
);

const handleMenuClick = ({ key }) => {
  const item = findMenuItem(items, key);
  if (item) {
    router.push({ name: `menu-${key}` });
  }
};

const findMenuItem = (items, key) => {
  for (const item of items) {
    if (item.key === key) {
      return item;
    }
    if (item.children) {
      const found = findMenuItem(item.children, key);
      if (found) {
        return found;
      }
    }
  }
  return null;
};
</script>

<style scoped lang="scss">
@import './layout.scss';
</style>
