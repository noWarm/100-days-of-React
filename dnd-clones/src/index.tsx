import { render } from "react-dom";
import Example from "./example";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./index.css";
import 'react-toastify/dist/ReactToastify.css';
import { Slide, ToastContainer } from "react-toastify";

function App() {
  return (
    <div className="App">
      <DndProvider backend={HTML5Backend}>
        <Example />
        <ToastContainer
          position="bottom-right"
          theme="dark"
          transition={Slide}
          hideProgressBar
          autoClose={5000}
        />
      </DndProvider>
    </div>
  );
}

const rootElement = document.getElementById("root");
render(<App />, rootElement);
