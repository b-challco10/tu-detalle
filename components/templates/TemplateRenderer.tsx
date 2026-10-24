import type { DedicationContent } from "@/lib/templates/types";
import { TemplateFrame } from "@/components/templates/TemplateFrame";

interface TemplateRendererProps {
  templateSlug: string;
  content: DedicationContent;
}

function encodeContent(content: DedicationContent) {
  return Buffer.from(JSON.stringify(content), "utf8").toString("base64url");
}

// Sigue siendo un componente de servidor: codifica los datos aquí
// y deja la lógica de carga al componente cliente TemplateFrame.
export function TemplateRenderer({
  templateSlug,
  content,
}: TemplateRendererProps) {
  const data = encodeContent(content);

  const src = `/template/${templateSlug}?data=${encodeURIComponent(data)}`;

  return (
    <TemplateFrame
      src={src}
      title="TuDetalle"
      heightClassName="h-screen"
      label="Preparando tu sorpresa ✨"
    />
  );
}