import React from "react";
import useSWR from "swr";
import { useAuth } from "../../../hooks/auth/useAuth";
import { token } from "../../../lib/auth/authAPI";
import { jwtDecode } from "jwt-decode";
import { getAdminDashboardSummary } from "../../../lib/admin/dashboardAPI";
import ProgressCircle from "../../../components/dashboard/parent/chart/ProgressCircle";
import DoughnutChartComponent from "../../../components/dashboard/parent/chart/DoughnutChartComponent";

const ROLE_COLORS = {
  parent: "#3b82f6",
  school: "#22d3ee",
  teacher: "#f59e42",
  healthcare: "#a855f7",
};

const ROLE_LABELS = {
  parent: "Orang Tua",
  school: "Sekolah",
  teacher: "Guru",
  healthcare: "Puskesmas",
};

const INST_COLORS = { School: "#3b82f6", HealthCare: "#22d3ee" };
const INST_LABELS = { School: "Sekolah", HealthCare: "Puskesmas" };

const REC_STATUS_STYLES = {
  pending: "bg-yellow-100 text-yellow-700",
  proses: "bg-blue-100 text-blue-700",
  selesai: "bg-emerald-100 text-emerald-700",
};

const REC_STATUS_LABELS = {
  pending: "Pending",
  proses: "Proses",
  selesai: "Selesai",
};

const REC_DONUT_COLORS = {
  pending: "#f59e0b",
  proses: "#3b82f6",
  selesai: "#10b981",
};

const REC_DONUT_LABELS = {
  pending: "Pending",
  proses: "Proses",
  selesai: "Selesai",
};

const Index = () => {
  const { accessToken, setAccessToken, user, setUser } = useAuth();
  const [showProgressModal, setShowProgressModal] = React.useState(false);
  const [showRecModal, setShowRecModal] = React.useState(false);
  const [progressSearch, setProgressSearch] = React.useState("");
  const [recSearch, setRecSearch] = React.useState("");

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
    const res = await getAdminDashboardSummary(t);
    return res.data;
  };

  const { data, isLoading } = useSWR("adminDashboardSummary", fetchSummary);

  const userRoleData =
    data?.userByRole?.map((item) => ({
      name: ROLE_LABELS[item.role] || item.role,
      total: item.total,
      fill: ROLE_COLORS[item.role] || "#6b7280",
    })) || [];

  const instTypeData =
    data?.institutionByType?.map((item) => ({
      name: INST_LABELS[item.type] || item.type,
      total: item.total,
      fill: INST_COLORS[item.type] || "#6b7280",
    })) || [];

  const recStatusData =
    data?.recommendationsByStatus?.map((item) => ({
      name: REC_DONUT_LABELS[item.status] || item.status,
      total: item.total,
      fill: REC_DONUT_COLORS[item.status] || "#6b7280",
    })) || [];

  const filteredInstitutions = React.useMemo(() => {
    if (!data?.questionnaireProgress?.institutionDetails) return [];
    if (!progressSearch) return data.questionnaireProgress.institutionDetails;
    return data.questionnaireProgress.institutionDetails.filter((inst) =>
      inst.name.toLowerCase().includes(progressSearch.toLowerCase()),
    );
  }, [data, progressSearch]);

  const filteredRecommendations = React.useMemo(() => {
    if (!data?.recentRecommendations) return [];
    if (!recSearch) return data.recentRecommendations;
    return data.recentRecommendations.filter(
      (rec) =>
        rec.studentName.toLowerCase().includes(recSearch.toLowerCase()) ||
        rec.institutionName.toLowerCase().includes(recSearch.toLowerCase()),
    );
  }, [data, recSearch]);

  const cards = [
    {
      label: "Total Pengguna",
      value: data?.totalUsers ?? 0,
      icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
      bg: "from-blue-500 to-blue-600",
    },
    {
      label: "Total Instansi",
      value: data?.totalInstitutions ?? 0,
      icon: "M3 21h18M3 10h18M3 7l9-4 9 4M4 10v11m16-11v11M8 14v.01M12 14v.01M16 14v.01M8 18v.01M12 18v.01M16 18v.01",
      bg: "from-emerald-500 to-emerald-600",
    },
    {
      label: "Total Rekomendasi",
      value: data?.totalRecommendations ?? 0,
      icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
      bg: "from-amber-500 to-amber-600",
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
            <div className="bg-white rounded-2xl p-6 h-48 shadow-sm" />
            <div className="bg-white rounded-2xl p-6 h-48 shadow-sm" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Hero */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-2xl shadow-sm p-10 items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Halo, {user?.username}
          </h1>
          <p className="text-xl text-gray-600 mb-6 leading-relaxed">
            Pantau seluruh aktivitas sistem kesehatan sekolah.
          </p>
          {data?.questionnaireProgress && (
            <div className="flex items-center gap-3 text-sm">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full font-semibold">
                <svg
                  className="size-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {data.questionnaireProgress.completedInstitutions} dari{" "}
                {data.questionnaireProgress.totalInstitutions}
              </span>
              <span className="text-gray-500 text-lg">
                instansi sudah mengisi kuisioner
              </span>
            </div>
          )}
        </div>
        <div className="flex flex-col items-center justify-center">
          <ProgressCircle
            percentage={data?.questionnaireProgress?.percentage || 0}
          />
          <p className="text-sm text-gray-500 mt-2">
            Progres Kuisioner Sekolah
          </p>
        </div>
      </section>

      {/* 4 Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map((card, i) => (
          <div
            key={card.label}
            className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
          >
            <div
              className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br opacity-5 rounded-bl-full"
              style={{
                backgroundImage: `linear-gradient(135deg, ${["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b"][i]}, ${["#2563eb", "#7c3aed", "#059669", "#d97706"][i]})`,
              }}
            />
            <div className="flex items-center gap-4">
              <div
                className={`p-3 rounded-xl bg-gradient-to-br ${card.bg} shadow-sm`}
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

      {/* 2 Column Layout */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* LEFT COLUMN */}
        <div className="space-y-5">
          {/* User Distribution */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
              <svg
                className="size-5 text-blue-500"
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
              Distribusi Pengguna
            </h2>
            {userRoleData.length > 0 ? (
              <DoughnutChartComponent
                title=""
                data={userRoleData}
                legend={true}
                height={240}
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-gray-300">
                <p className="text-sm">Belum ada data pengguna</p>
              </div>
            )}
          </div>

          {/* Recent Recommendations (max 2 + Lihat Semua) */}
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Rekomendasi Terbaru
            </h2>
            {data?.recentRecommendations?.length > 0 ? (
              <div className="space-y-2">
                {data.recentRecommendations.slice(0, 2).map((rec) => (
                  <div
                    key={rec.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="size-9 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                        {rec.studentName.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">
                          {rec.studentName}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {rec.institutionName}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${
                        REC_STATUS_STYLES[rec.status] ||
                        "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {REC_STATUS_LABELS[rec.status] || rec.status}
                    </span>
                  </div>
                ))}
                {data.recentRecommendations.length > 2 && (
                  <button
                    onClick={() => setShowRecModal(true)}
                    className="w-full mt-3 py-2.5 text-sm font-semibold text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <svg
                      className="size-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h16m-7 6h7"
                      />
                    </svg>
                    Lihat Semua ({data.recentRecommendations.length})
                  </button>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-gray-300">
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-sm">Belum ada rekomendasi</p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-5">
          {/* Institution Distribution */}
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
                  d="M3 21h18M3 10h18M3 7l9-4 9 4M4 10v11m16-11v11M8 14v.01M12 14v.01M16 14v.01M8 18v.01M12 18v.01M16 18v.01"
                />
              </svg>
              Distribusi Instansi
            </h2>
            {instTypeData.length > 0 ? (
              <DoughnutChartComponent
                title=""
                data={instTypeData}
                legend={true}
                height={240}
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-gray-300">
                <p className="text-sm">Belum ada data instansi</p>
              </div>
            )}
          </div>

          {/* Questionnaire Progress (top 5 + Lihat Semua) */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
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
              Progres Kuisioner
            </h2>
            {data?.questionnaireProgress?.institutionDetails?.length > 0 ? (
              <div className="space-y-2">
                {data.questionnaireProgress.institutionDetails
                  .slice(0, 5)
                  .map((inst) => (
                    <div
                      key={inst.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className={`shrink-0 size-2.5 rounded-full ${
                            inst.completedQuests >= inst.totalQuests
                              ? "bg-emerald-500"
                              : inst.completedQuests > 0
                                ? "bg-amber-500"
                                : "bg-gray-300"
                          }`}
                        />
                        <span className="text-sm font-medium text-gray-700 truncate">
                          {inst.name}
                        </span>
                      </div>
                      <span
                        className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${
                          inst.completedQuests >= inst.totalQuests
                            ? "bg-emerald-100 text-emerald-700"
                            : inst.completedQuests > 0
                              ? "bg-amber-100 text-amber-700"
                              : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {inst.completedQuests}/{inst.totalQuests}
                      </span>
                    </div>
                  ))}
                {data.questionnaireProgress.institutionDetails.length > 5 && (
                  <button
                    onClick={() => setShowProgressModal(true)}
                    className="w-full mt-3 py-2.5 text-sm font-semibold text-violet-600 bg-violet-50 hover:bg-violet-100 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <svg
                      className="size-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h16m-7 6h7"
                      />
                    </svg>
                    Lihat Semua (
                    {data.questionnaireProgress.institutionDetails.length})
                  </button>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-gray-300">
                <p className="text-sm">Belum ada data instansi sekolah</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL: Progress Kuisioner */}
      {showProgressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl mx-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 shrink-0">
              <div>
                <h3 className="text-lg font-bold text-gray-800">
                  Progres Kuisioner per Instansi
                </h3>
                <p className="text-sm text-gray-400 mt-0.5">
                  {data?.questionnaireProgress?.completedInstitutions} dari{" "}
                  {data?.questionnaireProgress?.totalInstitutions} instansi
                  telah menyelesaikan kuisioner
                </p>
              </div>
              <button
                onClick={() => {
                  setShowProgressModal(false);
                  setProgressSearch("");
                }}
                className="size-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
              >
                <svg
                  className="size-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="px-6 pt-4 pb-2 shrink-0">
              <div className="relative max-w-xs">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                  />
                </svg>
                <input
                  type="text"
                  value={progressSearch}
                  onChange={(e) => setProgressSearch(e.target.value)}
                  placeholder="Cari instansi..."
                  className="w-full py-2.5 pl-10 pr-4 text-sm border border-gray-200 rounded-xl focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-6 pb-6 pt-2">
              {filteredInstitutions.length > 0 ? (
                <div className="space-y-1.5">
                  {filteredInstitutions.map((inst) => (
                    <div
                      key={inst.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <span
                          className={`shrink-0 size-3 rounded-full ${
                            inst.completedQuests >= inst.totalQuests
                              ? "bg-emerald-500"
                              : inst.completedQuests > 0
                                ? "bg-amber-500"
                                : "bg-gray-300"
                          }`}
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">
                            {inst.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            {inst.completedQuests >= inst.totalQuests
                              ? "Sudah mengisi"
                              : inst.completedQuests > 0
                                ? "Belum selesai"
                                : "Belum mengisi"}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`shrink-0 text-sm font-bold px-3 py-1.5 rounded-full ${
                          inst.completedQuests >= inst.totalQuests
                            ? "bg-emerald-100 text-emerald-700"
                            : inst.completedQuests > 0
                              ? "bg-amber-100 text-amber-700"
                              : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {inst.completedQuests}/{inst.totalQuests}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-gray-300">
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
                      d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                    />
                  </svg>
                  <p className="text-sm">Instansi tidak ditemukan</p>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50 rounded-b-3xl shrink-0">
              <span className="text-sm text-gray-500">
                {filteredInstitutions.length} dari{" "}
                {data?.questionnaireProgress?.institutionDetails?.length || 0}{" "}
                instansi
              </span>
              <button
                onClick={() => {
                  setShowProgressModal(false);
                  setProgressSearch("");
                }}
                className="px-6 py-2.5 text-sm font-semibold text-gray-600 bg-gray-200 hover:bg-gray-300 rounded-xl transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Rekomendasi Terbaru */}
      {showRecModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl mx-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 shrink-0">
              <div>
                <h3 className="text-lg font-bold text-gray-800">
                  Rekomendasi Terbaru
                </h3>
                <p className="text-sm text-gray-400 mt-0.5">
                  Total {data?.recentRecommendations?.length || 0} rekomendasi
                </p>
              </div>
              <button
                onClick={() => {
                  setShowRecModal(false);
                  setRecSearch("");
                }}
                className="size-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
              >
                <svg
                  className="size-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="px-6 pt-4 pb-2 shrink-0">
              <div className="relative max-w-xs">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                  />
                </svg>
                <input
                  type="text"
                  value={recSearch}
                  onChange={(e) => setRecSearch(e.target.value)}
                  placeholder="Cari siswa atau sekolah..."
                  className="w-full py-2.5 pl-10 pr-4 text-sm border border-gray-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-6 pb-6 pt-2">
              {filteredRecommendations.length > 0 ? (
                <div className="space-y-1.5">
                  {filteredRecommendations.map((rec) => (
                    <div
                      key={rec.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="size-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                          {rec.studentName.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">
                            {rec.studentName}
                          </p>
                          <p className="text-xs text-gray-400 truncate">
                            {rec.institutionName}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                            REC_STATUS_STYLES[rec.status] ||
                            "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {REC_STATUS_LABELS[rec.status] || rec.status}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(rec.createdAt).toLocaleDateString("id-ID")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-gray-300">
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
                      d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                    />
                  </svg>
                  <p className="text-sm">Rekomendasi tidak ditemukan</p>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50 rounded-b-3xl shrink-0">
              <span className="text-sm text-gray-500">
                {filteredRecommendations.length} dari{" "}
                {data?.recentRecommendations?.length || 0} rekomendasi
              </span>
              <button
                onClick={() => {
                  setShowRecModal(false);
                  setRecSearch("");
                }}
                className="px-6 py-2.5 text-sm font-semibold text-gray-600 bg-gray-200 hover:bg-gray-300 rounded-xl transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
