import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { productService } from '../services/api';
import ProductForm from '../components/ProductForm';

export default function CreateProduct() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await productService.create(data);
      toast.success('Product created!');
      navigate(`/products/${res.data._id}`);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Add Product</h1>
          <p className="page-subtitle">Fill in the details below</p>
        </div>
        <button className="btn btn-ghost" onClick={() => navigate('/')}>← Back</button>
      </div>
      <ProductForm onSubmit={handleSubmit} loading={loading} submitLabel="Create Product" />
    </div>
  );
}
