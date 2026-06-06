import { useState, useEffect, useCallback } from 'react';
import { productService } from '../services/api';

export function useProducts(params = {}) {
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [meta,     setMeta]     = useState({ total: 0, page: 1, pages: 1 });

  const key = JSON.stringify(params);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await productService.getAll(params);
      setProducts(res.data);
      setMeta({ total: res.total, page: res.page, pages: res.pages });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => { fetch(); }, [fetch]);

  return { products, loading, error, meta, refetch: fetch };
}

export function useProduct(id) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    productService.getById(id)
      .then(res => setProduct(res.data))
      .catch(e  => setError(e.message))
      .finally(()=> setLoading(false));
  }, [id]);

  return { product, loading, error };
}
