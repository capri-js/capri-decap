import { decaprio } from "../../content";
import { Icon } from "../../components/Icon";
import { Section } from "../../components/Section";
import { Container } from "../../components/Container";
import { Headline } from "../../components/Headline";
import FeatureGrid from "./index";

decaprio.registerBlock(FeatureGrid, ({ headline, features }) => (
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
));

//type Feature = FeatureGridProps["features"][number];

function FeatureCard({ headline, text, icon }: any) {
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
