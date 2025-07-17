import { useContext } from "react";
import { DogContext } from "../Components/DogProvider";

export const useDogContext = () => {
  const context = useContext(DogContext);
  if (!context) {
    throw new Error("Context is not defined");
  }
  return context;
}; 