interface OnChangeHandler {
  (e: any): void;
}

export interface IEditorCommonProps {
  value: string;
  placeholder: string;
  onChange: OnChangeHandler;
  hasInitializedProp?: boolean;
}
