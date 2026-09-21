import type { DedicationContent } from "@/lib/templates/types";

interface TemplateRendererProps {
  templateSlug: string;
  content: DedicationContent;
}

function encodeContent(content: DedicationContent) {
  return Buffer.from(
    JSON.stringify(content),
    "utf8"
  ).toString("base64url");
}

export function TemplateRenderer({
  templateSlug,
  content,
}: TemplateRendererProps) {
  const data = encodeContent(content);

  const src = `/template/${templateSlug}?data=${encodeURIComponent(data)}`;

  return (
    <iframe
      title="TuDetalle"
      src={src}
      className="h-screen w-full border-0"
      sandbox="allow-scripts"
    />
  );
}