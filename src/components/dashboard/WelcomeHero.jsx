import React from "react";
import { useAuth } from "../../hooks/auth/useAuth";
import ProgressCircle from "./parent/chart/ProgressCircle";

const WelcomeHero = () => {
  const { user } = useAuth();
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-2xl shadow-sm p-10 items-center">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Halo, {user?.username} 👋
        </h1>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Yuk isi kuisioner terlebih dahulu agar bisa memantau perkembangan gizi
          dan kesehatan anak Anda.
        </p>
        <button className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition duration-300">
          Isi Kuisioner Sekarang
        </button>
      </div>

      <div className="flex flex-col items-center justify-center">
        <ProgressCircle />
      </div>
    </section>
  );
};

export default WelcomeHero;
