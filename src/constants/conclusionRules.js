export const CONCLUSION_RULES = [
  { id: 1, name: "Tidak Berisiko Gizi Lebih", minGood: 6, maxGood: 6, icon: "🏆", color: "from-emerald-500 to-teal-600" },
  { id: 2, name: "Berisiko Gizi Lebih",       minGood: 5, maxGood: 5, icon: "⚠️", color: "from-amber-500 to-orange-600" },
  { id: 3, name: "Gizi Lebih",                minGood: 0, maxGood: 4, icon: "🚨", color: "from-rose-500 to-red-600" },
];

export const findConclusionRule = (goodCount) =>
  CONCLUSION_RULES.find(r => goodCount >= r.minGood && goodCount <= r.maxGood);

const SARAN_ORTU_GIZI_BAIK = [
  "Tetap pertahankan status gizi anak anda",
  "Jangan berhenti berikan makanan dan minuman terbaik untuk anak",
  "Dukung aktivitas fisik anak yang bermanfaat untuk tubuh",
  "Pastikan kebutuhan tidur anak terpenuhi",
];

const SARAN_ORTU_BURUK_OVERWEIGHT = [
  "Segera periksakan anak anda ke Ahli Gizi/fasilitas layanan kesehatan terdekat",
  "Berikan contoh perilaku makan dan minum yang baik di rumah",
  "Dukung aktivitas fisik anak yang bermanfaat untuk tubuh",
  "Pastikan kebutuhan tidur anak terpenuhi",
];

const SARAN_SEKOLAH_GIZI_BAIK = [
  "Budayakan perilaku hidup sehat dalam lingkungan sekolah",
];

const SARAN_SEKOLAH_BURUK_OVERWEIGHT = [
  "Rekomendasi tindaklanjut Puskesmas",
  "Budayakan perilaku hidup sehat dalam lingkungan sekolah",
];

export const CONCLUSION_SARAN = {
  1: {
    "GIZI BAIK":         { parent: SARAN_ORTU_GIZI_BAIK,        school: SARAN_SEKOLAH_GIZI_BAIK },
    "GIZI BURUK-KURANG": { parent: SARAN_ORTU_BURUK_OVERWEIGHT, school: SARAN_SEKOLAH_BURUK_OVERWEIGHT },
  },
  2: {
    "GIZI BAIK":         { parent: SARAN_ORTU_GIZI_BAIK,        school: SARAN_SEKOLAH_GIZI_BAIK },
  },
  3: {
    "OVERWEIGHT-OBESITAS": { parent: SARAN_ORTU_BURUK_OVERWEIGHT, school: SARAN_SEKOLAH_BURUK_OVERWEIGHT },
  },
};
