import { Button } from "@/components/ui/button";

export function CtaDark() {
  return (
    <section className="mx-auto max-w-[1640px] px-4 pb-16 sm:px-6 lg:px-7">
      <div className="rounded-[28px] bg-neutral-900 px-8 py-16 text-center sm:px-10">
        <h2 className="font-sans text-3xl font-semibold leading-[1.1] tracking-tight text-white sm:text-4xl lg:text-[46px]">
          Lorem ipsum dolor{" "}
          <em className="not-italic text-brand-300">sit amet</em>
        </h2>
        <p className="mx-auto mt-4 max-w-[50ch] text-[16.5px] leading-[1.55] text-white/75">
          Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3.5">
          <Button href="/signup" variant="primary" size="lg">
            Lorem ipsum dolor
          </Button>
          <Button href="/signup/pro" variant="outline-light" size="lg">
            Lorem ipsum
          </Button>
        </div>
      </div>
    </section>
  );
}
