import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { Headline } from "../components/Headline";
import { Prose } from "../components/Prose";
import { decaprio } from "../content";
import pages from "./pages";

decaprio.registerLayout(
  pages,
  ({ headline, intro, sections, description, settings }) => {
    const { mainNav, ...footerProps } = settings;
    return (
      <>
        <Header mainNav={mainNav}>
          <Headline>{headline}</Headline>
          {intro && (
            <div className="mt-8 text-xl text-gray-600 max-w-2xl">
              <Prose>{intro}</Prose>
            </div>
          )}
        </Header>

        <main>
          {sections?.map((section, i) => {
            let Section: any; //TODO
            return Section ? (
              <Section key={i} {...(section as any)} />
            ) : (
              <div key={i} className="container mx-auto px-4 py-24">
                Unknown section type: {section.type}
              </div>
            );
          })}
        </main>

        <Footer {...footerProps} />
      </>
    );
  }
);
