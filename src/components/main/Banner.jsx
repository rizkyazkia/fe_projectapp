const Banner = () => {
  return (
    <section className="py-20 bg-primary text-text-light px-4 md:px-8">
      <div className="max-w-container mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/20">
          <div className="flex flex-col items-center justify-center p-4">
            <span className="text-white font-heading text-4xl md:text-5xl font-bold mb-2">
              500+
            </span>
            <span className="font-semibold text-white/80">Anak Terpantau</span>
          </div>
          <div className="flex flex-col items-center justify-center p-4">
            <span className="text-white font-heading text-4xl md:text-5xl font-bold mb-2">
              50+
            </span>
            <span className="font-semibold text-white/80">Sekolah Aktif</span>
          </div>
          <div className="flex flex-col items-center justify-center p-4">
            <span className="text-white font-heading text-4xl md:text-5xl font-bold mb-2">
              20+
            </span>
            <span className="font-semibold text-white/80">Puskesmas Bermitra</span>
          </div>
          <div className="flex flex-col items-center justify-center p-4">
            <span className="text-white font-heading text-4xl md:text-5xl font-bold mb-2">
              1.000+
            </span>
            <span className="font-semibold text-white/80">Kuisioner Terisi</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
