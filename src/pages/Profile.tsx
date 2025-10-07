import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { User, MapPin, Package, Heart, Settings, Loader2, Camera } from "lucide-react";
import { Link } from "react-router-dom";

interface ProfileData {
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  birth_date: string | null;
  gender: string | null;
  dni: string | null;
  bio: string | null;
  avatar_url: string | null;
}

export default function Profile() {
  const { user, role } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<ProfileData>({
    first_name: null,
    last_name: null,
    phone: null,
    birth_date: null,
    gender: null,
    dni: null,
    bio: null,
    avatar_url: null,
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      toast.error('Error al cargar el perfil');
    } else if (data) {
      setProfile({
        first_name: (data as any).first_name || null,
        last_name: (data as any).last_name || null,
        phone: (data as any).phone || null,
        birth_date: (data as any).birth_date || null,
        gender: (data as any).gender || null,
        dni: (data as any).dni || null,
        bio: (data as any).bio || null,
        avatar_url: data.avatar_url || null,
      });
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({
        first_name: profile.first_name,
        last_name: profile.last_name,
        phone: profile.phone,
        birth_date: profile.birth_date,
        gender: profile.gender,
        dni: profile.dni,
        bio: profile.bio,
        avatar_url: profile.avatar_url,
      })
      .eq('id', user.id);

    if (error) {
      console.error('Error updating profile:', error);
      toast.error('Error al guardar el perfil');
    } else {
      toast.success('Perfil actualizado correctamente');
    }
    setSaving(false);
  };

  const getInitials = () => {
    if (profile.first_name && profile.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
    }
    return user?.email?.[0].toUpperCase() || 'U';
  };

  if (!user) {
    return (
      <div className="container px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Acceso Denegado</h1>
          <p className="text-muted-foreground mb-6">Necesitás iniciar sesión para ver tu perfil</p>
          <Link to="/auth">
            <Button>Iniciar Sesión</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container px-4 py-12">
        <div className="flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Mi Perfil</h1>

        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal">
              <User className="mr-2 h-4 w-4" />
              Personal
            </TabsTrigger>
            <TabsTrigger value="addresses">
              <MapPin className="mr-2 h-4 w-4" />
              Direcciones
            </TabsTrigger>
            <TabsTrigger value="orders">
              <Package className="mr-2 h-4 w-4" />
              Órdenes
            </TabsTrigger>
            <TabsTrigger value="wishlist">
              <Heart className="mr-2 h-4 w-4" />
              Favoritos
            </TabsTrigger>
          </TabsList>

          {/* INFORMACIÓN PERSONAL */}
          <TabsContent value="personal" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información Personal</CardTitle>
                <CardDescription>
                  Actualizá tu información personal y foto de perfil
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar */}
                <div className="flex items-center gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profile.avatar_url || undefined} />
                    <AvatarFallback className="text-2xl">{getInitials()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" size="sm">
                      <Camera className="mr-2 h-4 w-4" />
                      Cambiar Foto
                    </Button>
                    <p className="mt-2 text-xs text-muted-foreground">
                      JPG, PNG o GIF. Máximo 2MB.
                    </p>
                  </div>
                </div>

                {/* Email (read-only) */}
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={user.email || ''} disabled />
                  <p className="text-xs text-muted-foreground">
                    Tu email no se puede cambiar
                  </p>
                </div>

                {/* Nombre y Apellido */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">Nombre</Label>
                    <Input
                      id="first_name"
                      placeholder="Juan"
                      value={profile.first_name || ''}
                      onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Apellido</Label>
                    <Input
                      id="last_name"
                      placeholder="Pérez"
                      value={profile.last_name || ''}
                      onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                    />
                  </div>
                </div>

                {/* Teléfono y DNI */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+54 9 11 1234-5678"
                      value={profile.phone || ''}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dni">DNI</Label>
                    <Input
                      id="dni"
                      placeholder="12345678"
                      value={profile.dni || ''}
                      onChange={(e) => setProfile({ ...profile, dni: e.target.value })}
                    />
                  </div>
                </div>

                {/* Fecha de Nacimiento y Género */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="birth_date">Fecha de Nacimiento</Label>
                    <Input
                      id="birth_date"
                      type="date"
                      value={profile.birth_date || ''}
                      onChange={(e) => setProfile({ ...profile, birth_date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Género</Label>
                    <Select
                      value={profile.gender || ''}
                      onValueChange={(value) => setProfile({ ...profile, gender: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccioná tu género" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Masculino</SelectItem>
                        <SelectItem value="female">Femenino</SelectItem>
                        <SelectItem value="other">Otro</SelectItem>
                        <SelectItem value="prefer_not_to_say">Prefiero no decir</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <Label htmlFor="bio">Biografía</Label>
                  <Textarea
                    id="bio"
                    placeholder="Contanos un poco sobre vos..."
                    rows={4}
                    value={profile.bio || ''}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Máximo 500 caracteres
                  </p>
                </div>

                {/* Rol (read-only) */}
                {role !== 'customer' && (
                  <div className="space-y-2">
                    <Label>Rol</Label>
                    <Input 
                      value={role === 'super_admin' ? 'Super Administrador' : 'Administrador'} 
                      disabled 
                    />
                  </div>
                )}

                {/* Botón Guardar */}
                <div className="flex justify-end">
                  <Button onClick={handleSave} disabled={saving}>
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      'Guardar Cambios'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* DIRECCIONES */}
          <TabsContent value="addresses">
            <Card>
              <CardHeader>
                <CardTitle>Mis Direcciones</CardTitle>
                <CardDescription>
                  Gestioná tus direcciones de envío
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Funcionalidad próximamente...</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ÓRDENES */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Mis Órdenes</CardTitle>
                <CardDescription>
                  Revisá el historial de tus compras
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Funcionalidad próximamente...</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* FAVORITOS */}
          <TabsContent value="wishlist">
            <Card>
              <CardHeader>
                <CardTitle>Mis Favoritos</CardTitle>
                <CardDescription>
                  Productos que guardaste para más tarde
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/wishlist">
                  <Button variant="outline">Ver Wishlist</Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
