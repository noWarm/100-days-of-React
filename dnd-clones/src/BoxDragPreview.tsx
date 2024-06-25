import type { CSSProperties, FC } from "react";
import { memo } from "react";

import { Box } from "./Box";


export interface BoxDragPreviewProps {
  title: string;
}

export interface BoxDragPreviewState {
  tickTock: any;
}

export const BoxDragPreview: FC<BoxDragPreviewProps> = memo(
  function BoxDragPreview({ title }) {

    return (
      <div className="w-min">
        <div className="h-6 bg-[#1B1F27] border-2 border-[#1B1F27]"></div>
        <Box title={title} preview />
      </div>
    );
  }
);
