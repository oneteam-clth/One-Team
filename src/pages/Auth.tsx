import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff, Mail, Lock, ArrowLeft, CheckCircle2 } from "lucide-react";
import lookbookImage from "@/assets/lookbook-1.jpg";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const signInSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "Mínimo 6 caracteres" }),
  remember: z.boolean().optional(),
});

const signUpSchema = z
  .object({
    email: z.string().email({ message: "Email inválido" }),
    password: z.string().min(6, { message: "Mínimo 6 caracteres" }),
    confirm: z.string().min(6, { message: "Confirmá tu contraseña" }),
    terms: z.boolean().refine((v) => v, { message: "Aceptá los términos" }),
  })
  .refine((data) => data.password === data.confirm, {
    path: ["confirm"],
    message: "Las contraseñas no coinciden",
  });

const Auth = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, signInWithGoogle, forgotPassword, resendVerification, user } = useAuth();
  const navigate = useNavigate();

  if (user) {
    navigate("/");
    return null;
  }

  const signInForm = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "", remember: true },
    mode: "onChange",
  });

  const signUpForm = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: "", password: "", confirm: "", terms: false },
    mode: "onChange",
  });

  const passwordStrength = useMemo(() => {
    const val = signUpForm.getValues("password") || "";
    const score = [/[a-z]/, /[A-Z]/, /\d/, /.{8,}/].reduce((s, r) => s + Number(r.test(val)), 0);
    return Math.min(score, 4);
  }, [signUpForm.watch("password")]);

  const handleSignIn = async (values: z.infer<typeof signInSchema>) => {
    setLoading(true);
    const { error } = await signIn(values.email, values.password);
    if (error) {
      toast.error(error.message || "Error al iniciar sesión");
    } else {
      if (values.remember) toast.message("Sesión recordada en este dispositivo");
      navigate("/");
    }
    setLoading(false);
  };

  const handleSignUp = async (values: z.infer<typeof signUpSchema>) => {
    setLoading(true);
    const { error } = await signUp(values.email, values.password);
    if (error) {
      toast.error(error.message || "Error al registrarse");
    } else {
      toast.success("Cuenta creada. Revisá tu email para verificarla.");
    }
    setLoading(false);
  };

  const handleForgot = async () => {
    const email = signInForm.getValues("email");
    if (!email) {
      toast.message("Ingresá tu email en el campo de arriba");
      return;
    }
    const { error } = await forgotPassword(email);
    if (error) toast.error(error.message);
    else toast.success("Te enviamos un email para recuperar tu contraseña");
  };

  const handleResend = async () => {
    const email = signUpForm.getValues("email");
    if (!email) {
      toast.message("Ingresá tu email para reenviar verificación");
      return;
    }
    const { error } = await resendVerification(email);
    if (error) toast.error(error.message);
    else toast.success("Reenviamos el email de verificación");
  };

  const handleGoogle = async () => {
    const { error } = await signInWithGoogle();
    if (error) toast.error(error.message);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(0,0,0,0.04),transparent_50%)]" />

      <div className="container grid min-h-screen items-center gap-8 px-4 py-12 md:grid-cols-2">
        <div className="relative hidden overflow-hidden rounded-2xl border md:block">
          <img src={lookbookImage} alt="One Team" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-background/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <h2 className="text-3xl font-bold">One Team</h2>
            <p className="mt-2 text-sm text-muted-foreground">Básicos que se sienten equipo.</p>
            <div className="mt-6 flex gap-3 text-xs text-muted-foreground">
              <span>• Envío a todo el país</span>
              <span>• Pago seguro</span>
              <span>• Cambios sin cargo</span>
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-md">
          <Link to="/" className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" /> Volver al inicio
          </Link>

          <Card className="backdrop-blur supports-[backdrop-filter]:bg-background/70">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Bienvenido</CardTitle>
              <CardDescription>Iniciá sesión o creá una cuenta para continuar</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="signin">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signin">Iniciar Sesión</TabsTrigger>
                  <TabsTrigger value="signup">Registrarse</TabsTrigger>
                </TabsList>

                <TabsContent value="signin">
                  <Form {...signInForm}>
                    <form onSubmit={signInForm.handleSubmit(handleSignIn)} className="mt-4 space-y-4">
                      <FormField
                        control={signInForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <Label htmlFor="signin-email">Email</Label>
                            <div className="relative">
                              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                              <FormControl>
                                <Input id="signin-email" type="email" className="pl-9" placeholder="tu@email.com" {...field} />
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={signInForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <Label htmlFor="signin-password">Contraseña</Label>
                            <div className="relative">
                              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                              <FormControl>
                                <Input id="signin-password" type={showPassword ? "text" : "password"} className="pl-9 pr-9" {...field} />
                              </FormControl>
                              <button
                                type="button"
                                onClick={() => setShowPassword((s) => !s)}
                                className="absolute inset-y-0 right-2 inline-flex items-center rounded px-2 text-muted-foreground hover:text-foreground"
                                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                              >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <label className="inline-flex items-center gap-2">
                                <input type="checkbox" className="accent-primary" {...signInForm.register('remember')} />
                                Recordarme
                              </label>
                              <button type="button" onClick={handleForgot} className="text-primary underline-offset-4 hover:underline">
                                ¿Olvidaste tu contraseña?
                              </button>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" className="w-full" disabled={loading || !signInForm.formState.isValid}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Iniciar Sesión
                      </Button>
                      <Button type="button" variant="outline" className="w-full" onClick={handleGoogle}>
                        Continuar con Google
                      </Button>
                    </form>
                  </Form>
                </TabsContent>

                <TabsContent value="signup">
                  <Form {...signUpForm}>
                    <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="mt-4 space-y-4">
                      <FormField
                        control={signUpForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <Label htmlFor="signup-email">Email</Label>
                            <div className="relative">
                              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                              <FormControl>
                                <Input id="signup-email" type="email" className="pl-9" placeholder="tu@email.com" {...field} />
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={signUpForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <Label htmlFor="signup-password">Contraseña</Label>
                            <div className="relative">
                              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                              <FormControl>
                                <Input id="signup-password" type={showPassword ? "text" : "password"} className="pl-9 pr-9" minLength={6} {...field} />
                              </FormControl>
                              <button
                                type="button"
                                onClick={() => setShowPassword((s) => !s)}
                                className="absolute inset-y-0 right-2 inline-flex items-center rounded px-2 text-muted-foreground hover:text-foreground"
                                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                              >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            </div>
                            <div className="mt-2 h-1 w-full overflow-hidden rounded bg-muted">
                              <div
                                className={`h-full transition-all ${
                                  passwordStrength >= 3
                                    ? 'w-3/4 bg-green-500'
                                    : passwordStrength === 2
                                    ? 'w-1/2 bg-yellow-500'
                                    : passwordStrength === 1
                                    ? 'w-1/4 bg-red-500'
                                    : 'w-0'
                                }`}
                              />
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={signUpForm.control}
                        name="confirm"
                        render={({ field }) => (
                          <FormItem>
                            <Label htmlFor="signup-confirm">Confirmar contraseña</Label>
                            <FormControl>
                              <Input id="signup-confirm" type={showPassword ? "text" : "password"} minLength={6} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={signUpForm.control}
                        name="terms"
                        render={({ field }) => (
                          <FormItem>
                            <label className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground">
                              <input type="checkbox" className="accent-primary" checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
                              Acepto los términos y políticas
                              {field.value && <span className="inline-flex items-center text-primary"><CheckCircle2 className="mr-1 h-3.5 w-3.5" />Ok</span>}
                            </label>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" className="w-full" disabled={loading || !signUpForm.formState.isValid}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Crear Cuenta
                      </Button>
                      <Button type="button" variant="outline" className="w-full" onClick={handleGoogle}>
                        Registrarse con Google
                      </Button>
                      <button type="button" onClick={handleResend} className="mt-2 w-full text-center text-xs text-primary underline-offset-4 hover:underline">
                        Reenviar email de verificación
                      </button>
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Auth;
