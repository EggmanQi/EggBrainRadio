import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { site } from '../../consts';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const words = (await getCollection('words'))
    .filter((entry) => !entry.data.draft)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return rss({
    title: `${site.name} — Words`,
    description: site.description,
    site: context.site!,
    items: words.map((entry) => ({
      title: entry.data.title,
      description: entry.data.summary,
      pubDate: entry.data.date,
      link: `/words/${entry.id}`,
    })),
  });
}
