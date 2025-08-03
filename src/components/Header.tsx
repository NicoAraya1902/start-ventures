
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { useAuth } from "@/contexts/AuthContext";
import { LoginButton } from "@/components/auth/LoginButton";
import { UserMenu } from "@/components/auth/UserMenu";
import { useIsMobile } from "@/hooks/use-mobile";

const Header = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">M</span>
          </div>
          <span className="text-lg font-bold text-foreground">Mural Estudiantil</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link 
            to="/" 
            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            Inicio
          </Link>
          <Link 
            to="/news" 
            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            Noticias
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <UserMenu />
          ) : (
            <LoginButton />
          )}
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col space-y-4 mt-4">
                <Link to="/" className="text-lg font-medium">Inicio</Link>
                
                <Link to="/news" className="text-lg font-medium">Noticias</Link>
                
                {user ? (
                  <>
                    <Link to="/profile" className="text-lg font-medium">Perfil</Link>
                    <Link to="/messages" className="text-lg font-medium">Mensajes</Link>
                  </>
                ) : (
                  <div className="space-y-2">
                    <LoginButton />
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;

