import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar, FileText, UserCircle, CreditCard } from "lucide-react";

export default async function ClientDashboard({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;
    const menu = [
        { title: 'Nová rezervácia', desc: 'AI vyhľadávanie trénera', link: `/${lang}/client-zone/booking`, icon: Calendar, color: 'text-blue-600' },
        { title: 'Moje formuláre', desc: 'GDPR a diagnostika', link: `/${lang}/client-zone/forms`, icon: FileText, color: 'text-amber-600' },
        { title: 'Profil klienta', desc: 'Osobné nastavenia', link: `/${lang}/client-zone/profile`, icon: UserCircle, color: 'text-purple-600' },
        { title: 'Kredity a platby', desc: 'Stav účtu u GoPay', link: `/${lang}/client-zone/payments`, icon: CreditCard, color: 'text-green-600' },
    ];

    return (
        <div className="container mx-auto p-8 space-y-12">
            <header className="text-center">
                <h1 className="text-4xl font-extrabold text-[#00287D] font-asap uppercase tracking-tighter">Vitajte v SportWell</h1>
                <p className="text-gray-500 mt-2 text-lg">Váš priestor pre zdravie a pohyb.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {menu.map((item: any) => (
                    <Link key={item.title} href={item.link} className="no-underline group">
                        <Card className="h-full hover:-translate-y-2 transition-transform cursor-pointer border-none shadow-xl bg-white rounded-3xl overflow-hidden group-hover:ring-4 group-hover:ring-primary/10">
                            <CardHeader className="text-center space-y-4 py-10">
                                <div className={`mx-auto p-4 rounded-2xl bg-gray-50 ${item.color} group-hover:scale-110 transition-transform`}>
                                    <item.icon className="h-10 w-10" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl font-bold">{item.title}</CardTitle>
                                    <CardDescription className="mt-2">{item.desc}</CardDescription>
                                </div>
                            </CardHeader>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
