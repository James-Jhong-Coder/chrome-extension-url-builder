<script setup lang="ts">
interface Props {
  generatedUrl?: string;
}
import { useClipboard } from '@vueuse/core';
const { copy, text, isSupported } = useClipboard({
  legacy: true,
});

const props = defineProps<Props>();

const onCopyHandler = async () => {
  console.log('enter!!!');
  try {
    await copy('dsdadsdf');
    console.log('複製成功:', text.value);
  } catch (e) {
    console.error('複製失敗', e);
  }

  // copy('dsdadsdf' || '');
};
</script>

<template>
  <div class="flex flex-col">
    <div class="flex items-center">
      <span>生成的 URL</span>
      <div class="icon-close-box ml-auto">
        <SvgIcon name="icon_close" class="w-4 h-4" />
      </div>
    </div>
    <GeneralInput :model-value="generatedUrl" disabled class="mt-4" />
    <div class="flex items-center mt-2">
      <Button @click="onCopyHandler">複製</Button>
      <Button class="ml-2">開啟</Button>
    </div>
  </div>
</template>

<style scoped>
@reference "@/styles/global.css";
.icon-close-box {
  @apply flex items-center justify-center;
  @apply w-6 h-6 rounded-sm cursor-pointer;
  @apply hover:bg-gray-530;
}
</style>
