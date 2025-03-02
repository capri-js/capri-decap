import { useEffect, useMemo, useRef, useState } from "react";

export const options = {
  loading: "visible",
};

const easeOutExpo = (t: number) => {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
};

const frameRate = 1000 / 60;

function useScrollTriggeredCountUp(
  ref: React.RefObject<HTMLElement | null>,
  number: number,
  duration = 2000
) {
  const isCounting = useRef(false);

  const format = useMemo(() => {
    const digits = number.toString().split(".")[1]?.length || 0;
    return (v: number) => v.toFixed(digits).replace(".", ",");
  }, [number]);

  const [count, setCount] = useState(format(number));

  useEffect(() => {
    if (!isNaN(number) && number > 1) {
      const totalFrames = Math.round(duration / frameRate);

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !isCounting.current) {
            isCounting.current = true;
            let frame = 0;

            const counter = setInterval(() => {
              frame++;
              const progress = easeOutExpo(frame / totalFrames);
              setCount(format(number * progress));

              if (frame === totalFrames) {
                clearInterval(counter);
                isCounting.current = false;
              }
            }, frameRate);
          } else {
            isCounting.current = false;
            setCount("0");
          }
        },
        { threshold: 0.7 }
      );
      const currentRef = ref.current;

      if (currentRef) {
        observer.observe(currentRef);
      }

      return () => {
        if (currentRef) {
          observer.unobserve(currentRef);
        }
      };
    }
  }, [number, duration, ref]);

  return count;
}

export default function CountUp({
  number,
  duration = 2000,
  className,
}: {
  className?: string;
  number: number | string;
  duration?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const count = useScrollTriggeredCountUp(ref, Number(number), duration);
  return (
    <div
      ref={ref}
      className={className}
      style={{ fontVariantNumeric: "tabular-nums" }}
    >
      {count}
    </div>
  );
}
