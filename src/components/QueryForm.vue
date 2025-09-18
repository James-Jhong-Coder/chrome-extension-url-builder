<script setup lang="ts">
import QueryList from '@/components/QueryList.vue';
import type { QueryKeyValue } from '../types/types';
interface Props {
  // 從父元件帶入的 useFieldArray 回傳
  fields: Array<QueryKeyValue>;
  errorMessages: string[];
}
defineProps<Props>();

const emits = defineEmits<{
  onAddNewQueryKey: [];
  onRemoveQueryItemByIndex: [index: number];
  onUpdateQueryItem: [index: number, value: QueryKeyValue];
}>();

const onAddNewQueryKey = () => {
  emits('onAddNewQueryKey');
};

const onUpdateQueryItem = (index: number, newQuery: QueryKeyValue) => {
  emits('onUpdateQueryItem', index, newQuery);
};

const onRemoveQueryItemByIndex = (index: number) => {
  emits('onRemoveQueryItemByIndex', index);
};
</script>

<template>
  <div class="flex flex-col">
    <div class="flex items-center">
      <span>Query 參數</span>
      <Button class="ml-auto" @click="onAddNewQueryKey">
        <div class="flex items-center">
          <SvgIcon name="icon_plus" />
          <span>新增參數</span>
        </div>
      </Button>
    </div>
    <!-- <QueryList
      :fields="fields"
      :error-messages="errorMessages"
      class="mt-4"
      @onUpdateQueryItem="onUpdateQueryItem"
      @onRemoveQueryItemByIndex="onRemoveQueryItemByIndex"
    /> -->
  </div>
</template>
