import { memo } from "react";
import { styled } from "classname-variants/react";
import { Image } from "@capri-js/image";

import { IconButton } from "./Button";
import Carousel from "./Carousel.island";
import { PostsSliderProps } from "../blocks/PostsSlider";

export const PostsSlider = memo(function PostsSlider({
  posts,
}: PostsSliderProps) {
  return (
    <section className="mb-lg">
      <Carousel>
        <SlideContainer small>
          {posts?.map(({ title, slug, image }, i) => (
            <div key={i} className="rounded-lg p-md">
              <div className="flex flex-col gap-sm hyphens-auto">
                <h3 className="text-heading-sm">{title}</h3>
                {image && (
                  <Image
                    src={image}
                    sizes="300px"
                    alt=""
                    className="mix-blend-lighten max-w-sm mx-auto flex-1"
                  />
                )}
                <div>
                  <IconButton
                    as="a"
                    href={slug && `/referenz/${slug}`}
                    fullWidth
                  >
                    Read More
                  </IconButton>
                </div>
              </div>
            </div>
          ))}
        </SlideContainer>
      </Carousel>
    </section>
  );
});

const SlideContainer = styled("aside", {
  base: "flex px-sm md:px-lg gap-sm md:gap-lg select-none *:flex *:shrink-0 *:flex-grow-0 *:basis-[80vw] *:max-w-[775px]",
  variants: {
    small: {
      true: "*:basis-[min(400px,80vw)]",
      false: "*:basis-[80vw]",
    },
  },
});
