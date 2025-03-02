import { styled } from "classname-variants/react";

const color = {
  default: "bg-white [.bg-white_+_&]:pt-0",
  gray: "bg-gray-50 [.bg-gray-50_+_&]:pt-0",
} as const;

export const Section = styled("section", {
  base: "py-24",
  variants: {
    color,
  },
  defaultVariants: {
    color: "default",
  },
});
