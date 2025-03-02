import { styled } from "classname-variants/react";

export const TwoCols = styled(
  "div",
  "grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-x-lg gap-y-sm lg:grid-rows-[auto_1fr] items-start *:col-start-1"
);

export const TwoColsRight = styled("div", {
  base: "lg:col-start-2 lg:row-span-2",
  variants: {
    align: {
      center: "self-center",
      top: "self-start",
      bottom: "self-end",
      stretch: "self-stretch flex",
    },
  },
  defaultVariants: {
    align: "center",
  },
});
