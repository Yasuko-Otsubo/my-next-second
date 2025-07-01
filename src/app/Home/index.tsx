"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./styles.module.css";

// 🔸 日付フォーマット関数を追加
const formatDate = (isoString: string): string => {
  const date = new Date(isoString);
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
};

// 🔸 テキストの文字数と改行文字の変換
const truncateText = (text: string, maxLength: number) => {
  const cleanText = text.replace(/<br\s*\/?>/g, '\n').trim();
  if (cleanText.length <= maxLength) {
    return cleanText;
  }
  return cleanText.substring(0, maxLength) + '...';
};

const Home: React.FC = () => {
  type Post = {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    categories: string[];
  };

  const [posts, setPosts] = useState<Post[] | null>(null);

  type ApiResponse = {
    posts: Post[] | [];
  };

  useEffect(() => {
    const fetcher = async () => {
      try {
        const res = await fetch("https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/posts");
        const data: ApiResponse = await res.json();
        setPosts(data.posts);
      } catch (error) {
        console.log("接続できませんでした。", error);
        setPosts([]);
      }
    };
    fetcher();
  }, []);

  if (posts === null) {
    return <p className={styles.h_loading}>データ取得中・・・</p>;
  }
  if (posts.length === 0) {
    return <p className={styles.h_loading}>ブログが見つかりません。</p>;
  }

  return (
    <div className={styles.h_main}>
      {posts.map((post) => (
        <article className={styles.h_sec} key={post.id}>
          <Link className={styles.h_link} href={`/posts/${post.id}`}>
            <div className={styles.h_sec_upper}>
              <time className={styles.h_time}>
                {formatDate(post.createdAt)} {/* 👈 ここで使う！ */}
              </time>
              <div className={styles.h_category}>
                {post.categories.sort().map((category) => (
                  <div className={styles.h_cate_area} key={category}>
                    {category}
                  </div>
                ))}
              </div>
            </div>
            <h2 className={styles.h2}>{post.title}</h2>
            <p className={styles.h_p}>{truncateText(post.content, 56)}</p>
          </Link>
        </article>
      ))}
    </div>
  );
};

export default Home;
