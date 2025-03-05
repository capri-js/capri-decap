import { use, Suspense } from "react";
import {
  Icon as Iconify,
  IconifyIcon,
  IconProps,
  loadIcon,
} from "@iconify/react";

const cache = new Map<string, Promise<IconifyIcon | null>>();

export function getIcon(name: string) {
  if (cache.has(name)) {
    return cache.get(name)!;
  }
  const icon = loadIcon(name).catch((e) => null);
  cache.set(name, icon);
  return icon;
}

type Props = Omit<IconProps, "icon"> & { name: string };

function Wrapper({ name, ...props }: Props) {
  const icon = use(getIcon(name));
  return (
    icon && (
      <Iconify width="2em" {...props} icon={icon} ssr={import.meta.env.SSR} />
    )
  );
}

export function Icon(props: Props) {
  return (
    <Suspense fallback={<div />}>
      <Wrapper {...props} />
    </Suspense>
  );
}
