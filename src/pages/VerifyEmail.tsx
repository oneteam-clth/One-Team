import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, ArrowLeft, RefreshCw, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";
  const [resending, setResending] = useState(false);

  const handleResend = async () => {
    if (!email) {
      toast.error("No se encontró el email");
      return;
    }

    setResending(true);
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
    });

    if (error) {
      toast.error("Error al reenviar email de verificación");
    } else {
      toast.success("Email de verificación reenviado. Revisá tu bandeja de entrada.");
    }
    setResending(false);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(0,0,0,0.04),transparent_50%)]" />

      <div className="container flex min-h-screen items-center justify-center px-4 py-12">
        <div className="mx-auto w-full max-w-md">
          <Link to="/" className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" /> Volver al inicio
          </Link>

          <Card className="backdrop-blur supports-[backdrop-filter]:bg-background/70">
            <CardHeader className="space-y-1 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/20">
                <Mail className="h-8 w-8 text-yellow-600" />
              </div>
              <CardTitle className="text-2xl">Verificá tu email</CardTitle>
              <CardDescription>
                Te enviamos un email de verificación
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900 dark:bg-yellow-900/20">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  Enviamos un email de verificación a:
                </p>
                <p className="mt-1 font-medium text-yellow-900 dark:text-yellow-100">
                  {email || "tu email"}
                </p>
              </div>

              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                  <p>Abrí tu bandeja de entrada y buscá el email de One Team</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                  <p>Hacé clic en el link de verificación</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                  <p>Volvé a esta página e iniciá sesión</p>
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleResend}
                  disabled={resending || !email}
                >
                  {resending ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Reenviando...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Reenviar email de verificación
                    </>
                  )}
                </Button>

                <Button
                  variant="default"
                  className="w-full"
                  onClick={() => navigate("/auth")}
                >
                  Ir a iniciar sesión
                </Button>
              </div>

              <div className="rounded-lg border bg-muted/50 p-3 text-xs text-muted-foreground">
                <p className="font-medium">¿No recibiste el email?</p>
                <ul className="mt-2 space-y-1 pl-4">
                  <li>• Revisá tu carpeta de spam o correo no deseado</li>
                  <li>• Verificá que el email sea correcto</li>
                  <li>• Esperá unos minutos, puede tardar</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
