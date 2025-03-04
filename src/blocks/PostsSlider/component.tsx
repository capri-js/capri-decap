import { decaprio } from "../../content";
import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { OptimizedImage } from "../../components/OptimizedImage";
import { Section } from "../../components/Section";
import { Container } from "../../components/Container";
import { Headline } from "../../components/Headline";
import { Icon } from "../../components/Icon";
import PostsSlider from "./index";

decaprio.registerBlock(PostsSlider, ({ headline, posts }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <Section color="gray">
      <Container>
        {headline && <Headline>{headline}</Headline>}
        <div className="relative">
          <div className="overflow-hidden -mx-4 px-4" ref={emblaRef}>
            <div className="flex -mx-3">
              {posts?.map(({ title, summary, image, href }, i) => (
                <div
                  key={i}
                  className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] px-3"
                >
                  <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow h-full">
                    {image && (
                      <div className="aspect-w-16 aspect-h-9 rounded-t-lg overflow-hidden">
                        <OptimizedImage
                          src={image}
                          alt=""
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        {title}
                      </h3>
                      <p className="text-gray-600">{summary}</p>
                      <div>
                        <a
                          href={href}
                          className="text-gray-600 hover:text-gray-900 transition-colors"
                        >
                          Read more
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={scrollPrev}
            className="absolute -left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Icon name="material-symbols-light:chevron-left" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Icon name="material-symbols-light:chevron-right" />
          </button>
        </div>
      </Container>
    </Section>
  );
});
