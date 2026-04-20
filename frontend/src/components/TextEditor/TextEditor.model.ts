interface OnChangeHandler {
  (e: any): void;
}

export interface IEditorProps {
  value: string;
  placeholder: string;
  onChange: OnChangeHandler;
  hasInitializedProp?: boolean;
}
