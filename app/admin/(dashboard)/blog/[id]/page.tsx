import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BlogPostForm } from "../BlogPostForm";
import { updateBlogPostAction } from "../../../actions/blog";

interface EditBlogPostPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: EditBlogPostPageProps): Promise<Metadata> {
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { id },
    select: { titre: true },
  });

  return {
    title: post ? `Modifier "${post.titre}" | Administration Sylla` : "Article introuvable",
  };
}

export default async function EditBlogPostPage({ params }: EditBlogPostPageProps) {
  const { id } = await params;

  const post = await prisma.blogPost.findUnique({
    where: { id },
  });

  if (!post) {
    notFound();
  }

  const updateActionWithId = updateBlogPostAction.bind(null, id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bebas text-4xl text-[#0F172A] tracking-wide leading-none">
          MODIFIER L&apos;ARTICLE
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Identifiant article : <code className="font-mono text-purple-600">{id}</code>
        </p>
      </div>

      <BlogPostForm
        initialData={{
          id: post.id,
          titre: post.titre,
          slug: post.slug,
          description: post.description,
          contenu: post.contenu,
          coverImage: post.coverImage,
          coverMediaId: post.coverMediaId,
          categorie: post.categorie,
          tags: post.tags,
          tempsLecture: post.tempsLecture,
          statut: post.statut as any,
          featured: post.featured,
        }}
        action={updateActionWithId}
        isEditing
      />
    </div>
  );
}
