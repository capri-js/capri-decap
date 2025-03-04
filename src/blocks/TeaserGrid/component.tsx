import { decaprio } from "../../content";
import { Grid } from "../../components/Grid";
import { Section } from "../../components/Section";
import { Container } from "../../components/Container";
import { Card } from "../../components/Card";
import { Headline } from "../../components/Headline";
import TeaserGrid from "./index";

decaprio.registerBlock(TeaserGrid, ({ headline, teasers }) => (
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
));
