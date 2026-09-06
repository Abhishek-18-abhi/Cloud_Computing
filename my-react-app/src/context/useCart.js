import { useContext } from "react";
import { CartContext } from "./CartStore";

export function useCart() {
  return useContext(CartContext);
}
