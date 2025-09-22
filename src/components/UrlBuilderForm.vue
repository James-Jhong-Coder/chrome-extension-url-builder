<script setup lang="ts">
import { useForm, useFieldArray } from 'vee-validate';
import { object, string, array } from 'yup';
import QueryForm from '@/components/QueryForm.vue';
import { v4 as uuidv4 } from 'uuid';
import type { QueryKeyValue } from '@/types/types';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import ResultPanel from './ResultPanel.vue';
import { Subject, of, map, catchError } from 'rxjs';
import { saveFormValues, loadFormValues } from '@/hook/useStorage'; // ← 剛剛的工具

interface FormValues {
  hostName: string;
  queries: QueryKeyValue[];
}

const schema = object({
  hostName: string()
    .required('Domain 為必填')
    .matches(
      /^(https?:\/\/)?((([a-z0-9-]+\.)+[a-z]{2,})|(\d{1,3}(\.\d{1,3}){3}))(:\d+)?(\/.*)?$/i,
      '請輸入正確的 Domain 或 IP'
    ),
  queries: array().of(
    object({
      key: string().trim().default(''),
      value: string().trim().nullable().default(''),
      id: string().optional(),
    }).test(
      'key-required-if-value',
      '因為 value 有值，必須輸入 key',
      (v) => !v?.value || v.value.trim() === '' || !!v?.key?.trim()
    )
  ),
});
const saved = loadFormValues();

const { defineField, handleSubmit, errors, values } = useForm<FormValues>({
  validationSchema: schema,
  initialValues: saved ?? {
    hostName: '',
    // 預設一組
    queries: [{ key: '', value: '', id: uuidv4() }],
  },
});

const [hostName, hostNameAttrs] = defineField('hostName');
const { fields, push, remove, update } =
  useFieldArray<QueryKeyValue>('queries');
const generatedUrl = ref('');

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

const submit$ = new Subject<FormValues>();

const onSubmit = handleSubmit((values) => {
  submit$.next(values);
});

onMounted(() => {
  onSubmit();
});

const normalizeHost = map<FormValues, FormValues>((v) => {
  const hasScheme = /^https?:\/\//i.test(v.hostName);
  return { ...v, hostName: hasScheme ? v.hostName : `https://${v.hostName}` };
});

type UrlStage = { url: URL; queries: QueryKeyValue[] };

const toUrl = map<FormValues, UrlStage>((v) => {
  const url = new URL(v.hostName);
  return { url, queries: v.queries ?? [] };
});

const appendQueries = map<UrlStage, URL>(({ url, queries }) => {
  for (const q of queries) {
    const k = q.key?.trim();
    const val = q.value?.toString().trim();
    if (k && val) url.searchParams.append(k, val); // 若想同 key 覆蓋用 set
  }
  return url;
});

const toString$ = map<URL, string>((url) => url.toString());

const subscription = submit$
  .pipe(
    normalizeHost,
    toUrl,
    appendQueries,
    toString$,
    catchError(() => of('')) // 任一段出錯 => 回傳空字串
  )
  .subscribe((url: string) => {
    generatedUrl.value = url;
  });

onUnmounted(() => subscription.unsubscribe());

const onCloseResultPanelHandler = () => {
  generatedUrl.value = '';
};

watch(
  values,
  (val) => {
    saveFormValues(val);
  },
  { deep: true }
);
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
    <ResultPanel
      class="mt-5"
      :generated-url="generatedUrl"
      @on-close="onCloseResultPanelHandler"
    />
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
