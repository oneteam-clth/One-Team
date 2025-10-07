import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Mail, X, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export default function EmailVerificationBanner() {
  const { user, isEmailVerified, resendVerification, signOut } = useAuth();
  const [dismissed, setDismissed] = useState(false);
  const [resending, setResending] = useState(false);

  // No mostrar si no hay usuario, si está verificado, o si fue cerrado
  if (!user || isEmailVerified || dismissed) {
    return null;
  }

  const handleResend = async () => {
    if (!user.email) return;
    
    setResending(true);
    const { error } = await resendVerification(user.email);
    
    if (error) {
      toast.error("Error al reenviar email de verificación");
    } else {
      toast.success("Email de verificación reenviado. Revisá tu bandeja de entrada.");
    }
    
    setResending(false);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.message("Sesión cerrada. Verificá tu email y volvé a iniciar sesión.");
    } catch (error) {
      console.error('Error signing out:', error);
      // Forzar cierre de sesión limpiando localStorage
      localStorage.clear();
      window.location.href = '/auth';
    }
  };

  return (
    <Alert className="relative border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20">
      <Mail className="h-4 w-4 text-yellow-600" />
      <AlertDescription className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <p className="font-medium text-yellow-800 dark:text-yellow-200">
            Email no verificado
          </p>
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            Revisá tu bandeja de entrada ({user.email}) y hacé clic en el link de verificación.
            Algunas funcionalidades están limitadas hasta que verifiques tu email.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleResend}
            disabled={resending}
            className="border-yellow-600 text-yellow-700 hover:bg-yellow-100 dark:text-yellow-300"
          >
            {resending ? (
              <>
                <RefreshCw className="mr-2 h-3 w-3 animate-spin" />
                Reenviando...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-3 w-3" />
                Reenviar email
              </>
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="text-yellow-700 hover:bg-yellow-100 dark:text-yellow-300"
          >
            Cerrar sesión
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDismissed(true)}
            className="h-6 w-6 text-yellow-700 hover:bg-yellow-100 dark:text-yellow-300"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
