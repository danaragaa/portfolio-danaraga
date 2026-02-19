export type Project = {
  slug: string;
  title: string;
  description: string;
  role: string;
  impact: string;
  period: string;
  image: string;
  imageAlt: string;
  overview: string;
  challenge: string;
  solution: string;
  outcome: string[];
  tech: string[];
  liveUrl?: string;
  repoUrl?: string;
};

export const projects: Project[] = [
  {
    slug: "basecodes",
    title: "Basecodes />",
    description: "Platform belajar web dasar dengan fitur CRUD dan admin panel.",
    role: "Fullstack Developer",
    impact: "Titik awal perjalanan saya sebagai developer: belajar membangun, memperbaiki, dan menstabilkan aplikasi web.",
    period: "2024",
    image: "/projects/basecodes.png",
    imageAlt: "Preview landing page Hero Section pada website Basecodes",
    overview:
      "Basecodes dibuat sebagai platform pembelajaran web dasar untuk membantu pengguna memahami konsep CRUD, autentikasi, dan manajemen data secara praktis.",
    challenge:
      "Tantangannya adalah menyederhanakan alur belajar untuk pemula, sambil tetap menjaga struktur aplikasi agar scalable ketika fitur bertambah.",
    solution:
      "Saya membangun arsitektur fullstack sederhana berbasis PHP dengan UI Tailwind yang modular, termasuk dashboard admin untuk manajemen konten belajar.",
    outcome: [
      "Menyelesaikan fondasi aplikasi CRUD end-to-end pertama dengan stabil.",
      "Meningkatkan pemahaman implementasi autentikasi dan role-based access.",
      "Menjadi basis project lanjutan dengan struktur kode lebih rapi.",
    ],
    tech: ["HTML", "CSS", "PHP", "TailwindCSS"],
    repoUrl: "https://github.com/danaragaa/basecodes",
  },
  {
    slug: "kang-bakso-mencari-gerobak",
    title: "Kang Bakso Mencari Gerobak",
    description: "Game Meme Absurd dengan gameplay sederhana untuk hiburan ringan.",
    role: "Visual Script Game Developer",
    impact: "Membangun game pertama saya dengan memperluas pemahaman saya tentang logika pemrograman dan desain game sederhana.",
    period: "2024",
    image: "/projects/kang-bakso.png",
    imageAlt: "Preview landing page Hero Section pada website Kang Bakso Mencari Gerobak",
    overview:
      "Project game jam bertema meme absurd dengan gameplay cepat untuk pengalaman hiburan ringan berbasis browser.",
    challenge:
      "Waktu pengembangan sangat singkat, sehingga scope gameplay dan aset harus diprioritaskan agar game tetap playable dan menarik.",
    solution:
      "Saya merancang gameplay loop sederhana dengan visual scripting di GDevelop, fokus pada respons input, pacing, dan visual humor.",
    outcome: [
      "Game selesai sesuai batas waktu event dan dapat dimainkan publik.",
      "Memperkuat kemampuan desain gameplay dan iterasi cepat.",
      "Meningkatkan kepercayaan diri dalam membangun project interaktif dari nol.",
    ],
    tech: ["GDevelop"],
    liveUrl: "https://gd.games/instant-builds/2d8e7cf3-c502-4670-a3e8-72b130a0f65d",
    repoUrl: "https://globalgamejam.org/games/2024/tukang-bakso-pencari-gerobak-8",
  },
  {
    slug: "bblara-cashier",
    title: "Bblar'A Cashier",
    description: "Web Aplikasi kasir untuk UMKM dengan fitur manajemen produk, transaksi, dan laporan penjualan.",
    role: "Frontend Developer",
    impact: "Membangun aplikasi yang membantu UMKM mengelola penjualan mereka dengan lebih efisien, sekaligus memperdalam pemahaman saya tentang pengembangan aplikasi fullstack.",
    period: "2025",
    image: "/projects/bblara-cashier.png",
    imageAlt: "Preview Kasir aplikasi Bblar'A Cashier",
    overview:
      "Aplikasi kasir web untuk UMKM dengan fokus pada kemudahan transaksi harian, manajemen produk, dan laporan penjualan.",
    challenge:
      "Sistem harus mudah digunakan oleh user non-teknis, tetap cepat dipakai saat jam ramai, dan mudah dipelihara.",
    solution:
      "Saya mengembangkan antarmuka transaksi yang ringkas, mengoptimalkan alur input kasir, dan menyiapkan struktur data laporan yang mudah dipantau.",
    outcome: [
      "Proses transaksi harian lebih cepat dan minim kesalahan input.",
      "Pemilik usaha dapat memantau penjualan lewat laporan terstruktur.",
      "Meningkatkan pengalaman implementasi aplikasi bisnis real-world.",
    ],
    tech: ["Laravel", "JavaScript", "MySQL", "TailwindCSS"],
    liveUrl: "https://bblara-cashier.kuadrattech.my.id",
    repoUrl: "https://github.com/rhelzz/bblara-pos",
  },
  {
    slug: "al-ruhamaa-bisto-wakaf",
    title: "Al-Ruhamaa' Bisto Wakaf",
    description: "Sistem point of sale untuk Yayasan Al-Ruhamaa' berbasis web dengan fitur manajemen produk, transaksi, dan laporan penjualan.",
    role: "Fullstack Developer",
    impact: "Membangun sistem POS yang membantu yayasan mengelola penjualan mereka dengan lebih efisien, sekaligus memperdalam pemahaman saya tentang pengembangan aplikasi fullstack.",
    period: "2025",
    image: "/projects/al-ruhamaa-bisto-wakaf.png",
    imageAlt: "Preview halaman Login pada website Al-Ruhamaa' Bisto Wakaf POS",
    overview:
      "Sistem point of sale berbasis web untuk yayasan, dengan kebutuhan transparansi transaksi dan operasional harian yang lebih terstruktur.",
    challenge:
      "Menyelaraskan kebutuhan operasional yayasan dengan UI yang sederhana serta menjaga reliabilitas data transaksi.",
    solution:
      "Saya membangun modul transaksi, manajemen produk, dan laporan menggunakan Laravel + Alpine.js dengan pendekatan fullstack terintegrasi.",
    outcome: [
      "Operasional kasir yayasan lebih rapi dan mudah dipantau.",
      "Laporan penjualan lebih jelas untuk evaluasi rutin.",
      "Memperdalam praktik fullstack untuk sistem organisasi nyata.",
    ],
    tech: ["Laravel", "Alpine.js", "TailwindCSS", "MySQL"],
    repoUrl: "https://github.com/Dcaiser/yc-oroject",
  },
];

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function getNextProject(currentSlug: string) {
  const currentIndex = projects.findIndex((project) => project.slug === currentSlug);
  if (currentIndex === -1 || projects.length <= 1) {
    return null;
  }

  const nextIndex = (currentIndex + 1) % projects.length;
  return projects[nextIndex];
}

export function getRelatedProjects(currentSlug: string, limit = 2) {
  const currentProject = getProjectBySlug(currentSlug);
  if (!currentProject) {
    return [];
  }

  const currentTech = new Set(currentProject.tech.map((item) => item.toLowerCase()));

  return projects
    .filter((project) => project.slug !== currentSlug)
    .map((project) => {
      const sharedTechCount = project.tech.filter((item) => currentTech.has(item.toLowerCase())).length;
      return { project, sharedTechCount };
    })
    .sort((a, b) => b.sharedTechCount - a.sharedTechCount)
    .slice(0, limit)
    .map((item) => item.project);
}