import { useEffect } from "react";

const useClickOutside = (ref: any, callback: any) => {
  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target)) {
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      // Cleanup
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });
};

export default useClickOutside;