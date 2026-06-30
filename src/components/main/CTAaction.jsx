import React from "react";
import { Link } from "react-router-dom";

const CTAaction = () => {
  return (
    <section className="py-20 px-4 md:px-8">
      <div className="max-w-container mx-auto">
        <div className="bg-gradient-to-r from-primary to-blue-400 rounded-3xl p-12 text-center text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white opacity-10 rounded-full" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-white opacity-10 rounded-full" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="font-heading text-3xl md:text-5xl font-bold mb-6">
              Siap Pantau Tumbuh Kembang Anak?
            </h2>
            <p className="text-xl text-white/90 mb-10">
              Bergabung bersama 500+ pengguna aktif. Gratis!
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to={"/auth/register"}>
                <p className="px-8 py-4 bg-white text-primary font-bold rounded-xl hover:bg-gray-50 transition-colors shadow-md">
                  Daftar Sekarang
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTAaction;
