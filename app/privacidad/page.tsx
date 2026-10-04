import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "Política de privacidad | Tu Detalle",
  description:
    "Cómo Tu Detalle recopila, usa y protege tus datos, fotos y mensajes, y cómo usamos cookies y publicidad de terceros.",
  alternates: { canonical: "https://www.tu-detalle.com/privacidad" },
};

// ✏️ EDITA ESTOS VALORES ANTES DE PUBLICAR
const EMAIL = "bcodex77@gmail.com";
const UPDATED = "4 de octubre de 2026";
const RETENTION = "12 meses"; // ej: "12 meses"

export default function PrivacidadPage() {
  return (
    <LegalLayout title="Política de privacidad" updated={UPDATED}>
      <p>
        En Tu Detalle (<a href="https://www.tu-detalle.com">www.tu-detalle.com</a>)
        nos tomamos en serio tu privacidad. Esta política explica qué información
        recopilamos cuando creas o ves un detalle, cómo la usamos y qué opciones
        tienes.
      </p>

      <h2>1. Información que recopilamos</h2>
      <ul>
        <li>
          <strong>Contenido que tú subes:</strong> textos y mensajes, fotografías,
          nombres, fechas, colores y la canción que eliges para tu detalle.
        </li>
        <li>
          <strong>Datos de contacto:</strong> tu correo electrónico, si nos
          escribes o si el servicio te lo pide para entregarte el enlace.
        </li>
        <li>
          <strong>Datos técnicos:</strong> dirección IP, tipo de navegador,
          dispositivo, páginas visitadas y fechas de acceso, recopilados de forma
          automática.
        </li>
        <li>
          <strong>Cookies y tecnologías similares:</strong> ver la sección 5.
        </li>
      </ul>

      <h2>2. Para qué usamos tu información</h2>
      <ul>
        <li>Crear, almacenar y mostrar tu detalle mediante un enlace único.</li>
        <li>Mantener el funcionamiento, la seguridad y la mejora del sitio.</li>
        <li>Responder tus consultas y solicitudes.</li>
        <li>Prevenir abusos, fraudes y contenido que incumpla nuestros términos.</li>
        <li>Mostrar publicidad y medir el uso del sitio (ver sección 5).</li>
      </ul>
      <p>No vendemos tus datos personales.</p>

      <h2>3. Quién puede ver tu detalle</h2>
      <p>
        Cada detalle se identifica con un enlace único. Cualquier persona que
        tenga ese enlace podrá verlo, así que compártelo solo con quien quieras
        sorprender. Los detalles no se muestran en nuestra página principal ni en
        listados públicos, y pedimos a los buscadores que no los indexen.
      </p>

      <h2>4. Conservación y eliminación</h2>
      <p>
        Conservamos tu contenido durante {RETENTION}. Puedes pedirnos que
        eliminemos tu detalle, tus fotos o tus datos en cualquier momento
        escribiendo a <a href={`mailto:${EMAIL}`}>{EMAIL}</a>, indicando el enlace
        del detalle. Responderemos en un plazo razonable.
      </p>

      <h2>5. Cookies y publicidad de terceros</h2>
      <p>
        Usamos cookies y tecnologías similares para que el sitio funcione, analizar
        el tráfico y mostrar anuncios.
      </p>
      <ul>
        <li>
          Proveedores externos, incluido <strong>Google</strong>, utilizan cookies
          para mostrar anuncios según tus visitas anteriores a este y otros sitios
          web.
        </li>
        <li>
          El uso de la cookie de publicidad de Google permite a Google y a sus
          socios mostrarte anuncios basados en tu navegación.
        </li>
        <li>
          Puedes desactivar la publicidad personalizada desde{" "}
          <a
            href="https://adssettings.google.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            la configuración de anuncios de Google
          </a>{" "}
          y obtener más información sobre cómo Google usa los datos en{" "}
          <a
            href="https://policies.google.com/technologies/partner-sites"
            target="_blank"
            rel="noopener noreferrer"
          >
            policies.google.com/technologies/partner-sites
          </a>
          .
        </li>
        <li>
          También puedes bloquear o eliminar cookies desde la configuración de tu
          navegador, aunque algunas funciones del sitio podrían dejar de funcionar.
        </li>
      </ul>

      <h2>6. Servicios de terceros</h2>
      <p>
        Para operar el sitio usamos proveedores externos de alojamiento,
        almacenamiento de archivos, analítica y publicidad. Estos proveedores
        pueden procesar datos técnicos y, en el caso del almacenamiento, el
        contenido que subes, únicamente para prestarnos el servicio.
      </p>

      <h2>7. Seguridad</h2>
      <p>
        Aplicamos medidas técnicas razonables para proteger tu información. Sin
        embargo, ningún sistema en internet es completamente seguro y no podemos
        garantizar una protección absoluta.
      </p>

      <h2>8. Menores de edad</h2>
      <p>
        El servicio no está dirigido a menores de 14 años. Si crees que un menor
        nos ha facilitado datos personales sin autorización de sus padres o tutores,
        escríbenos y los eliminaremos.
      </p>

      <h2>9. Tus derechos</h2>
      <p>
        Puedes solicitar acceso, corrección o eliminación de tus datos personales, y
        oponerte a ciertos usos. Para ejercer estos derechos escribe a{" "}
        <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
      </p>

      <h2>10. Cambios en esta política</h2>
      <p>
        Podemos actualizar esta política. Publicaremos la versión vigente en esta
        página con su fecha de actualización.
      </p>

      <h2>11. Contacto</h2>
      <p>
        Si tienes preguntas sobre esta política, escríbenos a{" "}
        <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
      </p>
    </LegalLayout>
  );
}