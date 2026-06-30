import { IoTrendingUp, IoRestaurant } from "react-icons/io5";
import HeroIllustration from "../../assets/main/hero.png";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section id="hero" className="relative pt-12 md:pt-24 pb-16 md:pb-32 px-4 md:px-8 max-w-container mx-auto overflow-hidden">
      <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob" />
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
        <div className="flex flex-col gap-6 max-w-xl">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Sehatkan Hidup Dengan{" "}
            <span className="text-primary relative inline-block">
              Gizi Seimbang
              <svg
                className="absolute -bottom-2 left-0 w-full h-3 text-yellow-500"
                preserveAspectRatio="none"
                viewBox="0 0 100 20"
              >
                <path
                  d="M0,10 Q50,20 100,10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                />
              </svg>
            </span>
          </h1>
          <p className="text-lg text-text-muted">
            Pantau asupan gizi, dapatkan rekomendasi nutrisi tepat, dan wujudkan
            gaya hidup sehat untuk anak Anda — terintegrasi antara sekolah,
            puskesmas, dan orang tua.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Link to={"/auth/register"}>
              <p className="px-6 py-3 bg-primary text-white rounded-xl font-semibold text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                Mulai Pantau Sekarang
              </p>
            </Link>
            <a
              href="#tentang"
              className="px-6 py-3 border-2 border-gray-200 text-gray-900 rounded-xl font-semibold text-center hover:border-primary hover:text-primary transition-all duration-300"
            >
              Pelajari Lebih Lanjut
            </a>
          </div>
          <div className="flex items-center gap-4 mt-8 pt-6 border-t border-gray-100">
            <div className="flex -space-x-3">
              <img
                className="w-10 h-10 rounded-full border-2 border-white object-cover"
                src="https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&q=80&w=120"
                alt="Child 1"
                referrerPolicy="no-referrer"
              />
              <img
                className="w-10 h-10 rounded-full border-2 border-white object-cover"
                src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=120"
                alt="Child 2"
                referrerPolicy="no-referrer"
              />
              <img
                className="w-10 h-10 rounded-full border-2 border-white object-cover"
                src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=120"
                alt="Child 3"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="text-sm">
              <span className="font-bold text-gray-900">1,000+</span>{" "}
              <span className="text-text-muted">Keluarga terbantu</span>
            </div>
          </div>
        </div>

        <div className="relative h-[400px] md:h-[500px] w-full rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm flex items-center justify-center p-8">
          <div className="w-full h-full bg-gradient-to-br from-primary/10 to-green-100 rounded-xl flex items-center justify-center">
              <img
                src={HeroIllustration}
                alt="Hero Illustration"
                className="w-full h-full object-cover"
              />
          </div>

          <div className="absolute top-8 left-8 bg-white p-3 rounded-xl shadow-md border border-gray-100 animate-bounce-slow">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-sm">
                  <IoTrendingUp />
                </span>
              </div>
              <div>
                <div className="text-xs text-gray-500">Status Gizi</div>
                <div className="font-bold text-sm text-green-700">Normal</div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-12 right-8 bg-white p-3 rounded-xl shadow-md border border-gray-100 animate-bounce-slow-delayed">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-sm">
                  <IoRestaurant />
                </span>
              </div>
              <div>
                <div className="text-xs text-gray-500">Rekomendasi</div>
                <div className="font-bold text-sm text-gray-800">
                  Sayuran Hijau
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
