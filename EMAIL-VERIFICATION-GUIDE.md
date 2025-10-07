# ✉️ Sistema de Verificación de Email - Guía Completa

## 📋 Resumen

He implementado un sistema completo de verificación de email que:

1. ✅ **Valida formato de email** antes de permitir registro
2. ✅ **Detecta si el email está verificado** automáticamente
3. ✅ **Muestra banner de advertencia** cuando el email no está verificado
4. ✅ **Bloquea checkout** hasta que el usuario verifique su email
5. ✅ **Permite reenviar email de verificación** fácilmente
6. ✅ **No redirige automáticamente** después del registro

---

## 🎯 Flujo de Usuario

### **Antes (Problemático):**

1. Usuario se registra con cualquier email
2. Supabase crea la cuenta aunque el email no exista
3. Usuario es redirigido al home como si estuviera logueado
4. Puede intentar comprar sin verificar email
5. Confusión total

### **Ahora (Mejorado):**

1. Usuario se registra con un email
2. Se valida el formato del email
3. Supabase crea la cuenta y envía email de verificación
4. Usuario ve mensaje de éxito con instrucciones claras
5. **Banner amarillo aparece** indicando que debe verificar su email
6. Usuario **NO puede comprar** hasta verificar
7. Puede reenviar el email de verificación desde el banner
8. Una vez verificado, el banner desaparece automáticamente

---

## 🛠️ Archivos Modificados/Creados

### **1. `src/contexts/AuthContext.tsx` (Actualizado)**

**Nuevas propiedades:**

```ts
interface AuthContextType {
  // ... propiedades existentes
  isEmailVerified: boolean;  // ← NUEVO
}
```

**Lógica agregada:**

- Detecta automáticamente si `user.email_confirmed_at` existe
- Actualiza `isEmailVerified` en cada cambio de sesión
- Se sincroniza con Supabase en tiempo real

### **2. `src/components/EmailVerificationBanner.tsx` (Nuevo)**

Banner que se muestra cuando el email no está verificado.

**Características:**

- 🟡 Diseño amarillo de advertencia (no es error, es info)
- ✉️ Muestra el email del usuario
- 🔄 Botón para reenviar email de verificación
- 🚪 Botón para cerrar sesión
- ❌ Botón para cerrar el banner (temporalmente)

**Ubicación:** Debajo del Header, visible en todas las páginas

### **3. `src/App.tsx` (Actualizado)**

Agregado el banner globalmente:

```tsx
<Header />
<EmailVerificationBanner />  {/* ← NUEVO */}
<main>...</main>
```

### **4. `src/pages/Auth.tsx` (Actualizado)**

**Mejoras en el registro:**

- Validación de formato de email antes de enviar a Supabase
- Mensaje de éxito más claro con instrucciones
- **NO redirige automáticamente** después del registro
- Solo redirige si el usuario está verificado

**Mejoras en el login:**

- Solo redirige si `user && isEmailVerified`
- Si el usuario no está verificado, se queda en `/auth` y ve el banner

### **5. `src/pages/Checkout.tsx` (Actualizado)**

**Validación agregada:**

```ts
if (!isEmailVerified) {
  setError("Necesitás verificar tu email antes de poder comprar.");
  return;
}
```

El botón de pago se bloquea hasta que el email esté verificado.

---

## 🔒 Seguridad y UX

### **Validaciones Implementadas:**

1. **Formato de Email:**

   ```ts
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   if (!emailRegex.test(email)) {
     toast.error("El formato del email no es válido");
     return;
   }
   ```

2. **Estado de Verificación:**

   ```ts
   const isEmailVerified = user.email_confirmed_at !== null;
   ```

3. **Bloqueo de Funcionalidades:**
   - ❌ No puede comprar sin verificar
   - ✅ Puede navegar la tienda
   - ✅ Puede agregar al carrito
   - ✅ Puede ver productos

---

## 📱 Experiencia de Usuario

### **Registro:**

1. Usuario completa el formulario
2. Click en "Registrarse"
3. Ve toast de éxito: "Cuenta creada exitosamente - Te enviamos un email de verificación..."
4. **Permanece en `/auth`** (no redirige)
5. Ve el banner amarillo con instrucciones

### **Verificación:**

1. Usuario revisa su email
2. Click en el link de verificación
3. Supabase confirma el email
4. Usuario vuelve a la app
5. Banner desaparece automáticamente
6. Puede comprar normalmente

### **Si no recibe el email:**

1. Usuario ve el banner
2. Click en "Reenviar email"
3. Toast: "Email de verificación reenviado"
4. Revisa bandeja de entrada y spam

---

## 🎨 Diseño del Banner

```tsx
<Alert className="border-yellow-500 bg-yellow-50">
  <Mail className="h-4 w-4 text-yellow-600" />
  <AlertDescription>
    <p className="font-medium text-yellow-800">
      Email no verificado
    </p>
    <p className="text-sm text-yellow-700">
      Revisá tu bandeja de entrada ({user.email})...
    </p>
    
    <Button>Reenviar email</Button>
    <Button>Cerrar sesión</Button>
    <Button>×</Button>
  </AlertDescription>
</Alert>
```

**Colores:**

- 🟡 Amarillo (advertencia, no error)
- Texto legible en light y dark mode
- Botones con hover states

---

## 🧪 Testing

### **Caso 1: Registro Normal**

1. Andá a `/auth`
2. Registrate con un email real
3. ✅ Deberías ver toast de éxito
4. ✅ Deberías permanecer en `/auth`
5. ✅ Deberías ver el banner amarillo
6. ✅ Revisá tu email y verificá

### **Caso 2: Email Inválido**

1. Intentá registrarte con "test@test"
2. ✅ Deberías ver error: "El formato del email no es válido"
3. ✅ No se crea la cuenta

### **Caso 3: Reenviar Verificación**

1. Registrate
2. Click en "Reenviar email" en el banner
3. ✅ Deberías ver toast de éxito
4. ✅ Deberías recibir otro email

### **Caso 4: Intentar Comprar sin Verificar**

1. Registrate (sin verificar)
2. Agregá productos al carrito
3. Andá a `/checkout`
4. Click en "Pagar con Mercado Pago"
5. ✅ Deberías ver error: "Necesitás verificar tu email..."

### **Caso 5: Después de Verificar**

1. Verificá tu email (click en link)
2. Volvé a la app
3. ✅ El banner debería desaparecer
4. ✅ Deberías poder comprar normalmente

---

## 🔧 Configuración de Supabase

### **Email Templates (Opcional)**

Podés personalizar los emails en Supabase:

1. Andá a **Authentication > Email Templates**
2. Editá "Confirm signup"
3. Personalizá el mensaje:

```html
<h2>Bienvenido a One Team!</h2>
<p>Gracias por registrarte. Hacé clic en el botón para verificar tu email:</p>
<a href="{{ .ConfirmationURL }}">Verificar Email</a>
```

### **Redirect URLs**

Asegurate de tener configuradas las URLs de redirección:

1. **Authentication > URL Configuration**
2. **Site URL:** `https://tu-dominio.com`
3. **Redirect URLs:**
   - `http://localhost:8080`
   - `https://tu-dominio.com`

---

## 💡 Mejoras Futuras (Opcionales)

### **1. Validación de Email Real con API Externa**

Podés usar un servicio como [Abstract API](https://www.abstractapi.com/email-verification-validation-api) para verificar si el email existe:

```ts
const validateEmail = async (email: string) => {
  const response = await fetch(
    `https://emailvalidation.abstractapi.com/v1/?api_key=YOUR_KEY&email=${email}`
  );
  const data = await response.json();
  return data.deliverability === "DELIVERABLE";
};
```

### **2. Rate Limiting en Reenvío**

Limitar cuántas veces se puede reenviar el email:

```ts
const [resendCount, setResendCount] = useState(0);
const [lastResend, setLastResend] = useState<Date | null>(null);

const canResend = () => {
  if (!lastResend) return true;
  const diff = Date.now() - lastResend.getTime();
  return diff > 60000; // 1 minuto
};
```

### **3. Recordatorio Automático**

Mostrar un modal después de X minutos si el email no está verificado:

```ts
useEffect(() => {
  if (!isEmailVerified && user) {
    const timer = setTimeout(() => {
      toast.message("Recordá verificar tu email para poder comprar");
    }, 5 * 60 * 1000); // 5 minutos
    
    return () => clearTimeout(timer);
  }
}, [isEmailVerified, user]);
```

### **4. Verificación por SMS (Alternativa)**

Agregar opción de verificar por SMS para usuarios que no reciben el email.

---

## ❓ FAQ

### **¿Qué pasa si el usuario nunca verifica su email?**

- Puede navegar la tienda
- Puede agregar al carrito
- **NO puede comprar**
- Ve el banner en todas las páginas

### **¿El banner se puede cerrar permanentemente?**

No, solo temporalmente. Se vuelve a mostrar al recargar la página. Esto es intencional para recordarle al usuario que debe verificar.

### **¿Qué pasa si el usuario verifica su email en otro dispositivo?**

El estado se sincroniza automáticamente. Al recargar la página, Supabase detecta que el email está verificado y actualiza `isEmailVerified`.

### **¿Funciona con Google OAuth?**

Sí, Google OAuth verifica automáticamente el email, por lo que `isEmailVerified` será `true` desde el inicio.

### **¿Puedo deshabilitar la verificación de email?**

Sí, en Supabase:

1. **Authentication > Providers > Email**

2. Desactivá "Confirm email"

Pero **NO es recomendado** para producción.

---

## ✅ Checklist de Implementación

- [x] Agregar `isEmailVerified` al AuthContext
- [x] Crear componente `EmailVerificationBanner`
- [x] Agregar banner a `App.tsx`
- [x] Actualizar `Auth.tsx` para no redirigir sin verificar
- [x] Validar formato de email en registro
- [x] Bloquear checkout sin verificación
- [x] Mejorar mensajes de toast
- [x] Testing completo del flujo

---

## 🎉 Resultado Final

**Antes:**

- ❌ Usuarios con emails falsos
- ❌ Confusión sobre estado de cuenta
- ❌ Pueden comprar sin verificar
- ❌ Mala experiencia

**Ahora:**

- ✅ Solo emails válidos
- ✅ Estado claro con banner visible
- ✅ No pueden comprar sin verificar
- ✅ Flujo intuitivo y seguro
- ✅ Fácil reenvío de verificación

---

## 📞 Soporte

Si tenés problemas:

1. **Verificá la consola del navegador** (F12)
2. **Revisá los logs de Supabase** (Dashboard > Logs)
3. **Verificá las Email Templates** en Supabase
4. **Asegurate que las Redirect URLs** estén configuradas

**Logs útiles:**

```
[Auth] Event: SIGNED_IN
[Auth] Event: SIGNED_OUT
[Auth] Error fetching role: ...
```

---

¡El sistema de verificación de email está completo y funcionando! 🚀
