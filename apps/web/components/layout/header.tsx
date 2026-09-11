import { LogoWordmark } from "@/components/layout/logo-wordmark";
import { HeaderMobileMenu } from "@/components/layout/header-mobile-menu";
import { NavLinks } from "@/components/layout/nav-links";
import { Button } from "@/components/ui/button";
import { auth0 } from "@/lib/auth0";
import { getNavigationLinks } from "@/lib/prismic/navigation";

export async function Header() {
  const [links, session] = await Promise.all([
    getNavigationLinks(),
    auth0.getSession(),
  ]);

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-zinc-50/85 backdrop-blur-md">
      <div className="relative mx-auto flex h-16 max-w-[1640px] items-center gap-6 px-4 sm:px-6 lg:px-7">
        <LogoWordmark />

        <div className="ml-2 hidden md:block">
          <NavLinks items={links} variant="horizontal" />
        </div>

        <div className="ml-auto flex items-center gap-2.5">
          {session ? (
            <Button href="/signout" external variant="outline-dark">
              Cerrar sesión
            </Button>
          ) : (
            <>
              <Button
                href="/login"
                variant="outline-dark"
                className="hidden sm:inline-flex"
              >
                Login
              </Button>
              <Button href="/signup" external>
                Sign up
              </Button>
            </>
          )}
          <HeaderMobileMenu links={links} />
        </div>
      </div>
    </header>
  );
}
