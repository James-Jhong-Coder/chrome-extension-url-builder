<script setup lang="ts">
type Variant = 'solid' | 'outline';

interface Props {
  variant?: Variant;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'outline',
  disabled: false,
});

defineEmits<{
  click: [];
}>();
</script>

<template>
  <div class="btn" :class="[props.variant]">
    <slot></slot>
  </div>
</template>

<style scoped>
@reference "@/styles/global.css";

.btn {
  @apply flex items-center;
  @apply leading-none;
  @apply text-gray-410 h-[2rem] px-3 rounded-lg;
  @apply cursor-pointer;
}

.btn.solid {
  @apply bg-gray-650;
  @apply text-white;
}

.btn.solid:hover {
  @apply bg-gray-630;
}

.btn.outline {
  @apply border border-gray-430;
}

.btn.outline:hover {
  @apply bg-gray-560;
}
</style>
