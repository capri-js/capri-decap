import { OptimizedImage } from "../components/OptimizedImage";
import { Prose } from "../components/Prose";
import { Section } from "../components/Section";
import { Container } from "../components/Container";

import { BlockProps } from "../collections";
import { block, field } from "../decaprio";

const config = field({
  label: "Text & Image",
  name: "TextAndImage",
  widget: "object",
  fields: [
    {
      label: "Headline",
      name: "headline",
      widget: "string",
      required: false,
    },
    {
      label: "Content",
      name: "content",
      widget: "markdown",
      buttons: ["bold", "italic", "bulleted-list", "numbered-list", "link"],
      editor_components: ["link-button"],
    },
    { label: "Image", name: "image", widget: "image", required: false },
  ],
});

type Props = BlockProps<typeof config>;

export function TextAndImage({ headline, content, image }: Props) {
  return (
    <Section>
      <Container>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            {headline && (
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {headline}
              </h2>
            )}
            {content && <Prose>{content}</Prose>}
          </div>
          {image && (
            <div className="order-first md:order-last">
              <OptimizedImage
                src={image}
                alt=""
                className="rounded-lg shadow-lg"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
}

export default block(config, TextAndImage);
