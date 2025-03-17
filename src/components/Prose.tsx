import { ComponentPropsWithoutRef } from "react";
import { styled } from "classname-variants/react";
import { Markdown } from "../markdown";

type Props = ComponentPropsWithoutRef<typeof Wrapper>;
export function Prose({ children, ...props }: Props) {
  if (!children) return null;
  return (
    <Wrapper {...props}>
      <Markdown content={children} />
    </Wrapper>
  );
}

const Wrapper = styled("div", {
  base: "prose whitespace-pre-wrap",
  variants: {
    dimmed: {
      true: "opacity-65",
    },
    smallHeadings: {
      true: "small-headings",
    },
  },
});
