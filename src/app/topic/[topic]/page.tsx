import Link from "next/link";
import { getAllTopics, getPostsByTopic } from "@/lib/posts";

export const metadata = {
  title: "blumen zum selberpflücken",
  description: "emils blog über alles mögliche",
};

type TopicPageParams = {
  params: Promise<{ topic: string }>;
};

export async function generateStaticParams() {
  return getAllTopics().map((topic) => ({ topic: topic.slug }));
}

export default async function TopicPage({ params }: TopicPageParams) {
  const { topic } = await params;
  const posts = getPostsByTopic(topic);

  return (
    <main style={{ maxWidth: 760, margin: "40px auto", padding: "0 16px" }}>
      {posts.length === 0 ? (
        <p>wie kommst du darauf?</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {posts.map((post) => (
            <li
              key={post.slug}
              style={{
                marginBottom: 24,
                paddingBottom: 16,
                borderBottom: "1px solid #ddd",
              }}
            >
              <small>{post.date}</small>
              <h1 style={{ marginBottom: 6, marginTop: 0 }}>
                <Link href={`/${post.slug}`}>{post.title}</Link>
              </h1>
              {post.summary && <i style={{ marginTop: 8 }}>{post.summary}</i>}
            </li>
          ))}
        </ul>
      )}
    </main>
    
  );
}
