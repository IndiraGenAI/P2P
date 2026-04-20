import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { IEditorCommonProps } from "./TextEditorCommon.model";

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "code"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "code",
];

const TextEditorCommon: React.FC<IEditorCommonProps> = ({
  value,
  onChange,
  placeholder,
}) => {
  const handleOnChange = (newValue:string) => {
    if (newValue.replace(/<(.|\n)*?>/g, "").trim().length === 0) {
      newValue = ""; 
    }
    onChange(newValue);
  }
  return (
    <>
      <ReactQuill
        theme="snow"
        value={value || ""}
        modules={modules}
        formats={formats}
        onChange={handleOnChange}
        placeholder={placeholder || ""}
      />
    </>
  );
};

export default TextEditorCommon;
