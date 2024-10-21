<template>
  <div class="footer bg-[var(--color-three)]">
    <div class="container">
      <div class="grid grid-cols-6 gap-4 p-12 justify-center items-center">
        <div class="col-span-3 text-[#ffff]">
          <h2 class="footer__title uppercase font-semibold text-[28px] mb-3">Đừng bỏ lỡ thông tin</h2>
          <p>Đăng ký nhận tin để không bỏ lỡ những chương trình khuyến mãi</p>
        </div>

        <div class="col-span-2 mr-5 flex bg-[#FBEEE0] justify-center items-center rounded-md">
          <EmailIcon class="w-[25px] h-[25px] mr-3"></EmailIcon>
          <input class="bg-inherit w-[300px] h-[40px] placeholder-[#868686] outline-none" type="email" placeholder="Nhập email của bạn..." />
        </div>
        <div class="button-74 col-span-1">Đăng kí</div>
      </div>
    </div>
  </div>

  <div class="bg-[#EEEEEE] pt-[40px] pb-[60px]">
    <div class="container">
      <div class="grid grid-cols-4 gap-12">
        <div class="col-span-2 p-4">
          <img src="@/assets/images/Logo_PTIT.jpg" class="w-[200px] h-100px]" />
          <h3 class="uppercase font-semibold text-[18px] mt-4">Học Viện Công NGhệ Buu Chính Viễn Thông</h3>
          <p class="text-[16px] mt-2">Địa chỉ: Nguyễn Trãi, Hà Đông, Hà Nội</p>
          <p class="text-[16px] mt-2">Email: abc@gmail.com</p>
          <p class="text-[16px] mt-2 mb-3">SĐT liên hệ: 022469534</p>
          <ul class="flex">
            <li class="footer__contact bg-[#fff] p-2 rounded mr-3">
              <a href="https://www.facebook.com/" target="blank"><FacebookIcon class="w-[25px] h-[25px]"></FacebookIcon></a>
            </li>
            <li class="footer__contact bg-[#fff] p-2 rounded mr-3">
              <a href="https://www.instagram.com/" target="blank"><InstagramIcon class="w-[25px] h-[25px]"></InstagramIcon></a>
            </li>
            <li class="footer__contact bg-[#fff] p-2 rounded mr-3">
              <a href="https://www.instagram.com/" target="blank"><TwitterIcon class="w-[25px] h-[25px]"></TwitterIcon></a>
            </li>
          </ul>
        </div>

        <div class="col-span-1">
          <h3 class="uppercase font-bold text-[20px] mb-[40px] mt-10">Về chúng tôi</h3>
          <ul class="text-[16px]">
            <li class="mb-2">Giới thiệu</li>
            <li class="mb-2">Liên hệ</li>
            <li class="mb-2">Tuyển dụng</li>
            <li class="mb-2">Tin tức</li>
          </ul>
        </div>

        <div class="col-span-1">
          <h3 class="uppercase font-bold text-[20px] mb-[40px] mt-10">Hỗ trợ</h3>
          <ul class="text-[16px]">
            <li class="mb-2">Chính sách đổi trả</li>
            <li class="mb-2">Chính sách bảo mật</li>
            <li class="mb-2">Điều khoản và điều kiện</li>
            <li class="mb-2">Chính sách đồng kiểm</li>
            <li class="mb-2">Hướng dẫn mua hàng</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { EmailIcon, FacebookIcon, InstagramIcon, TwitterIcon } from '@/assets/icons/icon.js';
</script>
<style scoped lang="scss">
@import './footer.scss';
</style>
