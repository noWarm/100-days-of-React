"use client";
import { animated, useSprings } from "@react-spring/web";
import { useState } from "react";

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

function getNormalArray(n: number) {
  return Array.from({ length: n }, (_, i) => i);
}

function getRandomArray(n: number) {
  let x = [];
  let arr = getNormalArray(n);
  while (arr.length > 0) {
    let randIdx = getRandomInt(arr.length);
    x.push(arr[randIdx]);
    arr.splice(randIdx, 1);
  }
  return x;
}

function isDiffArr(arr1: number[], arr2: number[]) {
  if (arr1.length != arr2.length) return true;
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] != arr2[i]) return true;
  }
  return false;
}

export default function JoSprings() {
  const initialCoords = [
    { x: 0, y: 0 },
    { x: 0, y: 100 },
    { x: 100, y: 100 },
  ];
  const [coord, setCoord] = useState<{ x: number; y: number }[]>(initialCoords);

  const [springs, api] = useSprings(3, (i) => ({
    from: {
      x: coord[i].x,
      y: coord[i].y,
    },
  }));


  const resetBoxes = () => {
    api.start((i) => ({
      to: { ...initialCoords[i] },
    }));
  };

  const swapBoxes = () => {
    let newCoord = [coord[1], coord[0]];

    api.start((i) => {
      return {
        from: { ...coord[i] },
        to: { ...newCoord[i] },
      };
    });

    setCoord(newCoord);
  };

  const randomSwapBoxes = () => {
    let swapOrder = getRandomArray(3);
    const prevOrder = getNormalArray(3);
    while (!isDiffArr(swapOrder, prevOrder)) {
      swapOrder = getRandomArray(3);
    }

    const newCoord: { x: number; y: number }[] = [];
    for (let i = 0; i < 3; i++) {
      newCoord.push(coord[swapOrder[i]]);
    }
    api.start((i) => {
      return {
        from: { ...coord[i] },
        to: { ...newCoord[i] },
      };
    });

    setCoord(newCoord);
  };

  const backBoxes = () => {
    api.start((i) => ({
      to: { x: i * 100 },
    }));
  };

  return (
    <div>
      <div className="p-4 relative">
        <animated.div style={springs[0]} className="absolute">
          <div className="w-max h-min p-2 bg-red-500">A</div>
        </animated.div>

        <animated.div style={springs[1]} className="absolute">
          <div className="w-max h-min p-2 bg-blue-500">B</div>
        </animated.div>

        <animated.div style={springs[2]} className="absolute">
          <div className="w-max h-min p-2 bg-green-500">C</div>
        </animated.div>
      </div>
      <div className="my-44">
        <button className="border border-black" onClick={resetBoxes}>
          RESET
        </button>
        <button className="border border-black" onClick={randomSwapBoxes}>
          RANDOM SWAP
        </button>
      </div>
    </div>
  );
}
