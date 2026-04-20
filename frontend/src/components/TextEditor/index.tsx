import React, { useRef } from "react";
import ReactQuill from "react-quill";
import { IEditorProps } from "./TextEditor.model";
import "react-quill/dist/quill.snow.css";

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

const TextEditor: React.FC<IEditorProps> = ({
  value,
  onChange,
  placeholder,
  hasInitializedProp = false,
}) => {
  const hasInitialized = useRef(hasInitializedProp);

  const handleOnChange = (newValue: string) => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      return;
    }

    if (newValue.replace(/<(.|\n)*?>/g, "").trim().length === 0) {
      newValue = "";
    }
    onChange(newValue);
  };

  return (
    <ReactQuill
      theme="snow"
      value={value || ""}
      modules={modules}
      formats={formats}
      onChange={handleOnChange}
      placeholder={placeholder || ""}
    />
  );
};

export default TextEditor;
