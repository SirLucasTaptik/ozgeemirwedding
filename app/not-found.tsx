import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FCFBF8] px-6">
      <div className="max-w-xl text-center">

        <p className="text-xs uppercase tracking-[8px] text-[#B89B5E]">
          404
        </p>

        <h1 className="mt-6 font-serif text-6xl md:text-8xl font-light">
          Oops
        </h1>

        <p className="mt-8 text-lg leading-8 text-neutral-600">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="mt-14">

          <Link
            href="/"
            className="inline-flex items-center rounded-full bg-[#B89B5E] px-8 py-4 text-white transition hover:bg-[#A68649]"
          >
            Back to Invitation
          </Link>

        </div>

      </div>
    </main>
  );
}
