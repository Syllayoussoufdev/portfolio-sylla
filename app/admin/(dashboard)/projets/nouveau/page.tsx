import { createProjectAction } from "../../../actions/projects";
import { ProjectForm } from "../ProjectForm";

export default function NewProjectPage() {
  return (
    <div className="py-2">
      <ProjectForm action={createProjectAction} isEditing={false} />
    </div>
  );
}
