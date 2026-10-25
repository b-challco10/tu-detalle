import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { isAdmin } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";
import { parseTemplateInput } from "@/lib/templates/validate";

interface RouteContext {
  params: Promise<{ id: string }>;
}

const unauthorized = () =>
  NextResponse.json({ error: "No autorizado." }, { status: 401 });

/* Editar la plantilla completa */
export async function PUT(request: Request, { params }: RouteContext) {
  if (!(await isAdmin())) return unauthorized();

  const { id } = await params;

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const parsed = parseTemplateInput(body);

  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("templates")
    .update(parsed.value)
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "Ya existe una plantilla con ese slug." },
        { status: 409 }
      );
    }

    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json(
      { error: "No se encontró la plantilla." },
      { status: 404 }
    );
  }

  revalidatePath("/", "layout");

  return NextResponse.json({ id: data.id });
}

/* Activar / ocultar */
export async function PATCH(request: Request, { params }: RouteContext) {
  if (!(await isAdmin())) return unauthorized();

  const { id } = await params;

  let body: { active?: unknown };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  if (typeof body.active !== "boolean") {
    return NextResponse.json({ error: "Falta el campo active." }, { status: 400 });
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("templates")
    .update({ active: body.active })
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json(
      { error: "No se encontró la plantilla." },
      { status: 404 }
    );
  }

  revalidatePath("/", "layout");

  return NextResponse.json({ ok: true });
}

/* Borrar */
export async function DELETE(_request: Request, { params }: RouteContext) {
  if (!(await isAdmin())) return unauthorized();

  const { id } = await params;

  const supabase = await createClient();

  const { error } = await supabase.from("templates").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath("/", "layout");

  return NextResponse.json({ ok: true });
}
