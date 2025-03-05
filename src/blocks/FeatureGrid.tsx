import { Icon } from "../components/Icon";
import { Section } from "../components/Section";
import { Container } from "../components/Container";
import { Headline } from "../components/Headline";

import { block, field } from "../decaprio";
import { BlockProps } from "../collections";

const config = field({
  label: "Feature-Grid",
  name: "FeatureGrid",
  widget: "object",
  fields: [
    { label: "Headline", name: "headline", widget: "string" },
    {
      label: "Text",
      name: "text",
      widget: "markdown",
      buttons: ["bold"],
      editor_components: [],
      required: false,
    },
    {
      label: "Features",
      name: "features",
      widget: "list",
      fields: [
        {
          label: "Icon",
          name: "icon",
          widget: "icon",
          required: true,
          index_file: "",
          meta: false,
        },
        { label: "Headline", name: "headline", widget: "string" },
        {
          label: "Text",
          name: "text",
          widget: "text",
        },
      ],
    },
  ],
});

type Props = BlockProps<typeof config>;

function FeatureGrid({ headline, features }: Props) {
  return (
    <Section color="gray">
      <Container>
        {headline && <Headline>{headline}</Headline>}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features?.map((feature, i) => (
            <FeatureCard key={i} {...feature} />
          ))}
        </div>
      </Container>
    </Section>
  );
}

type Feature = Props["features"][number];

function FeatureCard({ headline, text, icon }: Feature) {
  return (
    <div className="bg-white rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow">
      {icon && (
        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4">
          <Icon name={icon} />
        </div>
      )}
      {headline && (
        <h3 className="text-xl font-semibold text-gray-900 mb-3">{headline}</h3>
      )}
      {text && <p className="text-gray-600">{text}</p>}
    </div>
  );
}

export default block(config, FeatureGrid);
