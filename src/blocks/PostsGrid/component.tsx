import { decaprio } from "../../content";
import { Section } from "../../components/Section";
import { Container } from "../../components/Container";
import { Grid } from "../../components/Grid";
import { Card } from "../../components/Card";
import { Headline } from "../../components/Headline";
import { Pagination } from "../../components/Pagination";
import PostsGrid from ".";

const POSTS_PER_PAGE = 9;

decaprio.registerBlock(PostsGrid, ({ headline, posts /* page = 1 */ }) => {
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const page = 1;
  const start = (page - 1) * POSTS_PER_PAGE;
  const end = start + POSTS_PER_PAGE;
  const visiblePosts = posts.slice(start, end);
  console.log(posts);
  return (
    <Section color="gray">
      <Container>
        {headline && <Headline>{headline}</Headline>}
        <Grid>
          {visiblePosts.map(({ title, summary, image, href }, i) => (
            <Card
              key={i}
              headline={title}
              text={summary}
              image={image ?? ""}
              link={{ href }}
            />
          ))}
        </Grid>
        {totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            baseUrl="/blog"
          />
        )}
      </Container>
    </Section>
  );
});
