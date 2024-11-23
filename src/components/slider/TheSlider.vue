<template>
  <div class="slider">
    <div class="slider__container" :style="{ transform: `translateX(-${state.currentIndex * 100}%)` }">
      <div class="slider__item" v-for="(slide, index) in state.slides" :key="index">
        <img :src="slide.src" :alt="slide.alt" />
      </div>
    </div>
    <button class="button button--prev" @click="prevSlide">
      <PreviousIcon class="icon" />
    </button>
    <button class="button button--next" @click="nextSlide">
      <ForwardIcon class="icon" />
    </button>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { ForwardIcon, PreviousIcon } from '@/assets/icons/icon.js';

// Khai báo trạng thái slider sử dụng reactive
const state = reactive({
  currentIndex: 0,
  slides: [
    { src: new URL('@/assets/images/slide3.png', import.meta.url).href, alt: 'Image 1' },
    { src: new URL('@/assets/images/bg_slider_11.jpg', import.meta.url).href, alt: 'Image 2' },
    { src: new URL('@/assets/images/bg_slider_13.jpg', import.meta.url).href, alt: 'Image 3' }
  ]
});

const prevSlide = function () {
  state.currentIndex = state.currentIndex > 0 ? state.currentIndex - 1 : state.slides.length - 1;
};

const nextSlide = function () {
  state.currentIndex = state.currentIndex < state.slides.length - 1 ? state.currentIndex + 1 : 0;
};
</script>

<style scoped lang="scss">
@import './slider.scss';
</style>
