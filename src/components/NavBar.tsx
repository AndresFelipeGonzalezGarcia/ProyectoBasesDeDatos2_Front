// src/components/Navbar.tsx

function Navbar() {
  return (
    <nav className="navbar navbar-dark bg-dark">
      <div className="container-fluid">
        {/* Aquí luego podemos poner un logo */}
        <span className="navbar-brand mb-0 h1 text-uppercase fw-bold text-danger">
          Buggy's Fit
        </span>
      </div>
    </nav>
  );
}

export default Navbar;
