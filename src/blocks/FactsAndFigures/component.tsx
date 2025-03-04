import { decaprio } from "../../content";
import { Section } from "../../components/Section";
import { Container } from "../../components/Container";
import { Headline } from "../../components/Headline";
import FactsAndFigures from "./index";

decaprio.registerBlock(FactsAndFigures, ({ headline, facts }) => (
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
));

//decaprio.blocks.FactsAndFigures

function FactsCard({ prefix, number, unit, label }: any) {
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
