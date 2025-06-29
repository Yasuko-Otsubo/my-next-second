"use client"

import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styles from '../styles.module.css';
import Image from 'next/image';

//APIレスポンスがどのようなデータ構造を持つかを定義
type ApiResponse = {
  post: Post;
};

//投稿データの構造を定義
type Post = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  categories: { id: string; name: string }[]
  thumbnail: { url: string; height: number; width: number }
};

const BlogPage: React.FC = () => {
  const { id } = useParams(); // URLが/posts/1の場合、idには1が格納されます

  //データ用の状態管理 
  const [post, setPost] = useState<Post | null>(null); //nullをいれるのはまだ値が設定されていない状態を表現するため
  const [error, setError] = useState<string |null>(null); 
  
  ///////////////////////コンポーネントが初期化される、またはidが変更されるとuseEffectが実行///////////////////////
  useEffect(() => {
    const fetcher = async () => {
      try {

        ////////////////////fetcher関数が呼び出され、APIからデータを受け取る////////////////////
        const res = await fetch(`https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/posts/${id}`);

        //throwによってエラーオブジェクトを発生させ、現在のコードの実行を中断
        //レスポンスのokプロパティ（HTTPステータスコードが200〜299の場合にtrueになる）をチェック
        if (!res.ok) {
          throw new Error(`HTTPエラー: ${res.status}`);
        }

        //res.json()を使ってレスポンスボディをパースし、必要なデータ部分を取得
        const data: ApiResponse = await res.json();

        ///////////////////////正常なレスポンスの場合、データの形式を確認してpostステートに保存///////////////////////
        // 'posts'キーまたは'post'キーが存在するか確認
          setPost(data.post); // 'post'キーの場合
        } catch  (error : unknown ) {
          if (error instanceof Error) {
            // errorがError型である場合のみ、.messageにアクセスできる
          ///////////////////////異常がある場合は、エラーメッセージをコンソールに出力し、errorステートに保存///////////////////////
          console.error("データ取得中のエラー:", error.message);
          setError(`データの取得に失敗しました: ${error.message }`);
        } else {
          // Error型以外の場合
        console.error("データ取得中の不明なエラー:", error);
        setError("不明なエラーが発生しました");
        }
      }
    };
    fetcher();
    //依存配列を空にする（=useEffectの第二引数に空の配列を渡す）と、初回レンダリング時のみ処理が実行される
  },[id]); //空の依存配列を追加


  // エラーハンドリング
  if (error) {
    return <p className={styles.b_p}>{error}</p>;
  }
  
  return (
    <div className={styles.blogpage}>
      {post ? (
        <>
          <Image 
            className={styles.b_img}
            src="post.thumbnail"
            alt="Thumbnail" 
          />
          <div className={styles.b_sub}>
            <time className={styles.b_time}>{new Date(post.createdAt).toLocaleDateString()}</time>
            <div className={styles.b_category}>
              {post.categories?.map((category) => (
                <div className={styles.b_cate_area} key={category.id}>
                  {category.id}
                </div>
              ))}
            </div>
          </div>
          <h2 className={styles.h2}>{post.title}</h2>
          <p dangerouslySetInnerHTML={{ __html: post.content }}></p>
        </>
      ) : (
        <p className={styles.b_p}>データを読み込んでいます...</p>
      )}
    </div>
    );
    }
export default BlogPage;