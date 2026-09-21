import type { Template } from "@/lib/templates/types";

import { TemplateCard } from "./TemplateCard";

interface Props {
  templates: Template[];
}

export function TemplateGrid({
  templates,
}: Props) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {templates.map((template) => (
        <TemplateCard
          key={template.slug}
          template={template}
        />
      ))}
    </div>
  );
}