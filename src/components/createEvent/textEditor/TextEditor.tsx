"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
interface IProps {
  onTextChangeHandler: (e: string) => void;
  enteredText: string;
}
export const TextEditor = ({ onTextChangeHandler, enteredText }: IProps) => {
  const quillRef = useRef(null);

  const miniModules = {
    toolbar: {
      container: [
        ["bold", "italic", "underline", "strike"],
        ["clean"],
        ["link"],
        [{ list: "ordered" }, { list: "bullet" }],
      ],
    },
    clipboard: {
      matchVisual: false,
    },
  };

  const formats = [
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "link",
  ];
  return (
    <ReactQuill
      //@ts-ignore
      ref={(el) => (quillRef.current = el)}
      modules={miniModules}
      formats={formats}
      theme="snow"
      value={enteredText}
      onChange={onTextChangeHandler}
    />
  );
};
