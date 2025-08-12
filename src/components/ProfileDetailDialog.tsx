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
  Gamepad2
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
              <h2 className="text-xl font-semibold">{student.name}</h2>
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

              {student.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{student.location}, {student.region}</span>
                </div>
              )}

              {student.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{student.phone}</span>
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

            {/* Skills */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Code className="h-4 w-4" />
                Habilidades
              </h3>
              
              {student.technicalSkills && student.technicalSkills.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Técnicas:</p>
                  <div className="flex flex-wrap gap-1">
                    {student.technicalSkills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {student.nonTechnicalSkills && student.nonTechnicalSkills.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">No técnicas:</p>
                  <div className="flex flex-wrap gap-1">
                    {student.nonTechnicalSkills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* What they're seeking */}
            {student.seekingTechnical && student.seekingTechnical !== "none" && (
              <>
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    Busca en su equipo
                  </h3>
                  
                  {student.seekingTechnical === "technical" && student.seekingTechnicalSkills && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Habilidades técnicas:</p>
                      <div className="flex flex-wrap gap-1">
                        {student.seekingTechnicalSkills.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {student.seekingTechnical === "non_technical" && student.seekingNonTechnicalSkills && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Habilidades no técnicas:</p>
                      <div className="flex flex-wrap gap-1">
                        {student.seekingNonTechnicalSkills.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
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
                <ContactRequestDialog 
                  receiverId={student.id} 
                  receiverName={student.name}
                />
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