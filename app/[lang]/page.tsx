import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Activity, Heart, ShieldCheck } from "lucide-react";
import { getDictionary, hasLocale } from "./dictionaries";
import { notFound } from "next/navigation";

export default async function LandingPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-white">
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-400 rounded-full blur-[100px]" />
        </div>

        <div className="container mx-auto px-4 z-10 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 text-primary text-sm font-bold uppercase tracking-widest animate-in fade-in zoom-in duration-700">
            <Activity className="h-4 w-4" />
            {dict.landing.badge}
          </div>

          <h1 className="text-6xl md:text-8xl font-extrabold text-[#00287D] font-asap tracking-tighter uppercase leading-[0.9] max-w-4xl mx-auto">
            {dict.landing.title.split(' ')[0]} {dict.landing.title.split(' ')[1]} {dict.landing.title.split(' ')[2]} <br /> <span className="text-blue-500">{dict.landing.title.split(' ').slice(3).join(' ')}</span>
          </h1>

          <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            {dict.landing.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href={`/${lang}/client-zone/booking`}>
              <Button size="lg" className="bg-primary text-white text-lg px-8 py-8 rounded-2xl shadow-2xl hover:scale-105 transition-transform">
                {dict.landing.ctaBooking} <ArrowRight className="ml-2" />
              </Button>
            </Link>
            <Link href={`/${lang}/sluzby`}>
              <Button variant="outline" size="lg" className="text-lg px-8 py-8 rounded-2xl border-2">
                {dict.landing.ctaServices}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: ShieldCheck, title: dict.features.diagnostic.title, desc: dict.features.diagnostic.desc },
              { icon: Activity, title: dict.features.plan.title, desc: dict.features.plan.desc },
              { icon: Heart, title: dict.features.prevention.title, desc: dict.features.prevention.desc },
            ].map((f, i) => (
              <div key={i} className="flex flex-col items-center text-center space-y-4 p-8 bg-white rounded-3xl shadow-sm hover:shadow-xl transition-shadow">
                <div className="p-4 bg-primary/5 rounded-2xl text-primary">
                  <f.icon className="h-10 w-10" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{f.title}</h3>
                <p className="text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-[#00287D] text-white">
        <div className="container mx-auto px-4 text-center">
          <p className="font-asap font-bold uppercase tracking-widest opacity-50 mb-4">SportWell Physiotherapy</p>
          <p>{dict.footer.rights}</p>
        </div>
      </footer>
    </div>
  );
}
