import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Save, Mail, Phone } from "lucide-react";

interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  career: string | null;
  year: number | null;
  gender: string | null;
  entrepreneur_type: string | null;
  project_name: string | null;
  project_description: string | null;
  project_sector: string | null;
  project_stage: string | null;
  team_status: string | null;
  team_size: number | null;
  support_areas: string[] | null;
}

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;

    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile(data);
      } else {
        // Create initial profile
        const newProfile = {
          user_id: user.id,
          full_name: user.user_metadata?.full_name || "",
          email: user.email || "",
          avatar_url: user.user_metadata?.avatar_url || "",
        };

        const { data: createdProfile, error: createError } = await supabase
          .from("profiles")
          .insert(newProfile)
          .select()
          .single();

        if (createError) throw createError;

        setProfile(createdProfile);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo cargar el perfil",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user || !profile) return;

    setSaving(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: profile.full_name,
          phone: profile.phone,
          career: profile.career,
          year: profile.year,
          gender: profile.gender,
          entrepreneur_type: profile.entrepreneur_type,
          project_name: profile.project_name,
          project_description: profile.project_description,
          project_sector: profile.project_sector,
          project_stage: profile.project_stage,
          team_status: profile.team_status,
          team_size: profile.team_size,
          support_areas: profile.support_areas,
        })
        .eq("user_id", user.id);

      if (error) throw error;

      toast({
        title: "Perfil actualizado",
        description: "Tu información ha sido guardada correctamente",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo actualizar el perfil",
      });
    } finally {
      setSaving(false);
    }
  };

  const updateProfile = (field: keyof Profile, value: any) => {
    if (!profile) return;
    setProfile({ ...profile, [field]: value });
  };

  if (!user) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Acceso Restringido</CardTitle>
            <CardDescription>
              Debes iniciar sesión para ver tu perfil.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse space-y-4">
          <Card>
            <CardHeader>
              <div className="h-6 bg-muted rounded w-1/4"></div>
            </CardHeader>
            <CardContent className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-10 bg-muted rounded"></div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={profile?.avatar_url || ""} alt={profile?.full_name || ""} />
                <AvatarFallback>
                  <User className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Mi Perfil
                </CardTitle>
                <CardDescription>
                  Actualiza tu información personal y de proyecto
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Información Personal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Nombre Completo</Label>
                <Input
                  id="full_name"
                  value={profile?.full_name || ""}
                  onChange={(e) => updateProfile("full_name", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    value={profile?.email || ""}
                    disabled
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    value={profile?.phone || ""}
                    onChange={(e) => updateProfile("phone", e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Género</Label>
                <Select
                  value={profile?.gender || ""}
                  onValueChange={(value) => updateProfile("gender", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona género" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="masculino">Masculino</SelectItem>
                    <SelectItem value="femenino">Femenino</SelectItem>
                    <SelectItem value="otro">Otro</SelectItem>
                    <SelectItem value="prefiero_no_decir">Prefiero no decir</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Academic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Información Académica</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="career">Carrera</Label>
                <Input
                  id="career"
                  value={profile?.career || ""}
                  onChange={(e) => updateProfile("career", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Año</Label>
                <Select
                  value={profile?.year?.toString() || ""}
                  onValueChange={(value) => updateProfile("year", parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona año" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}° año
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Project Information */}
        <Card>
          <CardHeader>
            <CardTitle>Información del Proyecto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="entrepreneur_type">Tipo de Emprendedor</Label>
              <Select
                value={profile?.entrepreneur_type || ""}
                onValueChange={(value) => updateProfile("entrepreneur_type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="con_idea">Con Idea</SelectItem>
                  <SelectItem value="sin_idea">Sin Idea</SelectItem>
                  <SelectItem value="en_desarrollo">En Desarrollo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="project_name">Nombre del Proyecto</Label>
                <Input
                  id="project_name"
                  value={profile?.project_name || ""}
                  onChange={(e) => updateProfile("project_name", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="project_sector">Sector</Label>
                <Input
                  id="project_sector"
                  value={profile?.project_sector || ""}
                  onChange={(e) => updateProfile("project_sector", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="project_description">Descripción del Proyecto</Label>
              <Textarea
                id="project_description"
                value={profile?.project_description || ""}
                onChange={(e) => updateProfile("project_description", e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="project_stage">Etapa del Proyecto</Label>
                <Select
                  value={profile?.project_stage || ""}
                  onValueChange={(value) => updateProfile("project_stage", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona etapa" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="idea">Idea</SelectItem>
                    <SelectItem value="prototipo">Prototipo</SelectItem>
                    <SelectItem value="desarrollo">Desarrollo</SelectItem>
                    <SelectItem value="lanzamiento">Lanzamiento</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="team_status">Estado del Equipo</Label>
                <Select
                  value={profile?.team_status || ""}
                  onValueChange={(value) => updateProfile("team_status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="buscando">Buscando Equipo</SelectItem>
                    <SelectItem value="completo">Equipo Completo</SelectItem>
                    <SelectItem value="individual">Trabajo Individual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="team_size">Tamaño del Equipo</Label>
                <Input
                  id="team_size"
                  type="number"
                  value={profile?.team_size || ""}
                  onChange={(e) => updateProfile("team_size", parseInt(e.target.value) || null)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            <Save className="h-4 w-4" />
            {saving ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </div>
      </div>
    </div>
  );
}