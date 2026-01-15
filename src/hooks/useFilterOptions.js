import { useState, useEffect } from 'react';
import filterOptionsData from '@/data/filterOptions.json';

export function useFilterOptions() {
  const [options, setOptions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoading(true);
        // Simulate API call - replace with actual API fetch in future
        // const response = await fetch('/api/filter-options');
        // const data = await response.json();
        
        // For now, use local JSON data
        setOptions(filterOptionsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, []);

  return { options, loading, error };
}
