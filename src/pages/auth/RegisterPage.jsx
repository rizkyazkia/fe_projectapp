import React from "react";
import { PiFingerprint } from "react-icons/pi";
import { MdOutlineAlternateEmail, MdLockOutline } from "react-icons/md";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import Logo from "../../components/main/Logo";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import InputForm from "../../components/auth/InputForm";
import { useAuth } from "../../hooks/auth/useAuth";
import { useFormik } from "formik";
import RegisterIllustration from "../../assets/auth/register.jpg";

export default function RegisterPage({ onNavigate, onRegister }) {
  const [handlePassword, setHandlePassword] = React.useState(false);
  const { register } = useAuth();

  const { handleChange, handleBlur, handleSubmit } = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      role_id: 2,
    },
    onSubmit: async (values) => {
      await register(values);
    },
  });

  return (
    <div className="flex h-screen w-full bg-surface">
      {/* Left Column: Register Form */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full lg:w-1/2 flex flex-col justify-center px-6 md:px-12 lg:px-24 xl:px-32 bg-white h-full overflow-y-auto py-8"
      >
        {/* Header/Logo Area */}
        <div className="mb-5 md:mb-10 text-center lg:text-left">
          <div className="flex justify-center lg:justify-start mb-5 md:mb-6">
            <Logo className="h-12" />
          </div>
          <h1 className="text-[32px] leading-tight font-extrabold text-on-surface mb-2 font-display">
            Daftar
          </h1>
          <p className="text-on-surface-variant font-sans text-base">
            Buat akun Anda untuk mulai memantau gizi anak
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-2 md:space-y-6 max-w-md mx-auto lg:mx-0 w-full"
        >
          {/* Username Field */}
          <InputForm
            htmlFor={"username"}
            label={"Username"}
            type={"username"}
            id={"username"}
            name={"username"}
            placeholder={"contoh"}
            onChange={handleChange}
            onBlur={handleBlur}
          >
            <PiFingerprint
              size={16}
              className="absolute top-1/2 -translate-y-1/2 left-4"
            />
          </InputForm>

          {/* Email Field */}
          <InputForm
            htmlFor={"email"}
            label={"Email"}
            type={"email"}
            id={"email"}
            name={"email"}
            placeholder={"contoh@site.com"}
            onChange={handleChange}
            onBlur={handleBlur}
          >
            <MdOutlineAlternateEmail
              size={16}
              className="absolute top-1/2 -translate-y-1/2 left-4"
            />
          </InputForm>

          {/* Password Field */}
          <InputForm
            htmlFor={"password"}
            label={"Password"}
            type={handlePassword ? "text" : "password"}
            id={"password"}
            name={"password"}
            placeholder={"katasandi123"}
            onChange={handleChange}
            onBlur={handleBlur}
          >
            <MdLockOutline
              size={16}
              className="absolute top-1/2 -translate-y-1/2 left-4"
            />
            {handlePassword ? (
              <IoEyeOutline
                size={16}
                className="absolute top-1/2 -translate-y-1/2 right-4 cursor-pointer"
                onClick={() => setHandlePassword(!handlePassword)}
              />
            ) : (
              <IoEyeOffOutline
                size={16}
                className="absolute top-1/2 -translate-y-1/2 right-4 cursor-pointer"
                onClick={() => setHandlePassword(!handlePassword)}
              />
            )}
          </InputForm>

          {/* Submit Button */}
          <button
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-on-primary bg-primary hover:bg-primary-container focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all active:scale-[0.98] cursor-pointer"
            type="submit"
          >
            Daftar
          </button>

          <Link to={"/"}>
            <button
              className="w-full flex justify-center py-3 px-4 border border-primary rounded-lg shadow-sm text-sm font-semibold text-primary bg-white hover:bg-white/65 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all shadow-[0px_2px_4px_rgba(18,23,35,0.05)] hover:shadow-[0px_10px_15px_rgba(18,23,35,0.1)] active:scale-[0.98] cursor-pointer"
              type="button"
            >
              Kembali ke Beranda
            </button>
          </Link>

          {/* Divider */}
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline-variant"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-on-surface-variant">
                atau
              </span>
            </div>
          </div>

          {/* Sign In Link */}
          <p className="mt-2 text-center text-sm text-on-surface-variant">
            Sudah punya akun?{" "}
            <Link to={"/auth/login"}>
              <button
                className="font-semibold text-primary hover:text-primary-container transition-colors cursor-pointer"
                type="button"
              >
                Masuk
              </button>
            </Link>
          </p>
        </form>
      </motion.div>

      {/* Right Column: Illustration & Quote */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-primary to-primary-container items-center justify-center p-12 overflow-hidden">
        {/* Decorative Circles */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white opacity-10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-80 h-80 rounded-full bg-white opacity-10 blur-3xl"></div>

        <div className="relative z-10 flex flex-col items-center max-w-lg text-center space-y-10">
          {/* Beautiful SVG Illustration depicting collaboration / monitoring dashboard */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="w-full aspect-square rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-xl overflow-hidden flex flex-col items-center justify-center p-8 transition-transform hover:scale-[1.02] duration-500"
          >
            <img
              alt="Jalinan Anak Sehat Illustration"
              className="w-full h-full object-contain drop-shadow-lg"
              src={RegisterIllustration}
            />
          </motion.div>

          {/* Motivational Quote */}
          <blockquote className="space-y-4">
            <p className="text-[32px] leading-tight font-display font-bold text-white">
              Pantau Tumbuh Kembang Bersama
            </p>
            <footer className="text-white text-sm font-light leading-relaxed max-w-md mx-auto opacity-90">
              Bergabunglah dengan ribuan orang tua, sekolah, dan puskesmas dalam
              menjaga gizi anak Indonesia untuk masa depan yang lebih baik.
            </footer>
          </blockquote>
        </div>
      </div>
    </div>
  );
}
