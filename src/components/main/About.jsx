import AboutIllustration from "../../assets/main/about.png";
import { IoIosCheckmark } from "react-icons/io";

const About = () => {
  return (
    <section id="tentang" className="py-16 md:py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* About Left: Landscape Stream SVG representation */}
        <div className="lg:col-span-6">
          <div className="bg-white p-4 rounded-2xl shadow-lg border border-outline-variant/30 overflow-hidden aspect-video relative flex items-center justify-center">
            {/* Stylized forest and river stream landscape in CSS SVG */}
            <img
              src={AboutIllustration}
              alt="About Illustration"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* About Right: Text Contents */}
        <div className="lg:col-span-6 flex flex-col space-y-6">
          <span className="text-xs font-bold text-primary tracking-widest uppercase font-display bg-primary/10 px-3 py-1 rounded-full w-fit">
            Tentang Jalinan Anak sehat
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display leading-tight text-on-surface">
            Platform Kolaborasi 3 Pilar Kesehatan Anak
          </h2>
          <p className="text-on-surface-variant leading-relaxed">
            Jalinan membangun ekosistem kesehatan terpadu yang menghubungkan
            orang tua, pihak sekolah, dan tenaga kesehatan (Puskesmas). Kami
            memastikan setiap anak mendapatkan pemantauan gizi yang akurat dan
            intervensi yang tepat waktu demi masa depan yang lebih cerah.
          </p>

          {/* List of benefits */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-tertiary-container/30 flex items-center justify-center text-tertiary mt-1">
                <span className="material-symbols-outlined text-[14px] font-bold">
                  <IoIosCheckmark />
                </span>
              </div>
              <div>
                <h4 className="font-bold text-sm text-on-surface">
                  Terintegrasi
                </h4>
                <p className="text-xs text-on-surface-variant">
                  Satu platform untuk semua stakeholder pendidikan dan kesehatan
                  anak.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-tertiary-container/30 flex items-center justify-center text-tertiary mt-1">
                <span className="material-symbols-outlined text-[14px] font-bold">
                  <IoIosCheckmark />
                </span>
              </div>
              <div>
                <h4 className="font-bold text-sm text-on-surface">Real-time</h4>
                <p className="text-xs text-on-surface-variant">
                  Update data pertumbuhan dan rekomendasi asupan gizi secara
                  instan.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-tertiary-container/30 flex items-center justify-center text-tertiary mt-1">
                <span className="material-symbols-outlined text-[14px] font-bold">
                  <IoIosCheckmark />
                </span>
              </div>
              <div>
                <h4 className="font-bold text-sm text-on-surface">
                  Terpercaya
                </h4>
                <p className="text-xs text-on-surface-variant">
                  Metodologi pengukuran dan materi divalidasi langsung oleh ahli
                  gizi anak Indonesia.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
