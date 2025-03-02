import { use, Suspense } from "react";
import type { ImageMeta } from "./image-processing";

interface ImageProps
  extends Omit<
    React.ImgHTMLAttributes<HTMLImageElement>,
    "width" | "height" | "sizes" | "srcSet"
  > {
  src: string;
  alt: string;
  /** CSS sizes attribute, defaults to "(min-width: 500px) 500px, 100vw" */
  sizes?: string;
  /** Device widths to generate images for */
  deviceSizes?: number[];
  /** Device pixel ratios to generate images for */
  resolutions?: number[];
  /** Optional callback to add additional attributes based on the src */
  attributes?: (src: string) => React.ImgHTMLAttributes<HTMLImageElement>;
}

// SSR image metadata loading
async function getImageMetaSSR(
  path: string,
  options?: {
    deviceSizes?: number[];
    resolutions?: number[];
    sizes?: string;
  }
): Promise<ImageMeta | null> {
  if (import.meta.env.SSR) {
    const { getImageMeta } = await import("./image-processing");
    return getImageMeta(path, options);
  }
  return null;
}

// Helper functions
function getAvailableWidths(meta: ImageMeta): number[] {
  return Object.keys(meta.formats.webp.sizes)
    .map(Number)
    .sort((a, b) => a - b);
}

function parseFixedSize(sizes: string): number | null {
  const match = sizes.match(/^(\d+)px$/);
  return match ? parseInt(match[1], 10) : null;
}

function generateSrcSet(meta: ImageMeta, widths: number[]): string {
  return widths
    .map((w) => `${meta.formats.webp.sizes[w].path} ${w}w`)
    .join(", ");
}

export function OptimizedImage({
  src,
  attributes,
  loading = "lazy",
  sizes = "(min-width: 500px) 500px, 100vw",
  deviceSizes,
  resolutions,
  ...props
}: ImageProps) {
  if (!src) {
    console.error("OptimizedImage: src is required");
    return <img src="" {...props} />;
  }
  const meta =
    import.meta.env.SSR &&
    use(getImageMetaSSR(src, { deviceSizes, resolutions, sizes }));

  // On client or when meta is not available, use original src
  if (!meta) {
    const attr = attributes?.(src) ?? {};
    return <img src={src} loading={loading} {...props} {...attr} />;
  }

  // Get available widths and determine if we have a single fixed size
  const availableWidths = getAvailableWidths(meta);
  const smallestWidth = availableWidths[0];
  const smallestPath = meta.formats.webp.sizes[smallestWidth].path;
  const attr = attributes?.(smallestPath) ?? {};

  // Check if we're dealing with a single fixed size
  const requestedWidth = parseFixedSize(sizes);
  const isSingleFixedSize =
    requestedWidth && availableWidths.includes(requestedWidth);

  if (isSingleFixedSize) {
    const path = meta.formats.webp.sizes[requestedWidth!].path;
    return (
      <Suspense>
        <img
          src={path}
          loading={loading}
          {...props}
          {...meta.dimensions}
          {...attr}
        />
      </Suspense>
    );
  }

  // Generate srcset from available sizes
  const srcSet = generateSrcSet(meta, availableWidths);

  return (
    <Suspense>
      <img
        src={smallestPath}
        srcSet={srcSet}
        sizes={sizes}
        loading={loading}
        {...props}
        {...meta.dimensions}
        {...attr}
      />
    </Suspense>
  );
}
