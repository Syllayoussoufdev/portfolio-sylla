import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createProfileAction } from "../../../actions/profiles";
import { ProfileForm } from "../ProfileForm";

export const dynamic = "force-dynamic";

export default async function NewProfilePage() {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  const subPortfolios = await prisma.subPortfolio.findMany({
    select: {
      id: true,
      label: true,
      slug: true,
    },
    orderBy: { label: "asc" },
  });

  return (
    <div className="py-2">
      <ProfileForm
        subPortfolios={subPortfolios}
        action={createProfileAction}
        isEditing={false}
      />
    </div>
  );
}
