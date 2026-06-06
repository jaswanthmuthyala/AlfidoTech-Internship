import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useProduct } from '../hooks/useProducts';
import { productService } from '../services/api';
import DeleteModal from '../components/DeleteModal';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { product, loading, error } = useProduct(id);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting,   setDeleting]   = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await productService.remove(id);
      toast.success('Product deleted');
      navigate('/');
    } catch (e) {
      toast.error(e.message);
      setDeleting(false);
    }
  };

  if (loading) return (
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
          <h1 className="page-title">Product Detail</h1>
          <p className="page-subtitle">ID: {product._id}</p>
        </div>
        <button className="btn btn-ghost" onClick={() => navigate('/')}>← Back</button>
      </div>

      <div className="detail-card">
        <div className="detail-header">
          <div className="detail-name">{product.name}</div>
          <div className="detail-price">₹{product.price.toLocaleString()}</div>
        </div>

        {product.description && (
          <div className="detail-desc">{product.description}</div>
        )}

        <div className="detail-grid">
          <div className="detail-field">
            <label>Category</label>
            <span>{product.category}</span>
          </div>
          <div className="detail-field">
            <label>Stock</label>
            <span>{product.stock} units</span>
          </div>
          <div className="detail-field">
            <label>Availability</label>
            <span className={`badge ${product.isAvailable ? 'badge-available' : 'badge-unavailable'}`}>
              {product.isAvailable ? 'Available' : 'Unavailable'}
            </span>
          </div>
          <div className="detail-field">
            <label>Created</label>
            <span>{new Date(product.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
        </div>

        <div className="detail-actions">
          <button className="btn btn-primary" onClick={() => navigate(`/products/${id}/edit`)}>Edit Product</button>
          <button className="btn btn-danger" onClick={() => setShowDelete(true)}>Delete</button>
        </div>
      </div>

      {showDelete && (
        <DeleteModal
          productName={product.name}
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
          loading={deleting}
        />
      )}
    </div>
  );
}
