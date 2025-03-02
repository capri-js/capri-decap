import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { usePrevNextButtons } from "./usePrevNextButtons";
import { CircularButton } from "./Button";

export const options = {
  loading: "visible",
};

export default function Carousel({ children }: { children: React.ReactNode }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ container: "aside" });
  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);
  return (
    <div>
      <div className="overflow-x-clip pr-lg" ref={emblaRef}>
        {children}
      </div>
      <div className="container mt-sm">
        <div className="flex justify-end -mx-[4px]">
          <CircularButton
            aria-label="Zurück"
            onClick={onPrevButtonClick}
            disabled={prevBtnDisabled}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="27"
              height="27"
              viewBox="0 -960 960 960"
            >
              <path
                fill="currentColor"
                d="m406-481 177 177q9 9 8.5 21t-9.5 21q-9 9-21.5 9t-21.5-9L341-460q-5-5-7-10t-2-11q0-6 2-11t7-10l199-199q9-9 21.5-9t21.5 9q9 9 9 21.5t-9 21.5L406-481Z"
              ></path>
            </svg>
          </CircularButton>
          <CircularButton
            aria-label="Weiter"
            onClick={onNextButtonClick}
            disabled={nextBtnDisabled}
          >
            <svg width="27" height="27" viewBox="0 -960 960 960">
              <path
                fill="currentColor"
                d="M530-481 353-658q-9-9-8.5-21t9.5-21q9-9 21.5-9t21.5 9l198 198q5 5 7 10t2 11q0 6-2 11t-7 10L396-261q-9 9-21 8.5t-21-9.5q-9-9-9-21.5t9-21.5l176-176Z"
              ></path>
            </svg>
          </CircularButton>
        </div>
      </div>
    </div>
  );
}
