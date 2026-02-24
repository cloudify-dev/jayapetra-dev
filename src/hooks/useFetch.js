import { useState, useEffect } from 'react';

/**
 * Custom hook untuk fetching data dari API.
 * Mengembalikan { data, loading, error } dan fungsi refetch.
 *
 * @param {Function} fetchFn  - Fungsi API yang dipanggil (misal: getArticles)
 * @param {Array}    deps     - Dependency array untuk re-fetch
 */
const useFetch = (fetchFn, deps = []) => {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchFn();
      setData(response.data);
    } catch (err) {
      setError(err?.response?.data?.error?.message || 'Terjadi kesalahan, coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error, refetch: fetchData };
};

export default useFetch;
