import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateProfileAction } from "../../../actions/profiles";
import { ProfileForm } from "../ProfileForm";

export const dynamic = "force-dynamic";

export default async function EditProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  const { id } = await params;

  const profile = await prisma.profile.findUnique({
    where: { id },
    include: {
      heroMedia: true,
      subPortfolio: true,
    },
  });

  if (!profile) {
    notFound();
  }

  const subPortfolios = await prisma.subPortfolio.findMany({
    select: {
      id: true,
      label: true,
      slug: true,
    },
    orderBy: { label: "asc" },
  });

  const boundUpdateAction = updateProfileAction.bind(null, id);

  return (
    <div className="py-2">
      <ProfileForm
        initialData={profile}
        subPortfolios={subPortfolios}
        action={boundUpdateAction}
        isEditing={true}
      />
    </div>
  );
}
