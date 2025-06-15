import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Lightbulb, Users, CheckCircle, Rocket, Award, Flag } from 'lucide-react';

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="container pt-24 pb-12 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-6xl">
            Del Campus al Ecosistema Emprendedor.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            START es la plataforma para estudiantes con grandes ideas. Conecta con compañeros, forma equipos y transforma tus proyectos académicos en startups innovadoras.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button asChild size="lg">
              <Link to="/explore">
                Explorar Proyectos <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/create-project">Publica Tu Idea</Link>
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section id="how-it-works" className="container py-24">
          <div className="mx-auto grid max-w-4xl items-start gap-10 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Lightbulb className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold">Publica una Idea</h3>
              <p className="text-muted-foreground">¿Tienes un proyecto para una asignatura, un TFG o una idea innovadora? Compártela y busca el talento que necesitas en el campus.</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold">Encuentra Talento</h3>
              <p className="text-muted-foreground">Conecta con estudiantes de programación, diseño y negocios. Tu próximo co-fundador podría estar en la facultad de al lado.</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <CheckCircle className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold">Construye tu Equipo</h3>
              <p className="text-muted-foreground">Forma tu equipo ideal, gestiona candidaturas y empieza a colaborar para llevar tu proyecto al siguiente nivel, incluso antes de graduarte.</p>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted-foreground/10 px-3 py-1 text-sm text-muted-foreground">Nuestro Club</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Acerca de START</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Conoce nuestra misión, los valores que nos guían y nuestra historia.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 py-12 sm:grid-cols-3">
              <div className="grid gap-1 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                  <Rocket className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">Visión</h3>
                <p className="text-sm text-muted-foreground">
                  Ser el principal catalizador del emprendimiento universitario, transformando ideas académicas en empresas de impacto.
                </p>
              </div>
              <div className="grid gap-1 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                  <Award className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">Valores</h3>
                <p className="text-sm text-muted-foreground">
                  Fomentamos la colaboración, la innovación, la proactividad y el aprendizaje continuo en todos nuestros miembros.
                </p>
              </div>
              <div className="grid gap-1 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                  <Flag className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">Trayectoria</h3>
                <p className="text-sm text-muted-foreground">
                  Fundado en 2025, START nace de la necesidad de generar una red de emprendedores universitarios y ser un puente entre el talento del campus y el ecosistema de startups.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
