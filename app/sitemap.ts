import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";
import { templates } from "@/lib/templates/registry"; // Cambia 'TEMPLATES' por la constante o función que exportes en registry.ts
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://tu-detalle.com";

  // 1. Rutas estáticas principales
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/crear`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/plantillas`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/faq`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/sobre`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/contacto`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  ];

  // 2. Rutas dinámicas de plantillas (/crear/[slug]) desde tu registry.ts
  const templateList = Array.isArray(templates) ? templates : Object.values(templates);
  
  const templateRoutes: MetadataRoute.Sitemap = templateList.map((template: any) => ({
    url: `${base}/crear/${template.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // 3. Rutas dinámicas de detalles públicos (/p/[slug]) desde Supabase
  let detailRoutes: MetadataRoute.Sitemap = [];

  try {
    const supabase = await createClient();
    const { data: details } = await supabase
      .from("details") // Cambia "details" por el nombre exacto de tu tabla en Supabase
      .select("slug, updated_at");

    if (details) {
      detailRoutes = details.map((detail) => ({
        url: `${base}/p/${detail.slug}`,
        lastModified: detail.updated_at ? new Date(detail.updated_at) : new Date(),
        changeFrequency: "daily",
        priority: 0.6,
      }));
    }
  } catch (error) {
    console.error("Error cargando detalles desde Supabase para sitemap:", error);
  }

  return [...staticRoutes, ...templateRoutes, ...detailRoutes];
}