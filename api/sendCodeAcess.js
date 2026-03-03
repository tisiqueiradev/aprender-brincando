import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { user_id } = req.body;

    const { data, error } = await supabase
      .from("profiles")
      .select("email, access_code")
      .eq("id", user_id)
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    await resend.emails.send({
      from: "Aprender Brincando <noreply@aprender-brincando.com.br>",
      to: data.email,
      subject: "Seu código de acesso",
      html: `
        <h1>Bem-vindo 🎉</h1>
        <p>Seu código de acesso é:</p>
        <h2>${data.access_code}</h2>
      `,
    });

    return res.status(200).json({ success: true });

  } catch {
    return res.status(500).json({ error: "Erro interno" });
  }
}
