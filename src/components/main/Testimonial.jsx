import { IoMdStar } from "react-icons/io";

const Testimonial = () => {
  return (
    <section id="testimoni" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold font-display text-on-surface">
            Apa Kata Mereka?
          </h2>
          <p className="text-on-surface-variant mt-2">
            Dengarkan kisah nyata dari pengguna ekosistem Jalinan Anak Sehat.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Testimonial 1 */}
          <div className="p-6 bg-surface-container rounded-2xl flex flex-col justify-between">
            <div>
              <div className="flex text-yellow-400 gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className="material-symbols-outlined text-[18px] fill-current"
                  >
                    <IoMdStar />
                  </span>
                ))}
              </div>
              <p className="text-sm text-on-surface leading-relaxed italic">
                "Sangat membantu saya memantau gizi anak dengan mudah di rumah.
                Notifikasi dan grafik rekomendasi menunya sangat pas serta
                gampang dipahami oleh ibu rumah tangga seperti saya."
              </p>
            </div>
            <div className="flex items-center gap-3 mt-6">
              <img
                className="w-10 h-10 rounded-full object-cover"
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120"
                alt="Sari Dewi"
                referrerPolicy="no-referrer"
              />
              <div>
                <h4 className="font-bold text-sm text-on-surface">Sari Dewi</h4>
                <p className="text-xs text-on-surface-variant">
                  Orang Tua Murid
                </p>
              </div>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="p-6 bg-surface-container rounded-2xl flex flex-col justify-between">
            <div>
              <div className="flex text-yellow-400 gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className="material-symbols-outlined text-[18px] fill-current"
                  >
                    <IoMdStar />
                  </span>
                ))}
              </div>
              <p className="text-sm text-on-surface leading-relaxed italic">
                "Integrasi UKS sekolah dengan puskesmas membuat deteksi kasus
                stunting dan gizi buruk jadi jauh lebih cepat. Kami bisa
                langsung bertindak berkat rekomendasi yang diberikan platform."
              </p>
            </div>
            <div className="flex items-center gap-3 mt-6">
              <img
                className="w-10 h-10 rounded-full object-cover"
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120"
                alt="Ahmad Fauzi"
                referrerPolicy="no-referrer"
              />
              <div>
                <h4 className="font-bold text-sm text-on-surface">
                  Ahmad Fauzi
                </h4>
                <p className="text-xs text-on-surface-variant">
                  Kepala Sekolah SD
                </p>
              </div>
            </div>
          </div>

          {/* Testimonial 3 */}
          <div className="p-6 bg-surface-container rounded-2xl flex flex-col justify-between">
            <div>
              <div className="flex text-yellow-400 gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className="material-symbols-outlined text-[18px] fill-current"
                  >
                    <IoMdStar />
                  </span>
                ))}
              </div>
              <p className="text-sm text-on-surface leading-relaxed italic">
                "Data rekam medis gizi anak yang terstruktur membantu dokter dan
                ahli gizi Puskesmas menganalisis tren kesehatan wilayah kerja
                kami secara akurat, hemat waktu, dan teratur."
              </p>
            </div>
            <div className="flex items-center gap-3 mt-6">
              <img
                className="w-10 h-10 rounded-full object-cover"
                src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=120"
                alt="dr. Rini Wijaya"
                referrerPolicy="no-referrer"
              />
              <div>
                <h4 className="font-bold text-sm text-on-surface">
                  dr. Rini Wijaya
                </h4>
                <p className="text-xs text-on-surface-variant">
                  Ahli Gizi Puskesmas
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
