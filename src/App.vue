<script setup lang="ts">
import UrlBuilderForm from '@/components/UrlBuilderForm.vue';
</script>

<template>
  <div class="page">
    <section class="section">
      <UrlBuilderForm class="mt-10" />
    </section>
  </div>
</template>

<style scoped>
@reference "@/styles/global.css";
.page {
  @apply max-w-screen-lg px-4 pb-6 mx-auto w-full;
}

.section {
  @apply flex flex-col items-center;
}
</style>
