import React from "react";
import useSWR from "swr";
import { useAuth } from "../../../hooks/auth/useAuth";
import { token } from "../../../lib/auth/authAPI";
import { jwtDecode } from "jwt-decode";
import { getDashboardSummary } from "../../../lib/parent/dashboardAPI";
import WelcomeHero from "../../../components/dashboard/WelcomeHero";
import {
  findConclusionRule,
  CONCLUSION_SARAN,
} from "../../../constants/conclusionRules";

const educationLabelMap = {
  TIDAK_SEKOLAH: "Tidak Sekolah",
  SD: "SD",
  SMP: "SMP",
  SMA: "SMA",
  D1: "D1",
  D2: "D2",
  D3: "D3",
  S1: "S1",
  S2: "S2",
  S3: "S3",
};

const SCORE_COLORS = [
  { bg: "from-emerald-500 to-emerald-600", icon: "users" },
  { bg: "from-violet-500 to-violet-600", icon: "clipboard" },
  { bg: "from-amber-500 to-amber-600", icon: "child" },
  { bg: "from-rose-500 to-rose-600", icon: "heart" },
];

const Index = () => {
  const { accessToken, setAccessToken, user, setUser } = useAuth();

  const getActiveToken = async () => {
    const currentTime = new Date().getTime();
    if (user?.exp * 1000 < currentTime) {
      const response = await token();
      setAccessToken(response.data.accessToken);
      const decoded = jwtDecode(response.data.accessToken);
      setUser(decoded);
      return response.data.accessToken;
    }
    return accessToken;
  };

  const fetchSummary = async () => {
    const t = await getActiveToken();
    const res = await getDashboardSummary(t);
    return res.data;
  };

  const { data, isLoading } = useSWR("parentDashboardSummary", fetchSummary);

  const conclusionData = React.useMemo(() => {
    if (!data) return null;

    const items = [
      {
        label: "Status Gizi",
        value: data.latestNutritionStatus || "Tidak Terdata",
        good: data.latestNutritionStatus === "GIZI BAIK",
      },
      {
        label: "Kebiasaan Sehari-hari",
        value:
          data.questionnaireResults?.find((r) => r.title.includes("Kebiasaan"))
            ?.interpretation || "Belum diisi",
        good:
          data.questionnaireResults?.find((r) => r.title.includes("Kebiasaan"))
            ?.interpretation === "Baik",
      },
      {
        label: "Pengetahuan Gizi",
        value:
          data.questionnaireResults?.find((r) =>
            r.title.includes("Pengetahuan"),
          )?.interpretation || "Belum diisi",
        good:
          data.questionnaireResults?.find((r) =>
            r.title.includes("Pengetahuan"),
          )?.interpretation === "Baik",
      },
      {
        label: "Sosial Ekonomi",
        value: data.socioEconomic?.interpretation || "Belum diisi",
        good: data.socioEconomic?.interpretation === "Menengah-Tinggi",
      },
      {
        label: "Pendidikan Orang Tua",
        value:
          data.parentEducation?.ibu?.category === "Menengah-Tinggi" ||
          data.parentEducation?.ayah?.category === "Menengah-Tinggi"
            ? "Menengah-Tinggi"
            : "Dasar",
        good:
          data.parentEducation?.ibu?.category === "Menengah-Tinggi" ||
          data.parentEducation?.ayah?.category === "Menengah-Tinggi",
      },
      {
        label: "Pelayanan Kesehatan Sekolah",
        value: data.schoolHealthService?.interpretation || "Belum diisi",
        good: data.schoolHealthService?.interpretation === "Tinggi",
      },
    ];

    const goodCount = items.filter((i) => i.good).length;
    const rule = findConclusionRule(goodCount);
    const saran =
      rule && data.latestNutritionStatus
        ? CONCLUSION_SARAN[rule.id]?.[data.latestNutritionStatus]?.parent || []
        : [];

    return {
      kategori: rule?.name || "Tidak Diketahui",
      icon: rule?.icon || "❓",
      color: rule?.color || "from-gray-500 to-gray-600",
      saran,
      goodCount,
      total: items.length,
    };
  }, [data]);

  const cards = [
    {
      label: "Anggota Keluarga",
      value: data?.totalFamilyMembers ?? 0,
      icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
    },
    {
      label: "Kuisioner Selesai",
      value: `${data?.answeredQuestionnaires ?? 0}/${data?.totalQuestionnaires ?? 0}`,
      icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
    },
    {
      label: "Anak Terdaftar",
      value: data?.totalChildren ?? 0,
      icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z",
    },
    {
      label: "Status Gizi",
      value: data?.latestNutritionStatus ?? "-",
      icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-3xl p-10 h-52" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-6 h-28 shadow-sm" />
          ))}
        </div>
        <div className="grid lg:grid-cols-2 gap-5">
          <div className="bg-white rounded-2xl p-6 h-72 shadow-sm" />
          <div className="space-y-5">
            <div className="bg-white rounded-2xl p-6 h-32 shadow-sm" />
            <div className="bg-white rounded-2xl p-6 h-32 shadow-sm" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <WelcomeHero
        percentage={data?.questionnaireProgress || 0}
        completedQuisioner={!!data?.questionnaireResults?.length}
      />

      {/* KESIMPULAN & SARAN */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-sm">
            <svg
              className="size-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">
              Kesimpulan &amp; Saran
            </h2>
            <p className="text-sm text-gray-400">
              Berdasarkan hasil kuisioner dan data kesehatan
            </p>
          </div>
        </div>

        {conclusionData && (
          <>
            {/* Kategori Banner */}
            <div
              className={`bg-gradient-to-r ${conclusionData.color} rounded-2xl p-5 md:p-6 mb-6 shadow-sm`}
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl md:text-4xl">
                  {conclusionData.icon}
                </span>
                <div>
                  <h3 className="text-white text-xl md:text-2xl font-bold">
                    {conclusionData.kategori}
                  </h3>
                  <p className="text-white/80 text-sm mt-1">
                    {conclusionData.goodCount} dari {conclusionData.total}{" "}
                    indikator dalam kondisi baik
                  </p>
                </div>
              </div>
            </div>

            {/* Saran untuk Orang Tua */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50/50 rounded-2xl p-5 md:p-6 border border-blue-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-blue-100">
                  <svg
                    className="size-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-800">
                  Saran untuk Orang Tua
                </h3>
              </div>
              <ul className="space-y-2.5">
                {conclusionData.saran.map((saran, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="shrink-0 size-5 rounded-full bg-emerald-100 flex items-center justify-center mt-0.5">
                      <svg
                        className="size-3 text-emerald-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2.5"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </span>
                    <span className="text-gray-700 leading-relaxed">
                      {saran}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((card, i) => (
          <div
            key={card.label}
            className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
          >
            <div
              className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br opacity-5 rounded-bl-full"
              style={{
                backgroundImage: `linear-gradient(135deg, ${SCORE_COLORS[i].bg.replace("from-", "").split(" ")[0]}, ${SCORE_COLORS[i].bg.replace("to-", "").split(" ")[0]})`,
              }}
            />
            <div className="flex items-center gap-4">
              <div
                className={`p-3 rounded-xl bg-gradient-to-br ${SCORE_COLORS[i].bg} shadow-sm`}
              >
                <svg
                  className="size-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={card.icon}
                  />
                </svg>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {card.label}
                </p>
                <p className="text-2xl font-bold text-gray-800 mt-0.5">
                  {card.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-base font-bold text-gray-800 mb-5 flex items-center gap-2">
            <svg
              className="size-5 text-violet-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            Hasil Kuisioner
          </h2>
          {data?.questionnaireResults?.length > 0 ? (
            <div className="space-y-3">
              {data.questionnaireResults.map((qr) => {
                const good = qr.interpretation === "Baik";
                return (
                  <div
                    key={qr.quesionerId}
                    className="relative p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-800">
                          {qr.title}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Skor: {qr.totalScore}
                        </p>
                      </div>
                      <span
                        className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                          good
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {qr.interpretation}
                      </span>
                    </div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all duration-500 ${
                          good ? "bg-emerald-500" : "bg-red-500"
                        }`}
                        style={{
                          width: `${Math.min((qr.totalScore / 40) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-gray-300">
              <svg
                className="size-12 mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <p className="text-sm">Belum mengisi kuisioner</p>
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
              <svg
                className="size-5 text-amber-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              Pendidikan Orang Tua
            </h2>
            {data?.parentEducation &&
            Object.keys(data.parentEducation).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(data.parentEducation).map(([role, edu]) => (
                  <div
                    key={role}
                    className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          role === "ibu" ? "bg-pink-100" : "bg-blue-100"
                        }`}
                      >
                        <svg
                          className={`size-5 ${
                            role === "ibu" ? "text-pink-600" : "text-blue-600"
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d={
                              role === "ibu"
                                ? "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                : "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            }
                          />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-gray-800 capitalize">
                        {role === "ibu" ? "Ibu" : "Ayah"}
                      </span>
                    </div>
                    <div className="text-right flex items-center gap-2">
                      <span className="text-sm text-gray-500">
                        {educationLabelMap[edu.education] ?? edu.education}
                      </span>
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          edu.category === "Menengah-Tinggi"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {edu.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-gray-300">
                <svg
                  className="size-12 mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <p className="text-sm">Belum ada data orang tua</p>
              </div>
            )}
          </div>

          {data?.socioEconomic && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                <svg
                  className="size-5 text-emerald-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Status Sosial Ekonomi
              </h2>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
                <div className="p-3.5 bg-gray-50 rounded-xl">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    Rumah
                  </p>
                  <p className="text-sm font-bold text-gray-800">
                    {data.socioEconomic.residenceStatus === "MILIK_SENDIRI"
                      ? "Milik Sendiri"
                      : data.socioEconomic.residenceStatus === "MENYEWA"
                        ? "Sewa/Kontrak"
                        : data.socioEconomic.residenceStatus ===
                            "BERSAMA_ORANG_TUA"
                          ? "Bersama Orang Tua"
                          : data.socioEconomic.residenceStatus}
                  </p>
                  <p className="text-xs text-emerald-600 font-semibold mt-0.5">
                    +{data.socioEconomic.residencePoints} poin
                  </p>
                </div>
                <div className="p-3.5 bg-gray-50 rounded-xl">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    Anak
                  </p>
                  <p className="text-sm font-bold text-gray-800">
                    {data.socioEconomic.childrenCount === "SATU"
                      ? "1 Orang"
                      : data.socioEconomic.childrenCount === "DUA_SAMPAI_TIGA"
                        ? "2-3 Orang"
                        : "≥ 4 Orang"}
                  </p>
                  <p className="text-xs text-emerald-600 font-semibold mt-0.5">
                    +{data.socioEconomic.childrenPoints} poin
                  </p>
                </div>
                <div className="p-3.5 bg-gray-50 rounded-xl">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    Balita
                  </p>
                  <p className="text-sm font-bold text-gray-800">
                    {data.socioEconomic.underFiveCount === "TIDAK_ADA"
                      ? "Tidak Ada"
                      : data.socioEconomic.underFiveCount === "SATU"
                        ? "1 Orang"
                        : data.socioEconomic.underFiveCount ===
                            "DUA_SAMPAI_TIGA"
                          ? "2-3 Orang"
                          : "≥ 4 Orang"}
                  </p>
                  <p className="text-xs text-emerald-600 font-semibold mt-0.5">
                    +{data.socioEconomic.underFivePoints} poin
                  </p>
                </div>
                <div className="p-3.5 bg-gray-50 rounded-xl">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    Penghasilan
                  </p>
                  <p className="text-sm font-bold text-gray-800">
                    {data.socioEconomic.familyIncomeLevel ===
                    "KURANG_DARI_LIMA_JUTA"
                      ? "< 5 Juta"
                      : data.socioEconomic.familyIncomeLevel ===
                          "LIMA_JUTA_SAMPAI_SEPULUH_JUTA"
                        ? "5-10 Juta"
                        : "> 10 Juta"}
                  </p>
                  <p className="text-xs text-emerald-600 font-semibold mt-0.5">
                    +{data.socioEconomic.incomePoints} poin
                  </p>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">
                    Total Skor
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-blue-700">
                      {data.socioEconomic.totalScore}
                    </span>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        data.socioEconomic.interpretation === "Menengah-Tinggi"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {data.socioEconomic.interpretation}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-white/60 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-700 ${
                      data.socioEconomic.interpretation === "Menengah-Tinggi"
                        ? "bg-gradient-to-r from-emerald-400 to-emerald-600"
                        : "bg-gradient-to-r from-red-400 to-red-600"
                    }`}
                    style={{
                      width: `${Math.min((data.socioEconomic.totalScore / 12) * 100, 100)}%`,
                    }}
                  />
                </div>
                <p className="text-[11px] text-gray-400 mt-1.5">
                  Skor minimal: 4 · Maksimal: 12
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
