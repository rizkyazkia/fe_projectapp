import React from "react";

const Step = () => {
  return (
    <section className="py-16 md:py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold font-display text-on-surface">
            Tiga Langkah Mudah Pantau Gizi Anak
          </h2>
          <p className="text-on-surface-variant mt-2">
            Dapatkan pemantauan gizi lengkap yang sangat sederhana.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl border border-outline-variant/30 shadow-sm relative z-10">
            <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg mb-4 shadow-sm">
              1
            </div>
            <h3 className="font-bold text-lg text-on-surface">Isi Data</h3>
            <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">
              Orang tua atau pihak sekolah menginput data antropometri dasar
              seperti berat badan, tinggi badan, dan riwayat asupan makanan
              secara berkala.
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl border border-outline-variant/30 shadow-sm relative z-10">
            <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg mb-4 shadow-sm">
              2
            </div>
            <h3 className="font-bold text-lg text-on-surface">
              Screening & Rekomendasi
            </h3>
            <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">
              Sistem Jalinan menganalisis status pertumbuhan anak secara
              otomatis berdasarkan standar WHO dan langsung memberikan
              rekomendasi diet terarah.
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl border border-outline-variant/30 shadow-sm relative z-10">
            <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg mb-4 shadow-sm">
              3
            </div>
            <h3 className="font-bold text-lg text-on-surface">
              Intervensi & Tindak Lanjut
            </h3>
            <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">
              Petugas gizi Puskesmas meninjau data hasil skrining bermasalah
              untuk penanganan langsung, pemberian vitamin tambahan, atau
              konseling lanjutan.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Step;
