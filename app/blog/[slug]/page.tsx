import Image from "next/image"

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000"

async function getPost(slug: string) {
  const res = await fetch(`${API}/posts/${slug}/`, { cache: "no-store" })
  if (!res.ok) return null
  return res.json()
}

export default async function BlogDetail({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug)
  if (!post) return <div className="py-6">Not found</div>

  return (
    <article className="prose lg:prose-lg max-w-3xl mx-auto py-8">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

      {post.image && (
        <div className="relative w-full h-96 mb-6">
          <Image
            src={post.image}
            alt={post.title}
            fill
            priority
            className="object-cover rounded-lg"
          />
        </div>
      )}

      <div dangerouslySetInnerHTML={{ __html: post.body }} />
    </article>
  )
}
