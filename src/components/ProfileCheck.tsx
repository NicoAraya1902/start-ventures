import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface ProfileCheckProps {
  children: React.ReactNode;
}

export function ProfileCheck({ children }: ProfileCheckProps) {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkProfile = async () => {
      if (authLoading) return;
      
      // Don't check if user is not logged in or already on profile/auth pages
      if (!user || location.pathname === '/profile' || location.pathname === '/auth') {
        setChecking(false);
        return;
      }

      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        // Check if profile is complete
        const isComplete = profile && 
          profile.full_name &&
          profile.university &&
          profile.career &&
          profile.year &&
          profile.gender &&
          profile.entrepreneur_type &&
          profile.team_status;

        if (!isComplete) {
          navigate('/profile');
          return;
        }
      } catch (error) {
        console.error('Error checking profile:', error);
        // If there's an error, redirect to profile to be safe
        navigate('/profile');
        return;
      }

      setChecking(false);
    };

    checkProfile();
  }, [user, authLoading, location.pathname, navigate]);

  // Show loading while checking
  if (authLoading || checking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
}