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
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { User, Save, Mail, Phone, Upload, Camera, Code, Briefcase, Heart, Users, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { UNIVERSITIES_CHILE, REGIONS_CHILE } from "@/data/chile-data";
import { sanitizeText, sanitizeEmail, sanitizePhone } from "@/lib/sanitizer";

interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  user_type: 'universitario' | 'no_universitario' | null;
  career: string | null;
  university: string | null;
  year: number | null;
  profession: string | null;
  experience_years: number | null;
  gender: string | null;
  entrepreneur_type: string | null;
  project_name: string | null;
  project_description: string | null;
  project_sector: string | null;
  project_stage: string | null;
  team_status: string | null;
  team_size: number | null;
  support_areas: string[] | null;
  is_technical: boolean | null;
  responsible_areas: string[] | null;
  seeking_areas: string[] | null;
  team_members: { name: string; areas: string[] }[] | null;
  hobbies: string[] | null;
  interests: string[] | null;
}

const BUSINESS_AREAS = [
  "Producto",
  "Ingeniería", 
  "Diseño",
  "Ventas y Marketing",
  "Operaciones"
];

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;
    fetchProfile();
  }, [user]);

  const isProfileComplete = (profile: Profile | null) => {
    if (!profile) return false;
    
    const baseFields = Boolean(
      profile.full_name &&
      profile.user_type &&
      profile.gender &&
      profile.entrepreneur_type &&
      profile.team_status &&
      profile.is_technical !== null &&
      profile.responsible_areas && profile.responsible_areas.length > 0
    );

    // Check if seeking areas are filled when actively seeking team
    const seekingComplete = profile.team_status !== 'buscando' || 
      (profile.seeking_areas && profile.seeking_areas.length > 0);

    if (profile.user_type === 'universitario') {
      return baseFields && seekingComplete && Boolean(
        profile.university &&
        profile.career &&
        profile.year
      );
    } else if (profile.user_type === 'no_universitario') {
      return baseFields && seekingComplete && Boolean(
        profile.profession &&
        profile.experience_years
      );
    }

    return false;
  };

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
        setProfile(data as unknown as Profile);
        
        if (isProfileComplete(data as Profile) && window.location.pathname === '/profile') {
          const fromLogin = sessionStorage.getItem('fromLogin');
          if (fromLogin) {
            sessionStorage.removeItem('fromLogin');
            navigate('/');
          }
        }
      } else {
        const newProfile = {
          user_id: user.id,
          full_name: user.user_metadata?.full_name || "",
          email: user.email || "",
          avatar_url: user.user_metadata?.avatar_url || null,
          team_status: 'buscando',
          user_type: 'universitario' as const,
        };

        const { data: createdProfile, error: createError } = await supabase
          .from("profiles")
          .insert(newProfile)
          .select()
          .single();

        if (createError) throw createError;

        setProfile({
          ...createdProfile,
          team_members: null
        } as Profile);
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

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: data.publicUrl })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      setProfile(prev => prev ? { ...prev, avatar_url: data.publicUrl } : null);

      toast({
        title: "Avatar actualizado",
        description: "Tu foto de perfil ha sido actualizada",
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo subir la imagen",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!user || !profile) return;

    const missingFields = [];
    
    if (!profile.full_name?.trim()) missingFields.push("Nombre completo");
    if (!profile.user_type) missingFields.push("Tipo de usuario");
    if (!profile.gender) missingFields.push("Género");
    if (!profile.entrepreneur_type) missingFields.push("Tipo de emprendedor");
    if (!profile.team_status) missingFields.push("Estado del equipo");
    if (profile.is_technical === null) missingFields.push("Perfil técnico");
    if (!profile.responsible_areas || profile.responsible_areas.length === 0) {
      missingFields.push("Áreas de responsabilidad");
    }

    if (profile.user_type === 'universitario') {
      if (!profile.university) missingFields.push("Universidad");
      if (!profile.career?.trim()) missingFields.push("Carrera");
      if (!profile.year) missingFields.push("Año");
    } else if (profile.user_type === 'no_universitario') {
      if (!profile.profession?.trim()) missingFields.push("Profesión");
      if (!profile.experience_years) missingFields.push("Años de experiencia");
    }

    if (profile.team_status === 'buscando' && (!profile.seeking_areas || profile.seeking_areas.length === 0)) {
      missingFields.push("Áreas que buscas en tu equipo");
    }

    if (missingFields.length > 0) {
      toast({
        variant: "destructive",
        title: "Campos obligatorios faltantes",
        description: `Completa los siguientes campos: ${missingFields.join(", ")}`,
      });
      return;
    }

    setSaving(true);

    try {
      const sanitizedProfile = {
        full_name: profile.full_name ? sanitizeText(profile.full_name, 100) : null,
        phone: profile.phone ? sanitizePhone(profile.phone) : null,
        user_type: profile.user_type,
        university: profile.university ? sanitizeText(profile.university, 255) : null,
        career: profile.career ? sanitizeText(profile.career, 255) : null,
        year: profile.year,
        profession: profile.profession ? sanitizeText(profile.profession, 255) : null,
        experience_years: profile.experience_years,
        gender: profile.gender,
        entrepreneur_type: profile.entrepreneur_type,
        project_name: profile.project_name ? sanitizeText(profile.project_name, 255) : null,
        project_description: profile.project_description ? sanitizeText(profile.project_description, 2000) : null,
        project_sector: profile.project_sector ? sanitizeText(profile.project_sector, 255) : null,
        project_stage: profile.project_stage,
        team_status: profile.team_status,
        team_size: profile.team_size,
        support_areas: profile.support_areas,
        is_technical: profile.is_technical,
        responsible_areas: profile.responsible_areas,
        seeking_areas: profile.seeking_areas,
        team_members: profile.team_members,
        hobbies: profile.hobbies,
        interests: profile.interests,
      };

      const { error } = await supabase
        .from("profiles")
        .update(sanitizedProfile)
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

  const addTeamMember = () => {
    const currentMembers = profile?.team_members || [];
    updateProfile("team_members", [...currentMembers, { name: "", areas: [] }]);
  };

  const updateTeamMember = (index: number, field: 'name' | 'areas', value: string | string[]) => {
    const currentMembers = profile?.team_members || [];
    const updatedMembers = [...currentMembers];
    updatedMembers[index] = { ...updatedMembers[index], [field]: value };
    updateProfile("team_members", updatedMembers);
  };

  const removeTeamMember = (index: number) => {
    const currentMembers = profile?.team_members || [];
    updateProfile("team_members", currentMembers.filter((_, i) => i !== index));
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
         {/* Header with Avatar Upload */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={profile?.avatar_url || ""} alt={profile?.full_name || ""} />
                  <AvatarFallback>
                    <User className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
                <label htmlFor="avatar-upload" className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground rounded-full p-1 cursor-pointer hover:bg-primary/90 transition-colors">
                  <Camera className="h-3 w-3" />
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={uploadAvatar}
                  className="hidden"
                  disabled={uploading}
                />
              </div>
              <div className="flex-1">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Mi Perfil
                  {!isProfileComplete(profile) && (
                    <Badge variant="outline" className="text-orange-600 border-orange-600">
                      Incompleto
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  {!isProfileComplete(profile) 
                    ? "Completa tu información para aparecer en el mural"
                    : "Actualiza tu información personal y de proyecto"
                  }
                </CardDescription>
                {uploading && (
                  <p className="text-sm text-muted-foreground mt-1">Subiendo imagen...</p>
                )}
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
            <div className="space-y-2">
              <Label htmlFor="user_type">Tipo de Usuario *</Label>
              <Select
                value={profile?.user_type || ""}
                onValueChange={(value) => updateProfile("user_type", value as 'universitario' | 'no_universitario')}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona tipo de usuario" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="universitario">Universitario</SelectItem>
                  <SelectItem value="no_universitario">No Universitario</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Nombre Completo *</Label>
                <Input
                  id="full_name"
                  value={profile?.full_name || ""}
                  onChange={(e) => updateProfile("full_name", e.target.value)}
                  required
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
                <Label htmlFor="phone">Teléfono (opcional)</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    value={profile?.phone || ""}
                    onChange={(e) => updateProfile("phone", e.target.value)}
                    className="pl-10"
                    placeholder="Ej: +56912345678"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Género *</Label>
                <Select
                  value={profile?.gender || ""}
                  onValueChange={(value) => updateProfile("gender", value)}
                  required
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

        {/* Academic/Professional Information */}
        {profile?.user_type === 'universitario' && (
          <Card>
            <CardHeader>
              <CardTitle>Información Académica</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="university">Universidad/Institución *</Label>
                  <Select
                    value={profile?.university || ""}
                    onValueChange={(value) => updateProfile("university", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona tu universidad" />
                    </SelectTrigger>
                    <SelectContent>
                      {UNIVERSITIES_CHILE.map((university) => (
                        <SelectItem key={university} value={university}>
                          {university}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="career">Carrera *</Label>
                    <Input
                      id="career"
                      value={profile?.career || ""}
                      onChange={(e) => updateProfile("career", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year">Año *</Label>
                    <Select
                      value={profile?.year?.toString() || ""}
                      onValueChange={(value) => updateProfile("year", parseInt(value))}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona año" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6].map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}° año
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {profile?.user_type === 'no_universitario' && (
          <Card>
            <CardHeader>
              <CardTitle>Información Profesional</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="profession">Profesión/Ocupación *</Label>
                  <Input
                    id="profession"
                    value={profile?.profession || ""}
                    onChange={(e) => updateProfile("profession", e.target.value)}
                    placeholder="Ej: Desarrollador, Diseñador, Consultor, etc."
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience_years">Años de Experiencia *</Label>
                  <Input
                    id="experience_years"
                    type="number"
                    value={profile?.experience_years || ""}
                    onChange={(e) => updateProfile("experience_years", parseInt(e.target.value) || null)}
                    placeholder="Años de experiencia laboral"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Project Information */}
        <Card>
          <CardHeader>
            <CardTitle>Información del Proyecto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="entrepreneur_type">Tipo de Emprendedor *</Label>
              <Select
                value={profile?.entrepreneur_type || ""}
                onValueChange={(value) => updateProfile("entrepreneur_type", value)}
                required
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
                <Label htmlFor="team_status">Estado del Equipo *</Label>
                <Select
                  value={profile?.team_status || ""}
                  onValueChange={(value) => updateProfile("team_status", value)}
                  required
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

        {/* Responsibility Areas and Team Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Áreas de Responsabilidad y Equipo
            </CardTitle>
            <CardDescription>
              Define qué áreas manejas y qué áreas necesitas en tu equipo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Technical Question */}
            <div className="space-y-3">
              <Label className="text-base font-medium">¿Eres técnico? *</Label>
              <p className="text-sm text-muted-foreground">
                Programadores, científicos o ingenieros que pueden construir el producto sin ayuda externa
              </p>
              <RadioGroup
                value={profile?.is_technical === null ? "" : profile?.is_technical ? "yes" : "no"}
                onValueChange={(value) => updateProfile("is_technical", value === "yes")}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="technical-yes" />
                  <Label htmlFor="technical-yes">Sí, soy técnico</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="technical-no" />
                  <Label htmlFor="technical-no">No, no soy técnico</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Responsible Areas */}
            <div className="space-y-3">
              <Label className="text-base font-medium">¿De qué áreas te puedes hacer responsable? *</Label>
              <p className="text-sm text-muted-foreground">
                Selecciona las áreas en las que puedes liderar y tomar responsabilidad
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {BUSINESS_AREAS.map((area) => (
                  <div key={area} className="flex items-center space-x-2">
                    <Checkbox
                      id={`responsible-${area}`}
                      checked={profile?.responsible_areas?.includes(area) || false}
                      onCheckedChange={(checked) => {
                        const currentAreas = profile?.responsible_areas || [];
                        if (checked) {
                          updateProfile("responsible_areas", [...currentAreas, area]);
                        } else {
                          updateProfile("responsible_areas", currentAreas.filter(a => a !== area));
                        }
                      }}
                    />
                    <Label htmlFor={`responsible-${area}`} className="text-sm">
                      {area}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Seeking Areas - Only show if looking for team */}
            {profile?.team_status === 'buscando' && (
              <div className="space-y-3">
                <Label className="text-base font-medium">¿Qué áreas buscas que tu cofundador maneje? *</Label>
                <p className="text-sm text-muted-foreground">
                  Selecciona las áreas donde necesitas ayuda de un cofundador
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {BUSINESS_AREAS.map((area) => (
                    <div key={area} className="flex items-center space-x-2">
                      <Checkbox
                        id={`seeking-${area}`}
                        checked={profile?.seeking_areas?.includes(area) || false}
                        onCheckedChange={(checked) => {
                          const currentAreas = profile?.seeking_areas || [];
                          if (checked) {
                            updateProfile("seeking_areas", [...currentAreas, area]);
                          } else {
                            updateProfile("seeking_areas", currentAreas.filter(a => a !== area));
                          }
                        }}
                      />
                      <Label htmlFor={`seeking-${area}`} className="text-sm">
                        {area}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Team Members - Only show if team is complete */}
            {profile?.team_status === 'completo' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">Miembros de tu equipo</Label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={addTeamMember}
                    className="gap-2"
                  >
                    <Users className="h-4 w-4" />
                    Agregar Miembro
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Define los miembros de tu equipo y sus áreas de responsabilidad
                </p>
                
                {profile?.team_members?.map((member, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Miembro {index + 1}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTeamMember(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`member-name-${index}`}>Nombre</Label>
                      <Input
                        id={`member-name-${index}`}
                        value={member.name}
                        onChange={(e) => updateTeamMember(index, 'name', e.target.value)}
                        placeholder="Nombre del miembro del equipo"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Áreas de responsabilidad</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {BUSINESS_AREAS.map((area) => (
                          <div key={area} className="flex items-center space-x-2">
                            <Checkbox
                              id={`member-${index}-${area}`}
                              checked={member.areas.includes(area)}
                              onCheckedChange={(checked) => {
                                const currentAreas = member.areas;
                                if (checked) {
                                  updateTeamMember(index, 'areas', [...currentAreas, area]);
                                } else {
                                  updateTeamMember(index, 'areas', currentAreas.filter(a => a !== area));
                                }
                              }}
                            />
                            <Label htmlFor={`member-${index}-${area}`} className="text-sm">
                              {area}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
                
                {(!profile?.team_members || profile.team_members.length === 0) && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No has agregado miembros del equipo aún</p>
                    <p className="text-sm">Haz clic en "Agregar Miembro" para comenzar</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Hobbies and Interests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Pasatiempos e Intereses
            </CardTitle>
            <CardDescription>
              Comparte tus pasatiempos e intereses para conectar mejor con otros emprendedores
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Hobbies */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Pasatiempos</Label>
              <p className="text-sm text-muted-foreground">
                ¿Qué te gusta hacer en tu tiempo libre?
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  "Videojuegos",
                  "Lectura",
                  "Deportes",
                  "Música",
                  "Cocina",
                  "Viajes",
                  "Fotografía",
                  "Arte",
                  "Cine",
                  "Baile",
                  "Jardinería",
                  "Escritura",
                  "Manualidades",
                  "Yoga",
                  "Senderismo"
                ].map((hobby) => (
                  <div key={hobby} className="flex items-center space-x-2">
                    <Checkbox
                      id={hobby}
                      checked={profile?.hobbies?.includes(hobby) || false}
                      onCheckedChange={(checked) => {
                        const currentHobbies = profile?.hobbies || [];
                        if (checked) {
                          updateProfile("hobbies", [...currentHobbies, hobby]);
                        } else {
                          updateProfile("hobbies", currentHobbies.filter(h => h !== hobby));
                        }
                      }}
                    />
                    <Label htmlFor={hobby} className="text-sm">
                      {hobby}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Interests */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Intereses</Label>
              <p className="text-sm text-muted-foreground">
                ¿Qué temas te interesan o te motivan?
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  "Tecnología",
                  "Emprendimiento",
                  "Sostenibilidad",
                  "Innovación",
                  "Educación",
                  "Salud",
                  "Finanzas",
                  "Marketing",
                  "Ciencia",
                  "Política",
                  "Cultura",
                  "Historia",
                  "Psicología",
                  "Filosofía",
                  "Medio ambiente"
                ].map((interest) => (
                  <div key={interest} className="flex items-center space-x-2">
                    <Checkbox
                      id={interest}
                      checked={profile?.interests?.includes(interest) || false}
                      onCheckedChange={(checked) => {
                        const currentInterests = profile?.interests || [];
                        if (checked) {
                          updateProfile("interests", [...currentInterests, interest]);
                        } else {
                          updateProfile("interests", currentInterests.filter(i => i !== interest));
                        }
                      }}
                    />
                    <Label htmlFor={interest} className="text-sm">
                      {interest}
                    </Label>
                  </div>
                ))}
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