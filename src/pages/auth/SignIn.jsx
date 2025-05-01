import React from "react";
import { AtSign, Lock, Eye, EyeOff } from "lucide-react";
import InputForm from "../../components/auth/InputForm";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import { useAuth } from "../../hooks/auth/useAuth";

const SignIn = () => {
  const [handlePassword, setHandlePassword] = React.useState(false);
  const { login } = useAuth();

  const { handleChange, handleBlur, handleSubmit } = useFormik({
    initialValues: {
      identifier: "",
      password: "",
    },
    onSubmit: async (values) => {
      await login(values);
    },
  });

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <InputForm
        htmlFor={"identifier"}
        label={"Email atau Username"}
        type={"text"}
        id={"identifier"}
        name={"identifier"}
        placeholder={"contoh@site.com atau contoh"}
        onChange={handleChange}
        onBlur={handleBlur}
      >
        <AtSign
          size={16}
          className="absolute top-1/2 -translate-y-1/2 left-4"
        />
      </InputForm>
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
        <Lock size={16} className="absolute top-1/2 -translate-y-1/2 left-4" />
        {handlePassword ? (
          <Eye
            size={16}
            className="absolute top-1/2 -translate-y-1/2 right-4 cursor-pointer"
            onClick={() => setHandlePassword(!handlePassword)}
          />
        ) : (
          <EyeOff
            size={16}
            className="absolute top-1/2 -translate-y-1/2 right-4 cursor-pointer"
            onClick={() => setHandlePassword(!handlePassword)}
          />
        )}
      </InputForm>
      <Link to={"/auth/register"} className="flex items-center justify-end">
        <span className="text-xs text-blue-900 group">
          Belum punya akun?{" "}
          <p className="inline group-hover:underline">Daftar</p>
        </span>
      </Link>
      <button
        type="submit"
        className="py-3 px-4 inline-flex items-center justify-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-900 text-white hover:drop-shadow-2xl transition-all duration-300 focus:outline-hidden focus:bg-blue-900 disabled:opacity-50 disabled:pointer-events-none"
      >
        Masuk
      </button>
    </form>
  );
};

export default SignIn;
