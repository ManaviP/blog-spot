"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { PostForm } from "@/components/post-form"

interface Category {
  id: number
  name: string
  slug: string
  description: string | null
}

interface Post {
  id: number
  title: string
  slug: string
  content: string
  excerpt: string
  categoryId: number | null
  published: boolean
  views: number
  createdAt: string
  updatedAt: string
  category?: {
    id: number
    name: string
  } | null
}

export default function EditPostPage() {
  const params = useParams()
  const id = params?.id as string
  const [post, setPost] = useState<Post | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!id) return

    const fetchData = async () => {
      try {
        console.log(`_ Fetching post ${id} for editing...`)
        const [postRes, categoriesRes] = await Promise.all([
          fetch(`/api/posts/${id}`),
          fetch("/api/categories"),
        ])

        if (!postRes.ok) {
          console.error(`_ Post fetch failed with status: ${postRes.status}`)
          setError(true)
          return
        }

        const postData = await postRes.json()
        const categoriesData = await categoriesRes.json()

        setPost(postData)
        setCategories(categoriesData)
        console.log(`_ Loaded post: ${postData.title}`)
      } catch (error) {
        console.error("_ Error fetching post:", error)
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </main>
    )
  }

  if (error || !post) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 py-16 text-center">
          <h1 className="text-6xl font-bold mb-4">404</h1>
          <h2 className="text-2xl font-semibold mb-6">Post Not Found</h2>
          <p className="text-muted-foreground mb-8">
            The post you are looking for doesn't exist or has been removed.
          </p>
          <Link href="/dashboard">
            <Button size="lg">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-8">
            ← Back to Dashboard
          </Button>
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Edit Post</h1>
          <p className="text-muted-foreground">Update your article</p>
        </div>

        <PostForm categories={categories} initialPost={post} />
      </div>
    </main>
  )
}