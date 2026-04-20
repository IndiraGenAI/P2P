import { startTransition } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";

export function useStartTransition() {
  const navigate: NavigateFunction = useNavigate();

  return (path: string | number) => {
    startTransition(() => {
      if (typeof path === "number") {
        navigate(path);
      } else {
        navigate(path);
      }
    });
  };
}
