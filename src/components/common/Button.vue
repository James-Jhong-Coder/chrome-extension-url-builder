<script setup lang="ts">
type Variant = 'solid' | 'outline';

interface Props {
  variant?: Variant;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'solid',
  disabled: false,
});
</script>

<template>
  <div class="box" :class="[props.variant]">
    <slot></slot>
  </div>
</template>

<style scoped>
@reference "@/styles/global.css";
.box {
  @apply flex items-center;
  @apply leading-none;
  @apply border border-gray-430 text-gray-410 h-[2rem] px-3 rounded-lg;
  @apply cursor-pointer;
}
</style>
