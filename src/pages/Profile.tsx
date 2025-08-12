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
import { User, Save, Mail, Phone, Upload, Camera, Code, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  seeking_technical: string | null;
  technical_skills: string[] | null;
  non_technical_skills: string[] | null;
  seeking_technical_skills: string[] | null;
  seeking_non_technical_skills: string[] | null;
}

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
      profile.seeking_technical !== null
    );

    // Check if skills are filled based on technical status
    const skillsComplete = profile.is_technical 
      ? Boolean(profile.technical_skills && profile.technical_skills.length > 0)
      : Boolean(profile.non_technical_skills && profile.non_technical_skills.length > 0);

    // Check if seeking skills are filled when seeking_technical is defined
    const seekingSkillsComplete = profile.seeking_technical === "technical" 
      ? Boolean(profile.seeking_technical_skills && profile.seeking_technical_skills.length > 0)
      : profile.seeking_technical === "non_technical"
        ? Boolean(profile.seeking_non_technical_skills && profile.seeking_non_technical_skills.length > 0)
        : true;

    if (profile.user_type === 'universitario') {
      return baseFields && skillsComplete && seekingSkillsComplete && Boolean(
        profile.university &&
        profile.career &&
        profile.year
      );
    } else if (profile.user_type === 'no_universitario') {
      return baseFields && skillsComplete && seekingSkillsComplete && Boolean(
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
        setProfile(data as Profile);
        // Check if profile is complete and if we're not on profile page, redirect to home
        if (isProfileComplete(data as Profile) && window.location.pathname === '/profile') {
          // Only redirect if we came from login, not manual navigation
          const fromLogin = sessionStorage.getItem('fromLogin');
          if (fromLogin) {
            sessionStorage.removeItem('fromLogin');
            navigate('/');
          }
        }
      } else {
        // Create initial profile with default team_status
        const newProfile = {
          user_id: user.id,
          full_name: user.user_metadata?.full_name || "",
          email: user.email || "",
          avatar_url: user.user_metadata?.avatar_url || "",
          team_status: 'buscando', // Default to actively searching
          user_type: 'universitario' as const, // Default to university user
        };

        const { data: createdProfile, error: createError } = await supabase
          .from("profiles")
          .insert(newProfile)
          .select()
          .single();

        if (createError) throw createError;

        setProfile(createdProfile as Profile);
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

    setSaving(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: profile.full_name,
          phone: profile.phone,
          user_type: profile.user_type,
          university: profile.university,
          career: profile.career,
          year: profile.year,
          profession: profile.profession,
          experience_years: profile.experience_years,
          gender: profile.gender,
          entrepreneur_type: profile.entrepreneur_type,
          project_name: profile.project_name,
          project_description: profile.project_description,
          project_sector: profile.project_sector,
          project_stage: profile.project_stage,
          team_status: profile.team_status,
          team_size: profile.team_size,
          support_areas: profile.support_areas,
          is_technical: profile.is_technical,
          seeking_technical: profile.seeking_technical,
          technical_skills: profile.technical_skills,
          non_technical_skills: profile.non_technical_skills,
          seeking_technical_skills: profile.seeking_technical_skills,
          seeking_non_technical_skills: profile.seeking_non_technical_skills,
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
            {/* User Type Selection */}
            <div className="space-y-2">
              <Label htmlFor="user_type">Tipo de Usuario</Label>
              <Select
                value={profile?.user_type || ""}
                onValueChange={(value) => updateProfile("user_type", value as 'universitario' | 'no_universitario')}
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

        {/* Academic/Professional Information */}
        {profile?.user_type === 'universitario' && (
          <Card>
            <CardHeader>
              <CardTitle>Información Académica</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="university">Universidad/Institución</Label>
                  <Input
                    id="university"
                    value={profile?.university || ""}
                    onChange={(e) => updateProfile("university", e.target.value)}
                    placeholder="Ej: Universidad de Chile, DUOC UC, etc."
                  />
                </div>
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
                  <Label htmlFor="profession">Profesión/Ocupación</Label>
                  <Input
                    id="profession"
                    value={profile?.profession || ""}
                    onChange={(e) => updateProfile("profession", e.target.value)}
                    placeholder="Ej: Desarrollador, Diseñador, Consultor, etc."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience_years">Años de Experiencia</Label>
                  <Input
                    id="experience_years"
                    type="number"
                    value={profile?.experience_years || ""}
                    onChange={(e) => updateProfile("experience_years", parseInt(e.target.value) || null)}
                    placeholder="Años de experiencia laboral"
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

        {/* Technical Skills Section */}
        {(profile?.team_status === 'buscando' || profile?.entrepreneur_type === 'con_idea' || profile?.entrepreneur_type === 'en_desarrollo') && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Perfil Técnico
              </CardTitle>
              <CardDescription>
                Define tu perfil técnico y qué tipo de colaborador buscas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Is Technical */}
              <div className="space-y-3">
                <Label className="text-base font-medium">¿Eres técnico?</Label>
                <p className="text-sm text-muted-foreground">
                  Ser técnico significa tener las habilidades para construir un producto uno mismo
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

              {/* Seeking Technical */}
              <div className="space-y-3">
                <Label className="text-base font-medium">¿Qué tipo de colaborador buscas?</Label>
                <RadioGroup
                  value={profile?.seeking_technical || ""}
                  onValueChange={(value) => updateProfile("seeking_technical", value)}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="technical" id="seeking-technical" />
                    <Label htmlFor="seeking-technical">Busco un perfil técnico</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="non_technical" id="seeking-non-technical" />
                    <Label htmlFor="seeking-non-technical">Busco un perfil no técnico</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="none" id="seeking-none" />
                    <Label htmlFor="seeking-none">No busco colaboradores actualmente</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Seeking Skills */}
              {(profile?.seeking_technical === "technical" || profile?.seeking_technical === "non_technical") && (
                <div className="space-y-3">
                  <Label className="text-base font-medium">
                    Habilidades que busco en mi equipo (máximo 3)
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Selecciona 2-3 habilidades que más necesitas en tu equipo
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {profile.seeking_technical === "technical" ? (
                      // Technical Skills they're seeking
                      [
                        "Desarrollo web y móvil (MVP rápido)",
                        "Manejo de bases de datos y backend ágil",
                        "Integraciones con APIs y automatización (n8n, Zapier, Make)",
                        "Análisis de datos y métricas clave (KPI, cohortes, CAC, LTV)",
                        "UX/UI design centrado en el usuario",
                        "Marketing digital (SEO, SEM, social ads)",
                        "Email marketing y automatizaciones de ventas",
                        "E-commerce y pasarelas de pago",
                        "Growth hacking (experimentos de adquisición y retención)",
                        "Gestión de herramientas SaaS para productividad y colaboración",
                        "Seguridad básica y compliance (privacidad, pagos)",
                        "Prototipado rápido (Figma, Canva, Webflow, Bubble)",
                        "Creación de contenido audiovisual (videos, reels, podcast)",
                        "Herramientas de financiamiento colectivo (crowdfunding)",
                        "Gestión de servidores y cloud en bajo costo (AWS, GCP, DigitalOcean)"
                      ].map((skill) => {
                        const currentSeekingSkills = profile.seeking_technical_skills || [];
                        const isSelected = currentSeekingSkills.includes(skill);
                        const canSelect = currentSeekingSkills.length < 3 || isSelected;
                        
                        return (
                          <div key={skill} className="flex items-center space-x-2">
                            <Checkbox
                              id={`seeking-${skill}`}
                              checked={isSelected}
                              disabled={!canSelect}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  updateProfile("seeking_technical_skills", [...currentSeekingSkills, skill]);
                                } else {
                                  updateProfile("seeking_technical_skills", currentSeekingSkills.filter(s => s !== skill));
                                }
                              }}
                            />
                            <Label htmlFor={`seeking-${skill}`} className="text-sm leading-tight">
                              {skill}
                            </Label>
                          </div>
                        );
                      })
                    ) : (
                      // Non-Technical Skills they're seeking
                      [
                        "Validación de ideas de negocio (Lean Startup)",
                        "Diseño y presentación de pitch para inversionistas",
                        "Networking y construcción de alianzas estratégicas",
                        "Negociación con clientes, partners e inversionistas",
                        "Gestión de equipos pequeños y multidisciplinarios",
                        "Inteligencia emocional para manejar incertidumbre",
                        "Adaptabilidad extrema y pivotaje rápido",
                        "Storytelling para ventas y marketing",
                        "Orientación obsesiva al cliente y su feedback",
                        "Gestión del tiempo y priorización radical",
                        "Búsqueda y manejo de capital (bootstrapping, VC, grants)",
                        "Liderazgo inspirador en etapas de alto riesgo",
                        "Creación y defensa de propuesta de valor única",
                        "Capacidad de vender antes de construir (preventa)",
                        "Toma de decisiones rápidas con información incompleta"
                      ].map((skill) => {
                        const currentSeekingSkills = profile.seeking_non_technical_skills || [];
                        const isSelected = currentSeekingSkills.includes(skill);
                        const canSelect = currentSeekingSkills.length < 3 || isSelected;
                        
                        return (
                          <div key={skill} className="flex items-center space-x-2">
                            <Checkbox
                              id={`seeking-${skill}`}
                              checked={isSelected}
                              disabled={!canSelect}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  updateProfile("seeking_non_technical_skills", [...currentSeekingSkills, skill]);
                                } else {
                                  updateProfile("seeking_non_technical_skills", currentSeekingSkills.filter(s => s !== skill));
                                }
                              }}
                            />
                            <Label htmlFor={`seeking-${skill}`} className="text-sm leading-tight">
                              {skill}
                            </Label>
                          </div>
                        );
                      })
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Máximo 3 habilidades. Se deshabilitarán las opciones una vez alcanzado el límite.
                  </p>
                </div>
              )}

              {/* Skills Selection */}
              {profile?.is_technical !== null && (
                <div className="space-y-3">
                  <Label className="text-base font-medium">
                    {profile.is_technical ? "Mis habilidades técnicas" : "Mis habilidades no técnicas"}
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {profile.is_technical ? (
                      // Technical Skills
                      [
                        "Desarrollo web y móvil (MVP rápido)",
                        "Manejo de bases de datos y backend ágil",
                        "Integraciones con APIs y automatización (n8n, Zapier, Make)",
                        "Análisis de datos y métricas clave (KPI, cohortes, CAC, LTV)",
                        "UX/UI design centrado en el usuario",
                        "Marketing digital (SEO, SEM, social ads)",
                        "Email marketing y automatizaciones de ventas",
                        "E-commerce y pasarelas de pago",
                        "Growth hacking (experimentos de adquisición y retención)",
                        "Gestión de herramientas SaaS para productividad y colaboración",
                        "Seguridad básica y compliance (privacidad, pagos)",
                        "Prototipado rápido (Figma, Canva, Webflow, Bubble)",
                        "Creación de contenido audiovisual (videos, reels, podcast)",
                        "Herramientas de financiamiento colectivo (crowdfunding)",
                        "Gestión de servidores y cloud en bajo costo (AWS, GCP, DigitalOcean)"
                      ].map((skill) => (
                        <div key={skill} className="flex items-center space-x-2">
                          <Checkbox
                            id={skill}
                            checked={profile.technical_skills?.includes(skill) || false}
                            onCheckedChange={(checked) => {
                              const currentSkills = profile.technical_skills || [];
                              if (checked) {
                                updateProfile("technical_skills", [...currentSkills, skill]);
                              } else {
                                updateProfile("technical_skills", currentSkills.filter(s => s !== skill));
                              }
                            }}
                          />
                          <Label htmlFor={skill} className="text-sm leading-tight">
                            {skill}
                          </Label>
                        </div>
                      ))
                    ) : (
                      // Non-Technical Skills
                      [
                        "Validación de ideas de negocio (Lean Startup)",
                        "Diseño y presentación de pitch para inversionistas",
                        "Networking y construcción de alianzas estratégicas",
                        "Negociación con clientes, partners e inversionistas",
                        "Gestión de equipos pequeños y multidisciplinarios",
                        "Inteligencia emocional para manejar incertidumbre",
                        "Adaptabilidad extrema y pivotaje rápido",
                        "Storytelling para ventas y marketing",
                        "Orientación obsesiva al cliente y su feedback",
                        "Gestión del tiempo y priorización radical",
                        "Búsqueda y manejo de capital (bootstrapping, VC, grants)",
                        "Liderazgo inspirador en etapas de alto riesgo",
                        "Creación y defensa de propuesta de valor única",
                        "Capacidad de vender antes de construir (preventa)",
                        "Toma de decisiones rápidas con información incompleta"
                      ].map((skill) => (
                        <div key={skill} className="flex items-center space-x-2">
                          <Checkbox
                            id={skill}
                            checked={profile.non_technical_skills?.includes(skill) || false}
                            onCheckedChange={(checked) => {
                              const currentSkills = profile.non_technical_skills || [];
                              if (checked) {
                                updateProfile("non_technical_skills", [...currentSkills, skill]);
                              } else {
                                updateProfile("non_technical_skills", currentSkills.filter(s => s !== skill));
                              }
                            }}
                          />
                          <Label htmlFor={skill} className="text-sm leading-tight">
                            {skill}
                          </Label>
                        </div>
                      ))
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Selecciona las habilidades que mejor describen tu perfil
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

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