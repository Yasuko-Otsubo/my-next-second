'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession'
import { Post } from '@/types/post'

export default function Page() {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { token } = useSupabaseSession()

  useEffect(() => {
    if (!token) return

    const fetcher = async () => {
      const res = await fetch('/api/admin/posts', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token, // 👈 Header に token を付与。
        },
      })
       if (!res.ok) {
    console.error('Fetch failed:', res.status, res.statusText)
    return
  }
    const text = await res.text()
    if (!text) {
        console.error('レスポンスが空です')
        return
      }
    const { posts } = JSON.parse(text)


      setPosts([...posts])
      setIsLoading(false)
    }

    fetcher()
  }, [token])

  return (
    <div className="">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-bold">記事一覧</h1>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          <Link href="/admin/posts/new">新規作成</Link>
        </button>
      </div>

      <div className="">
        {isLoading && <div>loading...</div>}
        {!isLoading && posts.length === 0 && <div>記事がありません</div>}
        {!isLoading &&
          posts.map((post) => {
            return (
              <Link href={`/admin/posts/${post.id}`} key={post.id}>
                <div className="border-b border-gray-300 p-4 hover:bg-gray-100 cursor-pointer">
                  <div className="text-xl font-bold">{post.title}</div>
                  <div className="text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </Link>
            )
          })}
      </div>
    </div>
  )
}