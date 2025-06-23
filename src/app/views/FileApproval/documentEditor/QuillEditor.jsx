import React from "react";
import { useEffect } from "react";
import { useState } from "react";

const QuillEditor = () => {

  const [value, setValue] = useState("hello my name is aman bisht");

  // useEffect(() => {
  //   const sfdt = JSON.parse(localStorage.getItem("sfdt"))
  //   let text;
  //   sfdt.sections[0].blocks.map((sfdtObj,index)=>{
       
  //   })
  // }, []);

  // const handleChange = (content, delta, source, editor) => {
  //   console.log(editor.getContents())
  //   setValue(content);
  // };


  return <h4>hello</h4>
};

export default QuillEditor;
