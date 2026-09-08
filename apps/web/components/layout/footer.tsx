import Link from "next/link";
import { LogoWordmark } from "@/components/layout/logo-wordmark";
import { NewsletterForm } from "@/components/layout/newsletter-form";
import { FacebookIcon } from "@/components/ui/icons/facebook";
import { InstagramIcon } from "@/components/ui/icons/instagram";
import { PinterestIcon } from "@/components/ui/icons/pinterest";

const COLUMNS = [
  {
    title: "Lorem",
    links: [
      { href: "/productos", label: "Ipsum" },
      { href: "/fabricantes", label: "Dolor" },
      { href: "/discover/photos", label: "Sit" },
      { href: "/profesionales", label: "Amet" },
      { href: "/magazine", label: "Consectetur" },
    ],
  },
  {
    title: "Adipiscing",
    links: [
      { href: "/signup/pro", label: "Sed do eiusmod tempor" },
      { href: "/signup", label: "Incididunt ut labore" },
      { href: "/insignia", label: "Et dolore magna aliqua" },
      { href: "/login", label: "Commodo consequat" },
      { href: "/contact", label: "Dolore" },
    ],
  },
  {
    title: "Laborum",
    links: [
      { href: "/legal/terms-pro", label: "Enim ad minim veniam" },
      { href: "/legal/privacy", label: "Ullamco laboris nisi" },
      { href: "/legal/terms", label: "Duis aute irure" },
    ],
  },
] as const;

const SOCIALS = [
  { href: "https://www.instagram.com/", label: "Instagram", Icon: InstagramIcon },
  { href: "https://www.facebook.com/", label: "Facebook", Icon: FacebookIcon },
  { href: "https://www.pinterest.com/", label: "Pinterest", Icon: PinterestIcon },
] as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer aria-labelledby="footer-heading" className="mt-20">
      <h2 id="footer-heading" className="sr-only">
        Pie de página
      </h2>

      <NewsletterForm />

      <div className="bg-zinc-50">
        <div className="mx-auto grid max-w-[1640px] gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.2fr_2fr] lg:px-7">
          <div>
            <LogoWordmark />
            <p className="mt-4 max-w-xs text-[14.5px] leading-relaxed text-zinc-600">
              Lorem. Ipsum dolor. Sit amet consectetur adipiscing elit sed do eiusmod.
            </p>
            <ul className="mt-6 flex gap-3">
              {SOCIALS.map(({ href, label, Icon }) => (
                <li key={label}>
                  <Link
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
                  >
                    <Icon width={20} height={20} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h3 className="text-[12.5px] font-bold uppercase tracking-[0.12em] text-zinc-500">
                  {col.title}
                </h3>
                <ul className="mt-4 flex flex-col gap-3">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-[14.5px] text-zinc-700 transition-colors hover:text-rose-500"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-zinc-200">
          <div className="mx-auto flex max-w-[1640px] flex-col gap-2 px-4 py-6 text-[13px] text-zinc-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-7">
            <span>© {year} · Lorem ipsum dolor</span>
            <span>Lorem ipsum dolor sit amet consectetur adipiscing</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
