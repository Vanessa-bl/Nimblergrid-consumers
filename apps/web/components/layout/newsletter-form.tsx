export function NewsletterForm() {
  return (
    <div className="bg-rose-50">
      <div className="mx-auto flex max-w-[1640px] flex-col items-start gap-6 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:px-7">
        <div className="max-w-md">
          <h3 className="font-sans text-[22px] font-semibold leading-tight text-zinc-900">
            Lorem ipsum dolor!
          </h3>
          <p className="mt-2 text-[14.5px] leading-relaxed text-zinc-600">
            Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut.
          </p>
        </div>

        {/* TODO: wire up to newsletter service (Prismic + backend/Resend/Mailchimp) */}
        <form action="#" method="post" className="flex w-full max-w-lg gap-3">
          <label htmlFor="newsletter-email" className="sr-only">
            Correo electrónico
          </label>
          <input
            id="newsletter-email"
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="Lorem ipsum dolor sit amet consectetur"
            className="min-w-0 flex-1 rounded-full border border-zinc-200 bg-white px-5 py-3 text-[14.5px] text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-rose-400"
          />
          <button
            type="submit"
            className="rounded-full bg-rose-500 px-6 py-3 text-[14.5px] font-semibold text-white transition-all hover:brightness-95 hover:-translate-y-px"
          >
            Lorem
          </button>
        </form>
      </div>
    </div>
  );
}
