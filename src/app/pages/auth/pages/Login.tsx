import { supabase } from "../../../../lib/supabase";
import { useState } from "react";
import { useToast } from "../../../../hooks/use-toast";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const navigate = useNavigate();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      const error = "Usuário(a) ou senha invalido";
      toast({
        variant: "destructive",
        title: "Acesso negado!",
        description: error,
      });
      return;
    }

    if (data.user) {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("access_code, role")
        .eq("id", data.user.id)
        .single();

      if (profileError) {
        console.log(profileError);
        return;
      }

      console.log(profile.access_code);
      console.log(profile.role);
    }

    navigate("/home");
  }

  return (
    <div className="w-full min-h-[100dvh] flex items-center justify-center px-4 py-8">
      <form
        onSubmit={handleLogin}
        className="w-full py-6 px-5 sm:px-8 md:px-10 max-w-lg mx-auto rounded-2xl shadow-md bg-card"
      >
        <div className="mb-6 sm:mb-8">
          <h1 className="text-geo text-xl sm:text-2xl md:text-3xl font-bold">
            Entre agora
          </h1>
        </div>

        <div className="space-y-5 sm:space-y-6">
          <div className="relative flex items-center">
            <input
              name="email"
              type="email"
              required
              className="text-slate-900 bg-white border border-slate-300 w-full text-sm sm:text-base pl-4 pr-8 py-2.5 sm:py-3 rounded-md outline-blue-500"
              placeholder="e-mail"
              onChange={(e) => setEmail(e.target.value)}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="#bbb"
              stroke="#bbb"
              className="w-4 h-4 absolute right-4"
              viewBox="0 0 682.667 682.667"
            >
              <defs>
                <clipPath id="a" clipPathUnits="userSpaceOnUse">
                  <path d="M0 512h512V0H0Z" clipPath="#000000"></path>
                </clipPath>
              </defs>
              <g clipPath="url(#a)" transform="matrix(1.33 0 0 -1.33 0 682.667)">
                <path
                  fill="none"
                  strokeMiterlimit="10"
                  strokeWidth="40"
                  d="M452 444H60c-22.091 0-40-17.909-40-40v-39.446l212.127-157.782c14.17-10.54 33.576-10.54 47.746 0L492 364.554V404c0 22.091-17.909 40-40 40Z"
                  data-original="#000000"
                ></path>
                <path
                  d="M472 274.9V107.999c0-11.027-8.972-20-20-20H60c-11.028 0-20 8.973-20 20V274.9L0 304.652V107.999c0-33.084 26.916-60 60-60h392c33.084 0 60 26.916 60 60v196.653Z"
                  data-original="#000000"
                ></path>
              </g>
            </svg>
          </div>

          <div className="relative flex items-center">
            <input
              name="password"
              type="password"
              required
              className="text-slate-900 bg-white border border-slate-300 w-full text-sm sm:text-base pl-4 pr-8 py-2.5 sm:py-3 rounded-md outline-blue-500"
              placeholder="senha"
              onChange={(e) => setPassword(e.target.value)}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="#bbb"
              stroke="#bbb"
              className="w-4 h-4 absolute right-4 cursor-pointer"
              viewBox="0 0 128 128"
            >
              <path
                d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z"
                data-original="#000000"
              ></path>
            </svg>
          </div>
        </div>

        <div className="mt-7 sm:mt-8">
          <button
            type="submit"
            className="w-full py-2.5 sm:py-3 px-4 tracking-wider text-sm sm:text-base rounded-md text-geo-foreground bg-geo hover:bg-geo/90 focus:outline-none cursor-pointer"
          >
            Entrar
          </button>
        </div>
        <p className="text-slate-600 text-sm sm:text-base mt-4 text-center">
          <a href="/forgot" className="text-blue-600 font-medium hover:underline">
            Esqueci minha senha
          </a>
        </p>
        <p className="text-slate-600 text-sm sm:text-base mt-6 text-center">
          Não tem uma conta?{" "}
          <a href="/register" className="text-blue-600 font-medium hover:underline ml-1">
            Criar cadastro
          </a>
        </p>
      </form>
    </div>
  );
}
