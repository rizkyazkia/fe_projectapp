import React from "react";
import { Fingerprint, AtSign, Lock, Eye, EyeOff } from "lucide-react";
import InputForm from "../../components/auth/InputForm";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import { useAuth } from "../../hooks/auth/useAuth";

const SignUp = () => {
  const [handlePassword, setHandlePassword] = React.useState(false);

  const { register } = useAuth();

  const { values, handleChange, handleBlur, handleSubmit } = useFormik({
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

  console.log(values);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
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
        <Fingerprint
          size={16}
          className="absolute top-1/2 -translate-y-1/2 left-4"
        />
      </InputForm>
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
      <Link to={"/auth/login"} className="flex items-center justify-end">
        <span className="text-xs text-blue-900 group">
          Sudah punya akun?{" "}
          <p className="inline group-hover:underline">Masuk</p>
        </span>
      </Link>
      <button
        type="submit"
        className="py-3 px-4 inline-flex items-center justify-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-900 text-white hover:drop-shadow-2xl focus:outline-hidden focus:bg-blue-900 disabled:opacity-50 disabled:pointer-events-none"
      >
        Daftar
      </button>
    </form>
  );
};

export default SignUp;
