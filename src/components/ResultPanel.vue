<script setup lang="ts">
interface Props {
  generatedUrl?: string;
}
import { useClipboard } from "@vueuse/core";
const { copy, text } = useClipboard({
  legacy: true,
});

const props = defineProps<Props>();

const onCopyHandler = async () => {
  console.log("enter!!!");
  try {
    await copy(props.generatedUrl || "");
    console.log("複製成功:", text.value);
  } catch (e) {
    console.error("複製失敗", e);
  }
};

const onOpenHandler = () => {
  if (props.generatedUrl) {
    window.open(props.generatedUrl, "_blank", "noopener,noreferrer");
  } else {
    console.warn("沒有可用的 URL");
  }
};

const emits = defineEmits<{
  onClose: [];
}>();

const onClosePanelHandler = () => {
  emits("onClose");
};
</script>

<template>
  <div class="flex flex-col">
    <div class="flex items-center">
      <span>生成的 URL</span>
      <div class="icon-close-box ml-auto" @click="onClosePanelHandler">
        <SvgIcon name="icon_close" class="w-4 h-4" />
      </div>
    </div>
    <GeneralInput :model-value="generatedUrl" disabled class="mt-2" />
    <div class="flex items-center mt-3">
      <Button @click="onCopyHandler">複製</Button>
      <Button class="ml-2" @click="onOpenHandler">開啟</Button>
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
