"use client";

import { useSprings, animated } from "@react-spring/web";
import { useRef } from "react";
import { useDrag } from "react-use-gesture";

import clamp from "lodash.clamp";
import swap from "lodash-move";

// they say it's a factory function for creating spring configs
const fn =
  (order: number[], active = false, originalIndex = 0, curIndex = 0, y = 0) =>
  (index: number) =>
    active && index === originalIndex
      ? {
          y: curIndex * 50 + y,
          scale: 1.1,
          zIndex: 1,
          shadow: 15,
          immediate: (key: string) => key === "y" || key === "zIndex", // makes overlap doesn't happen for some reason
        }
      : {
          y: order.indexOf(index) * 50,
          scale: 1,
          zIndex: 0,
          shadow: 1,
          immediate: false,
        };

function DraggableList({ items }: { items: string[] }) {
  const order = useRef(items.map((_, index) => index));

  const [springs, api] = useSprings(items.length, fn(order.current));

  const bind = useDrag(({ args: [originalIndex], active, movement: [, y] }) => {
    console.log("active", active);
    const curIndex = order.current.indexOf(originalIndex);
    const curRow = clamp(
      Math.round((curIndex * 100 + y) / 100),
      0,
      items.length - 1
    );
    const newOrder = swap(order.current, curIndex, curRow);
    api.start(fn(newOrder, active, originalIndex, curIndex, y));
    if (!active) {
      order.current = newOrder;
    }
  });

  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <div
        className="relative w-[200px] h-[100px]"
        style={{ height: items.length * 50 }}
      >
        {springs.map(({ zIndex, shadow, y, scale }, i) => (
          <animated.div
            {...bind(i)}
            key={i}
            className="absolute w-[200px] h-[40px] bg-blue-400 select-none"
            style={{
              zIndex,
              boxShadow: shadow.to(
                (s) => `rgba(0,0,0,0.15) 0px ${s}px ${2 * s}px  0px`
              ),
              y,
              scale,
            }}
            children={items[i]}
          />
        ))}
      </div>
    </div>
  );
}

export default function todolist() {
  return (
    <div className="relative w-[200px] h-[100px]">
      <DraggableList items={"Lorem ipsum dolor sit".split(" ")} />
    </div>
  );
}
