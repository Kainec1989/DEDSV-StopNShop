import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';

/**
 * Loads a single product by id, manages size selection and add-to-cart navigation.
 * Keeps API and state out of the presentational component.
 *
 * @param {string | undefined} productId - Route param or explicit id (e.g. in tests).
 * @returns {{
 *   product: object | null,
 *   loading: boolean,
 *   error: string | null,
 *   notFound: boolean,
 *   selectedSize: string,
 *   handleSizeChange: (e: import('react').ChangeEvent<HTMLSelectElement>) => void,
 *   handleAddToCart: () => void,
 * }}
 */
export function useProductData(productId) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');

  useEffect(() => {
    if (!productId) {
      setLoading(false);
      setNotFound(true);
      setError(null);
      setProduct(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);
    setNotFound(false);
    setSelectedSize('');

    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/api/products/${productId}`);
        if (cancelled) return;

        const data = response.data;
        if (!data || typeof data !== 'object') {
          setProduct(null);
          setNotFound(true);
          setError(null);
          return;
        }

        if (!data.sizes || !Array.isArray(data.sizes)) {
          console.error('Invalid sizes data:', data.sizes);
        }
        setProduct(data);
        setNotFound(false);
        setError(null);
      } catch (err) {
        console.error('Error fetching product:', err);
        if (cancelled) return;

        if (axios.isAxiosError(err) && err.response?.status === 404) {
          setNotFound(true);
          setError(null);
          setProduct(null);
          return;
        }

        setNotFound(false);
        const message =
          axios.isAxiosError(err) && err.response?.data?.error
            ? String(err.response.data.error)
            : 'Unable to load this product. Please try again later.';
        setError(message);
        setProduct(null);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchProduct();
    return () => {
      cancelled = true;
    };
  }, [productId]);

  const handleSizeChange = useCallback((e) => {
    setSelectedSize(e.target.value);
  }, []);

  const handleAddToCart = useCallback(() => {
    if (!product) return;

    if (!selectedSize) {
      alert('Please select a size');
      return;
    }

    const sizeInfo = product.sizes.find((s) => s.size === selectedSize);
    if (!sizeInfo || sizeInfo.countInStock === 0) {
      alert('Selected size is out of stock');
      return;
    }

    addToCart({
      ...product,
      selectedSize,
      quantity: 1,
    });

    navigate('/cart');
  }, [product, selectedSize, addToCart, navigate]);

  return {
    product,
    loading,
    error,
    notFound,
    selectedSize,
    handleSizeChange,
    handleAddToCart,
  };
}
