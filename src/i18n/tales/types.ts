/** One finished tale per level: a title, two short paragraphs and a closing line that resolves it. */
export interface Tale {
  title: string;
  body: [string, string];
  end: string;
}
