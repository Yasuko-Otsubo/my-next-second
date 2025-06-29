//import { posts } from '../data/posts';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styles from './styles.module.css';

//テキストの文字数と改行文字の変換
const truncateText = (text: string, maxLength: number) => {
  // <br>タグを改行文字に変換
  const cleanText = text.replace(/<br\s*\/?>/g, '\n').trim();
  if (cleanText.length <= maxLength) {
    return cleanText;
  }
  return cleanText.substring(0, maxLength) + '...';
};


const Home: React.FC = () =>{

  type Post = {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    categories: string[];
  };
  
  //データ用の状態管理
  const [posts, setPosts] = useState<Post[] | null>(null);


  type ApiResponse = {
    posts: Post[] | [];
  };
  

// APIでpostsを取得する処理をuseEffectで実行します。
useEffect(() => {
  const fetcher = async () => {
    try {

    // APIを呼び出してデータを取得する処理
    const res = await fetch("https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/posts")
    const data:ApiResponse = await res.json()
    setPosts(data.posts); // postsが存在することを確認

    } catch (error){
      console.log("接続できませんでした。" , error );
      setPosts([]);
    }

  };
  fetcher();
}, [])

    if(posts === null){
      return <p className={styles.h_loading}>データ取得中・・・</p>;
    }
    if (posts.length === 0 ) {
      return <p className={styles.h_loading}>ブログが見つかりません。</p>
    }

  return (
    <div className={styles.h_main}>
      {posts.map((post) => (
        <article className={styles.h_sec} key={post.id}>
          <Link className={styles.h_link} to={`/posts/${post.id}`}>
          <div className={styles.h_sec_upper}>
            <time className={styles.h_time}>{new Date(post.createdAt).toLocaleDateString()}</time>
            <div className={styles.h_category}>
              {post.categories.map((category) => (
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

