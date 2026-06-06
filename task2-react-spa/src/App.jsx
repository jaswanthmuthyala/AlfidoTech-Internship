import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProductList   from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import CreateProduct from './pages/CreateProduct';
import EditProduct   from './pages/EditProduct';

export default function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/"                      element={<ProductList />} />
          <Route path="/products/new"          element={<CreateProduct />} />
          <Route path="/products/:id"          element={<ProductDetail />} />
          <Route path="/products/:id/edit"     element={<EditProduct />} />
          <Route path="*"                      element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
