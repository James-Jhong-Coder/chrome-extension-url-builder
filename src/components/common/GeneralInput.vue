<script setup lang="ts">
import type { BaseFieldProps } from "vee-validate";
import { computed, type Ref } from "vue";
type VeeValidateAttrs =
  | Ref<BaseFieldProps & Record<string, unknown>>
  | (BaseFieldProps & Record<string, unknown>);

interface InputProps {
  modelValue?: string | number;
  name?: string;
  type?: "text";
  placeholder?: string;
  disabled?: boolean;
  errorMessage?: string;
  info?: string;
  veeValidateAttrs?: VeeValidateAttrs;
}

const props = withDefaults(defineProps<InputProps>(), {
  modelValue: "",
  type: "text",
  veeValidateAttrs: () => ({} as any),
});

const emit = defineEmits<{
  "update:modelValue": [val: string];
}>();

const onInput = (e: Event) => {
  const val = (e.target as HTMLInputElement).value;
  emit("update:modelValue", val);
};
const hasError = computed(() => {
  return !!props.errorMessage;
});
</script>

<template>
  <div class="flex flex-col">
    <div
      class="input-box"
      :class="{
        'has-error': hasError,
        disabled,
      }"
    >
      <input
        :type="type"
        v-bind="veeValidateAttrs"
        :placeholder="placeholder"
        :disabled="disabled"
        :value="modelValue"
        class="input"
        @input="onInput"
      />
    </div>
    <span v-if="hasError" class="mt-1 text-xs text-red-600">
      {{ errorMessage }}
    </span>
  </div>
</template>

<style scoped>
@reference "@/styles/global.css";
.input-box {
  @apply bg-gray-300;
  @apply rounded-md px-3 py-2;
  @apply text-xs;
  @apply border border-transparent; /* 預設先有透明邊框，避免跳動 */
  @apply transition-colors duration-200 ease-in-out; /* 加入漸變 */
}

.input-box .input {
  @apply w-full focus:outline-none;
}

.input-box .input::placeholder {
  @apply text-gray-520;
}

.input-box:focus-within {
  @apply border-gray-350;
}

.input-box.has-error {
  @apply border-red-600;
}

.input-box.disabled {
  @apply bg-gray-680;
  @apply cursor-not-allowed;
}
.input-box.disabled:focus-within {
  @apply bg-gray-680;
}
</style>
