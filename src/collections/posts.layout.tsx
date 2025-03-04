import { decaprio } from "../content";
import { Footer } from "../components/Footer";
import { Prose } from "../components/Prose";
import { format } from "date-fns";
import posts from "./posts";

decaprio.registerLayout(posts, ({ title, date, image, body, settings }) => {
  const { mainNav, ...footerProps } = settings;
  return (
    <main className="min-h-screen bg-white">
      <title>{title}</title>

      <header className="relative w-full">
        {image && (
          <div className="relative h-[60vh] w-full overflow-hidden">
            <img
              src={image}
              alt={title}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        )}

        <div
          className={`container mx-auto px-4 ${
            image ? "relative -mt-32" : "pt-16"
          }`}
        >
          <div className="max-w-3xl mx-auto">
            <div className="backdrop-blur-lg bg-white/70 p-8 rounded-lg shadow-lg">
              {date && (
                <time className="text-sm font-medium text-gray-600 mb-2 block">
                  {format(new Date(date), "MMMM d, yyyy")}
                </time>
              )}
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                {title}
              </h1>
            </div>
          </div>
        </div>
      </header>

      <article className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <Prose>{body}</Prose>
        </div>
      </article>

      <Footer {...footerProps} />
    </main>
  );
});
