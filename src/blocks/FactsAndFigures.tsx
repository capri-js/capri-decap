import { Section } from "../components/Section";
import { Container } from "../components/Container";
import { Headline } from "../components/Headline";

import { block, field } from "../decaprio";
import { BlockProps } from "../collections";

const config = field({
  name: "FactsAndFigures",
  label: "Facts & Figures",
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
      label: "Facts",
      name: "facts",
      widget: "list",
      fields: [
        { label: "Label", name: "label", widget: "string" },
        {
          label: "Prefix",
          name: "prefix",
          widget: "string",
          required: false,
        },
        { label: "Number", name: "number", widget: "number" },
        { label: "Unit", name: "unit", widget: "string", required: false },
      ],
    },
  ],
});

type Props = BlockProps<typeof config>;

function FactsAndFigures({ headline, facts }: Props) {
  return (
    <Section color="gray">
      <Container>
        {headline && <Headline>{headline}</Headline>}
        <div className="grid md:grid-cols-3 gap-8">
          {facts?.map((fact, i) => (
            <FactsCard key={i} {...fact} />
          ))}
        </div>
      </Container>
    </Section>
  );
}

type Fact = Props["facts"][number];

function FactsCard({ prefix, number, unit, label }: Fact) {
  return (
    <div className="text-center p-8 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="text-4xl font-bold text-blue-600 mb-4">
        {prefix}
        {number}
        {unit}
      </div>
      <div className="text-lg text-gray-600">{label}</div>
    </div>
  );
}

export default block(config, FactsAndFigures);
