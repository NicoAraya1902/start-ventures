import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ContactRequestDialog } from "@/components/messaging/ContactRequestDialog";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { 
  User, 
  MapPin, 
  Mail, 
  Phone, 
  GraduationCap, 
  Briefcase, 
  Target, 
  Users, 
  Code, 
  Search,
  Heart,
  Gamepad2,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Student } from "@/data/students-data";

interface ProfileDetailDialogProps {
  student: Student;
  children: React.ReactNode;
}

export function ProfileDetailDialog({ student, children }: ProfileDetailDialogProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [fullProfile, setFullProfile] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Check if users are connected and fetch full profile if they are
  useEffect(() => {
    const checkConnection = async () => {
      if (!user) return;
      
      try {
        // Use the secure function to get full profile details if connected
        const { data, error } = await supabase
          .rpc('get_connected_profile_details', { target_user_id: student.id });
        
        if (!error && data && data.length > 0) {
          setFullProfile(data[0]);
          setIsConnected(true);
        }
      } catch (error) {
        console.error('Error checking connection:', error);
      }
    };

    checkConnection();
  }, [user, student.id]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={student.profileImageUrl} alt={student.name} />
              <AvatarFallback>
                <User className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">
                {isConnected && fullProfile ? fullProfile.full_name : student.name}
              </h2>
              <p className="text-sm text-muted-foreground">{student.degree}</p>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {student.userType === 'universitario' ? student.university : 'Profesional'}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {student.userType === 'universitario' 
                    ? `Año ${student.year}`
                    : `${student.year} años de experiencia`
                  }
                </span>
              </div>

              {isConnected && fullProfile?.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{fullProfile.location}, {fullProfile.region}</span>
                </div>
              )}

              {isConnected && fullProfile?.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{fullProfile.email}</span>
                </div>
              )}

              {isConnected && fullProfile?.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{fullProfile.phone}</span>
                </div>
              )}

              {!isConnected && (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    💎 Contacta con este perfil para ver información de contacto completa
                  </p>
                </div>
              )}

              <div className="flex gap-2 flex-wrap">
                <Badge variant={student.userType === 'universitario' ? 'default' : 'secondary'}>
                  {student.userType === 'universitario' ? 'Universitario' : 'Profesional'}
                </Badge>
                <Badge variant={student.type === "Emprendedor/a" ? "default" : "secondary"}>
                  {student.type}
                </Badge>
                <Badge variant={student.hasIdea ? "default" : "outline"}>
                  {student.hasIdea ? "Tiene idea" : "Buscando ideas"}
                </Badge>
                <Badge variant="outline">
                  {student.teamStatus}
                </Badge>
                {student.isTechnical !== undefined && (
                  <Badge variant={student.isTechnical ? "default" : "secondary"} className="flex items-center gap-1">
                    {student.isTechnical ? <Code className="h-3 w-3" /> : <Briefcase className="h-3 w-3" />}
                    {student.isTechnical ? "Técnico" : "No Técnico"}
                  </Badge>
                )}
              </div>
            </div>

            <Separator />

            {/* Project Information */}
            {(student.projectName || student.projectDescription) && (
              <>
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Proyecto
                  </h3>
                  
                  {student.projectName && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Nombre:</p>
                      <p className="text-sm">{student.projectName}</p>
                    </div>
                  )}

                  {student.projectDescription && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Descripción:</p>
                      <p className="text-sm leading-relaxed">{student.projectDescription}</p>
                    </div>
                  )}

                  {student.projectSector && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Sector:</p>
                      <p className="text-sm">{student.projectSector}</p>
                    </div>
                  )}

                  {student.projectStage && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Etapa:</p>
                      <p className="text-sm">{student.projectStage}</p>
                    </div>
                  )}

                  {student.teamSize && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Tamaño del equipo:</p>
                      <p className="text-sm">{student.teamSize} personas</p>
                    </div>
                  )}
                </div>
                <Separator />
              </>
            )}

            {/* Responsible Areas */}
            {student.responsibleAreas && student.responsibleAreas.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  Áreas de Responsabilidad
                </h3>
                <div className="flex flex-wrap gap-2">
                  {student.responsibleAreas.map((area, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {student.responsibleAreas && student.responsibleAreas.length > 0 && (
              <Separator />
            )}

            {/* Seeking Areas */}
            {student.seekingAreas && student.seekingAreas.length > 0 && (
              <>
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    Busca en su equipo
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {student.seekingAreas.map((area, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Separator />
              </>
            )}

            {/* Support Areas */}
            {student.supportAreas && student.supportAreas.length > 0 && (
              <>
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Áreas de apoyo
                  </h3>
                  <div className="flex flex-wrap gap-1">
                    {student.supportAreas.map((area, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Separator />
              </>
            )}

            {/* Hobbies */}
            {student.hobbies && student.hobbies.length > 0 && (
              <>
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Gamepad2 className="h-4 w-4" />
                    Pasatiempos
                  </h3>
                  <div className="flex flex-wrap gap-1">
                    {student.hobbies.map((hobby, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {hobby}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Separator />
              </>
            )}

            {/* Interests */}
            {student.interests && student.interests.length > 0 && (
              <>
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    Intereses
                  </h3>
                  <div className="flex flex-wrap gap-1">
                    {student.interests.map((interest, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Separator />
              </>
            )}

            {/* Contact Button */}
            <div className="pt-4">
              {user ? (
                isConnected ? (
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
                    <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                      ✅ Ya estás conectado con este perfil
                    </p>
                  </div>
                ) : (
                  <ContactRequestDialog 
                    receiverId={student.id} 
                    receiverName={isConnected && fullProfile ? fullProfile.full_name : student.name}
                  >
                    <Button size="sm" className="gap-2 w-full">
                      <MessageSquare className="h-4 w-4" />
                      Solicitar contacto
                    </Button>
                  </ContactRequestDialog>
                )
              ) : (
                <Button 
                  className="w-full"
                  onClick={() => navigate('/auth')}
                >
                  Iniciar sesión para contactar
                </Button>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}