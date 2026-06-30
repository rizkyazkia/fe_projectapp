import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  LuBookOpen,
  LuTrophy,
  LuSparkles,
  LuDownload,
  LuCheck,
  LuX,
  LuArrowRight,
  LuArrowLeft,
  LuRotateCcw,
  LuUtensils,
  LuInfo,
  LuCalendar,
  LuClipboardList,
  LuFlame,
  LuAward,
} from "react-icons/lu";
import ModulPDF from "../../assets/main/MODUL_PETUALANGAN_MAKANAN_SEHAT_JENNY.pdf";

export default function InteractiveModule() {
  const [activeTab, setActiveTab] = useState("story");

  const [storyPage, setStoryPage] = useState(0);
  const [storyChoice, setStoryChoice] = useState(null);
  const [storyScore, setStoryScore] = useState(0);

  const [gameStarted, setGameStarted] = useState(false);
  const [currentFoodIndex, setCurrentFoodIndex] = useState(0);
  const [gameScore, setGameScore] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [gameFeedback, setGameFeedback] = useState("");

  const [selectedCarb, setSelectedCarb] = useState(null);
  const [selectedProtein, setSelectedProtein] = useState(null);
  const [selectedVeggie, setSelectedVeggie] = useState(null);
  const [selectedFruit, setSelectedFruit] = useState(null);
  const [plateScore, setPlateScore] = useState(0);
  const [plateFeedback, setPlateFeedback] = useState("");

  const foodsForSorting = [
    {
      name: "Apel Segar 🍎",
      type: "baik",
      desc: "Buah segar kaya serat alami, vitamin C, dan air yang membuat tubuh segar bertenaga!",
    },
    {
      name: "Donat Cokelat 🍩",
      type: "palsu",
      desc: "Sangat tinggi gula tambahan dan lemak jenuh. Memberikan energi instan tapi cepat bikin lemas dan mengantuk.",
    },
    {
      name: "Wortel Rebus 🥕",
      type: "baik",
      desc: "Kaya akan Vitamin A untuk kesehatan mata, serta serat untuk kelancaran pencernaan.",
    },
    {
      name: "Burger Jumbo 🍔",
      type: "palsu",
      desc: "Tinggi lemak jenuh, garam, dan MSG. Jika dikonsumsi berlebihan bisa memicu obesitas sejak dini.",
    },
    {
      name: "Ikan Bakar 🐟",
      type: "baik",
      desc: "Sumber protein hewani yang luar biasa dan kaya omega-3 untuk kecerdasan otak anak!",
    },
    {
      name: "Keripik Asin 🍟",
      type: "palsu",
      desc: "Sangat tinggi natrium/garam dan MSG. Membuat cepat haus dan tidak memiliki nutrisi seimbang.",
    },
    {
      name: "Telur Rebus 🥚",
      type: "baik",
      desc: "Protein hewani lengkap dengan asam amino esensial untuk mendukung tumbuh kembang sel tubuh.",
    },
  ];

  const carbsList = [
    {
      id: "nasi",
      name: "Nasi Putih 🍚",
      color: "bg-amber-100 border-amber-400 text-amber-800",
    },
    {
      id: "kentang",
      name: "Kentang Rebus 🥔",
      color: "bg-amber-100 border-amber-400 text-amber-800",
    },
    {
      id: "roti",
      name: "Roti Gandum 🍞",
      color: "bg-amber-100 border-amber-400 text-amber-800",
    },
    {
      id: "jagung",
      name: "Jagung Manis 🌽",
      color: "bg-amber-100 border-amber-400 text-amber-800",
    },
  ];

  const proteinsList = [
    {
      id: "ikan",
      name: "Ikan Bakar 🐟",
      color: "bg-rose-100 border-rose-400 text-rose-800",
    },
    {
      id: "ayam",
      name: "Ayam Suwir 🍗",
      color: "bg-rose-100 border-rose-400 text-rose-800",
    },
    {
      id: "telor",
      name: "Telur Rebus 🥚",
      color: "bg-rose-100 border-rose-400 text-rose-800",
    },
    {
      id: "tempe",
      name: "Tempe Tahu 🪵",
      color: "bg-rose-100 border-rose-400 text-rose-800",
    },
  ];

  const veggiesList = [
    {
      id: "brokoli",
      name: "Brokoli 🥦",
      color: "bg-emerald-100 border-emerald-400 text-emerald-800",
    },
    {
      id: "wortel",
      name: "Wortel 🥕",
      color: "bg-emerald-100 border-emerald-400 text-emerald-800",
    },
    {
      id: "selada",
      name: "Selada Segar 🥬",
      color: "bg-emerald-100 border-emerald-400 text-emerald-800",
    },
    {
      id: "buncis",
      name: "Buncis Tumis 🫛",
      color: "bg-emerald-100 border-emerald-400 text-emerald-800",
    },
  ];

  const fruitsList = [
    {
      id: "apel",
      name: "Apel 🍎",
      color: "bg-orange-100 border-orange-400 text-orange-800",
    },
    {
      id: "jeruk",
      name: "Jeruk Manis 🍊",
      color: "bg-orange-100 border-orange-400 text-orange-800",
    },
    {
      id: "alpukat",
      name: "Alpukat 🥑",
      color: "bg-orange-100 border-orange-400 text-orange-800",
    },
    {
      id: "pisang",
      name: "Pisang 🍌",
      color: "bg-orange-100 border-orange-400 text-orange-800",
    },
  ];

  const handleStoryNext = () => {
    if (storyPage < 4) {
      setStoryPage(storyPage + 1);
      setStoryChoice(null);
    }
  };

  const handleStoryPrev = () => {
    if (storyPage > 0) {
      setStoryPage(storyPage - 1);
      setStoryChoice(null);
    }
  };

  const handleStoryChoice = (choice) => {
    setStoryChoice(choice);
    if (choice === "correct") {
      setStoryScore(storyScore + 1);
    }
  };

  const handleSort = (type) => {
    const currentFood = foodsForSorting[currentFoodIndex];
    if (currentFood.type === type) {
      setGameScore(gameScore + 1);
      setGameFeedback("correct");
    } else {
      setGameFeedback("incorrect");
    }

    setTimeout(() => {
      setGameFeedback("");
      if (currentFoodIndex < foodsForSorting.length - 1) {
        setCurrentFoodIndex(currentFoodIndex + 1);
      } else {
        setGameFinished(true);
      }
    }, 1500);
  };

  const resetGame = () => {
    setCurrentFoodIndex(0);
    setGameScore(0);
    setGameFinished(false);
    setGameFeedback("");
    setGameStarted(true);
  };

  const checkPlateBalance = () => {
    if (selectedCarb && selectedProtein && selectedVeggie && selectedFruit) {
      setPlateScore(100);
      setPlateFeedback(
        "Sempurna! Piring Seimbangmu mengandung Karbohidrat (Kuning), Protein (Merah), Sayur (Hijau), dan Buah (Oranye) dengan porsi ideal! Tubuhmu akan sangat sehat!",
      );
    } else {
      const missing = [];
      if (!selectedCarb) missing.push("Karbohidrat");
      if (!selectedProtein) missing.push("Protein");
      if (!selectedVeggie) missing.push("Sayuran");
      if (!selectedFruit) missing.push("Buah-buahan");
      setPlateScore(50);
      setPlateFeedback(
        `Piringmu belum seimbang secara penuh. Yuk lengkapi bagian: ${missing.join(", ")}!`,
      );
    }
  };

  const resetPlate = () => {
    setSelectedCarb(null);
    setSelectedProtein(null);
    setSelectedVeggie(null);
    setSelectedFruit(null);
    setPlateFeedback("");
    setPlateScore(0);
  };

  const handleDownloadModule = () => {
    const a = document.createElement("a");
    a.href = ModulPDF;
    a.download = "MODUL_PETUALANGAN_MAKANAN_SEHAT_JENNY.pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <section id="permainan" className="py-16 bg-gradient-to-b from-surface to-slate-50 border-t border-b border-outline-variant/20 font-sans relative">
      {/* Decorative dots background */}
      <div className="absolute top-10 right-10 opacity-10 pointer-events-none">
        <svg width="100" height="100" fill="currentColor">
          <pattern
            id="pattern-dots"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="2" className="text-primary" />
          </pattern>
          <rect width="100" height="100" fill="url(#pattern-dots)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-xs font-bold text-primary mb-4">
            <LuSparkles className="h-3.5 w-3.5 text-primary" />
            <span>Fitur Playable Edukasi Anak</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold font-display text-on-surface tracking-tight">
            Petualangan Makanan Sehat Jenny & Teman Gizi
          </h2>
          <p className="text-sm md:text-base text-on-surface-variant mt-3 leading-relaxed">
            Eksplorasi modul edukasi spesial pencegahan gizi lebih melalui
            permainan interaktif! Yuk ajak anak Anda belajar memilih nutrisi
            terbaik dengan gembira.
          </p>
        </div>

        {/* Playable Panel Card Container */}
        <div className="bg-white rounded-3xl shadow-xl border border-outline-variant/30 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Left Rail Menu - Tabs */}
          <div className="lg:col-span-3 bg-slate-50 p-6 border-r border-outline-variant/20 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible shrink-0">
            <button
              onClick={() => setActiveTab("story")}
              className={`flex-1 lg:flex-none flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all text-left whitespace-nowrap cursor-pointer ${
                activeTab === "story"
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/60"
              }`}
            >
              <LuBookOpen className="h-4.5 w-4.5 shrink-0" />
              <span>1. Cerita Rindu</span>
            </button>
            <button
              onClick={() => setActiveTab("game")}
              className={`flex-1 lg:flex-none flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all text-left whitespace-nowrap cursor-pointer ${
                activeTab === "game"
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/60"
              }`}
            >
              <LuTrophy className="h-4.5 w-4.5 shrink-0" />
              <span>2. Sortir Energi Baik</span>
            </button>
            <button
              onClick={() => setActiveTab("plate")}
              className={`flex-1 lg:flex-none flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all text-left whitespace-nowrap cursor-pointer ${
                activeTab === "plate"
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/60"
              }`}
            >
              <LuUtensils className="h-4.5 w-4.5 shrink-0" />
              <span>3. Isi Piringku</span>
            </button>
            <button
              onClick={() => setActiveTab("info")}
              className={`flex-1 lg:flex-none flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all text-left whitespace-nowrap cursor-pointer ${
                activeTab === "info"
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/60"
              }`}
            >
              <LuInfo className="h-4.5 w-4.5 shrink-0" />
              <span>4. Tentang Modul</span>
            </button>

            {/* Separator */}
            <div className="hidden lg:block my-4 border-t border-slate-200"></div>

            {/* Premium Download Section */}
            <div className="hidden lg:flex flex-col bg-slate-100/80 rounded-2xl p-4 border border-slate-200/60 text-center mt-auto">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Unduh Gratis
              </span>
              <p className="text-xs text-slate-600 font-medium mt-1 mb-3">
                Dapatkan modul lengkap 40 halaman beserta jurnal mingguan!
              </p>
              <button
                onClick={handleDownloadModule}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <LuDownload className="h-3.5 w-3.5" />
                <span>Unduh E-Book</span>
              </button>
            </div>
          </div>

          {/* Right Play Area Content */}
          <div className="lg:col-span-9 p-6 sm:p-8 bg-white flex flex-col justify-between min-h-[480px]">
            <AnimatePresence mode="wait">
              {/* TAB 1: STORY OF RINDU */}
              {activeTab === "story" && (
                <motion.div
                  key="story"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-6 flex flex-col justify-between h-full"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400">
                        Petualangan Rindu &amp; Kue Manisnya — Halaman{" "}
                        {storyPage + 1} dari 5
                      </span>
                      {storyScore > 0 && (
                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full border border-amber-200 text-xs font-bold">
                          <LuAward className="h-3.5 w-3.5 text-amber-500" />
                          <span>Poin Sehat: {storyScore}</span>
                        </div>
                      )}
                    </div>

                    {storyPage === 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                        <div className="md:col-span-4 flex justify-center">
                          <div className="w-40 h-40 rounded-full bg-pink-100 flex items-center justify-center text-6xl shadow-inner relative">
                            👧
                            <span className="absolute bottom-2 right-2 text-2xl">
                              🍰
                            </span>
                          </div>
                        </div>
                        <div className="md:col-span-8 space-y-3">
                          <h3 className="text-xl font-bold font-display text-slate-800">
                            Kenalan dengan Rindu
                          </h3>
                          <p className="text-slate-600 leading-relaxed text-sm">
                            "Namaku Rindu. Aku suka sekali kue manis! Donat
                            cokelat, bolu pelangi, es krim rasa stroberi...
                            Semuanya membuatku bahagia. Dulu, setiap pulang
                            sekolah, aku dan mama suka beli camilan manis di
                            depan gerbang. Aku suka kebersamaannya!"
                          </p>
                        </div>
                      </div>
                    )}

                    {storyPage === 1 && (
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                        <div className="md:col-span-4 flex justify-center">
                          <div className="w-40 h-40 rounded-full bg-slate-100 flex items-center justify-center text-6xl shadow-inner relative">
                            🥱
                            <span className="absolute bottom-2 right-2 text-2xl">
                              💤
                            </span>
                          </div>
                        </div>
                        <div className="md:col-span-8 space-y-3">
                          <h3 className="text-xl font-bold font-display text-slate-800">
                            Rindu Mulai Merasa Cepat Lelah
                          </h3>
                          <p className="text-slate-600 leading-relaxed text-sm">
                            "Tapi belakangan ini, aku sering cepat lelah dan
                            seragam sekolahku makin sempit. Teman-teman mulai
                            berkata: 'Kamu suka makan manis ya?' Aku sedih
                            sekali... Aku rindu rasa manis itu, tapi aku juga
                            rindu bermain lincah."
                          </p>
                        </div>
                      </div>
                    )}

                    {storyPage === 2 && (
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                        <div className="md:col-span-4 flex justify-center">
                          <div className="w-40 h-40 rounded-full bg-amber-50 flex items-center justify-center text-6xl shadow-inner relative">
                            👩‍🍳
                            <span className="absolute bottom-2 right-2 text-2xl">
                              🥣
                            </span>
                          </div>
                        </div>
                        <div className="md:col-span-8 space-y-4">
                          <h3 className="text-xl font-bold font-display text-slate-800">
                            Waktunya Membuat Camilan Baru!
                          </h3>
                          <p className="text-slate-600 leading-relaxed text-sm font-medium">
                            Mama membelai rambutku lembut. "Mama sayang kamu,
                            Rindu. Bagaimana kalau sore ini kita buat camilan
                            sehat tapi tetap enak bersama-sama?"
                          </p>
                          <div className="space-y-2">
                            <p className="text-xs font-bold text-slate-500">
                              Bantu Rindu memilih camilan sore ini:
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <button
                                onClick={() => handleStoryChoice("correct")}
                                className={`p-3 rounded-xl border text-left text-xs transition-all flex items-start gap-2 cursor-pointer ${
                                  storyChoice === "correct"
                                    ? "bg-emerald-50 border-emerald-500 text-emerald-800"
                                    : "bg-white border-slate-200 hover:border-slate-350"
                                }`}
                              >
                                <span className="text-lg">🍇</span>
                                <div>
                                  <span className="font-bold block">
                                    Puding Buah Naga Alami
                                  </span>
                                  <span className="text-slate-500 text-[10px]">
                                    Manis alami buah tanpa gula tambahan!
                                  </span>
                                </div>
                              </button>
                              <button
                                onClick={() => handleStoryChoice("incorrect")}
                                className={`p-3 rounded-xl border text-left text-xs transition-all flex items-start gap-2 cursor-pointer ${
                                  storyChoice === "incorrect"
                                    ? "bg-rose-50 border-rose-500 text-rose-800"
                                    : "bg-white border-slate-200 hover:border-slate-350"
                                }`}
                              >
                                <span className="text-lg">🍩</span>
                                <div>
                                  <span className="font-bold block">
                                    Donat Cokelat Extra Gula
                                  </span>
                                  <span className="text-slate-500 text-[10px]">
                                    Tinggi gula tambahan dan tepung.
                                  </span>
                                </div>
                              </button>
                            </div>
                          </div>

                          {storyChoice === "correct" && (
                            <motion.div
                              initial={{ scale: 0.95 }}
                              animate={{ scale: 1 }}
                              className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 flex items-center gap-2"
                            >
                              <LuCheck className="h-4 w-4 text-emerald-600" />
                              <span>
                                Pilihan Bagus! Puding Buah Naga mengandung
                                pemanis alami buah &amp; serat sehat untuk tubuh
                                ideal!
                              </span>
                            </motion.div>
                          )}
                          {storyChoice === "incorrect" && (
                            <motion.div
                              initial={{ scale: 0.95 }}
                              animate={{ scale: 1 }}
                              className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2"
                            >
                              <LuX className="h-4 w-4 text-rose-600" />
                              <span>
                                Donat memang lezat, tapi tinggi gula yang bikin
                                cepat lelah. Coba puding buah naga alami yuk!
                              </span>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    )}

                    {storyPage === 3 && (
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                        <div className="md:col-span-4 flex justify-center">
                          <div className="w-40 h-40 rounded-full bg-emerald-50 flex items-center justify-center text-6xl shadow-inner relative">
                            🍧
                            <span className="absolute bottom-2 right-2 text-2xl">
                              🍓
                            </span>
                          </div>
                        </div>
                        <div className="md:col-span-8 space-y-3">
                          <h3 className="text-xl font-bold font-display text-slate-800">
                            Menghias Pelangi Buah
                          </h3>
                          <p className="text-slate-600 leading-relaxed text-sm">
                            "Besok sorenya, kami membuat es lilin dari yoghurt
                            dan potongan mangga manis segar. Aku menata
                            buah-buahan seperti pelangi di piring. 'Ma, ternyata
                            makanan sehat itu juga bisa kelihatan lucu dan
                            menyenangkan ya!' kataku sambil tertawa gembira."
                          </p>
                        </div>
                      </div>
                    )}

                    {storyPage === 4 && (
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                        <div className="md:col-span-4 flex justify-center">
                          <div className="w-40 h-40 rounded-full bg-emerald-100 flex items-center justify-center text-6xl shadow-inner relative animate-bounce">
                            🏃‍♀️
                            <span className="absolute bottom-2 right-2 text-2xl">
                              ✨
                            </span>
                          </div>
                        </div>
                        <div className="md:col-span-8 space-y-3">
                          <h3 className="text-xl font-bold font-display text-emerald-800">
                            Rindu Merasa Sangat Hebat!
                          </h3>
                          <p className="text-slate-600 leading-relaxed text-sm">
                            "Kini aku lebih bijak memilih makanan. Aku jadi
                            lebih berenergi main lompat tali, lebih cepat
                            menghafal pelajaran di sekolah, dan tidak mengantuk
                            lagi di kelas! Tubuh kita memang butuh teman sehat
                            yang baik. Aku merasa luar biasa hebat!"
                          </p>
                          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-3">
                            <LuTrophy className="h-6 w-6 text-emerald-600" />
                            <div>
                              <h4 className="font-bold text-xs text-emerald-900">
                                Rangkuman Nilai:
                              </h4>
                              <p className="text-xs text-slate-600">
                                Gizi seimbang melatih kecerdasan kognitif &amp;
                                stamina bermain anak secara maksimal.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Navigation Footer */}
                  <div className="flex justify-between items-center pt-6 border-t border-slate-100">
                    <button
                      onClick={handleStoryPrev}
                      disabled={storyPage === 0}
                      className="px-4 py-2 text-xs font-bold border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <LuArrowLeft className="h-4 w-4" />
                      <span>Kembali</span>
                    </button>
                    <div className="flex gap-1.5">
                      {[0, 1, 2, 3, 4].map((idx) => (
                        <span
                          key={idx}
                          className={`w-2 h-2 rounded-full transition-all ${
                            storyPage === idx
                              ? "bg-primary w-4"
                              : "bg-slate-200"
                          }`}
                        />
                      ))}
                    </div>
                    {storyPage === 4 ? (
                      <button
                        onClick={() => {
                          setStoryPage(0);
                          setStoryChoice(null);
                        }}
                        className="px-4 py-2 text-xs font-bold bg-primary text-white hover:bg-primary-container rounded-lg flex items-center gap-1.5 cursor-pointer"
                      >
                        <LuRotateCcw className="h-4 w-4" />
                        <span>Mulai Lagi</span>
                      </button>
                    ) : (
                      <button
                        onClick={handleStoryNext}
                        className="px-4 py-2 text-xs font-bold bg-primary text-white hover:bg-primary-container rounded-lg flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>Lanjut</span>
                        <LuArrowRight className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </motion.div>
              )}

              {/* TAB 2: SORTING GAME */}
              {activeTab === "game" && (
                <motion.div
                  key="game"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-6 flex flex-col justify-between h-full"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400">
                        Game: Sortir Energi Baik VS Energi Palsu
                      </span>
                      <div className="px-3 py-1 bg-amber-50 rounded-full border border-amber-200 text-xs font-bold text-amber-700 flex items-center gap-1.5">
                        <LuFlame className="h-4 w-4 text-amber-500 fill-amber-500" />
                        <span>
                          Skor: {gameScore} / {foodsForSorting.length}
                        </span>
                      </div>
                    </div>

                    {!gameStarted && !gameFinished && (
                      <div className="text-center py-10 space-y-4 max-w-md mx-auto">
                        <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center text-3xl mx-auto shadow-inner">
                          🎮
                        </div>
                        <h3 className="text-xl font-bold font-display text-slate-800">
                          Sortir Energi Sehatmu
                        </h3>
                        <p className="text-slate-500 text-xs leading-relaxed">
                          Tentukan apakah makanan yang muncul memberikan energi
                          sehat jangka panjang (Energi Baik) atau energi instan
                          tanpa nutrisi seimbang (Energi Palsu).
                        </p>
                        <button
                          onClick={() => setGameStarted(true)}
                          className="px-6 py-3 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-container shadow-md transition-all cursor-pointer"
                        >
                          Mulai Main Game!
                        </button>
                      </div>
                    )}

                    {gameStarted && !gameFinished && (
                      <div className="max-w-md mx-auto bg-slate-50 rounded-2xl p-6 border border-slate-200 relative text-center space-y-6">
                        {/* Food Card */}
                        <motion.div
                          key={currentFoodIndex}
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="bg-white p-6 rounded-xl border border-slate-300/60 shadow-md flex flex-col items-center gap-3 relative overflow-hidden"
                        >
                          <span className="text-5xl">
                            {
                              foodsForSorting[currentFoodIndex].name.split(
                                " ",
                              )[1]
                            }
                          </span>
                          <span className="font-extrabold text-lg text-slate-800">
                            {
                              foodsForSorting[currentFoodIndex].name.split(
                                " ",
                              )[0]
                            }
                          </span>
                          <span className="text-xs text-slate-400">
                            Makanan ke-{currentFoodIndex + 1} dari{" "}
                            {foodsForSorting.length}
                          </span>

                          {/* Instant Feedback Overlay */}
                          {gameFeedback === "correct" && (
                            <div className="absolute inset-0 bg-emerald-500/90 flex flex-col items-center justify-center text-white p-4">
                              <LuCheck className="h-10 w-10 stroke-[3]" />
                              <span className="font-bold mt-2">
                                Jawaban Benar!
                              </span>
                              <p className="text-[11px] mt-1 text-emerald-50 leading-relaxed text-center">
                                {foodsForSorting[currentFoodIndex].desc}
                              </p>
                            </div>
                          )}
                          {gameFeedback === "incorrect" && (
                            <div className="absolute inset-0 bg-rose-500/90 flex flex-col items-center justify-center text-white p-4">
                              <LuX className="h-10 w-10 stroke-[3]" />
                              <span className="font-bold mt-2">
                                Jawaban Kurang Tepat!
                              </span>
                              <p className="text-[11px] mt-1 text-rose-50 leading-relaxed text-center">
                                {foodsForSorting[currentFoodIndex].desc}
                              </p>
                            </div>
                          )}
                        </motion.div>

                        {/* Interactive Buttons */}
                        <div className="grid grid-cols-2 gap-4">
                          <button
                            onClick={() => handleSort("baik")}
                            disabled={!!gameFeedback}
                            className="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <LuCheck className="h-4 w-4" />
                            <span>Energi Baik</span>
                          </button>
                          <button
                            onClick={() => handleSort("palsu")}
                            disabled={!!gameFeedback}
                            className="py-3 px-4 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <LuX className="h-4 w-4" />
                            <span>Energi Palsu</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {gameFinished && (
                      <div className="text-center py-8 space-y-4 max-w-md mx-auto">
                        <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center text-3xl mx-auto shadow-inner animate-bounce">
                          🏆
                        </div>
                        <h3 className="text-xl font-bold font-display text-slate-800">
                          Petualangan Selesai!
                        </h3>
                        <p className="text-slate-500 text-xs">
                          Kerja luar biasa! Anda berhasil mengklasifikasikan
                          bahan makanan penting dengan tepat. Ayo pertahankan
                          kebiasaan makan sehat setiap hari!
                        </p>
                        <div className="p-3 bg-emerald-50 text-emerald-800 font-bold text-sm rounded-xl border border-emerald-200">
                          Skor Akhir Anda: {gameScore} /{" "}
                          {foodsForSorting.length} Benar!
                        </div>
                        <button
                          onClick={resetGame}
                          className="px-6 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg transition-all cursor-pointer"
                        >
                          Main Lagi
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* TAB 3: PLATE BUILDER */}
              {activeTab === "plate" && (
                <motion.div
                  key="plate"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-6 flex flex-col justify-between h-full"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400">
                        Simulasi Interaktif: Menyusun Piring Seimbangku
                      </span>
                      {plateScore > 0 && (
                        <div className="px-3 py-1 bg-emerald-50 rounded-full border border-emerald-200 text-xs font-bold text-emerald-700">
                          Kelengkapan Gizi: {plateScore}%
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                      {/* Left Side: Visual Plate Illustration */}
                      <div className="md:col-span-5 flex justify-center">
                        <div className="relative w-72 h-72 rounded-full border-8 border-slate-100 bg-white shadow-lg overflow-hidden flex flex-wrap p-3">
                          {/* Top Left: Protein (Rose) */}
                          <div
                            className={`w-1/2 h-1/2 border-r-2 border-b-2 border-slate-100 flex flex-col items-center justify-center p-2 transition-all ${selectedProtein ? "bg-rose-50/70" : "bg-slate-50/50"}`}
                          >
                            <span className="text-[10px] text-rose-500 font-bold uppercase tracking-wider">
                              Protein (1/6)
                            </span>
                            <span className="text-lg mt-1">
                              {selectedProtein
                                ? selectedProtein.name.split(" ")[1]
                                : "🥩"}
                            </span>
                            <span className="text-[10px] text-slate-400 mt-1 truncate max-w-full text-center">
                              {selectedProtein
                                ? selectedProtein.name.split(" ")[0]
                                : "Kosong"}
                            </span>
                          </div>

                          {/* Top Right: Karbohidrat (Amber) */}
                          <div
                            className={`w-1/2 h-1/2 border-b-2 border-slate-100 flex flex-col items-center justify-center p-2 transition-all ${selectedCarb ? "bg-amber-50/70" : "bg-slate-50/50"}`}
                          >
                            <span className="text-[10px] text-amber-500 font-bold uppercase tracking-wider">
                              Karbo (1/3)
                            </span>
                            <span className="text-lg mt-1">
                              {selectedCarb
                                ? selectedCarb.name.split(" ")[1]
                                : "🌾"}
                            </span>
                            <span className="text-[10px] text-slate-400 mt-1 truncate max-w-full text-center">
                              {selectedCarb
                                ? selectedCarb.name.split(" ")[0]
                                : "Kosong"}
                            </span>
                          </div>

                          {/* Bottom Left: Sayur (Emerald) */}
                          <div
                            className={`w-1/2 h-1/2 border-r-2 border-slate-100 flex flex-col items-center justify-center p-2 transition-all ${selectedVeggie ? "bg-emerald-50/70" : "bg-slate-50/50"}`}
                          >
                            <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">
                              Sayur (1/3)
                            </span>
                            <span className="text-lg mt-1">
                              {selectedVeggie
                                ? selectedVeggie.name.split(" ")[1]
                                : "🥗"}
                            </span>
                            <span className="text-[10px] text-slate-400 mt-1 truncate max-w-full text-center">
                              {selectedVeggie
                                ? selectedVeggie.name.split(" ")[0]
                                : "Kosong"}
                            </span>
                          </div>

                          {/* Bottom Right: Buah (Orange) */}
                          <div
                            className={`w-1/2 h-1/2 flex flex-col items-center justify-center p-2 transition-all ${selectedFruit ? "bg-orange-50/70" : "bg-slate-50/50"}`}
                          >
                            <span className="text-[10px] text-orange-500 font-bold uppercase tracking-wider">
                              Buah (1/6)
                            </span>
                            <span className="text-lg mt-1">
                              {selectedFruit
                                ? selectedFruit.name.split(" ")[1]
                                : "🍎"}
                            </span>
                            <span className="text-[10px] text-slate-400 mt-1 truncate max-w-full text-center">
                              {selectedFruit
                                ? selectedFruit.name.split(" ")[0]
                                : "Kosong"}
                            </span>
                          </div>

                          {/* Center Hub */}
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-200 border-4 border-white flex items-center justify-center text-[10px] font-bold text-slate-600 shadow-sm">
                            💧
                          </div>
                        </div>
                      </div>

                      {/* Right Side: Interactive Food Selectors */}
                      <div className="md:col-span-7 space-y-4">
                        {/* Selector 1: Carbs */}
                        <div className="space-y-1.5">
                          <label className="block text-xs font-bold text-slate-500">
                            🌾 Karbohidrat (Kuning):
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {carbsList.map((item) => (
                              <button
                                key={item.id}
                                onClick={() => setSelectedCarb(item)}
                                className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                                  selectedCarb?.id === item.id
                                    ? "bg-amber-500 border-amber-600 text-white scale-98"
                                    : "bg-white border-slate-200 hover:bg-slate-50 text-slate-750"
                                }`}
                              >
                                {item.name}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Selector 2: Protein */}
                        <div className="space-y-1.5">
                          <label className="block text-xs font-bold text-slate-500">
                            🥩 Protein / Lauk Pauk (Merah):
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {proteinsList.map((item) => (
                              <button
                                key={item.id}
                                onClick={() => setSelectedProtein(item)}
                                className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                                  selectedProtein?.id === item.id
                                    ? "bg-rose-500 border-rose-600 text-white scale-98"
                                    : "bg-white border-slate-200 hover:bg-slate-50 text-slate-750"
                                }`}
                              >
                                {item.name}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Selector 3: Veggies */}
                        <div className="space-y-1.5">
                          <label className="block text-xs font-bold text-slate-500">
                            🥦 Sayuran Hijau (Hijau):
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {veggiesList.map((item) => (
                              <button
                                key={item.id}
                                onClick={() => setSelectedVeggie(item)}
                                className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                                  selectedVeggie?.id === item.id
                                    ? "bg-emerald-500 border-emerald-600 text-white scale-98"
                                    : "bg-white border-slate-200 hover:bg-slate-50 text-slate-750"
                                }`}
                              >
                                {item.name}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Selector 4: Fruit */}
                        <div className="space-y-1.5">
                          <label className="block text-xs font-bold text-slate-500">
                            🍎 Buah-Buahan (Oranye):
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {fruitsList.map((item) => (
                              <button
                                key={item.id}
                                onClick={() => setSelectedFruit(item)}
                                className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                                  selectedFruit?.id === item.id
                                    ? "bg-orange-500 border-orange-600 text-white scale-98"
                                    : "bg-white border-slate-200 hover:bg-slate-50 text-slate-750"
                                }`}
                              >
                                {item.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {plateFeedback && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-xl border text-xs leading-relaxed ${
                          plateScore === 100
                            ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                            : "bg-amber-50 border-amber-200 text-amber-800"
                        }`}
                      >
                        {plateFeedback}
                      </motion.div>
                    )}
                  </div>

                  {/* Action Bar */}
                  <div className="flex justify-between pt-6 border-t border-slate-100">
                    <button
                      onClick={resetPlate}
                      className="px-4 py-2 text-xs font-bold border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg flex items-center gap-1.5 cursor-pointer"
                    >
                      <LuRotateCcw className="h-4 w-4" />
                      <span>Atur Ulang Piring</span>
                    </button>
                    <button
                      onClick={checkPlateBalance}
                      className="px-6 py-2 bg-primary text-white hover:bg-primary-container text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                    >
                      <LuCheck className="h-4 w-4" />
                      <span>Evaluasi Piring</span>
                    </button>
                  </div>
                </motion.div>
              )}

              {/* TAB 4: ABOUT MODULE */}
              {activeTab === "info" && (
                <motion.div
                  key="info"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-6 flex flex-col justify-between h-full"
                >
                  <div className="space-y-5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-sm">
                        <LuBookOpen className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold font-display text-slate-800">
                          Tentang Modul Jenny &amp; Teman Gizi
                        </h3>
                        <p className="text-xs text-slate-400">
                          Petualangan Makanan Seru Setiap Hari
                        </p>
                      </div>
                    </div>

                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                      Modul ini disusun oleh <strong>Jenny Anna Siauta</strong>{" "}
                      bekerja sama dengan ahli pakar gizi dan kurikulum{" "}
                      <strong>Dr. Cecep Kustandi, M.Pd</strong> sebagai panduan
                      promotif-preventif yang ceria untuk mencegah permasalahan
                      gizi lebih/obesitas pada anak-anak usia sekolah dasar di
                      Indonesia.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60">
                        <h4 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                          <LuClipboardList className="h-4 w-4 text-primary" />
                          <span>Materi Pembelajaran Utama:</span>
                        </h4>
                        <ul className="text-slate-500 text-xs mt-2 space-y-1 list-disc pl-4">
                          <li>Bahaya &amp; Ciri-Ciri Gizi Lebih</li>
                          <li>Porsi Ideal Pedoman "Isi Piringku"</li>
                          <li>Membaca Label Nilai Gizi Makanan</li>
                          <li>Gaya Hidup Aktif Minimal 60 Menit/Hari</li>
                        </ul>
                      </div>

                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60">
                        <h4 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                          <LuCalendar className="h-4 w-4 text-primary" />
                          <span>Template Evaluasi Rumah:</span>
                        </h4>
                        <ul className="text-slate-500 text-xs mt-2 space-y-1 list-disc pl-4">
                          <li>Jurnal Makan &amp; Aktivitasku Harian</li>
                          <li>Kartu Evaluasi 3 Hari Orang Tua</li>
                          <li>Template Kalender Gerakku Mingguan</li>
                          <li>Resep Sehat Sup Ayam Bergizi Tinggi</li>
                        </ul>
                      </div>
                    </div>

                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2.5">
                      <LuInfo className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">
                          Tips untuk Orang Tua &amp; Guru:
                        </span>
                        <p className="text-slate-600 text-[11px] mt-1">
                          Gunakan e-book digital ini untuk berdiskusi bersama
                          anak. Cari resep menyenangkan seperti sup ayam gizi
                          komplit dan latih anak mengisi Jurnal Gizi mereka
                          sendiri.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Small Promo banner for download (mobile responsive) */}
        <div className="mt-6 lg:hidden bg-slate-100/80 rounded-2xl p-4 border border-slate-200/60 text-center flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Unduh Gratis
            </span>
            <p className="text-xs text-slate-600 font-medium">
              Dapatkan modul lengkap 40 halaman beserta jurnal mingguan!
            </p>
          </div>
          <button
            onClick={handleDownloadModule}
            className="py-2.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer w-full sm:w-auto"
          >
            <LuDownload className="h-3.5 w-3.5" />
            <span>Unduh E-Book</span>
          </button>
        </div>
      </div>
    </section>
  );
}
