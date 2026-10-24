/** One finished tale per level: a title, a few short paragraphs and a closing line that resolves it. */
export interface Tale {
  title: string;
  body: string[];
  end: string;
}
