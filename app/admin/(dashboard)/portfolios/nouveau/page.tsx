import { prisma } from "@/lib/prisma";
import { createSubPortfolioAction } from "../../../actions/subportfolios";
import { SubPortfolioForm } from "../SubPortfolioForm";

export default async function NewSubPortfolioPage() {
  const projects = await prisma.project.findMany({
    select: {
      id: true,
      titre: true,
      slug: true,
      tags: true,
      visible: true,
    },
    orderBy: [{ ordre: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div className="py-2">
      <SubPortfolioForm
        availableProjects={projects}
        action={createSubPortfolioAction}
        isEditing={false}
      />
    </div>
  );
}
