export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }, // ここでリクエストパラメータを受け取る
) => {
  // paramsの中にidが入っているので、それを取り出す
  const { id } = params

  try {
    // idを元にPostをDBから取得
    const post = await prisma.post.findUnique({
      where: {
        id: parseInt(id),
      },
      // カテゴリーも含めて取得
      include: {
        postCategories: {
          include: {
            category: {
              select: {
                // カテゴリーのidとnameだけ取得
                id: true,
                name: true,
              },
            },
          },
        },
      },
    })
        if (!post) {
    return NextResponse.json({ status: 'NOT_FOUND' }, { status: 404 });
}


    // レスポンスを返す
    return NextResponse.json({ status: 'OK', post: post }, { status: 200 })
} catch (error) {
  console.error("API /api/posts/[id] error:", error);
  return NextResponse.json(
    { status: 'ERROR', message: String(error) },
    { status: 500 }
  );
}
}