<template>
  <div>
    <Header />
    <main>
      <router-view />
    </main>
    <Footer />
    <Call></Call>
  </div>
</template>

<script setup>

import Header from '@/components/TheHeader/TheHeader.vue';
import Footer from '@/components/footer/TheFooter.vue';
import Call from '@/components/call/TheCall.vue';
</script>

<style scoped></style>