import { useState, useEffect } from 'react';
import { apiClient } from '../apiClient';
import { ITalle } from '../types/ITalle';


export function useTalles() {
  const [talles, setTalles] = useState<ITalle[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTalles = async () => {
      try {
        setIsLoading(true);
        // En un caso real, aquí se haría una llamada a la API
        // Por ahora simulamos los datos para el ejemplo
        const response = await apiClient.get('/talles');
        setTalles(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error al cargar talles:', error);
        setError('No se pudieron cargar los talles');
        setIsLoading(false);
      }
    };

    fetchTalles();
  }, []);

  return { talles, isLoading, error };
}