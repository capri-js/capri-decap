import { block, field } from "decaprio";

import { Grid } from "../components/Grid";
import { Section } from "../components/Section";
import { Container } from "../components/Container";
import { Card } from "../components/Card";
import { Headline } from "../components/Headline";
import { BlockProps } from "../collections";

const config = field({
  label: "Teaser-Grid",
  name: "TeaserGrid",
  widget: "object",
  fields: [
    { label: "Headline", name: "headline", widget: "string" },
    {
      label: "Teasers",
      name: "teasers",
      widget: "list",
      fields: [
        { label: "Headline", name: "headline", widget: "string" },
        { label: "Image", name: "image", widget: "image" },
        { label: "Text", name: "text", widget: "text" },
        {
          label: "Link",
          name: "link",
          widget: "relation",
          collection: "pages",
          search_fields: ["title"],
          display_fields: ["title", "path"],
          value_field: "{{slug}}",
          required: false,
        },
        {
          label: "Link Text",
          name: "linkText",
          widget: "string",
          required: false,
        },
      ],
    },
  ],
});

type Props = BlockProps<typeof config>;

function TeaserGrid({ headline, teasers }: Props) {
  return (
    <Section color="gray">
      <Container>
        {headline && <Headline>{headline}</Headline>}
        <Grid>
          {teasers.map((teaser, i) => (
            <Card key={i} {...teaser} />
          ))}
        </Grid>
      </Container>
    </Section>
  );
}

export default block(config, TeaserGrid);
