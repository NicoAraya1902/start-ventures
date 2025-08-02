import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { Link } from "react-router-dom";

export function LoginButton() {
  return (
    <Button
      asChild
      variant="outline"
      className="gap-2"
    >
      <Link to="/auth">
        <LogIn className="h-4 w-4" />
        Iniciar Sesión
      </Link>
    </Button>
  );
}