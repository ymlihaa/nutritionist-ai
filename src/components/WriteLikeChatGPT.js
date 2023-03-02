import React, { useState, useEffect } from "react";

function WriteLikeChatGPT({ message }) {
  const [text, setText] = useState("");
  const [previousTime, setPreviousTime] = useState(null);
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const animate = (time) => {
      if (previousTime !== null && !isAnimationComplete) {
        const deltaTime = time - previousTime;
        const delay = 16; // Her 16 milisaniyede bir animasyon adımı yaparız.

        if (deltaTime > delay && currentIndex < message.length) {
          setText((prevText) => prevText + message[currentIndex]);
          setCurrentIndex((prevIndex) => prevIndex + 1);
        }
      }

      if (currentIndex >= message.length) {
        setIsAnimationComplete(true);
      }

      setPreviousTime(time);
    };

    if (!isAnimationComplete) {
      const request = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(request);
    }
  }, [previousTime, currentIndex, isAnimationComplete]);

  return <div>{text}</div>;
}

export default WriteLikeChatGPT;
