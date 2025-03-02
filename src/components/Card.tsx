import { Icon } from "../components/Icon";
import { OptimizedImage } from "./OptimizedImage";
import { styled } from "classname-variants/react";

type CardProps = {
  headline: string;
  text?: string;
  image: string;
  link?: { href: string };
  linkText?: string;
};

export function Card({
  headline,
  text,
  image,
  link,
  linkText = "Read More",
}: CardProps) {
  const wrapperProps = link
    ? ({ as: "a", href: link.href, hover: true } as const)
    : {};
  return (
    <CardWrapper {...wrapperProps}>
      <div className="md:max-lg:group-last:group-odd:row-span-3">
        <OptimizedImage src={image} alt="" />
      </div>
      <div className="p-4 md:max-lg:group-last:group-odd:row-span-2">
        <h3 className="text-lg">{headline}</h3>
        <div className="opacity-65">{text}</div>
      </div>
      <div className="self-end justify-end p-4 flex items-center font-semibold text-orange-600 group-hover:text-orange-400">
        {linkText} <Icon name="material-symbols-light:chevron-right" />
      </div>
    </CardWrapper>
  );
}

const CardWrapper = styled("div", {
  base: "group gap-0 grid grid-cols-subgrid grid-rows-subgrid row-span-3 rounded-lg overflow-clip bg-white max-md:col-span-2 md:max-lg:last:odd:col-span-2",
  variants: {
    hover: {
      true: "hover:scale-105 transition-all duration-300 will-change-transform",
    },
  },
});
