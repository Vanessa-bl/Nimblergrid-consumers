import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { auth0 } from "@/lib/auth0";

export const dynamic = "force-dynamic";

export default async function SignupPage() {
  const session = await auth0.getSession();
  if (session) redirect("/");

  return (
    <section className="mx-auto flex min-h-[60vh] max-w-[1640px] items-center justify-center px-4 py-16 sm:px-6 lg:px-7">
      <div className="w-full max-w-[560px] rounded-[28px] border border-zinc-200 bg-white px-6 py-12 text-center shadow-[0_10px_30px_-12px_rgba(15,23,42,0.25)] sm:px-12">
        <Eyebrow>Cuenta</Eyebrow>
        <h1 className="mt-3 font-sans text-3xl font-semibold leading-[1.1] tracking-tight text-zinc-900 sm:text-4xl">
          Crea tu cuenta
        </h1>
        <p className="mx-auto mt-3.5 max-w-[44ch] text-[16px] leading-[1.55] text-zinc-600">
          Únete para guardar inspiración, contactar a profesionales y publicar tus
          propios proyectos.
        </p>
        <Button
          href="/auth/login?screen_hint=signup&returnTo=/test-profile"
          external
          size="lg"
          className="mt-8"
        >
          Crear cuenta
        </Button>
        <p className="mt-6 text-[14.5px] text-zinc-600">
          ¿Ya tienes una cuenta?{" "}
          <Link
            href="/login"
            className="font-semibold text-rose-500 transition-colors hover:text-rose-600"
          >
            Iniciar sesión
          </Link>
        </p>
      </div>
    </section>
  );
}
