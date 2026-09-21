import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const file = formData.get("file");
    const type = formData.get("type");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "No se recibió ningún archivo." },
        { status: 400 }
      );
    }

    if (type !== "image" && type !== "audio") {
      return NextResponse.json(
        { error: "Tipo de archivo inválido." },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const extension =
      file.name.split(".").pop()?.toLowerCase() ?? "bin";

    const folder = type === "image" ? "images" : "audio";

    const fileName = `${crypto.randomUUID()}.${extension}`;

    const path = `${folder}/${fileName}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    const { error } = await supabase.storage
      .from("dedications")
      .upload(path, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("Error subiendo archivo:", error);

      return NextResponse.json(
        { error: "No se pudo subir el archivo." },
        { status: 500 }
      );
    }

    const { data } = supabase.storage
      .from("dedications")
      .getPublicUrl(path);

    return NextResponse.json({
      url: data.publicUrl,
    });
  } catch (error) {
    console.error("Error en uploads:", error);

    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}