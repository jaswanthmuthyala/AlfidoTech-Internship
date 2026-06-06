import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useProducts } from '../hooks/useProducts';
import { productService } from '../services/api';
import DeleteModal from '../components/DeleteModal';

const CATEGORIES = ['', 'electronics', 'clothing', 'food', 'books', 'other'];

export default function ProductList() {
  const navigate = useNavigate();
  const [page,      setPage]      = useState(1);
  const [category,  setCategory]  = useState('');
  const [available, setAvailable] = useState('');
  const [toDelete,  setToDelete]  = useState(null); // { id, name }
  const [deleting,  setDeleting]  = useState(false);

  const params = { page, limit: 8, ...(category && { category }), ...(available !== '' && { isAvailable: available }) };
  const { products, loading, error, meta, refetch } = useProducts(params);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await productService.remove(toDelete.id);
      toast.success(`"${toDelete.name}" deleted`);
      setToDelete(null);
      refetch();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Products</h1>
          <p className="page-subtitle">{meta.total} total records</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/products/new')}>
          + Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <select className="filter-select" value={category}
          onChange={e => { setCategory(e.target.value); setPage(1); }}>
          <option value="">All categories</option>
          {CATEGORIES.filter(Boolean).map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <select className="filter-select" value={available}
          onChange={e => { setAvailable(e.target.value); setPage(1); }}>
          <option value="">All availability</option>
          <option value="true">In stock</option>
          <option value="false">Out of stock</option>
        </select>

        <span className="results-count">
          Page {meta.page} of {meta.pages || 1}
        </span>
      </div>

      {/* Error */}
      {error && <div className="error-banner">⚠ {error}</div>}

      {/* Table */}
      <div className="card">
        {loading ? (
          <div className="loading-state">
            <div className="spinner" />
            <span>Loading products…</span>
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <div className="empty-title">No products found</div>
            <div className="empty-sub">Try changing the filters or add a new product.</div>
          </div>
        ) : (
          <table className="products-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p._id}>
                  <td>
                    <div className="product-name">{p.name}</div>
                    {p.description && <div className="product-desc">{p.description.slice(0, 50)}{p.description.length > 50 ? '…' : ''}</div>}
                  </td>
                  <td><span className="badge badge-category">{p.category}</span></td>
                  <td><span className="price-tag">₹{p.price.toLocaleString()}</span></td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>{p.stock}</td>
                  <td>
                    <span className={`badge ${p.isAvailable ? 'badge-available' : 'badge-unavailable'}`}>
                      {p.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/products/${p._id}`)}>View</button>
                      <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/products/${p._id}/edit`)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => setToDelete({ id: p._id, name: p.name })}>Del</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {meta.pages > 1 && (
        <div className="pagination">
          <button className="btn btn-ghost btn-sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
          <span className="page-info">{page} / {meta.pages}</span>
          <button className="btn btn-ghost btn-sm" disabled={page >= meta.pages} onClick={() => setPage(p => p + 1)}>Next →</button>
        </div>
      )}

      {/* Delete modal */}
      {toDelete && (
        <DeleteModal
          productName={toDelete.name}
          onConfirm={handleDelete}
          onCancel={() => setToDelete(null)}
          loading={deleting}
        />
      )}
    </div>
  );
}
