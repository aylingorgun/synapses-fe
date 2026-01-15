import { useState, useEffect } from 'react';
import disasterDataJson from '@/data/disasterData.json';

export function useDisasterData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Simulate API call - replace with actual API fetch in future
        // const response = await fetch('/api/disasters');
        // const data = await response.json();

        // For now, use local JSON data
        setData(disasterDataJson);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
}
