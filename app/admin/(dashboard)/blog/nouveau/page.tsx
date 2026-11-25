import { Metadata } from "next";
import { BlogPostForm } from "../BlogPostForm";
import { createBlogPostAction } from "../../../actions/blog";

export const metadata: Metadata = {
  title: "Nouvel Article | Administration Sylla",
};

export default function NewBlogPostPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bebas text-4xl text-[#0F172A] tracking-wide leading-none">
          RÉDIGER UN NOUVEL ARTICLE
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Partagez vos réflexions, retours d&apos;expérience et analyses sur le Design, le Développement Full Stack et l&apos;IA.
        </p>
      </div>

      <BlogPostForm action={createBlogPostAction} />
    </div>
  );
}
