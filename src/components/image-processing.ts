import { createHash } from "crypto";
import path from "path";
import fs from "fs/promises";
import sharp from "sharp";

// Constants
const CURRENT_VERSION = 2;
const DEFAULT_DEVICE_SIZES = [375, 500] as const;
const DEFAULT_RESOLUTIONS = [1] as const;

// File system paths
const rootDir = new URL("../../", import.meta.url).pathname;
const publicDir = path.join(rootDir, "public");
const distDir = path.join(rootDir, "dist");
const optimizedPrefix = "/assets/optimized-images";
const optimizedDir = path.join(distDir, optimizedPrefix);
const cacheDir = path.join(
  process.env.npm_config_cache || path.join(rootDir, ".cache"),
  "image-cache"
);

// Cache tracking
const promises = new Map<string, Promise<ImageMeta>>();

// Types
export interface ImageMeta {
  /** Metadata version for cache invalidation */
  version: number;
  /** Original source path */
  src: string;
  /** Hash of the original file */
  hash: string;
  /** Original dimensions */
  dimensions: {
    width: number;
    height: number;
  };
  /** Optimized versions info */
  formats: {
    webp: {
      /** Available widths and their file sizes */
      sizes: {
        [width: number]: {
          path: string;
          size: number;
        };
      };
    };
    /** AVIF is optional and only included if it provides better compression than WebP */
    avif?: {
      sizes: {
        [width: number]: {
          path: string;
          size: number;
        };
      };
    };
  };
}

interface GenerateOptions {
  deviceSizes?: number[];
  resolutions?: number[];
  /** CSS sizes attribute to determine required widths */
  sizes?: string;
}

interface SizesEntry {
  minWidth?: number; // undefined means no media query
  size: number; // size in pixels or viewport percentage
  isViewportRelative: boolean;
}

// Debug logging
console.log("Caching optimized images in", cacheDir);

async function listCache() {
  try {
    console.log("Cache contents:", await fs.readdir(cacheDir));
  } catch (e) {
    console.log("Failed to list cache contents.");
  }
}
listCache();

// Parsing functions
function parseSizes(sizes: string): SizesEntry[] {
  // Split on commas that are not inside parentheses
  const parts = sizes.split(/,(?![^(]*\))/);
  return parts.map((part) => {
    part = part.trim();
    const mediaMatch = part.match(/^\((min|max)-width:\s*(\d+)px\)\s+(.+)$/);
    if (mediaMatch) {
      const [, , width, size] = mediaMatch;
      const sizeMatch = size.match(/^([\d.]+)(px|vw)$/);
      if (!sizeMatch) throw new Error(`Invalid size in: '${size}'`);
      const [, value, unit] = sizeMatch;
      return {
        minWidth: parseInt(width, 10),
        size: parseInt(value, 10),
        isViewportRelative: unit === "vw",
      };
    } else {
      const sizeMatch = part.match(/^([\d.]+)(px|vw)$/);
      if (!sizeMatch) throw new Error(`Invalid size in: '${part}'`);
      const [, value, unit] = sizeMatch;
      return {
        size: parseInt(value, 10),
        isViewportRelative: unit === "vw",
      };
    }
  });
}

function simplifyWidths(widths: number[], minimumDifference = 0.2): number[] {
  const sorted = [...widths].sort((a, b) => a - b);
  if (sorted.length <= 2) return sorted;

  const result: number[] = [sorted[0]]; // Always keep smallest width

  // Simplify intermediate widths
  for (let i = 1; i < sorted.length - 1; i++) {
    const lastKept = result[result.length - 1];
    const current = sorted[i];

    if (current >= lastKept * (1 + minimumDifference)) {
      result.push(current);
    }
  }

  // Always keep largest width if not already included
  if (result[result.length - 1] !== sorted[sorted.length - 1]) {
    result.push(sorted[sorted.length - 1]);
  }

  return result;
}

function generateWidths(
  originalWidth: number,
  options?: GenerateOptions
): number[] {
  const deviceSizes = options?.deviceSizes ?? DEFAULT_DEVICE_SIZES;
  const resolutions = options?.resolutions ?? DEFAULT_RESOLUTIONS;
  const widths = new Set<number>();

  // Handle sizes attribute if provided
  if (options?.sizes) {
    try {
      const parsedSizes = parseSizes(options.sizes);

      // For a single fixed size (e.g. "300px"), just use that size
      if (parsedSizes.length === 1 && !parsedSizes[0].isViewportRelative) {
        const width = Math.min(parsedSizes[0].size, originalWidth);
        return [width];
      }

      // For responsive sizes, generate all needed widths
      for (const entry of parsedSizes) {
        if (entry.isViewportRelative) {
          // For viewport-relative sizes, use device sizes
          for (const size of deviceSizes) {
            for (const dpr of resolutions) {
              const width = Math.round((size * entry.size * dpr) / 100);
              if (width <= originalWidth) {
                widths.add(width);
              }
            }
          }
        } else {
          // For fixed sizes in media queries, use the exact size with resolutions
          for (const dpr of resolutions) {
            const width = entry.size * dpr;
            if (width <= originalWidth) {
              widths.add(width);
            }
          }
        }
      }
      const result = Array.from(widths).sort((a, b) => a - b);
      // If no widths were generated, use the original width
      return simplifyWidths(result.length > 0 ? result : [originalWidth]);
    } catch (e) {
      console.warn("Failed to parse sizes:", e);
    }
  }

  // Fallback to device sizes
  if (originalWidth < Math.min(...deviceSizes)) {
    // Use original width (smaller than device sizes)
    return [originalWidth];
  }

  for (const size of deviceSizes) {
    for (const dpr of resolutions) {
      const width = size * dpr;
      if (width <= originalWidth) {
        widths.add(width);
      }
    }
  }

  const result = Array.from(widths).sort((a, b) => a - b);
  // If no widths were generated, use the original width
  return simplifyWidths(result.length > 0 ? result : [originalWidth]);
}

// Cache management
async function computeFileHash(filePath: string): Promise<string> {
  const content = await fs.readFile(filePath);
  return createHash("sha256").update(content).digest("hex").slice(0, 12);
}

async function getCachedMeta(hash: string): Promise<ImageMeta | null> {
  try {
    const metaPath = path.join(cacheDir, `${hash}.json`);
    const meta = JSON.parse(await fs.readFile(metaPath, "utf-8")) as ImageMeta;
    // Discard cache if version doesn't match
    return meta.version === CURRENT_VERSION ? meta : null;
  } catch {
    return null;
  }
}

async function saveMeta(hash: string, meta: ImageMeta) {
  await fs.mkdir(cacheDir, { recursive: true });
  await fs.writeFile(path.join(cacheDir, `${hash}.json`), JSON.stringify(meta));
}

// Image processing
export interface ProcessOptions extends GenerateOptions {
  /** Original source path */
  src: string;
}

async function processImageMeta(options: ProcessOptions): Promise<ImageMeta> {
  const absolutePath = path.join(publicDir, options.src);
  const hash = await computeFileHash(absolutePath);

  // Load existing meta if available
  const existingMeta = await getCachedMeta(hash);
  const originalWidth =
    existingMeta?.dimensions.width ??
    (await sharp(absolutePath).metadata()).width!;

  // Generate and simplify target widths
  const targetWidths = generateWidths(originalWidth, options);

  // Check which widths we need to generate
  const missingWidths = targetWidths.filter(
    (width) => !existingMeta?.formats.webp.sizes[width]
  );

  // If we have all sizes we need, return filtered meta with only the widths we want
  if (existingMeta && missingWidths.length === 0) {
    try {
      // Copy required files to output directory
      await fs.mkdir(optimizedDir, { recursive: true });

      // Create filtered meta with only the widths we want
      const filteredMeta: ImageMeta = {
        ...existingMeta,
        formats: {
          webp: {
            sizes: {},
          },
        },
      };

      // Copy and include only the target widths
      for (const width of targetWidths) {
        const file = existingMeta.formats.webp.sizes[width];
        const webpPath = path.join(cacheDir, path.basename(file.path));
        await fs.access(webpPath);
        await fs.copyFile(
          webpPath,
          path.join(optimizedDir, path.basename(file.path))
        );
        filteredMeta.formats.webp.sizes[width] = file;
      }

      // Copy AVIF variants if they exist, but only for target widths
      if (existingMeta.formats.avif) {
        filteredMeta.formats.avif = { sizes: {} };
        for (const width of targetWidths) {
          const file = existingMeta.formats.avif.sizes[width];
          if (!file) continue;
          try {
            const avifPath = path.join(cacheDir, path.basename(file.path));
            await fs.access(avifPath);
            await fs.copyFile(
              avifPath,
              path.join(optimizedDir, path.basename(file.path))
            );
            filteredMeta.formats.avif.sizes[width] = file;
          } catch {
            // AVIF file missing from cache, skip this size
          }
        }
        // Remove AVIF format if no sizes remain
        if (Object.keys(filteredMeta.formats.avif.sizes).length === 0) {
          delete filteredMeta.formats.avif;
        }
      }

      console.log(
        `✓ Using cached ${path.basename(options.src)} [${targetWidths
          .map((w) => `${w}w`)
          .join(", ")}]`
      );
      return filteredMeta;
    } catch (err) {
      // Some files missing from cache, continue with generation
    }
  }

  // Start with existing meta or create new one
  const image = sharp(absolutePath);
  const metadata = await image.metadata();
  const baseName = path.basename(options.src, path.extname(options.src));

  const meta: ImageMeta = {
    version: CURRENT_VERSION,
    src: options.src,
    dimensions: {
      width: metadata.width!,
      height: metadata.height!,
    },
    hash,
    formats: {
      webp: {
        sizes: {},
      },
    },
  };

  // Ensure directories exist
  await fs.mkdir(optimizedDir, { recursive: true });
  await fs.mkdir(cacheDir, { recursive: true });

  // Generate missing widths
  const webpSizes: Record<number, number> = {};
  const avifSizes: Record<number, number> = {};

  for (const width of missingWidths) {
    const resized = image.clone().resize(width, null, {
      withoutEnlargement: true,
    });

    // Generate WebP
    const webpBuffer = await resized
      .webp({
        quality: metadata.format === "png" ? 90 : 75,
        effort: 4,
        lossless: metadata.format === "png",
      })
      .toBuffer();

    const webpFileName = `${baseName}.${hash}.${width}w.webp`;
    await fs.writeFile(path.join(optimizedDir, webpFileName), webpBuffer);
    await fs.writeFile(path.join(cacheDir, webpFileName), webpBuffer);

    meta.formats.webp.sizes[width] = {
      path: `${optimizedPrefix}/${webpFileName}`,
      size: webpBuffer.length,
    };
    webpSizes[width] = webpBuffer.length;

    // Generate AVIF
    const avifBuffer = await resized
      .avif({
        quality: metadata.format === "png" ? 90 : 65,
        effort: 5,
        chromaSubsampling: metadata.format === "png" ? "4:4:4" : "4:2:0",
      })
      .toBuffer();

    // Only save AVIF if it's smaller than WebP
    if (avifBuffer.length < webpBuffer.length) {
      const avifFileName = `${baseName}.${hash}.${width}w.avif`;
      await fs.writeFile(path.join(optimizedDir, avifFileName), avifBuffer);
      await fs.writeFile(path.join(cacheDir, avifFileName), avifBuffer);

      if (!meta.formats.avif) {
        meta.formats.avif = {
          sizes: {},
        };
      }
      meta.formats.avif.sizes[width] = {
        path: `${optimizedPrefix}/${avifFileName}`,
        size: avifBuffer.length,
      };
      avifSizes[width] = avifBuffer.length;
    }
  }

  // Copy existing widths that we want to keep
  if (existingMeta) {
    for (const width of targetWidths) {
      if (!missingWidths.includes(width)) {
        // Copy WebP
        const file = existingMeta.formats.webp.sizes[width];
        const webpPath = path.join(cacheDir, path.basename(file.path));
        await fs.copyFile(
          webpPath,
          path.join(optimizedDir, path.basename(file.path))
        );
        meta.formats.webp.sizes[width] = file;

        // Copy AVIF if it exists
        if (existingMeta.formats.avif?.sizes[width]) {
          const file = existingMeta.formats.avif.sizes[width];
          const avifPath = path.join(cacheDir, path.basename(file.path));
          try {
            await fs.copyFile(
              avifPath,
              path.join(optimizedDir, path.basename(file.path))
            );
            if (!meta.formats.avif) {
              meta.formats.avif = { sizes: {} };
            }
            meta.formats.avif.sizes[width] = file;
          } catch {
            // AVIF file missing from cache, skip
          }
        }
      }
    }
  }

  if (missingWidths.length > 0) {
    console.log(
      `✓ Generated ${path.basename(options.src)} [${missingWidths
        .map((w) => `${w}w`)
        .join(", ")}]`
    );
  } else {
    console.log(
      `✓ Using existing ${path.basename(options.src)} [${targetWidths
        .map((w) => `${w}w`)
        .join(", ")}]`
    );
  }

  await saveMeta(hash, meta);
  return meta;
}

export function getImageMeta(path: string, options?: GenerateOptions) {
  const key = options ? `${path}:${JSON.stringify(options)}` : path;
  if (promises.has(key)) {
    return promises.get(key)!;
  }
  const meta = processImageMeta({ src: path, ...options });
  promises.set(key, meta);
  return meta;
}
