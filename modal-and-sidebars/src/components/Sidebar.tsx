import { FC } from "react";
import { isSideBarVisibleAtom } from "../App";
import { useAtom } from "jotai";

export const SideBar: FC = () => {
  const [isSideBarVisible, setIsSideBarVisible] = useAtom(isSideBarVisibleAtom);

  return (
    <div
      className={`absolute left-0 top-0 border-r border-[#747476] w-64 h-screen transition-all ease-in-out duration-200 bg-[#282c34] rounded-r-lg  ${
        isSideBarVisible ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex justify-end p-4">
        <div className="flex justify-center items-center p-2 border border-[#747476] rounded-md bg-[#454a55]">
          <svg
            onClick={() => {
              setIsSideBarVisible(false);
            }}
            className="w-6 h-6 fill-[#6b717e] hover:fill-white transition"
            width="24"
            height="24"
            viewBox="0 0 256 256"
            id="Flat"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M208.48535,191.51465a12.0001,12.0001,0,0,1-16.9707,16.9707L128,144.9707,64.48535,208.48535a12.0001,12.0001,0,0,1-16.9707-16.9707L111.0293,128,47.51465,64.48535a12.0001,12.0001,0,0,1,16.9707-16.9707L128,111.0293l63.51465-63.51465a12.0001,12.0001,0,0,1,16.9707,16.9707L144.9707,128Z" />
          </svg>
        </div>
      </div>
    </div>
  );
};
