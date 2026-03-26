import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeHighlight from "rehype-highlight";

export type Topic = {
  slug: string;
  label: string;
};

export type PostMeta = {
  title: string;
  date: string;
  slug: string;
  summary?: string;
  tags?: string[];
  published?: boolean;
};

export type Post = PostMeta & {
  contentHtml: string;
};

const postsDirectory = path.join(process.cwd(), "content", "posts");

function formatDateToDisplay(value: unknown): string {
  const raw = String(value ?? "").trim();
  if (!raw) return "01-01-1970";

  const isoDateMatch = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoDateMatch) {
    const [, year, month, day] = isoDateMatch;
    return `${day}-${month}-${year}`;
  }

  const parsed = new Date(raw);
  if (!Number.isNaN(parsed.getTime())) {
    const day = String(parsed.getUTCDate()).padStart(2, "0");
    const month = String(parsed.getUTCMonth() + 1).padStart(2, "0");
    const year = String(parsed.getUTCFullYear());
    return `${day}-${month}-${year}`;
  }

  return raw;
}

export function normalizeTopicSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function getAllTopics(): Topic[] {
  const posts = getSortedPostsMeta();
  const topicBySlug = new Map<string, string>();

  for (const post of posts) {
    for (const rawTag of post.tags ?? []) {
      const label = rawTag.trim();
      const slug = normalizeTopicSlug(label);

      if (!slug || topicBySlug.has(slug)) continue;
      topicBySlug.set(slug, label);
    }
  }

  return Array.from(topicBySlug.entries())
    .map(([slug, label]) => ({ slug, label }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

export function getPostsByTopic(topicSlug: string): PostMeta[] {
  const normalizedTopic = normalizeTopicSlug(topicSlug);
  if (!normalizedTopic) return [];

  return getSortedPostsMeta().filter((post) =>
    (post.tags ?? []).some((tag) => normalizeTopicSlug(tag) === normalizedTopic)
  );
}

export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) return [];
  return fs
    .readdirSync(postsDirectory)
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.replace(/\.md$/, ""));
}

export function getSortedPostsMeta(): PostMeta[] {
  const slugs = getAllPostSlugs();

  const posts = slugs.map((slug) => {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(fileContents);

    return {
      title: String(data.title ?? slug),
      date: formatDateToDisplay(data.date),
      slug,
      summary: data.summary ? String(data.summary) : "",
      tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      published: data.published !== false, // default true
    };
  });

  return posts
    .filter((p) => p.published)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (!slug) return null; // guard
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = path.join(postsDirectory, `${realSlug}.md`);

  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  const processedContent = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeHighlight)
    .use(rehypeStringify)
    .process(content);

  const contentHtml = String(processedContent);

  return {
    title: String(data.title ?? realSlug),
    date: formatDateToDisplay(data.date),
    slug: realSlug,
    summary: data.summary ? String(data.summary) : "",
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    published: data.published !== false,
    contentHtml,
  };
}