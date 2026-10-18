import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateProjectAction } from "../../../actions/projects";
import { ProjectForm } from "../ProjectForm";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await prisma.project.findUnique({
    where: { id },
  });

  if (!project) {
    notFound();
  }

  const boundUpdateAction = updateProjectAction.bind(null, id);

  return (
    <div className="py-2">
      <ProjectForm
        initialData={project}
        action={boundUpdateAction}
        isEditing={true}
      />
    </div>
  );
}
