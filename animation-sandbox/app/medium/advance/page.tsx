"use client"
import React from "react";
import { useSpring, animated } from "@react-spring/web";

const factor = 15;
const calc = (x, y) => [-(y - window.innerHeight / 2) / factor, (x - window.innerWidth / 2) / factor, 1.2]
const trans = (x, y, s) => `perspective(400px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`;

const cardContainerStyle = {
  margin: "auto",
  width: "30%",
  marginTop: "15vh"
};

export default function UseSpringDemoPage () {
  const [props, set] = useSpring(() => ({ xys: [0, 0, 1] }));
  return (
    <div style={cardContainerStyle}>
      <animated.div
        className="card"
        onMouseMove={({ clientX: x, clientY: y }) => set({ xys: calc(x, y) })}
        onMouseLeave={() => set({ xys: [0, 0, 1] })}
        style={{ transform: props.xys.to(trans) }}
      />
    </div>
  );
};