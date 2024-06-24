import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DnDCanvas from "./DnDCanvas.tsx";
import { Slide, ToastContainer } from "react-toastify";

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <DnDCanvas></DnDCanvas>
      <ToastContainer
        position="bottom-right"
        theme="dark"
        transition={Slide}
        hideProgressBar
        autoClose={5000}
      />
    </DndProvider>
  );
}

export default App;
