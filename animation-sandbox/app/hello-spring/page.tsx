"use client";
import { animated, useSpring } from "@react-spring/web";
import { useState } from "react";
export default function HelloSpring() {
  const [toRight, setToRight] = useState(true);
  const [springs, api] = useSpring(() => ({
    from: { x: 0 },
  }));

  const springsWithConfig = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    delay: 5000,
  });

  const handleClick = () => {
    if (toRight) {
      api.start({
        from: {
          x: 0,
        },
        to: {
          x: 100,
        },
      });
    } else {
      api.start({
        from: {
          x: 100,
        },
        to: {
          x: 0,
        },
      });
    }
    setToRight(!toRight);
  };

  return (
    <div>
      <animated.div
        onClick={handleClick}
        style={{
          width: 80,
          height: 80,
          background: "#ff6d6d",
          borderRadius: 8,
          ...springs,
        }}
      />

      <animated.div style={{ ...springsWithConfig }}>
        <p>I love dogs.</p>
      </animated.div>
    </div>
  );
}
