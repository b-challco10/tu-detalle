import type { Metadata } from "next";
import Link from "next/link";
import LegalLayout from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "Términos y condiciones | Tu Detalle",
  description:
    "Condiciones de uso de Tu Detalle: reglas para crear y compartir detalles, contenido permitido y responsabilidades.",
  alternates: { canonical: "https://www.tu-detalle.com/terminos" },
};

// ✏️ EDITA ESTOS VALORES ANTES DE PUBLICAR
const EMAIL = "bcodex77@gmail.com";
const UPDATED = "4 de octubre de 2026";
const COUNTRY = "Bolivia"; // ej: "Bolivia"

export default function TerminosPage() {
  return (
    <LegalLayout title="Términos y condiciones" updated={UPDATED}>
      <p>
        Al usar Tu Detalle (<a href="https://www.tu-detalle.com">www.tu-detalle.com</a>)
        aceptas estos términos. Si no estás de acuerdo, no uses el sitio.
      </p>

      <h2>1. Qué es Tu Detalle</h2>
      <p>
        Tu Detalle es una plataforma para crear dedicatorias y cartas digitales
        personalizadas con mensajes, fotos y música, y compartirlas mediante un
        enlace único.
      </p>

      <h2>2. Tu contenido</h2>
      <ul>
        <li>
          Eres el único responsable del contenido que subes (textos, fotos,
          canciones y cualquier otro material).
        </li>
        <li>
          Declaras que tienes derecho a usar ese contenido y que cuentas con el
          permiso de las personas que aparecen en tus fotos.
        </li>
        <li>
          Nos concedes una licencia limitada, no exclusiva, para almacenar y
          mostrar tu contenido con el único fin de prestarte el servicio. Tú
          conservas todos los derechos sobre él.
        </li>
      </ul>

      <h2>3. Contenido prohibido</h2>
      <p>No puedes usar el servicio para crear o compartir contenido que:</p>
      <ul>
        <li>sea sexual explícito, o muestre a menores en cualquier contexto sexual;</li>
        <li>incite a la violencia, el odio o la discriminación;</li>
        <li>acose, amenace, difame o suplante a otra persona;</li>
        <li>muestre a alguien sin su consentimiento o vulnere su privacidad;</li>
        <li>infrinja derechos de autor, marcas u otros derechos de terceros;</li>
        <li>sea ilegal, engañoso, fraudulento o contenga malware o spam.</li>
      </ul>
      <p>
        Podemos eliminar cualquier detalle que incumpla estas reglas, sin aviso
        previo, y bloquear a quienes reincidan.
      </p>

      <h2>4. Música y derechos de autor</h2>
      <p>
        Si añades una canción a tu detalle, eres responsable de contar con los
        derechos o permisos necesarios para ello. Tu Detalle no cede licencias
        sobre obras musicales de terceros. Si eres titular de derechos y crees que
        un detalle infringe tu obra, escríbenos a{" "}
        <a href={`mailto:${EMAIL}`}>{EMAIL}</a> con el enlace del detalle y la
        prueba de titularidad, y lo revisaremos con prontitud.
      </p>

      <h2>5. Reportar contenido</h2>
      <p>
        Si recibes o ves un detalle que consideres inapropiado, ofensivo o que
        vulnere tus derechos, repórtalo a{" "}
        <a href={`mailto:${EMAIL}`}>{EMAIL}</a> indicando el enlace. Revisaremos
        el caso y, si corresponde, lo eliminaremos.
      </p>

      <h2>6. Enlaces y privacidad de los detalles</h2>
      <p>
        Quien tenga el enlace de un detalle puede verlo. Eres responsable de con
        quién lo compartes. Consulta nuestra{" "}
        <Link href="/privacidad">política de privacidad</Link> para saber cómo
        tratamos tus datos.
      </p>

      <h2>7. Disponibilidad del servicio</h2>
      <p>
        Procuramos que el sitio funcione de forma continua, pero no garantizamos
        que esté libre de errores ni disponible sin interrupciones. Podemos
        modificar, suspender o dejar de ofrecer funciones en cualquier momento. Te
        recomendamos conservar copias de tus fotos y mensajes originales.
      </p>

      <h2>8. Publicidad</h2>
      <p>
        El sitio puede mostrar anuncios de terceros, como Google AdSense. No somos
        responsables del contenido de los anuncios ni de los sitios a los que
        enlazan.
      </p>

      <h2>9. Limitación de responsabilidad</h2>
      <p>
        El servicio se ofrece &ldquo;tal cual&rdquo;. En la medida permitida por la
        ley, Tu Detalle no será responsable por daños indirectos, pérdida de
        contenido o perjuicios derivados del uso del sitio o del contenido creado
        por los usuarios.
      </p>

      <h2>10. Cambios en los términos</h2>
      <p>
        Podemos actualizar estos términos. La versión vigente estará siempre en esta
        página; si sigues usando el sitio después de un cambio, se entiende que lo
        aceptas.
      </p>

      <h2>11. Ley aplicable</h2>
      <p>
        Estos términos se rigen por las leyes de {COUNTRY}. Cualquier controversia
        se someterá a los tribunales competentes de ese país.
      </p>

      <h2>12. Contacto</h2>
      <p>
        Para cualquier consulta escríbenos a{" "}
        <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
      </p>
    </LegalLayout>
  );
}