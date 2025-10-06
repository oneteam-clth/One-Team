import lookbookImage from "@/assets/lookbook-1.jpg";

const About = () => {
  return (
    <div className="min-h-screen">
      <div className="container px-4 py-16">
        {/* Hero */}
        <div className="mb-16 text-center">
          <h1 className="mb-6 text-5xl font-bold">One Team</h1>
          <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
            Desde 2014, diseñando esenciales atemporales que combinan calidad,
            estilo deportivo y versatilidad urbana.
          </p>
        </div>

        {/* Story */}
        <div className="mb-16 grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="mb-6 text-3xl font-bold">Nuestra Historia</h2>
            <div className="space-y-4 text-lg text-muted-foreground">
              <p>
                One Team nace en 2014 con una visión clara: crear prendas básicas
                que no sean básicas. Cada pieza está pensada para durar, diseñada
                con atención al detalle y fabricada con los mejores materiales.
              </p>
              <p>
                Nuestro enfoque minimalista y deportivo refleja una filosofía de
                equipo: diseñamos para una comunidad que valora la calidad sobre
                las tendencias pasajeras, que busca prendas versátiles que los
                acompañen en cada momento.
              </p>
              <p>
                Dos colecciones definen nuestra identidad: Core Basics, los
                esenciales que necesitás en tu guardarropa, y Since 2014, piezas
                especiales que celebran nuestra trayectoria y evolución.
              </p>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
            <img
              src={lookbookImage}
              alt="One Team Story"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="mb-12 text-center text-3xl font-bold">Nuestros Valores</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-4 text-4xl font-bold text-primary">Calidad</div>
              <h3 className="mb-2 text-xl font-semibold">Sin Compromisos</h3>
              <p className="text-muted-foreground">
                Seleccionamos los mejores materiales y procesos de fabricación
                para garantizar prendas que duren.
              </p>
            </div>
            <div className="text-center">
              <div className="mb-4 text-4xl font-bold text-primary">Diseño</div>
              <h3 className="mb-2 text-xl font-semibold">Atemporal</h3>
              <p className="text-muted-foreground">
                Creamos piezas que trascienden las modas pasajeras, con líneas
                limpias y detalles sutiles.
              </p>
            </div>
            <div className="text-center">
              <div className="mb-4 text-4xl font-bold text-primary">Comunidad</div>
              <h3 className="mb-2 text-xl font-semibold">Equipo</h3>
              <p className="text-muted-foreground">
                Más que una marca, somos una comunidad que comparte valores de
                autenticidad y compromiso.
              </p>
            </div>
          </div>
        </div>

        {/* Commitment */}
        <div className="rounded-lg bg-muted p-8 text-center md:p-12">
          <h2 className="mb-4 text-3xl font-bold">Nuestro Compromiso</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Cada prenda que creamos lleva nuestra garantía de calidad. Si encontrás
            algún defecto de fábrica en los primeros 90 días, lo solucionamos sin
            costo. Porque cuando decimos que son básicos que se sienten equipo, lo
            decimos en serio.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
