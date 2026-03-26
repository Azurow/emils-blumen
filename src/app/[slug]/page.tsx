import { notFound } from "next/navigation";
import { getAllPostSlugs, getPostBySlug } from "@/lib/posts";
import { Metadata} from 'next';

type Params = {
  params: Promise<{ slug: string }>;
};

// set dynamic metadata
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params; // important
  const post = await getPostBySlug(slug);
  if (!post || !post.published) {
    notFound();
  }
  return {
    title: post.title,
    description: post.summary,
    authors: [{ name: "Emil" }],
  };
}

export async function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params; // important
  const post = await getPostBySlug(slug);

  if (!post || !post.published) {
    notFound();
  }

  return (
    <main style={{ maxWidth: 760, margin: "40px auto", padding: "0 16px" }}>
      <article>
        <div
          className="prose prose-zinc max-w-none mt-6"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />
      </article>
    </main>
  );
}