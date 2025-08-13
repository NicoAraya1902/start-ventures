import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface UseFormPersistenceProps<T> {
  key: string;
  defaultValues: T;
  enabled?: boolean;
}

export function useFormPersistence<T extends Record<string, any>>({
  key,
  defaultValues,
  enabled = true
}: UseFormPersistenceProps<T>) {
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Load saved data on mount
  const loadSavedData = (): T => {
    if (!enabled) return defaultValues;
    
    try {
      const saved = localStorage.getItem(`form_${key}`);
      if (saved) {
        const parsedData = JSON.parse(saved);
        // Show notification that data was restored
        toast({
          title: "Datos restaurados",
          description: "Se han recuperado los datos del formulario guardados anteriormente",
          duration: 3000,
        });
        return { ...defaultValues, ...parsedData };
      }
    } catch (error) {
      console.error('Error loading saved form data:', error);
    }
    return defaultValues;
  };

  // Save data to localStorage
  const saveData = (data: T) => {
    if (!enabled) return;
    
    try {
      localStorage.setItem(`form_${key}`, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving form data:', error);
    }
  };

  // Clear saved data
  const clearSavedData = () => {
    if (!enabled) return;
    
    try {
      localStorage.removeItem(`form_${key}`);
    } catch (error) {
      console.error('Error clearing saved form data:', error);
    }
  };

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return {
    loadSavedData,
    saveData,
    clearSavedData,
    isLoading
  };
}

// Hook for unsaved changes warning
export function useUnsavedChangesWarning(hasUnsavedChanges: boolean) {
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);
}