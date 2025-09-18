<script setup lang="ts">
import { useForm, useFieldArray } from 'vee-validate';
import { object, string, array } from 'yup';
import QueryForm from '@/components/QueryForm.vue';
import { v4 as uuidv4 } from 'uuid';
import type { QueryKeyValue } from '@/types/types';
import { computed } from 'vue';
import ResultPanel from './ResultPanel.vue';

interface FormValues {
  hostName: string;
  queries: QueryKeyValue[];
}

const schema = object({
  hostName: string()
    .required('Domain 為必填')
    .matches(
      /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(:\d+)?(\/.*)?$/i,
      '請輸入正確的 Domain'
    ),
  queries: array().of(
    object({
      key: string().trim().default(''),
      value: string().trim().nullable().default(''),
      id: string().optional(),
    }).test(
      'key-required-if-value',
      '當 value 有值時，key 一定要有值',
      (v) => !v?.value || v.value.trim() === '' || !!v?.key?.trim()
    )
  ),
});

const { defineField, handleSubmit, errors } = useForm<FormValues>({
  validationSchema: schema,
  initialValues: {
    hostName: '',
    // 預設一組
    queries: [{ key: '', value: '', id: uuidv4() }],
  },
});

const [hostName, hostNameAttrs] = defineField('hostName');
const { fields, push, remove, update } =
  useFieldArray<QueryKeyValue>('queries');

const computedFields = computed(() => fields.value.map((f) => f.value));

const onAddNewQueryKey = () => {
  push({
    key: '',
    value: '',
    id: uuidv4(),
  });
};

const onRemoveQueryItemByIndex = (index: number) => {
  remove(index);
};

const onUpdateQueryItem = (index: number, newQuery: QueryKeyValue) => {
  update(index, newQuery);
};

const queriesErrorMessages = computed(() => {
  return Array.from({ length: fields.value.length }).map((_, index) => {
    return errors?.value[`queries[${index}]`] || '';
  });
});

const onSubmit = handleSubmit((values) => {});
</script>

<template>
  <div class="box p-6">
    <h2 class="box-title">URL Builder</h2>
    <div class="flex flex-col mt-4">
      <span class="text-gray-410">Domain</span>
      <GeneralInput
        v-model="hostName"
        :vee-validate-attrs="hostNameAttrs"
        placeholder="要寫完整的連結 例如 : https://example.com/"
        :error-message="errors['hostName']"
        class="mt-2"
      />
    </div>
    <QueryForm
      class="mt-5"
      :fields="computedFields"
      :errorMessages="queriesErrorMessages"
      @onAddNewQueryKey="onAddNewQueryKey"
      @onRemoveQueryItemByIndex="onRemoveQueryItemByIndex"
      @onUpdateQueryItem="onUpdateQueryItem"
    />
    <Button class="mt-5" @click="onSubmit" variant="solid">
      <div class="flex justify-center w-full">生成 URL</div>
    </Button>
    <ResultPanel class="mt-5" />
  </div>
</template>

<style scoped>
@reference "@/styles/global.css";

.box {
  @apply max-w-3xl w-full rounded-sm;
  @apply border border-gray-200 leading-none text-sm;
}

.box-title {
  @apply text-gray-500 text-base;
}
</style>
