import { useState } from 'react';

const CATEGORIES = ['electronics', 'clothing', 'food', 'books', 'other'];

const empty = { name: '', description: '', price: '', category: '', stock: '', isAvailable: true };

export default function ProductForm({ initial = {}, onSubmit, loading, submitLabel = 'Save' }) {
  const [form,   setForm]   = useState({ ...empty, ...initial });
  const [errors, setErrors] = useState({});

  const set = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
    setErrors(e => ({ ...e, [field]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())          e.name     = 'Name is required';
    if (form.name.length > 0 && form.name.length < 2) e.name = 'Min 2 characters';
    if (form.price === '')          e.price    = 'Price is required';
    if (Number(form.price) < 0)     e.price    = 'Price cannot be negative';
    if (!form.category)             e.category = 'Category is required';
    if (form.stock === '')          e.stock    = 'Stock is required';
    if (Number(form.stock) < 0)     e.stock    = 'Stock cannot be negative';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSubmit({
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
    });
  };

  return (
    <form className="form-card" onSubmit={handleSubmit} noValidate>
      <div className="form-grid">

        <div className="form-group full">
          <label className="form-label">Product Name *</label>
          <input className="form-input" value={form.name}
            onChange={e => set('name', e.target.value)} placeholder="e.g. Wireless Headphones" />
          {errors.name && <span className="form-error">{errors.name}</span>}
        </div>

        <div className="form-group full">
          <label className="form-label">Description</label>
          <textarea className="form-textarea" value={form.description}
            onChange={e => set('description', e.target.value)}
            placeholder="Short product description…" rows={3} />
        </div>

        <div className="form-group">
          <label className="form-label">Price (₹) *</label>
          <input className="form-input" type="number" min="0" step="0.01"
            value={form.price} onChange={e => set('price', e.target.value)} placeholder="0" />
          {errors.price && <span className="form-error">{errors.price}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Stock *</label>
          <input className="form-input" type="number" min="0"
            value={form.stock} onChange={e => set('stock', e.target.value)} placeholder="0" />
          {errors.stock && <span className="form-error">{errors.stock}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Category *</label>
          <select className="form-select" value={form.category}
            onChange={e => set('category', e.target.value)}>
            <option value="">Select…</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {errors.category && <span className="form-error">{errors.category}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Available?</label>
          <select className="form-select" value={String(form.isAvailable)}
            onChange={e => set('isAvailable', e.target.value === 'true')}>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>

      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  );
}
