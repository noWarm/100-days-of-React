import logo from "./logo.svg";
import "./App.css";
import { createContext, useState } from "react";
import { SideBar } from "./components/Sidebar";

export const SideBarDisplayContext = createContext<{
  isSideBarVisible: boolean;
  setIsSideBarVisible: (value: boolean) => void;
}>({
  isSideBarVisible: false,
  setIsSideBarVisible: () => {},
});

function App() {
  const [isSideBarVisible, setIsSideBarVisible] = useState(false);

  return (
    <SideBarDisplayContext.Provider
      value={{ isSideBarVisible, setIsSideBarVisible }}
    >
      <div className="App h-screen flex flex-col w-screen">
        <SideBar />
        <div
          id="nav"
          className={`shrink transition-all ease-in-out flex p-4 ${
            isSideBarVisible ? "  bg-[#434853]" : "bg-[#282c34]"
          }`}
        >
          <div className="flex justify-center items-center p-2 border border-[#747476] rounded-md bg-[#454a55]">
            <svg
              onClick={() => setIsSideBarVisible(true)}
              className="w-6 h-6 fill-[#6b717e] hover:fill-white transition"
              width="24"
              height="24"
              viewBox="0 0 20 20"
              id="Flat"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M19 4a1 1 0 01-1 1H2a1 1 0 010-2h16a1 1 0 011 1zm0 6a1 1 0 01-1 1H2a1 1 0 110-2h16a1 1 0 011 1zm-1 7a1 1 0 100-2H2a1 1 0 100 2h16z" />
            </svg>
          </div>
        </div>
        <header
          className={`flex flex-col items-center justify-center grow transition-all ease-in-out ${
            isSideBarVisible ? " bg-[#434853] text-[#b0b0b0]" : " bg-[#282c34] text-white"
          }`}
        >
          <div className="w-max">
            <img src={logo} className="App-logo" alt="logo" />
          </div>
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    </SideBarDisplayContext.Provider>
  );
}

export default App;
