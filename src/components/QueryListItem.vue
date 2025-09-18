<script setup lang="ts">
import type {
  QueryItem,
  UpdatePayload,
  EditableKey,
  QueryKeyValue,
} from '../types/types';

interface Props {
  queryItem: QueryItem;
  errorMessage?: string;
}

const props = withDefaults(defineProps<Props>(), {
  // queryItem: (): QueryItem => ({
  //   id: '',
  //   key: '',
  //   value: '',
  //   canDelete: true,
  // }),
  // errorMessage: '',
});

const emit = defineEmits<{
  onUpdateQueryItem: [value: QueryKeyValue];
  onRemove: [];
}>();

const onInputHandler = <K extends EditableKey>(payload: UpdatePayload<K>) => {
  const { key, value } = payload;
  const newQuery = {
    ...props.queryItem,
    [key]: value,
  };
  delete newQuery['canDelete'];
  emit('onUpdateQueryItem', {
    ...props.queryItem,
    [key]: value,
  });
};

const onRemove = () => {
  if (props.queryItem.canDelete) {
    emit('onRemove');
  }
};
</script>

<template>
  <div class="query-list-item">
    <GeneralInput
      placeholder="請輸入 key"
      :model-value="queryItem.key"
      @update:model-value="(value) => onInputHandler({ key: 'key', value })"
    />
    <GeneralInput
      placeholder="請輸入 value"
      :model-value="queryItem.value"
      :error-message="errorMessage"
      @update:model-value="(value) => onInputHandler({ key: 'value', value })"
    />
    <Button :disabled="!queryItem.canDelete" @click="onRemove">
      <SvgIcon name="icon_delete" class="text-black" />
    </Button>
  </div>
</template>

<style scoped>
@reference "@/styles/global.css";
.query-list-item {
  @apply grid;
  grid-template-columns: 1fr 1fr max-content;
  grid-template-rows: min-content;
  gap: 0 8px;
}
</style>
