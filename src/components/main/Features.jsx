import { LuLayoutDashboard, LuDatabase } from "react-icons/lu";
import { IoSchoolOutline } from "react-icons/io5";
import { MdOutlineHealthAndSafety, MdOutlineHistory } from "react-icons/md";
import { GoTasklist } from "react-icons/go";


const Features = () => {
  return (
    <section id="fitur" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-on-surface">
            Semua Kebutuhan Pemantauan Gizi dalam Satu Platform
          </h2>
          <p className="text-on-surface-variant text-base mt-3 leading-relaxed">
            Fitur lengkap yang dirancang khusus untuk memudahkan koordinasi,
            analisis, dan pemantauan gizi tumbuh kembang anak terpadu.
          </p>
        </div>

        {/* Grid Bento */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-6 bg-surface-container-low rounded-2xl hover:shadow-md hover:border-primary/20 border border-transparent transition-all flex flex-col gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary-container/20 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined">
                <LuLayoutDashboard className="w-6 h-6"/>
              </span>
            </div>
            <div>
              <h3 className="font-bold text-lg text-on-surface">
                Dashboard Orang Tua
              </h3>
              <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">
                Pantau grafik pertumbuhan anak (TB, BB, IMT), jadwal imunisasi,
                dan asupan gizi harian dari smartphone Anda.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-6 bg-surface-container-low rounded-2xl hover:shadow-md hover:border-primary/20 border border-transparent transition-all flex flex-col gap-4">
            <div className="w-10 h-10 rounded-xl bg-secondary-container/20 text-secondary flex items-center justify-center">
              <span className="material-symbols-outlined">
                <IoSchoolOutline className="w-6 h-6"/>
              </span>
            </div>
            <div>
              <h3 className="font-bold text-lg text-on-surface">
                Manajemen Sekolah
              </h3>
              <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">
                Fasilitasi pelaporan kesehatan siswa secara kolektif oleh UKS
                dan deteksi dini masalah gizi di lingkungan sekolah.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-6 bg-surface-container-low rounded-2xl hover:shadow-md hover:border-primary/20 border border-transparent transition-all flex flex-col gap-4">
            <div className="w-10 h-10 rounded-xl bg-tertiary-container/20 text-tertiary flex items-center justify-center">
              <span className="material-symbols-outlined">
                <MdOutlineHealthAndSafety className="w-6 h-6"/>
              </span>
            </div>
            <div>
              <h3 className="font-bold text-lg text-on-surface">
                Intervensi Puskesmas
              </h3>
              <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">
                Akses data agregat wilayah untuk perancangan program intervensi
                gizi serta pemberian imunisasi atau suplemen tepat waktu.
              </p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="p-6 bg-surface-container-low rounded-2xl hover:shadow-md hover:border-primary/20 border border-transparent transition-all flex flex-col gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary-container/20 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined">
                <GoTasklist className="w-6 h-6"/>
              </span>
            </div>
            <div>
              <h3 className="font-bold text-lg text-on-surface">
                Kuisioner Digital
              </h3>
              <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">
                Isi kuesioner skrining gizi secara berkala dengan form digital
                interaktif yang didesain mudah diisi oleh orang tua.
              </p>
            </div>
          </div>

          {/* Card 5 */}
          <div className="p-6 bg-surface-container-low rounded-2xl hover:shadow-md hover:border-primary/20 border border-transparent transition-all flex flex-col gap-4">
            <div className="w-10 h-10 rounded-xl bg-secondary-container/20 text-secondary flex items-center justify-center">
              <span className="material-symbols-outlined">
                <MdOutlineHistory className="w-6 h-6"/>
              </span>
            </div>
            <div>
              <h3 className="font-bold text-lg text-on-surface">
                Riwayat Rekomendasi
              </h3>
              <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">
                Simpan dan akses kembali rekam jejak konsultasi, riwayat
                pertumbuhan, serta saran gizi khusus dari petugas medis terkait.
              </p>
            </div>
          </div>

          {/* Card 6 */}
          <div className="p-6 bg-surface-container-low rounded-2xl hover:shadow-md hover:border-primary/20 border border-transparent transition-all flex flex-col gap-4">
            <div className="w-10 h-10 rounded-xl bg-tertiary-container/20 text-tertiary flex items-center justify-center">
              <span className="material-symbols-outlined">
                <LuDatabase className="w-6 h-6"/>
              </span>
            </div>
            <div>
              <h3 className="font-bold text-lg text-on-surface">
                Data Terpusat
              </h3>
              <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">
                Sistem rekam medis gizi anak terenkripsi yang aman, terintegrasi
                satu ID kependudukan anak, dan dapat diunduh kapan saja.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
