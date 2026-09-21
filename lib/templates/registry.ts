import type { Template } from "./types";
export const templates: Template[] = [
  {
    id: "rosas",
    slug: "rosas",
    name: "Flores Rosas",
    description:
      "Elegante jardín nocturno con flores rosas floreciendo, destellos de luz flotantes y dedicatoria personalizada con música",
    category: "Romántica",
    preview: "/templates/rosas.png",
    active: true,
    schema: [
      {
        id: "titulo",
        type: "text",
        label: "Título principal",
        placeholder: "🌸 Para ti, con todo mi corazón 🌸",
      },
      {
        id: "subtitulo",
        type: "textarea",
        label: "Dedicatoria o frase",
        placeholder: "Cada pétalo es un latido que late por ti",
      },
      { id: "photo1", type: "image", label: "Foto 1" },
      { id: "photo2", type: "image", label: "Foto 2" },
      { id: "photo3", type: "image", label: "Foto 3" },
      {
        id: "bgMusic",
        type: "audio",
        label: "Música de fondo (opcional)",
      },
    ],
  },
    {
    id: "universo",
    slug: "universo",
    name: "Universo de Amor",
    description:
      "Galaxia de corazones 3D brillantes, fotos flotantes en cristal y música de fondo",
    category: "Romántica",
    preview: "/templates/dedica3.png",
    active: true,
    schema: [
      {
        id: "title",
        type: "text",
        label: "Título principal",
        placeholder: "Universo de Amor",
      },
      {
        id: "subtitle",
        type: "text",
        label: "Subtítulo",
        placeholder: "Cada corazón es un momento contigo",
      },
      {
        id: "message",
        type: "textarea",
        label: "Mensaje",
        placeholder: "Escribe tu dedicatoria...",
      },
      { id: "photo1", type: "image", label: "Foto 1" },
      { id: "photo2", type: "image", label: "Foto 2" },
      { id: "photo3", type: "image", label: "Foto 3" },
      { id: "bgMusic", type: "audio", label: "Música de fondo" },
      { id: "primaryColor", type: "color", label: "Color principal" },
      { id: "secondaryColor", type: "color", label: "Color secundario" },
    ],
  },
  {
    id: "love-galaxy",
    slug: "love-galaxy",
    name: "Tarjeta de Amor",
    description: "Estrellas animadas, corazón brillante y música romántica.",
    category: "Romántica",
    preview: "/templates/loves.png",
    active: true,
    schema: [
      {
        id: "title",
        label: "Título",
        type: "text",
        required: true,
        placeholder: "Para el amor de mi vida",
      },

      {
        id: "recipient",
        label: "Para",
        type: "text",
        required: true,
        placeholder: "Nombre de la persona",
      },

      {
        id: "message",
        label: "Mensaje",
        type: "textarea",
        required: true,
        placeholder: "Escribe tu dedicatoria...",
      },

      {
        id: "photo",
        label: "Foto",
        type: "image",
      },

      {
        id: "song",
        label: "Canción",
        type: "audio",
      },
    ],
  },
  {
    id: "saturno",
    slug: "saturno",
    name: "Fotos flotantes",
    description:
      "Plantilla espacial con fotos flotantes y corazones animados",
    category: "Romántica",
    preview: "/templates/dedica2.png",
    active: true,
    schema: [
      {
        id: "mainTitle",
        type: "text",
        label: "Título principal",
        placeholder: "Nuestro Universo",
      },
      {
        id: "subtitle",
        type: "text",
        label: "Subtítulo",
        placeholder: "Entre anillos y estrellas",
      },
      {
        id: "message",
        type: "textarea",
        label: "Mensaje",
        placeholder: "Este es nuestro pequeño universo…",
      },
      { id: "fromName", type: "text", label: "De parte de", placeholder: "Yo" },
      { id: "toName", type: "text", label: "Para", placeholder: "Tú" },
      { id: "photo1", type: "image", label: "Foto 1" },
      { id: "photo2", type: "image", label: "Foto 2" },
      { id: "photo3", type: "image", label: "Foto 3" },
      { id: "photo4", type: "image", label: "Foto 4" },
      { id: "heartColor", type: "color", label: "Color corazones" },
      { id: "bgMusic", type: "audio", label: "Música" },
    ],
  },


];
