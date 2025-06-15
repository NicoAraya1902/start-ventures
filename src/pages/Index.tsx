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
            From Idea to Impact, Together.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            CollabCore is where creators, entrepreneurs, and professionals connect. Post your project, find collaborators, and bring your vision to life.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button asChild size="lg">
              <Link to="/explore">
                Explore Projects <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="#">Post Your Idea</Link>
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
              <h3 className="text-xl font-bold">Post an Idea</h3>
              <p className="text-muted-foreground">Have a brilliant concept? Share your vision and outline the roles you need to fill.</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold">Find Talent</h3>
              <p className="text-muted-foreground">Discover and connect with developers, designers, marketers, and business professionals eager to contribute their skills.</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <CheckCircle className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold">Build Your Team</h3>
              <p className="text-muted-foreground">Assemble your dream team, manage applications, and start collaborating to bring your idea to life.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
