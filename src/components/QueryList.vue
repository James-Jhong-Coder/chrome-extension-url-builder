<script setup lang="ts">
import { computed } from "vue";
import type { QueryKeyValue } from "../types/types";
import QueryListItem from "./QueryListItem.vue";
interface Props {
  // 從父元件帶入的 useFieldArray 回傳
  fields: Array<QueryKeyValue>;
  errorMessages: string[];
}
const props = defineProps<Props>();
const computedFields = computed(() => {
  return props.fields.map((item) => {
    return {
      ...item,
      canDelete: props.fields.length > 1,
    };
  });
});
const emit = defineEmits<{
  onUpdateQueryItem: [index: number, value: QueryKeyValue];
  onRemoveQueryItemByIndex: [index: number];
}>();

const onUpdateQueryItem = (index: number, newQuery: QueryKeyValue) => {
  emit("onUpdateQueryItem", index, newQuery);
};
const onRemoveQueryItemByIndex = (index: number) => {
  emit("onRemoveQueryItemByIndex", index);
};
</script>
<template>
  <div class="query-list">
    <QueryListItem
      v-for="(item, index) in computedFields"
      :key="item.id"
      :query-item="item"
      :error-message="errorMessages[index]"
      @onUpdateQueryItem="(newQuery: QueryKeyValue) => onUpdateQueryItem(index, newQuery)"
      @onRemove="() => onRemoveQueryItemByIndex(index)"
    />
  </div>
</template>

<style scoped>
@reference "@/styles/global.css";
.query-list {
  @apply flex flex-col;
}
.query-list > div:not(:first-child) {
  @apply mt-4;
}
</style>
