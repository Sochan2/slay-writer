import Link from "next/link";
import { Navbar } from "@/components/Navbar";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="mx-auto max-w-2xl px-6 py-16 lg:py-24">
        <h1 className="text-3xl font-bold tracking-tight text-white">Privacy</h1>
        <p className="mt-2 text-sm text-zinc-500">Last updated: March 5, 2026</p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-zinc-300">

          <section>
            <h2 className="mb-2 text-base font-semibold text-white">1. Information We Collect</h2>
            <ul>
              <li>Email address (via Google login)</li>
                <li>Content you enter to generate posts</li>
                  <li>Usage data(number of generation)</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-white">How we use your information</h2>
             <ul>
              <li>To privide the SLAY Writer service</li>
                <li>To manage your subscription</li>
                <li>To improve product</li>
            </ul>    
          </section>


          <section>
            <h2 className="mb-2 text-base font-semibold text-white">3. Data Storage</h2>
            <ul className="ml-4 mt-1 list-disc space-y-1 text-zinc-400">
              <li>Account data is stored in Supabase</li>
              <li>Payment data is handled by Stripe</li>
              <li>We do not store your credit card info</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-white">4. Third-Party Services</h2>
            <ul className="ml-4 mt-1 list-disc space-y-1 text-zinc-400">
              <li>Supabase (authentication & database)</li>
              <li>Stripe (payment processing)</li>
              <li>Anthropic Claude AI (post generation)</li>
              <li>Vercel(Hosting)</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-white">5. Data Sharing</h2>
            <ul className="ml-4 mt-1 list-disc space-y-1 text-zinc-400">
              <li>Do not sell your pesonal data</li>
              <li>We only share data with the third-party service listed above, as necessary to provide the service</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-white">6. Cookies</h2>
            <ul className="ml-4 mt-1 list-disc space-y-1 text-zinc-400">
              <li>We use cookies for authentication only.</li>
              <li>We do not use cookies for advertising</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-white">7. Your Rights</h2>
            <p className="mb-2">You can:</p>
            <ul className="ml-4 list-disc space-y-1 text-zinc-400">
              <li>Request deletion of your account</li>
              <li>Export your data</li>
              <li>Cancel your subscription anytime</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-white">8. Change to Privacy Policy</h2>
            <p>We may update this policy at any time. We will notify you of significant changes via email.</p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-white">9. Contact</h2>
            <p>If you have any question about privacy,</p>
            <p> Email us at: <span className="text-amber-400">sochan567890@gmail.com</span></p>

          </section>

        </div>

        <div className="mt-12 border-t border-zinc-800 pt-8">
          <Link href="/" className="text-sm text-zinc-500 hover:text-white transition-colors">
            ← Back to home
          </Link>
        </div>
      </main>

      </div>
  );
}