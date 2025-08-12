import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Search, Filter, Users as UsersIcon, GraduationCap, MapPin } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import StudentCard from '@/components/StudentCard';
import { supabase } from '@/integrations/supabase/client';
import type { Student } from '@/data/students-data';
import { UNIVERSITIES_CHILE, REGIONS_CHILE } from '@/data/chile-data';

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedProjectSector, setSelectedProjectSector] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedUserType, setSelectedUserType] = useState('universitario');
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_type', 'universitario')
          .not('full_name', 'is', null)
          .not('gender', 'is', null)
          .not('entrepreneur_type', 'is', null)
          .not('team_status', 'is', null);

        if (error) {
          console.error('Error fetching profiles:', error);
          return;
        }

        const transformedStudents: Student[] = profiles?.map(profile => ({
          id: profile.user_id,  // Use user_id instead of profile.id
          name: profile.full_name || '',
          email: profile.email || '',
          institutionalEmail: profile.email || '',
          degree: profile.user_type === 'universitario' ? (profile.career || '') : (profile.profession || ''),
          year: profile.user_type === 'universitario' ? (profile.year || 1) : (profile.experience_years || 0),
          gender: profile.gender || '',
          type: profile.entrepreneur_type as 'Emprendedor/a' | 'Entusiasta',
          projectName: profile.project_name || undefined,
          projectDescription: profile.project_description || undefined,
          projectStage: profile.project_stage || undefined,
          projectSector: profile.project_sector || undefined,
          teamStatus: (() => {
            if (profile.team_status === 'completo') return 'Equipo Completo';
            if (profile.team_status === 'individual') return 'Trabajo Individual';
            if (profile.team_status === 'buscando') {
              if (profile.team_size && profile.team_size > 1) {
                return `Equipo de ${profile.team_size} buscando más miembros`;
              }
              return 'Solo/a buscando equipo';
            }
            return 'En equipo';
          })(),
          teamSize: profile.team_size || undefined,
          supportAreas: profile.support_areas || [],
          profileImageUrl: profile.avatar_url || undefined,
          hasIdea: !!profile.project_name,
          phone: profile.phone || undefined,
          linkedinUrl: undefined,
          university: profile.university || '',
          location: (profile as any).location || 'Santiago', // Default location
          region: (profile as any).region || 'Región Metropolitana de Santiago', // Default region
          userType: (profile.user_type as 'universitario' | 'no_universitario') || 'universitario',
          isTechnical: profile.is_technical || undefined,
          seekingTechnical: profile.seeking_technical || undefined,
          technicalSkills: profile.technical_skills || undefined,
          nonTechnicalSkills: profile.non_technical_skills || undefined,
          seekingTechnicalSkills: profile.seeking_technical_skills || undefined,
          seekingNonTechnicalSkills: profile.seeking_non_technical_skills || undefined,
          hobbies: profile.hobbies || undefined,
          interests: profile.interests || undefined
        })) || [];

        setStudents(transformedStudents);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  // Use predefined lists for filters
  const universities = ['all', ...UNIVERSITIES_CHILE];
  const years = ['all', ...Array.from(new Set(students.map(s => s.year.toString())))];
  const projectSectors = ['all', ...Array.from(new Set(students.map(s => s.projectSector).filter(Boolean)))];
  const regions = ['all', ...REGIONS_CHILE];

  const filteredStudents = students.filter(student => {
    const searchContent = `${student.name} ${student.projectDescription || ''} ${student.projectSector || ''} ${student.supportAreas.join(' ')}`.toLowerCase();
    const matchesSearch = searchContent.includes(searchTerm.toLowerCase());
    const matchesUniversity = selectedUniversity === 'all' || student.university === selectedUniversity;
    const matchesYear = selectedYear === 'all' || student.year.toString() === selectedYear;
    const matchesProjectSector = selectedProjectSector === 'all' || student.projectSector === selectedProjectSector;
    const matchesRegion = selectedRegion === 'all' || student.region === selectedRegion;
    const matchesUserType = selectedUserType === 'all' || student.userType === selectedUserType;
    
    return matchesSearch && matchesUniversity && matchesYear && matchesProjectSector && matchesRegion && matchesUserType;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="container pt-24 pb-12 text-center">
          <h1 className="text-4xl font-black tracking-tight lg:text-6xl text-primary font-condensed">
            MATCHMAKING DE EMPRENDEDORES UNIVERSITARIOS
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Conecta con estudiantes talentosos de todo Chile. Encuentra tu co-fundador ideal y forma el equipo perfecto para tu próxima startup.
          </p>
        </section>

        {/* Filters Section */}
        <section className="container pb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Buscar por nombre, habilidades, intereses..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select onValueChange={setSelectedRegion} defaultValue="all">
              <SelectTrigger className="w-full lg:w-[200px]">
                <MapPin className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Región" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las regiones</SelectItem>
                {regions.filter(r => r !== 'all').map(region => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select onValueChange={setSelectedUniversity} defaultValue="all">
              <SelectTrigger className="w-full lg:w-[280px]">
                <GraduationCap className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Universidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las universidades</SelectItem>
                {universities.filter(u => u !== 'all').map(university => (
                  <SelectItem key={university} value={university}>
                    {university}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select onValueChange={setSelectedYear} defaultValue="all">
              <SelectTrigger className="w-full lg:w-[150px]">
                <SelectValue placeholder="Año" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los años</SelectItem>
                {years.filter(y => y !== 'all').map(year => (
                  <SelectItem key={year} value={year}>
                    Año {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select onValueChange={setSelectedProjectSector} defaultValue="all">
              <SelectTrigger className="w-full lg:w-[200px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Sector de proyecto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los sectores</SelectItem>
                {projectSectors.filter(s => s !== 'all').map(sector => (
                  <SelectItem key={sector} value={sector}>
                    {sector}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Results count */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">
              Mostrando {filteredStudents.length} de {students.length} estudiantes
            </p>
          </div>

          {/* Students Grid */}
          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Cargando perfiles...</p>
            </div>
          ) : filteredStudents.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredStudents.map(student => (
                <StudentCard key={student.id} student={student} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <UsersIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-2xl font-semibold mb-2">No se encontraron estudiantes</h3>
              <p className="text-muted-foreground">Intenta ajustar tus filtros de búsqueda.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Index;