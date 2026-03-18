import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PageTransition from "../components/PageTransition";
import { useLanguage } from "../context/LanguageContext";

const heroPhotos = [
  {
    title: "Harvest coordination",
    subtitle: "Field teams tracking quality at source",
    image:
      "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Direct farmer trade",
    subtitle: "Fresh produce moving without middlemen",
    image:
      "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function Home() {
  const { user } = useAuth();
  const { t } = useLanguage();

  return (
    <PageTransition className="relative overflow-hidden py-8 md:py-10">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-[-10%] top-16 h-72 w-72 rounded-full bg-emerald-200/30 blur-3xl" />
        <div className="absolute bottom-0 right-[-5%] h-80 w-80 rounded-full bg-lime-200/25 blur-3xl" />
      </div>

      <div className="page-shell relative">
        <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-6">
            <div className="eyebrow">
              {t("trustedSourcing")}
            </div>

            <div className="space-y-4">
              <h1
                className="max-w-3xl font-extrabold tracking-tight text-slate-950"
                style={{ fontSize: "var(--text-4xl)", lineHeight: 0.98 }}
              >
                {t("homeHeroTitle")}
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600">
                {t("homeHeroText")}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {!user && (
                <>
                  <Link to="/register" className="btn-primary">
                    {t("connectNow")}
                  </Link>
                  <Link to="/login" className="btn-outline">
                    {t("login")}
                  </Link>
                </>
              )}
              {user?.role === "FARMER" && (
                <Link to="/farmer" className="btn-primary">
                  {t("postCrop")}
                </Link>
              )}
              {user?.role === "CUSTOMER" && (
                <Link to="/customer" className="btn-primary">
                  {t("browseMarketplace")}
                </Link>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                ["Trusted Farmers", "400+"],
                ["Average Freshness", "98%"],
                ["Monthly Orders", "12k"],
              ].map(([label, value], index) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 * index, duration: 0.35 }}
                  className="card-soft p-5"
                >
                  <p className="text-sm uppercase tracking-[0.16em] text-slate-500">
                    {label}
                  </p>
                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {value}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="grid gap-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="hero-photo min-h-[430px] border border-white/55 shadow-2xl"
              style={{ backgroundImage: `url(${heroPhotos[0].image})` }}
            >
              <div className="relative z-10 flex h-full flex-col justify-between p-6 text-white">
                <div className="badge w-fit bg-white/12 text-white">
                  Fresh Harvest Network
                </div>
                <div className="max-w-sm space-y-2">
                  <p className="text-2xl font-semibold">{heroPhotos[0].title}</p>
                  <p className="text-sm leading-6 text-white/84">
                    {heroPhotos[0].subtitle}
                  </p>
                </div>
              </div>
            </motion.div>

            <div className="grid gap-5 md:grid-cols-[0.9fr_1.1fr]">
              <div className="card-soft p-5">
                <p className="text-sm uppercase tracking-[0.16em] text-emerald-800">
                  What changes here
                </p>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                  <li>Verified farm listings create a more professional first impression.</li>
                  <li>Fast filters and direct checkout reduce drop-off for buyers.</li>
                  <li>Role-based actions keep farmers and customers focused on the next step.</li>
                </ul>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.14, duration: 0.4 }}
                className="hero-photo min-h-[240px] border border-white/55"
                style={{ backgroundImage: `url(${heroPhotos[1].image})` }}
              >
                <div className="relative z-10 flex h-full items-end p-5 text-white">
                  <div>
                    <p className="text-xl font-semibold">{heroPhotos[1].title}</p>
                    <p className="mt-1 max-w-sm text-sm text-white/82">
                      {heroPhotos[1].subtitle}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="mt-12 grid gap-5 md:grid-cols-3">
          {[
            [
              "Transparent pricing",
              "Farmers set the rate and buyers understand value clearly before purchase.",
            ],
            [
              "Verified reviews",
              "Feedback is tied to real orders so trust is built with every transaction.",
            ],
            [
              "Reliable checkout",
              "Modern payments and clear delivery details make ordering feel polished.",
            ],
          ].map(([title, copy], index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * index, duration: 0.35 }}
              className="card p-6"
            >
              <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{copy}</p>
            </motion.div>
          ))}
        </section>
      </div>
    </PageTransition>
  );
}
