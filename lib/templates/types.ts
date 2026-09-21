export type TemplateField = {
  id: string;
  label: string;
  type:
    | "text"
    | "textarea"
    | "color"
    | "image"
    | "audio";

  required?: boolean;
  placeholder?: string;
};

export type Template = {
  id: string;

  slug: string;

  name: string;

  description: string;

  category: string;

  preview?: string;

  active: boolean;

  schema: TemplateField[];
};

export type DedicationContent =
  Record<string, string>;