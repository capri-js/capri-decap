import Markdown from "markdown-to-jsx";
import { LinkButton } from "./Button";
import { styled } from "classname-variants/react";
import { ComponentPropsWithoutRef, Fragment } from "react";

const options = {
  wrapper: Fragment,
  overrides: {
    LinkButton: {
      component: LinkButton,
    },
  },
};

type Props = ComponentPropsWithoutRef<typeof Wrapper>;
export function Prose({ children, ...props }: Props) {
  if (!children) return null;
  return (
    <Wrapper {...props}>
      <Markdown options={options}>{children.replaceAll("\\\n", "\n")}</Markdown>
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
