import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate newsletter signup
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success("¡Gracias por suscribirte!");
    setEmail("");
    setLoading(false);
  };

  return (
    <section className="bg-muted py-16">
      <div className="container px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold">Unite al equipo</h2>
          <p className="mb-8 text-muted-foreground">
            Recibí novedades, lanzamientos y descuentos exclusivos.
          </p>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1"
            />
            <Button type="submit" disabled={loading}>
              {loading ? "Enviando..." : "Suscribirme"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
