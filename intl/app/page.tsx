"use client"

import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  BatteryCharging,
  BarChart3,
  CheckCircle2,
  Globe2,
  Handshake,
  Leaf,
  Mail,
  Rocket,
  Sparkles,
  Target,
  Users,
} from "lucide-react"

import { ScrollReveal } from "@/components/scroll-reveal"
import { cn } from "@/lib/utils"

const roadmap = [
  {
    year: "2025",
    title: "Pilot Project",
    description: "Pilot project di Koperasi RAM Harapan, Riau untuk memvalidasi performa lapangan.",
  },
  {
    year: "2026",
    title: "100 Unit Aktif",
    description: "Penjualan 100 unit dengan revenue Rp800 juta dan perbaikan modul self-charging.",
  },
  {
    year: "2027",
    title: "Ekspansi Sumatera–Kalimantan",
    description: "500 unit aktif, BEP tercapai, dan kontrak maintenance korporasi.",
  },
  {
    year: "2028",
    title: "Ekspansi Regional",
    description: "1.000+ unit aktif, revenue Rp4,5 miliar, masuk pasar Malaysia & Thailand.",
  },
]

const marketingColumns = [
  {
    title: "Go-to-Market",
    description: "Direct sales ke koperasi dan petani, pilot project bersama mitra strategis, serta bundling dengan penyedia alat panen.",
    icon: Rocket,
  },
  {
    title: "Customer Acquisition",
    description: "Networking komunitas petani, program referral lokal, dan paket bundling alat + pelatihan.",
    icon: Handshake,
  },
  {
    title: "Branding",
    description: "Posisi sebagai 'alat panen sawit elektrik self-charging' dengan konten digital edukatif dan trust building di expo.",
    icon: Globe2,
  },
]

const financialHighlights = [
  { label: "Harga Jual", value: "Rp3,5 juta/unit" },
  { label: "HPP", value: "Rp2 juta/unit" },
  { label: "Opex Tahunan", value: "Rp1 miliar" },
  { label: "Break Even Point", value: "500 unit" },
  { label: "Proyeksi Profit 2028", value: "Rp1,5 miliar" },
  { label: "Valuasi Pre-money", value: "Rp1 miliar" },
  { label: "IRR", value: "40%" },
  { label: "Payback", value: "4 tahun" },
  { label: "NPV", value: "Rp1,8 miliar" },
]

const fundingAllocation = [
  { label: "R&D", value: 50 },
  { label: "Marketing", value: 30 },
  { label: "Operation", value: 20 },
]

const focusHighlights = [
  "Mengubah energi getaran menjadi listrik untuk self-charging.",
  "Modernisasi panen sawit tanpa emisi bahan bakar.",
  "Efisiensi biaya operasional dan maintenance.",
]

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-950 to-slate-950 text-slate-100">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="pointer-events-none absolute -top-40 -left-32 h-[520px] w-[520px] rounded-full bg-emerald-500/30 blur-3xl" />
        <div className="pointer-events-none absolute bottom-[-180px] right-[-160px] h-[520px] w-[520px] rounded-full bg-yellow-400/20 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,#1A3C32_0%,transparent_60%)]" />
      </div>

      <header className="sticky top-0 z-40 backdrop-blur-lg">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="#hero" className="flex items-center gap-3">
            <Image src="/penovtra-logo.svg" alt="Logo PE-NOVTRA" width={140} height={42} priority />
            <span className="sr-only">PE-NOVTRA</span>
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-medium text-emerald-100/80 md:flex">
            <a href="#vision" className="transition hover:text-white">Visi</a>
            <a href="#business" className="transition hover:text-white">Model Bisnis</a>
            <a href="#marketing" className="transition hover:text-white">Strategi</a>
            <a href="#financial" className="transition hover:text-white">Finansial</a>
            <a href="#milestone" className="transition hover:text-white">Roadmap</a>
            <a href="#contact" className="transition hover:text-white">Kontak</a>
          </nav>
          <div className="flex items-center gap-3">
            <a
              href="#contact"
              className="hidden rounded-full border border-emerald-400/40 px-5 py-2 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-400/20 md:inline-flex"
            >
              Hubungi Kami
            </a>
            <a
              href="#business"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-yellow-400 px-5 py-2 text-sm font-semibold text-emerald-950 shadow-lg shadow-emerald-500/40 transition hover:brightness-110"
            >
              Pelajari Lebih Lanjut
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </header>

      <main id="hero" className="relative">
        <section className="relative overflow-hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-24 md:flex-row md:items-center">
            <ScrollReveal className="flex-1">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200/90">
                <Sparkles className="h-4 w-4 text-yellow-300" />
                PE-NOVTRA V1
              </div>
              <h1 className="mt-6 text-4xl font-bold leading-tight text-white md:text-6xl">
                Inovasi Panen Sawit Elektrik Ramah Lingkungan
              </h1>
              <p className="mt-6 max-w-xl text-lg text-emerald-100/80 md:text-xl">
                PE-NOVTRA mengubah energi mekanik menjadi listrik — panen lebih efisien, hemat biaya, dan tanpa bahan bakar.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <a
                  href="#vision"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-yellow-400 px-6 py-3 text-sm font-semibold text-emerald-950 shadow-lg shadow-emerald-500/30 transition hover:scale-[1.01] hover:brightness-110"
                >
                  Pelajari Lebih Lanjut
                  <ArrowRight className="h-5 w-5" />
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-full border border-emerald-300/60 px-6 py-3 text-sm font-semibold text-emerald-100 transition hover:border-emerald-200 hover:text-white"
                >
                  Hubungi Kami
                  <Mail className="h-5 w-5" />
                </a>
              </div>
              <div className="mt-12 grid gap-4 text-sm md:grid-cols-3">
                {focusHighlights.map((highlight, index) => (
                  <ScrollReveal
                    key={highlight}
                    delay={150 * index}
                    className="flex items-start gap-3 rounded-2xl border border-white/5 bg-white/5 p-4 text-left text-emerald-100/90 shadow-lg shadow-emerald-500/5"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-yellow-300" />
                    <span>{highlight}</span>
                  </ScrollReveal>
                ))}
              </div>
            </ScrollReveal>
            <ScrollReveal className="relative flex flex-1 items-center justify-center" direction="left">
              <div className="relative">
                <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-br from-emerald-400 via-emerald-500 to-yellow-400 opacity-30 blur-3xl" />
                <Image
                  src="/penovtra-device.svg"
                  alt="Render alat panen PE-NOVTRA V1"
                  width={480}
                  height={420}
                  className="drop-shadow-[0_45px_55px_rgba(14,164,90,0.35)]"
                  priority
                />
              </div>
            </ScrollReveal>
          </div>
        </section>

        <section id="vision" className="relative border-t border-white/5 bg-slate-950/50 py-20">
          <div className="mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-[1.1fr_0.9fr] md:items-center">
            <ScrollReveal className="space-y-6">
              <h2 className="text-sm font-semibold uppercase tracking-[0.4em] text-emerald-200/70">Tentang Kami</h2>
              <p className="text-3xl font-bold text-white md:text-4xl">
                Inovasi mekatronika karya anak bangsa untuk modernisasi perkebunan sawit berkelanjutan.
              </p>
              <p className="text-lg text-emerald-100/80">
                PE-NOVTRA memanfaatkan piezoelektrik untuk mengubah energi getaran saat panen menjadi tenaga listrik, menghadirkan alat panen elektrik self-charging yang hemat energi dan mengurangi emisi karbon.
              </p>
              <div className="flex flex-wrap items-center gap-6 rounded-3xl border border-white/5 bg-white/5 p-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-yellow-400 text-emerald-950 shadow-lg shadow-emerald-500/40">
                  <Leaf className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">Visi 2028</h3>
                  <p className="text-emerald-100/80">
                    Menjadi pionir alat panen sawit elektrik self-charging di ASEAN dan motor transisi energi bersih dari perkebunan Indonesia.
                  </p>
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal className="grid gap-4 text-sm" direction="right">
              {[
                {
                  title: "Modern & Berkelanjutan",
                  description: "Desain ergonomis, ringan, dan efisien untuk mengurangi kelelahan operator serta menekan konsumsi bahan bakar.",
                },
                {
                  title: "Self-Charging",
                  description: "Modul piezoelektrik mengisi ulang baterai internal saat proses panen berlangsung.",
                },
                {
                  title: "Konektivitas Data",
                  description: "Sensor kinerja siap diintegrasikan dengan dashboard monitoring untuk analitik produktivitas.",
                },
              ].map((item, index) => (
                <div key={item.title} className="rounded-3xl border border-white/5 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-6">
                  <div className="flex items-center gap-3 text-emerald-200/80">
                    <Sparkles className="h-5 w-5 text-yellow-300" />
                    <span className="text-xs font-semibold uppercase tracking-[0.3em]">Fitur {index + 1}</span>
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-emerald-100/80">{item.description}</p>
                </div>
              ))}
            </ScrollReveal>
          </div>
        </section>

        <section id="business" className="relative border-t border-white/5 py-20">
          <div className="mx-auto max-w-6xl px-6">
            <ScrollReveal className="text-center">
              <h2 className="text-sm font-semibold uppercase tracking-[0.4em] text-emerald-200/70">Model Bisnis</h2>
              <p className="mt-3 text-3xl font-bold text-white md:text-4xl">All-in-One Package PE-NOVTRA V1</p>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-emerald-100/80">
                1 unit alat panen elektrik + garansi 1 tahun + free service 1x, siap untuk petani kecil hingga korporasi.
              </p>
            </ScrollReveal>
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              <ScrollReveal className="rounded-3xl border border-emerald-400/20 bg-white/5 p-8 shadow-lg shadow-emerald-500/10">
                <div className="flex items-center gap-3 text-emerald-200/80">
                  <Users className="h-5 w-5 text-yellow-300" />
                  <span className="text-xs font-semibold uppercase tracking-[0.3em]">Segmen B2C</span>
                </div>
                <h3 className="mt-4 text-2xl font-semibold text-white">Petani kecil & marketplace</h3>
                <p className="mt-3 text-emerald-100/80">
                  Penjualan langsung melalui marketplace (Tokopedia, Shopee), komunitas petani, dan expo pertanian dengan skema cicilan.
                </p>
              </ScrollReveal>
              <ScrollReveal className="rounded-3xl border border-emerald-400/20 bg-white/5 p-8 shadow-lg shadow-emerald-500/10" delay={150}>
                <div className="flex items-center gap-3 text-emerald-200/80">
                  <Handshake className="h-5 w-5 text-yellow-300" />
                  <span className="text-xs font-semibold uppercase tracking-[0.3em]">Segmen B2B</span>
                </div>
                <h3 className="mt-4 text-2xl font-semibold text-white">Koperasi & perusahaan sawit</h3>
                <p className="mt-3 text-emerald-100/80">
                  Kontrak maintenance dengan koperasi, perusahaan sawit, dan BUMN lengkap dengan paket training dan pendampingan operasional.
                </p>
              </ScrollReveal>
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-[1fr_1fr]">
              <ScrollReveal className="rounded-3xl border border-white/5 bg-gradient-to-br from-emerald-500/20 via-emerald-400/10 to-transparent p-8">
                <div className="flex items-center gap-3 text-emerald-200/80">
                  <BarChart3 className="h-5 w-5 text-yellow-300" />
                  <span className="text-xs font-semibold uppercase tracking-[0.3em]">Revenue Streams</span>
                </div>
                <ul className="mt-4 space-y-3 text-emerald-100/90">
                  {[
                    "Penjualan alat",
                    "Spare part & upgrade",
                    "Layanan maintenance",
                    "Training & pendampingan",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <span className="flex h-2 w-2 rounded-full bg-yellow-300" />
                      {item}
                    </li>
                  ))}
                </ul>
              </ScrollReveal>
              <ScrollReveal className="rounded-3xl border border-white/5 bg-white/5 p-8">
                <div className="flex items-center gap-3 text-emerald-200/80">
                  <BatteryCharging className="h-5 w-5 text-yellow-300" />
                  <span className="text-xs font-semibold uppercase tracking-[0.3em]">Differentiator</span>
                </div>
                <p className="mt-4 text-emerald-100/80">
                  Teknologi piezoelektrik terintegrasi yang memastikan baterai selalu terisi selama proses panen berlangsung dan memperpanjang umur operasional alat.
                </p>
                <div className="mt-6 grid gap-3 text-sm text-emerald-100/70 md:grid-cols-2">
                  <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4">
                    <p className="font-semibold text-white">Efisiensi Energi</p>
                    <p>Hemat biaya bahan bakar hingga 60%.</p>
                  </div>
                  <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4">
                    <p className="font-semibold text-white">Produktivitas</p>
                    <p>Output panen meningkat 25% dari alat manual.</p>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        <section id="marketing" className="relative border-t border-white/5 bg-slate-950/60 py-20">
          <div className="mx-auto max-w-6xl px-6">
            <ScrollReveal className="text-center">
              <h2 className="text-sm font-semibold uppercase tracking-[0.4em] text-emerald-200/70">Marketing Strategy</h2>
              <p className="mt-3 text-3xl font-bold text-white md:text-4xl">Strategi masuk pasar yang progresif</p>
              <p className="mx-auto mt-4 max-w-3xl text-lg text-emerald-100/80">
                Memadukan direct engagement dengan digital presence untuk membangun kepercayaan petani dan investor.
              </p>
            </ScrollReveal>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {marketingColumns.map((column, index) => (
                <ScrollReveal key={column.title} delay={index * 120} className="rounded-3xl border border-white/5 bg-white/5 p-8">
                  <column.icon className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-yellow-400 p-3 text-emerald-950" />
                  <h3 className="mt-6 text-2xl font-semibold text-white">{column.title}</h3>
                  <p className="mt-3 text-emerald-100/80">{column.description}</p>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <section id="financial" className="relative border-t border-white/5 py-20">
          <div className="mx-auto max-w-6xl px-6">
            <ScrollReveal className="text-center">
              <h2 className="text-sm font-semibold uppercase tracking-[0.4em] text-emerald-200/70">Finansial & Investasi</h2>
              <p className="mt-3 text-3xl font-bold text-white md:text-4xl">Kesempatan investasi clean-tech yang menjanjikan</p>
              <p className="mx-auto mt-4 max-w-3xl text-lg text-emerald-100/80">
                Struktur biaya yang solid dengan proyeksi profitabilitas tinggi dan utilisasi dana yang fokus pada inovasi.
              </p>
            </ScrollReveal>
            <div className="mt-12 grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
              <ScrollReveal className="rounded-3xl border border-white/5 bg-white/5 p-8">
                <div className="grid gap-6 md:grid-cols-2">
                  {financialHighlights.map((item) => (
                    <div key={item.label} className="rounded-2xl border border-white/10 bg-black/20 p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200/70">{item.label}</p>
                      <p className="mt-3 text-xl font-semibold text-white">{item.value}</p>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
              <ScrollReveal className="flex flex-col gap-6 rounded-3xl border border-emerald-400/30 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent p-8" direction="left">
                <div>
                  <h3 className="text-2xl font-semibold text-white">Pendanaan yang dibutuhkan</h3>
                  <p className="mt-2 text-lg text-emerald-100/80">Rp500 juta</p>
                </div>
                <div className="space-y-4">
                  {fundingAllocation.map((item) => (
                    <div key={item.label}>
                      <div className="flex items-center justify-between text-sm font-semibold text-emerald-100/80">
                        <span>{item.label}</span>
                        <span>{item.value}%</span>
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-white/10">
                        <div
                          className={cn(
                            "h-2 rounded-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-yellow-400",
                            item.value === 20 && "from-yellow-400 via-yellow-400 to-emerald-400"
                          )}
                          style={{ width: `${item.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-6 text-sm text-emerald-100/80">
                  <p className="font-semibold text-white">Highlight Investasi</p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-yellow-300" />IRR 40%
                    </li>
                    <li className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-yellow-300" />Payback 4 tahun
                    </li>
                    <li className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-yellow-300" />NPV Rp1,8 miliar
                    </li>
                  </ul>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        <section id="milestone" className="relative border-t border-white/5 bg-slate-950/50 py-20">
          <div className="mx-auto max-w-6xl px-6">
            <ScrollReveal className="text-center">
              <h2 className="text-sm font-semibold uppercase tracking-[0.4em] text-emerald-200/70">Milestone & Roadmap</h2>
              <p className="mt-3 text-3xl font-bold text-white md:text-4xl">Perjalanan menuju pasar ASEAN</p>
            </ScrollReveal>
            <div className="mt-12 grid gap-8 md:grid-cols-2">
              {roadmap.map((step, index) => (
                <ScrollReveal key={step.year} delay={index * 120} className="relative rounded-3xl border border-white/5 bg-white/5 p-8">
                  <div className="flex items-center justify-between text-emerald-100/80">
                    <span className="text-xs font-semibold uppercase tracking-[0.3em]">{step.year}</span>
                    <Target className="h-5 w-5 text-yellow-300" />
                  </div>
                  <h3 className="mt-4 text-2xl font-semibold text-white">{step.title}</h3>
                  <p className="mt-3 text-emerald-100/80">{step.description}</p>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="relative border-t border-white/5 py-20">
          <div className="mx-auto max-w-5xl px-6">
            <ScrollReveal className="rounded-[32px] border border-emerald-400/30 bg-gradient-to-br from-emerald-500/10 via-emerald-400/5 to-transparent p-10 shadow-[0_30px_120px_-40px_rgba(16,185,129,0.6)]">
              <div className="flex flex-col gap-10 lg:flex-row">
                <div className="lg:w-1/2">
                  <div className="flex items-center gap-3 text-emerald-200/80">
                    <Mail className="h-5 w-5 text-yellow-300" />
                    <span className="text-xs font-semibold uppercase tracking-[0.3em]">Mari Berkolaborasi</span>
                  </div>
                  <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">
                    Mari dukung transisi energi bersih dari perkebunan Indonesia.
                  </h2>
                  <p className="mt-4 text-emerald-100/80">
                    Tertarik menjadi mitra distribusi, investor, atau pilot project? Tinggalkan pesan Anda dan tim kami akan segera menghubungi.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3 text-sm font-semibold text-emerald-950">
                    {[
                      { label: "Gabung Mitra", href: "#contact" },
                      { label: "Investor", href: "#contact" },
                      { label: "Hubungi Kami", href: "mailto:contact@penovtra.id" },
                    ].map((cta) => (
                      <a
                        key={cta.label}
                        href={cta.href}
                        className="rounded-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-yellow-400 px-6 py-2 text-xs uppercase tracking-[0.2em] text-emerald-950 shadow-lg shadow-emerald-500/30 transition hover:brightness-110"
                      >
                        {cta.label}
                      </a>
                    ))}
                  </div>
                </div>
                <div className="rounded-3xl border border-white/5 bg-black/30 p-6 shadow-inner shadow-emerald-500/10 lg:w-1/2">
                  <form className="space-y-5">
                    <div>
                      <label htmlFor="name" className="text-sm font-semibold text-emerald-100/80">
                        Nama
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Nama lengkap"
                        className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-emerald-100/40 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="text-sm font-semibold text-emerald-100/80">
                        Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="nama@perusahaan.com"
                        className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-emerald-100/40 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="message" className="text-sm font-semibold text-emerald-100/80">
                        Pesan
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        placeholder="Ceritakan kebutuhan kolaborasi Anda"
                        className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-emerald-100/40 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-yellow-400 px-6 py-3 text-sm font-semibold text-emerald-950 transition hover:brightness-110"
                    >
                      Kirim Pesan
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  </form>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 bg-black/40">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 text-sm text-emerald-100/50 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Image src="/penovtra-logo.svg" alt="Logo PE-NOVTRA" width={120} height={32} />
            <span>© {new Date().getFullYear()} PE-NOVTRA. All rights reserved.</span>
          </div>
          <div className="flex gap-4">
            <a href="#vision" className="transition hover:text-emerald-100">
              Visi
            </a>
            <a href="#business" className="transition hover:text-emerald-100">
              Model Bisnis
            </a>
            <a href="#marketing" className="transition hover:text-emerald-100">
              Strategi
            </a>
            <a href="#contact" className="transition hover:text-emerald-100">
              Hubungi Kami
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
