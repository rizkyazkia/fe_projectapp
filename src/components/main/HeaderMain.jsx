import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../components/main/Logo";
import { IoMenu, IoClose } from "react-icons/io5";

const HeaderMain = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-outline-variant/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Logo />

        {/* Menu Desktop */}
        <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-on-surface-variant">
          <Link to={"/"}>
            <p className="hover:text-primary transition-colors">Beranda</p>
          </Link>
          <a href="#permainan" className="hover:text-primary transition-colors">
            Permainan
          </a>
          <a href="#tentang" className="hover:text-primary transition-colors">
            Tentang
          </a>
          <a href="#fitur" className="hover:text-primary transition-colors">
            Fitur
          </a>
          <a href="#testimoni" className="hover:text-primary transition-colors">
            Testimoni
          </a>
        </nav>

        {/* Action Buttons Desktop */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => navigate("/auth/login")}
            className="px-4 py-2 border border-primary text-primary rounded-lg font-semibold text-sm hover:bg-primary-light transition-colors"
          >
            Masuk
          </button>
          <button
            onClick={() => navigate("/auth/register")}
            className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-container transition-all active:scale-95 shadow-sm cursor-pointer"
          >
            Daftar Gratis
          </button>
        </div>

        {/* Hamburger Button */}
        <button
          className="md:hidden flex items-center justify-center size-10 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className="material-symbols-outlined text-2xl">
            {menuOpen ? <IoClose/> : <IoMenu/>}
          </span>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <nav className="px-4 sm:px-6 lg:px-8 pt-6 pb-4 flex flex-col gap-1">
            <Link
              to={"/"}
              onClick={() => setMenuOpen(false)}
              className="py-3 px-4 rounded-lg text-base font-medium text-gray-700 hover:text-primary hover:bg-primary-light transition-colors"
            >
              Beranda
            </Link>
            <a
              href="#tentang"
              onClick={() => setMenuOpen(false)}
              className="py-3 px-4 rounded-lg text-base font-medium text-gray-700 hover:text-primary hover:bg-primary-light transition-colors"
            >
              Tentang
            </a>
            <a
              href="#fitur"
              onClick={() => setMenuOpen(false)}
              className="py-3 px-4 rounded-lg text-base font-medium text-gray-700 hover:text-primary hover:bg-primary-light transition-colors"
            >
              Fitur
            </a>
            <a
              href="#testimoni"
              onClick={() => setMenuOpen(false)}
              className="py-3 px-4 rounded-lg text-base font-medium text-gray-700 hover:text-primary hover:bg-primary-light transition-colors"
            >
              Testimoni
            </a>
          </nav>

          <div className="border-t border-gray-100" />

          <div className="px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-3">
            <button
              onClick={() => {
                setMenuOpen(false);
                navigate("/auth/login");
              }}
              className="w-full px-4 py-3 border border-primary text-primary rounded-xl font-semibold text-sm hover:bg-primary-light transition-colors"
            >
              Masuk
            </button>
            <button
              onClick={() => {
                setMenuOpen(false);
                navigate("/auth/register");
              }}
              className="w-full px-4 py-3 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-container transition-all active:scale-95 shadow-sm cursor-pointer"
            >
              Daftar Gratis
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default HeaderMain;
