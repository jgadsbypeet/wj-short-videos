import booktrust from "../content/articles/booktrust.md?raw";
import charityRebrands from "../content/articles/charity-rebrands.md?raw";
import digitalMaturity from "../content/articles/digital-maturity.md?raw";
import paulHamlyn from "../content/articles/paul-hamlyn-foundation.md?raw";
import publicAi from "../content/articles/public-attitudes-to-ai.md?raw";
import sevenBarriers from "../content/articles/seven-barriers.md?raw";

export type PreviewArticle = {
  id: string;
  filename: string;
  markdown: string;
};

/** Campaign order, matching the three pillars in STRATEGY.md. */
export const articles: PreviewArticle[] = [
  { id: "seven-barriers", filename: "seven-barriers.md", markdown: sevenBarriers },
  { id: "charity-rebrands", filename: "charity-rebrands.md", markdown: charityRebrands },
  { id: "public-attitudes-to-ai", filename: "public-attitudes-to-ai.md", markdown: publicAi },
  { id: "digital-maturity", filename: "digital-maturity.md", markdown: digitalMaturity },
  { id: "paul-hamlyn-foundation", filename: "paul-hamlyn-foundation.md", markdown: paulHamlyn },
  { id: "booktrust", filename: "booktrust.md", markdown: booktrust },
];

export function articleById(id: string): PreviewArticle {
  return articles.find((article) => article.id === id) ?? articles[0];
}
