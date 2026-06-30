import {
  LuActivity,
  LuMail,
  LuPhone,
  LuMapPin,
  LuGlobe,
  LuShare2,
  LuInstagram,
  LuHeart,
  LuChevronRight,
} from "react-icons/lu";
import Logo from "./Logo";
const FooterMain = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-20 pb-10 border-t border-slate-900 font-sans relative overflow-hidden">
      {/* Subtle decorative glow effect */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full filter blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full filter blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-10 mb-16 relative z-10">
        {/* Col 1: Jalinan Brand Info (col-span-4) */}
        <div className="space-y-5 md:col-span-4">
          <Logo textColor="#FFF"/>
          {/* <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-sm shadow-primary/10">
              <LuActivity className="h-5 w-5" />
            </div>
            <span className="font-display font-extrabold text-2xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              Jalinan
            </span>
          </div> */}
          <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
            Platform kolaborasi 3 pilar utama untuk masa depan gizi dan
            kesehatan anak Indonesia yang lebih baik, sehat, dan seimbang secara
            berkelanjutan.
          </p>
          <div className="flex gap-3 pt-2">
            <a
              href="#"
              className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 hover:bg-slate-850 transition-all duration-200 shadow-sm group"
              aria-label="Website"
            >
              <LuGlobe className="h-4 w-4 group-hover:scale-110 transition-transform" />
            </a>
            <a
              href="#"
              className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 hover:bg-slate-850 transition-all duration-200 shadow-sm group"
              aria-label="Share"
            >
              <LuShare2 className="h-4 w-4 group-hover:scale-110 transition-transform" />
            </a>
            <a
              href="#"
              className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 hover:bg-slate-850 transition-all duration-200 shadow-sm group"
              aria-label="Instagram"
            >
              <LuInstagram className="h-4 w-4 group-hover:scale-110 transition-transform" />
            </a>
          </div>
        </div>

        {/* Col 2: Navigation (col-span-2) */}
        <div className="md:col-span-2">
          <h4 className="font-display font-bold text-xs text-slate-200 tracking-wider uppercase mb-5">
            Navigasi
          </h4>
          <ul className="space-y-3 text-sm">
            <li>
              <a
                href="#"
                className="flex items-center group text-slate-400 hover:text-white transition-colors"
              >
                <LuChevronRight className="h-3 w-3 opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all mr-1.5 text-primary" />
                Beranda
              </a>
            </li>
            <li>
              <a
                href="#tentang"
                className="flex items-center group text-slate-400 hover:text-white transition-colors"
              >
                <LuChevronRight className="h-3 w-3 opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all mr-1.5 text-primary" />
                Tentang Kami
              </a>
            </li>
            <li>
              <a
                href="#fitur"
                className="flex items-center group text-slate-400 hover:text-white transition-colors"
              >
                <LuChevronRight className="h-3 w-3 opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all mr-1.5 text-primary" />
                Fitur Kami
              </a>
            </li>
            <li>
              <a
                href="#testimoni"
                className="flex items-center group text-slate-400 hover:text-white transition-colors"
              >
                <LuChevronRight className="h-3 w-3 opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all mr-1.5 text-primary" />
                Testimoni
              </a>
            </li>
          </ul>
        </div>

        {/* Col 3: Services (col-span-2) */}
        <div className="md:col-span-2">
          <h4 className="font-display font-bold text-xs text-slate-200 tracking-wider uppercase mb-5">
            Layanan
          </h4>
          <ul className="space-y-3 text-sm">
            <li>
              <a
                href="#"
                className="flex items-center group text-slate-400 hover:text-white transition-colors"
              >
                <LuChevronRight className="h-3 w-3 opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all mr-1.5 text-primary" />
                Untuk Orang Tua
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center group text-slate-400 hover:text-white transition-colors"
              >
                <LuChevronRight className="h-3 w-3 opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all mr-1.5 text-primary" />
                Untuk Sekolah
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center group text-slate-400 hover:text-white transition-colors"
              >
                <LuChevronRight className="h-3 w-3 opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all mr-1.5 text-primary" />
                Untuk Puskesmas
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center group text-slate-400 hover:text-white transition-colors"
              >
                <LuChevronRight className="h-3 w-3 opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all mr-1.5 text-primary" />
                Pusat Bantuan
              </a>
            </li>
          </ul>
        </div>

        {/* Col 4: Contact info (col-span-4) */}
        <div className="md:col-span-4">
          <h4 className="font-display font-bold text-xs text-slate-200 tracking-wider uppercase mb-5">
            Hubungi Kami
          </h4>
          <ul className="space-y-4 text-sm text-slate-400">
            <li className="flex items-start gap-3 group">
              <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-primary group-hover:bg-primary/10 group-hover:border-primary/20 transition-all shrink-0">
                <LuMail className="h-4 w-4" />
              </div>
              <div className="pt-1">
                <span className="block text-xs text-slate-500 font-sans">
                  Email Resmi
                </span>
                <a
                  href="mailto:halo@jalinan.id"
                  className="hover:text-white transition-colors font-medium"
                >
                  halo@jalinan.id
                </a>
              </div>
            </li>
            <li className="flex items-start gap-3 group">
              <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-primary group-hover:bg-primary/10 group-hover:border-primary/20 transition-all shrink-0">
                <LuPhone className="h-4 w-4" />
              </div>
              <div className="pt-1">
                <span className="block text-xs text-slate-500 font-sans">
                  Telepon / WhatsApp
                </span>
                <span className="hover:text-white transition-colors font-medium">
                  +62 811 2233 4455
                </span>
              </div>
            </li>
            <li className="flex items-start gap-3 group">
              <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-primary group-hover:bg-primary/10 group-hover:border-primary/20 transition-all shrink-0">
                <LuMapPin className="h-4 w-4" />
              </div>
              <div className="pt-1">
                <span className="block text-xs text-slate-500 font-sans">
                  Kantor Utama
                </span>
                <span className="text-slate-400 leading-relaxed">
                  Gedung Kesehatan Lt. 4, Jakarta Selatan, Indonesia
                </span>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom copyright line */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-500 relative z-10">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
          <p>© 2026 Jalinan Anak Sehat. Hak Cipta Dilindungi.</p>
          <span className="hidden sm:inline text-slate-800">|</span>
          <span className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-400">
            Dibuat dengan{" "}
            <LuHeart className="h-3.5 w-3.5 text-red-500 fill-red-500 animate-pulse inline-block" />{" "}
            untuk Anak Indonesia
          </span>
        </div>
        <div className="flex gap-6 text-xs sm:text-sm font-medium">
          <p className="hover:text-white transition-colors">
            Kebijakan Privasi
          </p>
          <p className="hover:text-white transition-colors">
            Syarat & Ketentuan
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterMain;
