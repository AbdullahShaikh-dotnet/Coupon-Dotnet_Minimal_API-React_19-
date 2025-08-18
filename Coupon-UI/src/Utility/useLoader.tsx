import { useState, useEffect } from "react";

const useLoader = (isLoading: boolean) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isLoading) {
      setProgress(0);
      const timer = setInterval(() => {
        setProgress((prev) => {
          // slowly increment until ~90%
          if (prev >= 90) return prev;
          return prev + 1;
        });
      }, 400);
      return () => clearInterval(timer);
    } else {
      setProgress(0);
    }
  }, [isLoading]);

  return progress;
};

export default useLoader;
