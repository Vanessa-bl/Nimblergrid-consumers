import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { auth0 } from "@/lib/auth0";

export async function LoginScreen() {
  const session = await auth0.getSession();
  if (session) redirect("/");

  return (
    <section className="mx-auto flex min-h-[60vh] max-w-[1640px] items-center justify-center px-4 py-16 sm:px-6 lg:px-7">
      <div className="w-full max-w-[560px] rounded-[28px] border border-neutral-200 bg-white px-6 py-12 text-center shadow-card sm:px-12">
        <Eyebrow>Cuenta</Eyebrow>
        <h1 className="mt-3 font-sans text-3xl font-semibold leading-[1.1] tracking-tight text-neutral-900 sm:text-4xl">
          Inicia sesión en tu cuenta
        </h1>
        <p className="mx-auto mt-3.5 max-w-[44ch] text-[16px] leading-[1.55] text-neutral-600">
          Accede para guardar tus favoritos, seguir tus proyectos y gestionar tus
          publicaciones.
        </p>
        <Button href="/auth/login?returnTo=/test-profile" external size="lg" className="mt-8">
          Iniciar sesión
        </Button>
        <p className="mt-6 text-[14.5px] text-neutral-600">
          ¿Todavía no tienes cuenta?{" "}
          <Link
            href="/signup"
            className="font-semibold text-brand-500 transition-colors hover:text-brand-600"
          >
            Crear cuenta
          </Link>
        </p>
      </div>
    </section>
  );
}
