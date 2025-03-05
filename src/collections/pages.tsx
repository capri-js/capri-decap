import { LayoutProps } from "./index";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { Headline } from "../components/Headline";
import { Prose } from "../components/Prose";

import { collection, layout } from "../decaprio";
import { types } from "../blocks";

const config = collection({
  name: "pages",
  label: "Pages",
  label_singular: "Page",
  preview_path: "{{slug}}",
  extension: "yml",
  editor: {
    visualEditing: true,
  },
  /* nested: {
    depth: 100,
    subfolders: false,
  }, */
  //meta: { path: { widget: "string", label: "Path", index_file: "index" } },
  fields: [
    { label: "Title", name: "title", widget: "string" },
    {
      label: "Meta Description",
      name: "description",
      widget: "text",
      required: false,
      hint: "If empty, the first paragraph of the intro text will be used.",
    },
    {
      label: "Overline",
      name: "overline",
      widget: "string",
      required: false,
    },
    {
      label: "Headline",
      name: "headline",
      widget: "string",
      required: false,
    },
    {
      label: "Intro",
      name: "intro",
      widget: "markdown",
      buttons: ["bold", "italic", "bulleted-list", "numbered-list"],
      editor_components: [],
      required: false,
    },
    { label: "Image", name: "image", widget: "image", required: false },
    {
      name: "sections",
      label: "Sections",
      label_singular: "Section",
      widget: "list",
      types,
    },
    {
      name: "settings",
      widget: "hidden",
      hint: "load(settings,settings)",
    },
  ],
});

type Props = LayoutProps<typeof config>;

function Page({ headline, intro, sections, description, settings }: Props) {
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

export default layout(config, Page);
