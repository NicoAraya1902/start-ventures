import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { Student } from "@/data/students-data";
import { ContactRequestDialog } from "@/components/messaging/ContactRequestDialog";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export function StudentCard({ student }: { student: Student }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  return (
    <Card className="h-full">
      <div className="p-6 space-y-4">
        <div className="flex items-start gap-4">
          <img
            src={student.profileImageUrl}
            alt={student.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg">{student.name}</h3>
            <p className="text-sm text-muted-foreground">{student.degree}</p>
            <p className="text-sm text-muted-foreground">
              {student.userType === 'universitario' ? student.university : 'Profesional'}
            </p>
            <p className="text-xs text-muted-foreground">
              {student.userType === 'universitario' 
                ? `Año ${student.year} • ${student.type}`
                : `${student.year} años exp. • ${student.type}`
              }
            </p>
            <Badge variant={student.userType === 'universitario' ? 'default' : 'secondary'} className="text-xs mt-1">
              {student.userType === 'universitario' ? 'Universitario' : 'Profesional'}
            </Badge>
          </div>
        </div>

        {student.projectDescription && (
          <p className="text-sm leading-relaxed">{student.projectDescription}</p>
        )}

        <div className="space-y-2">
          <div className="flex gap-2 flex-wrap">
            <Badge variant={student.type === "Emprendedor/a" ? "default" : "secondary"}>
              {student.type}
            </Badge>
            <Badge variant={student.hasIdea ? "default" : "outline"}>
              {student.hasIdea ? "Tiene idea" : "Buscando ideas"}
            </Badge>
            <Badge variant="outline">
              {student.teamStatus}
            </Badge>
          </div>
          
          {student.projectName && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Proyecto:</p>
              <p className="text-sm font-medium">{student.projectName}</p>
            </div>
          )}

          {student.projectSector && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Sector:</p>
              <p className="text-sm">{student.projectSector}</p>
            </div>
          )}

          {student.projectStage && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Etapa:</p>
              <p className="text-sm">{student.projectStage}</p>
            </div>
          )}

          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">Busca apoyo en:</p>
            <div className="flex flex-wrap gap-1">
              {student.supportAreas.slice(0, 3).map((area, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {area}
                </Badge>
              ))}
              {student.supportAreas.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{student.supportAreas.length - 3} más
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          {user ? (
            <ContactRequestDialog 
              receiverId={student.id} 
              receiverName={student.name}
            />
          ) : (
            <Button 
              size="sm" 
              variant="default" 
              className="flex-1"
              onClick={() => navigate('/auth')}
            >
              Iniciar sesión para contactar
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

export default StudentCard;