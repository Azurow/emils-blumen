import Link from "next/link";
import { getSortedPostsMeta } from "@/lib/posts";

export const metadata = {
  title: "blumen zum selberpflücken",
  description: "emils blog über alles mögliche",
};

export default function AllPostsPage() {
  const posts = getSortedPostsMeta();

  return (
    <main style={{ maxWidth: 760, margin: "40px auto", padding: "0 16px" }}>
      {posts.length === 0 ? (
        <p>No posts yet.</p>
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
