import { NextResponse } from "next/server";
import { nanoid } from "nanoid";

import { createClient } from "@/lib/supabase/server";
import { templates } from "@/lib/templates/registry";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const templateId = body.template_id;
    const content = body.content;

    if (!templateId) {
      return NextResponse.json(
        { error: "Falta seleccionar una plantilla." },
        { status: 400 }
      );
    }

    const template = templates.find(
      (item) =>
        item.slug === templateId ||
        item.id === templateId
    );

    if (!template) {
      return NextResponse.json(
        { error: "La plantilla no existe." },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const slug = nanoid(10);

    const { error } = await supabase
      .from("dedicatorias")
      .insert({
        slug,
        template_id: template.slug,
        content,
      });

    if (error) {
      console.error("Supabase error:", error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      slug,
      url: `/p/${slug}`,
    });
  } catch (error) {
    console.error("API error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Error interno del servidor.",
      },
      { status: 500 }
    );
  }
}