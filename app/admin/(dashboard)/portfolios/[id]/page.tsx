import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateSubPortfolioAction } from "../../../actions/subportfolios";
import { SubPortfolioForm } from "../SubPortfolioForm";

export default async function EditSubPortfolioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [subPortfolio, allProjects] = await Promise.all([
    prisma.subPortfolio.findUnique({
      where: { id },
      include: {
        profile: {
          select: {
            template: true,
          },
        },
        projects: {
          select: {
            projectId: true,
            ordre: true,
          },
        },
      },
    }),
    prisma.project.findMany({
      select: {
        id: true,
        titre: true,
        slug: true,
        tags: true,
        visible: true,
      },
      orderBy: [{ ordre: "asc" }, { createdAt: "desc" }],
    }),
  ]);

  if (!subPortfolio) {
    notFound();
  }

  const boundUpdateAction = updateSubPortfolioAction.bind(null, id);

  return (
    <div className="py-2">
      <SubPortfolioForm
        initialData={{
          ...subPortfolio,
          template: subPortfolio.profile?.template || "creatif",
        }}
        availableProjects={allProjects}
        action={boundUpdateAction}
        isEditing={true}
      />
    </div>
  );
}
