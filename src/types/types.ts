export interface QueryKeyValue {
  id?: string;
  key?: string;
  value?: string;
}

export interface QueryItem extends QueryKeyValue {
  canDelete?: boolean;
}

/** 只能改這兩個欄位 */
export type EditableKey = 'key' | 'value';

/** 子元件 patch 事件的 payload */
export type UpdatePayload<K extends EditableKey = EditableKey> = {
  key: K;
  value: QueryItem[K];
};
