"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Header.module.css";

type TopicNavItem = {
  slug: string;
  label: string;
};

type HeaderProps = {
  topics: TopicNavItem[];
};

export default function Header({ topics }: HeaderProps) {
  const pathname = usePathname();

  const isAllPage = pathname === "/all";
  const isTopicPage = pathname.startsWith("/topic/");
  const currentTopic = isTopicPage ? pathname.split("/")[2] ?? "" : "";

  return (
    <header className={`${styles.header} ${!isTopicPage && !isAllPage ? styles.stickyHeader : ""}`}>
      <div className={styles.container}>
        <div className={styles.brandRow}>
            {isTopicPage || isAllPage ? <img src="/header.jpeg" alt="bild von mir" className={styles.image} /> : null}
          <div>
            <small><b><i>(emils)</i></b></small>
            <h1 className={styles.title}>blumen zum selberpflücken</h1>
            <nav>
              <ul className={styles.navbar}>
                {topics.map((topic) => (
                  <li key={topic.slug}>
                    <Link
                      href={`/topic/${topic.slug}`}
                      className={`${styles.navLink} ${currentTopic === topic.slug ? styles.activeLink : ""}`}
                    >
                      {topic.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/all"
                    className={`${styles.navLink} ${isAllPage ? styles.activeLink : ""}`}
                  >
                    alle
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}