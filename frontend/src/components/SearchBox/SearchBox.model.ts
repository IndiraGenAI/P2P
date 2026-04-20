import React, { ChangeEvent } from "react";
export interface ISearchBoxProps {
  styleName: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  value: string;
}


export interface IPattern {
  pattern : RegExp;
  redirect : string;
  page_code : string;
}