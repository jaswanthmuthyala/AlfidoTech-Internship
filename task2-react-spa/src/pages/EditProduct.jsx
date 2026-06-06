import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useProduct } from '../hooks/useProducts';
import { productService } from '../services/api';
import ProductForm from '../components/ProductForm';

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { product, loading: fetching, error } = useProduct(id);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (data) => {
    setSaving(true);
    try {
      await productService.update(id, data);
      toast.success('Product updated!');
      navigate(`/products/${id}`);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  if (fetching) return (
    <div className="loading-state">
      <div className="spinner" />
      <span>Loading product…</span>
    </div>
  );

  if (error) return <div className="error-banner">⚠ {error}</div>;
  if (!product) return null;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Edit Product</h1>
          <p className="page-subtitle">{product.name}</p>
        </div>
        <button className="btn btn-ghost" onClick={() => navigate(`/products/${id}`)}>← Back</button>
      </div>
      <ProductForm
        initial={product}
        onSubmit={handleSubmit}
        loading={saving}
        submitLabel="Save Changes"
      />
    </div>
  );
}
