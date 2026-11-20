
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="overflow-hidden bg-[#fffdf9]">
      <div className="mx-auto grid min-h-[620px] max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:px-10 lg:py-20">
        {/* Content */}
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#eadfd3] bg-[#f8f2e9] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#927044]">
            <span className="h-2 w-2 rounded-full bg-[#b58b57]" />
            Your beauty, our passion
          </span>

          <h1 className="mt-7 text-5xl font-semibold leading-[1.12] tracking-tight text-[#29251f] sm:text-6xl lg:text-[68px]">
            Feel Beautiful.
            <br />
            <span className="font-serif italic text-[#b58b57]">
              Be Confident.
            </span>
          </h1>

          <p className="mt-7 max-w-md text-base leading-8 text-[#777067]">
            Discover exceptional salon experiences. Book your favorite
            beauty services with trusted professionals, anytime, anywhere.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="/services"
              className="rounded-full bg-[#29251f] px-8 py-4 text-sm font-semibold text-white transition hover:bg-[#b58b57]"
            >
              Explore Services →
            </Link>

            <Link
              href="/sign-up"
              className="rounded-full border border-[#d9cbb9] px-8 py-4 text-sm font-semibold text-[#29251f] transition hover:bg-[#f5eee5]"
            >
              Join Us
            </Link>
          </div>

          <div className="mt-12 flex items-center gap-8 border-t border-[#eee9e2] pt-7">
            <div>
              <p className="text-2xl font-bold text-[#29251f]">20+</p>
              <p className="mt-1 text-xs text-[#8b8176]">Beauty Services</p>
            </div>
            <div className="h-10 w-px bg-[#e8dfd4]" />
            <div>
              <p className="text-2xl font-bold text-[#29251f]">Expert</p>
              <p className="mt-1 text-xs text-[#8b8176]">Professionals</p>
            </div>
            <div className="h-10 w-px bg-[#e8dfd4]" />
            <div>
              <p className="text-2xl font-bold text-[#29251f]">Easy</p>
              <p className="mt-1 text-xs text-[#8b8176]">Online Booking</p>
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="relative mx-auto w-full max-w-[540px]">
          <div
            className="h-[440px] rounded-t-[180px] rounded-b-[32px] bg-cover bg-center shadow-xl sm:h-[540px]"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1100&q=85')",
            }}
          />

          <div className="absolute -bottom-5 left-3 rounded-2xl border border-[#eee9e2] bg-white p-4 shadow-lg sm:-left-7 sm:p-5">
            <p className="text-sm font-semibold text-[#29251f]">
              Your moment of beauty
            </p>
            <p className="mt-1 text-xs text-[#8b8176]">
              Relax. Refresh. Rejuvenate.
            </p>
          </div>

          <div className="absolute right-3 top-8 rounded-2xl bg-white/95 px-4 py-3 shadow-lg backdrop-blur sm:-right-5">
            <p className="text-sm font-bold text-[#29251f]">★★★★★</p>
            <p className="mt-1 text-xs text-[#8b8176]">
              Beauty starts here
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
