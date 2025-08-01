import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogIn } from "lucide-react";

export function LoginButton() {
  const { signInWithGoogle, loading } = useAuth();

  return (
    <Button
      onClick={signInWithGoogle}
      disabled={loading}
      variant="outline"
      className="gap-2"
    >
      <LogIn className="h-4 w-4" />
      Iniciar Sesión con Google
    </Button>
  );
}