import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="navbar-logo">
          <span className="dot" />
          ProductBase
        </div>
        <div className="navbar-links">
          <NavLink to="/"           className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')}>Products</NavLink>
          <NavLink to="/products/new" className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')}>+ Add New</NavLink>
        </div>
      </div>
    </nav>
  );
}
