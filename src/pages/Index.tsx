
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Lightbulb, Users, CheckCircle } from 'lucide-react';

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="container pt-24 pb-12 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-6xl">
            De la Idea al Impacto, Juntos.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            START es donde creadores, emprendedores y profesionales se conectan. Publica tu proyecto, encuentra colaboradores y haz realidad tu visión.
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
              <p className="text-muted-foreground">¿Tienes un concepto brillante? Comparte tu visión y describe los roles que necesitas cubrir.</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold">Encuentra Talento</h3>
              <p className="text-muted-foreground">Descubre y conecta con desarrolladores, diseñadores, especialistas en marketing y profesionales de negocios deseosos de aportar sus habilidades.</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <CheckCircle className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold">Construye tu Equipo</h3>
              <p className="text-muted-foreground">Reúne a tu equipo ideal, gestiona las solicitudes y comienza a colaborar para hacer realidad tu idea.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
