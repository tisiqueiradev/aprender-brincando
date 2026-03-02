import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../../lib/supabase";
import { useToast } from "../../../../hooks/use-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  async function handleFakeEmailSend(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    setTimeout(() => {
      setEmailSent(true);
      setLoading(false);
      toast({
        title: "E-mail enviado!",
        description: "Simulamos o envio do link de recuperação para seu e-mail.",
      });
    }, 800);
  }

  async function handlePasswordReset(e: React.FormEvent) {
    e.preventDefault();

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Não foi possível atualizar a senha",
        description: error.message,
      });
      return;
    }

    toast({
      title: "Senha atualizada com sucesso!",
      description: "Faça login novamente com sua nova senha.",
    });

    navigate("/login");
  }

  return (
    <div className="max-w-4xl flex items-center mx-auto min-h-[100dvh] p-4">
      <div className="grid md:grid-cols-3 items-center [box-shadow:0_2px_10px_-3px_rgba(14,14,14,0.3)] rounded-xl overflow-hidden bg-card">
        <div className="max-md:order-1 flex flex-col justify-center md:space-y-16 space-y-8 max-md:mt-8 min-h-full bg-gradient-to-l from-math to-math lg:px-8 px-4 py-4">
          <div>
            <h3 className="text-geo text-base sm:text-lg">Recupere sua conta</h3>
            <p className="text-primary-foreground text-sm sm:text-base mt-3 leading-relaxed">
              {emailSent
                ? "Crie sua nova senha para voltar a acessar a plataforma."
                : "Informe seu e-mail para simularmos o envio do link de recuperação."}
            </p>
          </div>
          <div>
            <h3 className="text-geo text-base sm:text-lg">Processo rápido e seguro</h3>
            <p className="text-primary-foreground text-sm sm:text-base mt-3 leading-relaxed">
              Mantemos o mesmo padrão das telas de autenticação para facilitar sua experiência.
            </p>
          </div>
        </div>

        {!emailSent ? (
          <form onSubmit={handleFakeEmailSend} className="md:col-span-2 w-full py-6 px-5 sm:px-10 max-w-lg mx-auto">
            <div className="mb-8">
              <h1 className="text-geo text-xl sm:text-2xl md:text-3xl font-bold">Recuperar senha</h1>
            </div>

            <div className="space-y-6">
              <div className="relative flex items-center">
                <input
                  name="email"
                  type="email"
                  required
                  className="text-slate-900 bg-white border border-slate-300 w-full text-sm sm:text-base pl-4 pr-8 py-2.5 sm:py-3 rounded-md outline-blue-500"
                  placeholder="e-mail"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
                <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" className="w-4 h-4 absolute right-4" viewBox="0 0 682.667 682.667">
                  <defs>
                    <clipPath id="a" clipPathUnits="userSpaceOnUse">
                      <path d="M0 512h512V0H0Z" clipPath="#000000"></path>
                    </clipPath>
                  </defs>
                  <g clipPath="url(#a)" transform="matrix(1.33 0 0 -1.33 0 682.667)">
                    <path fill="none" strokeMiterlimit="10" strokeWidth="40" d="M452 444H60c-22.091 0-40-17.909-40-40v-39.446l212.127-157.782c14.17-10.54 33.576-10.54 47.746 0L492 364.554V404c0 22.091-17.909 40-40 40Z" data-original="#000000"></path>
                    <path d="M472 274.9V107.999c0-11.027-8.972-20-20-20H60c-11.028 0-20 8.973-20 20V274.9L0 304.652V107.999c0-33.084 26.916-60 60-60h392c33.084 0 60 26.916 60 60v196.653Z" data-original="#000000"></path>
                  </g>
                </svg>
              </div>
            </div>

            <div className="mt-8">
              <button type="submit" disabled={loading} className="w-full py-2.5 sm:py-3 px-4 tracking-wider text-sm sm:text-base rounded-md text-geo-foreground bg-geo hover:bg-geo/90 focus:outline-none cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed">
                {loading ? "Enviando..." : "Enviar e-mail de recuperação"}
              </button>
            </div>
            <p className="text-slate-600 text-sm sm:text-base mt-6 text-center">
              Lembrou sua senha?
              <a href="/login" className="text-blue-600 font-medium hover:underline ml-1">Acessar conta</a>
            </p>
          </form>
        ) : (
          <form onSubmit={handlePasswordReset} className="md:col-span-2 w-full py-6 px-5 sm:px-10 max-w-lg mx-auto">
            <div className="mb-8">
              <h1 className="text-geo text-xl sm:text-2xl md:text-3xl font-bold">Defina sua nova senha</h1>
              <p className="text-slate-600 text-sm sm:text-base mt-2">E-mail: {email}</p>
            </div>

            <div className="space-y-6">
              <div className="relative flex items-center">
                <input
                  name="new-password"
                  type="password"
                  required
                  minLength={6}
                  className="text-slate-900 bg-white border border-slate-300 w-full text-sm sm:text-base pl-4 pr-8 py-2.5 sm:py-3 rounded-md outline-blue-500"
                  placeholder="nova senha"
                  onChange={(e) => setNewPassword(e.target.value)}
                  value={newPassword}
                />
                <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" className="w-4 h-4 absolute right-4 cursor-pointer" viewBox="0 0 128 128">
                  <path d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z" data-original="#000000"></path>
                </svg>
              </div>
            </div>

            <div className="mt-8">
              <button type="submit" className="w-full py-2.5 sm:py-3 px-4 tracking-wider text-sm sm:text-base rounded-md text-geo-foreground bg-geo hover:bg-geo/90 focus:outline-none cursor-pointer">
                Salvar nova senha
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
