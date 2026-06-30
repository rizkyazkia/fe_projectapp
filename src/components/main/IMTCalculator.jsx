import { useState } from "react";
import { motion } from "motion/react";
import api from "../../lib/api";

const IMTCalculator = () => {
  const [miniGender, setMiniGender] = useState("Laki-laki");
  const [miniAgeYear, setMiniAgeYear] = useState(3);
  const [miniAgeMonth, setMiniAgeMonth] = useState(0);
  const [miniWeight, setMiniWeight] = useState(14);
  const [miniHeight, setMiniHeight] = useState(95);
  const [miniResult, setMiniResult] = useState(null);

  const handleMiniCalculate = async (e) => {
    e.preventDefault();
    try {
      const gender = miniGender === "Laki-laki" ? "L" : "P";
      const ageMonths = Number(miniAgeYear) * 12 + Number(miniAgeMonth);
      const res = await api.post("/imt/calculate", {
        gender,
        ageMonths,
        weightKg: Number(miniWeight),
        heightCm: Number(miniHeight),
      });
      setMiniResult(res.data.data);
    } catch (err) {
      console.error("Gagal menghitung IMT", err);
    }
  };

  return (
    <section className="py-12 bg-white border-y border-outline-variant/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-surface-container rounded-2xl p-6 md:p-8 shadow-sm">
          <div className="text-center max-w-lg mx-auto mb-6">
            <span className="text-primary text-xs font-bold tracking-widest uppercase font-display">
              Cepat & Akurat
            </span>
            <h2 className="text-2xl font-bold font-display mt-1">
              Cek Status Gizi Anak Sekarang
            </h2>
            <p className="text-sm text-on-surface-variant mt-1">
              Input data sederhana di bawah ini untuk melihat status gizi
              berdasarkan standar WHO
            </p>
          </div>

          <form
            onSubmit={handleMiniCalculate}
            className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end"
          >
            <div>
              <label className="block text-xs font-bold text-on-surface-variant mb-1">
                Gender
              </label>
              <select
                value={miniGender}
                onChange={(e) => setMiniGender(e.target.value)}
                className="w-full p-2 bg-white border border-outline-variant rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option>Laki-laki</option>
                <option>Perempuan</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center">
                <label className="block text-xs font-bold text-on-surface-variant mb-1">
                Usia (Tahun)
              </label>
              <label className="block text-xs font-bold text-on-surface-variant mb-1">
                Bulan
              </label>
              </div>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="2"
                  max="14"
                  value={miniAgeYear}
                  onChange={(e) => setMiniAgeYear(e.target.value)}
                  className="w-full p-2 bg-white border border-outline-variant rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Thn"
                  required
                />
                <input
                  type="number"
                  min="0"
                  max="11"
                  value={miniAgeMonth}
                  onChange={(e) => setMiniAgeMonth(e.target.value)}
                  className="w-full p-2 bg-white border border-outline-variant rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Bln"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface-variant mb-1">
                Berat (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={miniWeight}
                onChange={(e) => setMiniWeight(e.target.value)}
                className="w-full p-2 bg-white border border-outline-variant rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface-variant mb-1">
                Tinggi (cm)
              </label>
              <input
                type="number"
                step="0.1"
                value={miniHeight}
                onChange={(e) => setMiniHeight(e.target.value)}
                className="w-full p-2 bg-white border border-outline-variant rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full bg-primary text-white p-2.5 rounded-lg text-sm font-bold hover:bg-primary-container transition-all cursor-pointer"
              >
                Hitung Status
              </button>
            </div>
          </form>

          {miniResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-white rounded-xl border border-outline-variant/50 grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              <div className="flex flex-col">
                <span className="text-xs text-on-surface-variant">
                  IMT Anak (BMI)
                </span>
                <span className="text-lg font-bold text-on-surface">
                  {miniResult.bmi}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-on-surface-variant">
                  Status Indeks IMT/U
                </span>
                <span
                  className={`text-base font-bold px-2 py-0.5 rounded-full text-center w-fit ${miniResult.bmiColor}`}
                >
                  {miniResult.bmiStatus}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-on-surface-variant">
                  Rekomendasi Utama
                </span>
                <span className="text-xs text-on-surface font-medium leading-relaxed">
                  {miniResult.recommendations?.[0]}
                </span>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default IMTCalculator;
