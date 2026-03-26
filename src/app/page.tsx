import { redirect } from "next/navigation";
import { getAllTopics, getPostsByTopic } from "@/lib/posts";

export const metadata = {
  title: "Home of Emil's Blog ",
  description: "Markdown-powered blog",
};

const DEFAULT_TOPIC_SLUG = "tulpen";

export default function BlogPage() {
  const defaultTopicPosts = getPostsByTopic(DEFAULT_TOPIC_SLUG);
  if (defaultTopicPosts.length > 0) {
    redirect(`/topic/${DEFAULT_TOPIC_SLUG}`);
  }

  const topics = getAllTopics();
  if (topics.length > 0) {
    redirect(`/topic/${topics[0].slug}`);
  }

  redirect("/all");
}