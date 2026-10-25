import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { isAdmin } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";
import { parseTemplateInput } from "@/lib/templates/validate";

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

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
    .insert(parsed.value)
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "Ya existe una plantilla con ese slug." },
        { status: 409 }
      );
    }

    console.error("Error creando plantilla:", error);

    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath("/", "layout");

  return NextResponse.json({ id: data.id });
}
