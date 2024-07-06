"use client"
import { useSpring, animated } from "@react-spring/web";
import React, { CSSProperties, FC } from "react";

const basicDemoPageStyle: CSSProperties = {
  width: "75%",
  margin: "auto"
};

const numberDemoStyle: CSSProperties = {
  textAlign: "center",
  fontFamily: "Lato",
  fontSize: "25px",
  marginTop: "1vw"
};

const opacityDemoStyle: CSSProperties = {
  textAlign: "center",
  fontFamily: "Lato",
  fontSize: "25px",
  marginTop: "5vw"
};

const svgDemoStyle: CSSProperties = {
  textAlign: "center",
  marginTop: "5vw"
};

const svgStyle = {
  height: "1455px",
  width: "750px"
};

export default function BasicDemoPage ({}) {
  // Defining the spring
  const numberDemoSpring = useSpring({ dogs: 10, from: { dogs: 0 } });
  const opacityDemoSpring = useSpring({ delay: 50, opacity: 1, from: { opacity: 0 }});
  const svgDemoSpring = useSpring({ x: 100, from: { x: 0 } });

  return (
    <div style={basicDemoPageStyle}>
      <div style={opacityDemoStyle}>
        <animated.div style={opacityDemoSpring}>Hello React-Spring</animated.div>
      </div>
      <div style={numberDemoStyle}>
        <animated.span>{numberDemoSpring.dogs}</animated.span>
      </div>
    </div>
  );
};