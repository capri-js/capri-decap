import { Icon } from "../components/Icon";
import { styled } from "classname-variants/react";

export const Button = styled("button", {
  base: "inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-colors",
  variants: {
    variant: {
      primary:
        "bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md",
      secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
      outline:
        "border-2 border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-900",
    },
    size: {
      sm: "text-sm px-4 py-2",
      md: "text-base px-6 py-3",
      lg: "text-lg px-8 py-4",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

export const CircularButton = styled("button", {
  base: "inline-flex items-center justify-center aspect-square rounded-full no-underline transition-colors duration-300 whitespace-nowrap h-12 w-12 bg-clip-padding border-4 border-transparent bg-gray-500 opacity-60 hover:opacity-100 transition-opacity disabled:bg-gray-300 disabled:text-gray-500",
  variants: {},
});

export function IconButton({
  children,
  icon = "arrow_right_alt",
  ...props
}: {
  children: React.ReactNode;
  Icon?: React.ElementType;
} & React.ComponentProps<typeof Button>) {
  return (
    <Button {...props}>
      {children}
      <Icon name={icon} />
    </Button>
  );
}
