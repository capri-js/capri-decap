import FactsAndFigures from "./FactsAndFigures";
import FeatureGrid from "./FeatureGrid";
import PostsGrid from "./PostsGrid";
import PostsSlider from "./PostsSlider";
import TeaserGrid from "./TeaserGrid";
import TextAndImage from "./TextAndImage";
import { blocks } from "../decaprio";

export const { types, Blocks } = blocks(
  FactsAndFigures,
  FeatureGrid,
  PostsGrid,
  PostsSlider,
  TeaserGrid,
  TextAndImage
);
