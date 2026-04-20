import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

type Section = "home" | "about" | "projects" | "news" | "tenders" | "docs" | "contacts";
type UserRole = "admin" | "user" | null;

interface User {
  name: string;
  role: UserRole;
  email: string;
}

// ─── Mock data ──────────────────────────────────────────────────────────────
const PROJECTS = [
  { id: 1, title: "Жилой комплекс «Северная звезда»", type: "ПГС", year: 2024, area: "48 500 м²", img: "https://cdn.poehali.dev/projects/232d353a-884c-46d3-ba1a-b2a0e421060f/files/32c14947-3147-4e77-8f6d-a8717f8e0d95.jpg", status: "Завершён" },
  { id: 2, title: "Участок метро «Тропарёво – Румянцево»", type: "Метро и тоннели", year: 2023, area: "3.4 км", img: "https://cdn.poehali.dev/projects/232d353a-884c-46d3-ba1a-b2a0e421060f/files/32c14947-3147-4e77-8f6d-a8717f8e0d95.jpg", status: "Завершён" },
  { id: 3, title: "Автомагистраль М-12 «Восток»", type: "Дорожное строительство", year: 2024, area: "12.5 км", img: "https://cdn.poehali.dev/projects/232d353a-884c-46d3-ba1a-b2a0e421060f/files/32c14947-3147-4e77-8f6d-a8717f8e0d95.jpg", status: "В процессе" },
  { id: 4, title: "Инженерные сети микрорайона «Новый»", type: "Инженерная инфраструктура", year: 2023, area: "18 600 м²", img: "https://cdn.poehali.dev/projects/232d353a-884c-46d3-ba1a-b2a0e421060f/files/32c14947-3147-4e77-8f6d-a8717f8e0d95.jpg", status: "Завершён" },
  { id: 5, title: "Эстакада на ТТК, участок 4А", type: "Дорожное строительство", year: 2024, area: "820 м", img: "https://cdn.poehali.dev/projects/232d353a-884c-46d3-ba1a-b2a0e421060f/files/32c14947-3147-4e77-8f6d-a8717f8e0d95.jpg", status: "В процессе" },
  { id: 6, title: "Проект реконструкции депо «Печатники»", type: "Проектирование", year: 2023, area: "—", img: "https://cdn.poehali.dev/projects/232d353a-884c-46d3-ba1a-b2a0e421060f/files/32c14947-3147-4e77-8f6d-a8717f8e0d95.jpg", status: "Завершён" },
];

const NEWS = [
  { id: 1, date: "18 апреля 2026", category: "Компания", title: "АО УРСТ вошло в топ-10 строительных компаний России", text: "По итогам ежегодного рейтинга отраслевого портала, компания заняла 7-е место среди крупнейших строительных организаций страны." },
  { id: 2, date: "10 апреля 2026", category: "Проекты", title: "Начало строительства нового участка метро на севере города", text: "На этой неделе официально стартовал один из крупнейших транспортных проектов этого года — участок метро протяжённостью 4.2 км." },
  { id: 3, date: "2 апреля 2026", category: "Тендеры", title: "Победа в государственном тендере на строительство дороги", text: "Наша компания одержала победу в конкурсе на возведение участка автомагистрали. Стоимость контракта — 2.1 млрд рублей." },
  { id: 4, date: "25 марта 2026", category: "Компания", title: "Открытие нового регионального офиса в Санкт-Петербурге", text: "В рамках стратегии расширения географии присутствия открылся наш офис в Северной столице." },
];

const TENDERS = [
  { id: 1, title: "Строительство тоннельного участка метро", deadline: "15 мая 2026", budget: "от 4.5 млрд ₽", type: "Открытый конкурс", status: "active" },
  { id: 2, title: "Реконструкция инженерных сетей", deadline: "28 мая 2026", budget: "от 45 млн ₽", type: "Запрос котировок", status: "active" },
  { id: 3, title: "Строительство автомобильной дороги II категории", deadline: "5 июня 2026", budget: "от 780 млн ₽", type: "Открытый конкурс", status: "active" },
  { id: 4, title: "Проектирование объектов инфраструктуры", deadline: "20 апреля 2026", budget: "от 8 млн ₽", type: "Запрос котировок", status: "closed" },
  { id: 5, title: "Поставка строительных материалов 2026", deadline: "1 апреля 2026", budget: "от 62 млн ₽", type: "Открытый конкурс", status: "closed" },
];

const DOCS = [
  { id: 1, name: "Устав АО «УРСТ»", type: "PDF", size: "2.4 МБ", category: "Учредительные", date: "01.01.2020" },
  { id: 2, name: "Лицензия на строительную деятельность", type: "PDF", size: "1.1 МБ", category: "Лицензии", date: "15.03.2023" },
  { id: 3, name: "Сертификат ISO 9001:2015", type: "PDF", size: "0.8 МБ", category: "Сертификаты", date: "10.06.2024" },
  { id: 4, name: "Допуск СРО на особо опасные объекты", type: "PDF", size: "1.6 МБ", category: "СРО", date: "22.09.2023" },
  { id: 5, name: "Финансовая отчётность 2025", type: "XLSX", size: "3.2 МБ", category: "Финансы", date: "28.02.2026", restricted: true },
  { id: 6, name: "Технические регламенты и стандарты", type: "PDF", size: "5.7 МБ", category: "Техническая", date: "01.04.2026" },
];

const ACCENT = "#1565C0";
const ACCENT_DARK = "#0D47A1";
const NAVY = "#0D1B2A";

// ─── Login Modal ─────────────────────────────────────────────────────────────
function LoginModal({ onClose, onLogin }: { onClose: () => void; onLogin: (user: User) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (email === "admin@ao-urst.ru" && password === "admin123") {
      onLogin({ name: "Александр Петров", role: "admin", email });
    } else if (email === "user@ao-urst.ru" && password === "user123") {
      onLogin({ name: "Мария Иванова", role: "user", email });
    } else {
      setError("Неверный логин или пароль");
    }
  };

  return (
    <div className="modal-backdrop animate-fade-in" onClick={onClose}>
      <div className="bg-white w-full max-w-md mx-4 animate-scale-in"
        style={{ boxShadow: "0 30px 80px rgba(13,27,42,0.35)" }}
        onClick={(e) => e.stopPropagation()}>
        <div style={{ background: NAVY }} className="px-8 py-6 flex justify-between items-center">
          <div>
            <div className="text-white font-montserrat font-bold text-lg">Вход в систему</div>
            <div className="text-blue-300 text-sm mt-0.5">АО УРСТ</div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <Icon name="X" size={20} />
          </button>
        </div>
        <div style={{ background: "rgba(21,101,192,0.06)", borderLeft: `3px solid ${ACCENT}` }} className="px-6 py-3 mx-8 mt-6 text-sm">
          <div className="font-semibold mb-1 font-montserrat" style={{ color: ACCENT }}>Демо-доступ</div>
          <div className="text-gray-600 text-xs leading-relaxed">
            Администратор: admin@ao-urst.ru / admin123<br />
            Пользователь: user@ao-urst.ru / user123
          </div>
        </div>
        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold font-montserrat mb-1.5 uppercase tracking-wider" style={{ color: NAVY }}>Email</label>
            <input type="email" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Введите email" required />
          </div>
          <div>
            <label className="block text-xs font-semibold font-montserrat mb-1.5 uppercase tracking-wider" style={{ color: NAVY }}>Пароль</label>
            <input type="password" className="form-input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Введите пароль" required />
          </div>
          {error && (
            <div className="text-red-500 text-sm flex items-center gap-2">
              <Icon name="AlertCircle" size={14} /> {error}
            </div>
          )}
          <button type="submit" className="btn-blue w-full mt-2">Войти</button>
        </form>
      </div>
    </div>
  );
}

// ─── Header ──────────────────────────────────────────────────────────────────
function Header({ activeSection, setSection, user, onLoginClick, onLogout, mobileMenuOpen, setMobileMenuOpen }: {
  activeSection: Section; setSection: (s: Section) => void; user: User | null;
  onLoginClick: () => void; onLogout: () => void; mobileMenuOpen: boolean; setMobileMenuOpen: (v: boolean) => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navItems: { key: Section; label: string }[] = [
    { key: "home", label: "Главная" }, { key: "about", label: "О компании" },
    { key: "projects", label: "Проекты" }, { key: "news", label: "Новости" },
    { key: "tenders", label: "Тендеры" }, { key: "docs", label: "Документация" },
    { key: "contacts", label: "Контакты" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{ background: scrolled ? "rgba(13,27,42,0.97)" : NAVY, boxShadow: scrolled ? "0 4px 20px rgba(0,0,0,0.3)" : "none" }}>
      {/* Top bar */}
      <div style={{ background: ACCENT }} className="py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-xs text-white font-montserrat">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5"><Icon name="Phone" size={12} /> +7 (495) 940-07-03</span>
            <span className="flex items-center gap-1.5"><Icon name="Mail" size={12} /> info@ao-urst.ru</span>
          </div>
          <span className="flex items-center gap-1.5"><Icon name="Clock" size={12} /> Пн–Пт, 9:00–18:00</span>
        </div>
      </div>

      <nav className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <button onClick={() => setSection("home")} className="flex items-center gap-3">
          <div style={{ background: ACCENT, width: 36, height: 36 }} className="flex items-center justify-center flex-shrink-0">
            <Icon name="Building2" size={20} className="text-white" />
          </div>
          <div>
            <div className="text-white font-montserrat font-black text-lg leading-none tracking-wide">АО УРСТ</div>
            <div className="text-blue-300 text-xs leading-none font-montserrat tracking-widest opacity-70">СТРОИТЕЛЬНАЯ КОМПАНИЯ</div>
          </div>
        </button>

        <div className="hidden lg:flex items-center gap-6">
          {navItems.map((item) => (
            <button key={item.key} onClick={() => setSection(item.key)}
              className="nav-link text-sm font-montserrat transition-colors pb-1"
              style={{ color: activeSection === item.key ? "#42A5F5" : "#c8d8e8", fontWeight: activeSection === item.key ? 600 : 400 }}>
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2">
                <div style={{ background: user.role === "admin" ? ACCENT : "#1A2E45", width: 32, height: 32 }}
                  className="flex items-center justify-center text-white text-xs font-montserrat font-bold">
                  {user.name.charAt(0)}
                </div>
                <div className="text-xs">
                  <div className="text-white font-semibold font-montserrat">{user.name}</div>
                  <div className="text-xs font-montserrat" style={{ color: user.role === "admin" ? "#42A5F5" : "#8FA3B5" }}>
                    {user.role === "admin" ? "Администратор" : "Пользователь"}
                  </div>
                </div>
              </div>
              <button onClick={onLogout} className="text-gray-400 hover:text-white transition-colors" title="Выйти">
                <Icon name="LogOut" size={16} />
              </button>
            </div>
          ) : (
            <button onClick={onLoginClick} className="btn-blue text-xs py-2 px-4">Войти</button>
          )}
          <button className="lg:hidden text-gray-300 hover:text-white transition-colors" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Icon name={mobileMenuOpen ? "X" : "Menu"} size={22} />
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div style={{ background: NAVY, borderTop: `2px solid ${ACCENT}` }} className="lg:hidden px-4 pb-4">
          {navItems.map((item) => (
            <button key={item.key} onClick={() => { setSection(item.key); setMobileMenuOpen(false); }}
              className="block w-full text-left py-3 border-b border-gray-800 text-sm font-montserrat transition-colors"
              style={{ color: activeSection === item.key ? "#42A5F5" : "#c8d8e8" }}>
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}

// ─── Home ────────────────────────────────────────────────────────────────────
function HomeSection({ setSection }: { setSection: (s: Section) => void }) {
  const stats = [
    { value: "13+", label: "Лет на рынке" },
    { value: "120+", label: "Объектов сдано" },
    { value: "350 км", label: "Тоннелей и дорог" },
    { value: "98%", label: "Проектов в срок" },
  ];

  const services = [
    { icon: "Train", title: "Метро и тоннели", text: "Строительство и проектирование линий метро (глубокого и мелкого заложения), электродепо, тоннелей." },
    { icon: "Road", title: "Дорожное строительство", text: "Строительство автомобильных дорог, автомагистралей и искусственных сооружений на них (мосты, эстакады)." },
    { icon: "Building2", title: "Промышленное и гражданское строительство (ПГС)", text: "Строительство жилых и нежилых зданий, а также объектов инженерной инфраструктуры." },
    { icon: "Zap", title: "Инженерная инфраструктура", text: "Строительство коммуникаций: водоснабжение, водоотведение, газоснабжение, линии электропередач." },
    { icon: "FileText", title: "Проектирование", text: "Разработка строительных проектов." },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="hero-pattern min-h-screen flex items-center relative overflow-hidden" style={{ paddingTop: 100 }}>
        <div className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{ backgroundImage: `url(https://cdn.poehali.dev/projects/232d353a-884c-46d3-ba1a-b2a0e421060f/files/5dcc861c-9695-40f3-a9b3-c963da3c8aa5.jpg)` }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(13,27,42,0.97) 45%, rgba(13,27,42,0.55))" }} />

        {/* Decorative vertical line */}
        <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: `linear-gradient(to bottom, transparent, ${ACCENT}, transparent)` }} />

        <div className="max-w-7xl mx-auto px-4 py-24 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="tag-blue mb-6 inline-block animate-fade-in-up">13+ лет профессиональной деятельности</div>
            <h1 className="font-montserrat font-black text-white mb-6 animate-fade-in-up delay-100"
              style={{ fontSize: "clamp(2rem, 4.5vw, 3.2rem)", lineHeight: 1.1 }}>
              Строим будущее<br />
              <span style={{ color: "#42A5F5" }}>с надёжностью</span><br />
              и качеством
            </h1>
            <p className="text-gray-300 text-base mb-8 leading-relaxed max-w-lg animate-fade-in-up delay-200">
              Полный цикл строительства — от проектирования до сдачи объекта. Государственные и коммерческие заказчики.
            </p>
            <div className="flex gap-4 flex-wrap animate-fade-in-up delay-300">
              <button onClick={() => setSection("projects")} className="btn-blue">Наши проекты</button>
              <button onClick={() => setSection("contacts")} className="btn-outline-white">Связаться с нами</button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {stats.map((s, i) => (
              <div key={i} className="animate-fade-in-up"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(66,165,245,0.2)",
                  padding: "1.5rem",
                  animationDelay: `${0.2 + i * 0.1}s`,
                  opacity: 0,
                  borderTop: `2px solid ${ACCENT}`,
                }}>
                <div className="font-montserrat font-black text-3xl mb-1" style={{ color: "#42A5F5" }}>{s.value}</div>
                <div className="text-gray-300 text-sm font-montserrat">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl mb-12">
            <div className="tag-blue mb-3 inline-block">Что мы делаем</div>
            <div style={{ width: 48, height: 3, background: ACCENT, marginBottom: 16 }} />
            <h2 className="section-title mb-5">Направления деятельности</h2>
            <p className="leading-relaxed text-base" style={{ color: "#4A6077" }}>
              Акционерное Общество «Управление Развития Строительных Технологий» выполняет широкий перечень услуг, связанный с разработкой проектов в строительной сфере, проектированием и строительством объектов гражданского назначения.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((s, i) => (
              <div key={i} className="card-hover p-6 group cursor-pointer border border-gray-100"
                style={{ background: "#f8fafd", borderLeft: `3px solid transparent`, transition: "all 0.3s" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderLeftColor = ACCENT; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderLeftColor = "transparent"; }}>
                <div className="w-11 h-11 flex items-center justify-center mb-4" style={{ background: "rgba(21,101,192,0.08)" }}>
                  <Icon name={s.icon as "Building2"} size={20} style={{ color: ACCENT }} />
                </div>
                <h3 className="font-montserrat font-bold text-sm mb-2" style={{ color: NAVY }}>{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#4A6077" }}>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16" style={{ background: NAVY }}>
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="font-montserrat font-black text-white text-2xl md:text-3xl mb-2">Есть строительный проект?</h2>
            <p className="text-blue-200 opacity-70">Рассчитаем стоимость и сроки в течение одного рабочего дня.</p>
          </div>
          <button onClick={() => setSection("contacts")} className="btn-blue flex-shrink-0">Получить расчёт</button>
        </div>
      </section>

      {/* News preview */}
      <section className="py-20" style={{ background: "#f4f7fb" }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <div style={{ width: 48, height: 3, background: ACCENT, marginBottom: 12 }} />
              <h2 className="section-title">Последние новости</h2>
            </div>
            <button onClick={() => setSection("news")} className="btn-outline-navy hidden md:block">Все новости</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {NEWS.slice(0, 3).map((n) => (
              <div key={n.id} className="bg-white card-hover overflow-hidden">
                <div style={{ background: ACCENT, height: 3 }} />
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="tag-blue">{n.category}</span>
                    <span className="text-xs" style={{ color: "#8FA3B5" }}>{n.date}</span>
                  </div>
                  <h3 className="font-montserrat font-bold text-sm mb-3 leading-snug" style={{ color: NAVY }}>{n.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#4A6077" }}>{n.text.slice(0, 90)}...</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── About ───────────────────────────────────────────────────────────────────
function AboutSection() {
  const values = [
    { icon: "ShieldCheck", title: "Надёжность", text: "13 лет на рынке — каждый объект строится в срок и с гарантией." },
    { icon: "Award", title: "Качество", text: "Международные стандарты ISO, современные технологии и материалы." },
    { icon: "Users", title: "Команда", text: "Опытные инженеры, строители, проектировщики." },
    { icon: "TrendingUp", title: "Развитие", text: "Постоянное инвестирование в оборудование и обучение персонала." },
  ];
  const team = [
    { name: "Дмитрий Соколов", role: "Генеральный директор", exp: "20 лет в строительстве" },
    { name: "Елена Миронова", role: "Главный инженер", exp: "15 лет в отрасли" },
    { name: "Алексей Варшавский", role: "Директор по проектам", exp: "12 лет в управлении" },
    { name: "Ирина Федотова", role: "Финансовый директор", exp: "10 лет в финансах" },
  ];

  return (
    <div className="pt-24">
      <div style={{ background: NAVY }} className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="tag-blue mb-4 inline-block">О нас</div>
          <h1 className="font-montserrat font-black text-white text-4xl mb-4">О компании</h1>
          <p className="text-blue-200 opacity-80 max-w-xl leading-relaxed">АО «УРСТ» — одна из ведущих строительных компаний с 13-летней историей.</p>
        </div>
      </div>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div style={{ width: 48, height: 3, background: ACCENT, marginBottom: 16 }} />
            <h2 className="section-title mb-6">История и миссия</h2>
            <p className="text-gray-600 leading-relaxed mb-6">Компания основана в 2013 году. Начав с проектных работ, сегодня мы реализуем масштабные инфраструктурные проекты по всей России — метро, дороги, ПГС, инженерные сети.</p>
            <p className="text-gray-600 leading-relaxed mb-6">Наша миссия — создавать объекты, которые служат людям десятилетиями: надёжные, функциональные, современные.</p>
            <div className="flex flex-wrap gap-6 mt-8">
              {[["2013", "Год основания"], ["120+", "Объектов сдано"], ["350 км", "Тоннелей и дорог"]].map(([v, l]) => (
                <div key={l} style={{ borderLeft: `3px solid ${ACCENT}` }} className="pl-4">
                  <div className="font-montserrat font-black text-2xl" style={{ color: NAVY }}>{v}</div>
                  <div className="text-sm text-gray-500">{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <img src="https://cdn.poehali.dev/projects/232d353a-884c-46d3-ba1a-b2a0e421060f/files/5dcc861c-9695-40f3-a9b3-c963da3c8aa5.jpg" alt="АО УРСТ" className="w-full object-cover" style={{ height: 380 }} />
            <div className="absolute -bottom-4 -right-4 px-6 py-4 font-montserrat font-black text-white" style={{ background: ACCENT }}>
              <div className="text-3xl">13</div>
              <div className="text-xs tracking-wider">ЛЕТ ОПЫТА</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20" style={{ background: "#f4f7fb" }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div style={{ width: 48, height: 3, background: ACCENT, margin: "0 auto 16px" }} />
            <h2 className="section-title">Наши ценности</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <div key={i} className="bg-white p-6 card-hover text-center">
                <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center" style={{ background: "rgba(21,101,192,0.08)" }}>
                  <Icon name={v.icon as "ShieldCheck"} size={26} style={{ color: ACCENT }} />
                </div>
                <h3 className="font-montserrat font-bold text-base mb-2" style={{ color: NAVY }}>{v.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div style={{ width: 48, height: 3, background: ACCENT, marginBottom: 16 }} />
          <h2 className="section-title mb-10">Руководство компании</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((t, i) => (
              <div key={i} className="card-hover">
                <div className="h-2" style={{ background: ACCENT }} />
                <div className="p-6 border border-gray-100">
                  <div className="w-14 h-14 flex items-center justify-center font-montserrat font-black text-white text-lg mb-4" style={{ background: ACCENT }}>
                    {t.name.charAt(0)}
                  </div>
                  <h3 className="font-montserrat font-bold text-sm mb-1" style={{ color: NAVY }}>{t.name}</h3>
                  <div className="text-xs mb-2 font-semibold" style={{ color: ACCENT }}>{t.role}</div>
                  <div className="text-xs text-gray-400">{t.exp}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── Projects ─────────────────────────────────────────────────────────────────
function ProjectsSection() {
  const [filter, setFilter] = useState("Все");
  const types = ["Все", "Метро и тоннели", "Дорожное строительство", "ПГС", "Инженерная инфраструктура", "Проектирование"];
  const filtered = filter === "Все" ? PROJECTS : PROJECTS.filter((p) => p.type === filter);

  return (
    <div className="pt-24">
      <div style={{ background: NAVY }} className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="tag-blue mb-4 inline-block">Портфолио</div>
          <h1 className="font-montserrat font-black text-white text-4xl mb-4">Проекты</h1>
          <p className="text-blue-200 opacity-80 max-w-xl">120+ реализованных объектов по всей России.</p>
        </div>
      </div>
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap gap-2 mb-10">
            {types.map((t) => (
              <button key={t} onClick={() => setFilter(t)}
                className="px-4 py-2 text-xs font-montserrat font-semibold uppercase tracking-wider transition-all border"
                style={{ background: filter === t ? ACCENT : "transparent", color: filter === t ? "white" : NAVY, borderColor: filter === t ? ACCENT : "#ccd8e4" }}>
                {t}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p) => (
              <div key={p.id} className="card-hover group overflow-hidden bg-white border border-gray-100">
                <div className="relative overflow-hidden" style={{ height: 200 }}>
                  <img src={p.img} alt={p.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(13,27,42,0.85), transparent)" }} />
                  <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                    <span className="tag-blue">{p.type}</span>
                    <span className="text-xs font-montserrat font-semibold px-2 py-0.5"
                      style={{ background: p.status === "Завершён" ? "rgba(39,174,96,0.85)" : `rgba(21,101,192,0.85)`, color: "white" }}>
                      {p.status}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-montserrat font-bold text-sm mb-3 leading-snug" style={{ color: NAVY }}>{p.title}</h3>
                  <div className="flex gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><Icon name="Calendar" size={12} /> {p.year}</span>
                    <span className="flex items-center gap-1"><Icon name="Maximize2" size={12} /> {p.area}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── News ─────────────────────────────────────────────────────────────────────
function NewsSection() {
  return (
    <div className="pt-24">
      <div style={{ background: NAVY }} className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="tag-blue mb-4 inline-block">Пресс-центр</div>
          <h1 className="font-montserrat font-black text-white text-4xl mb-4">Новости</h1>
          <p className="text-blue-200 opacity-80 max-w-xl">Актуальные события компании и отрасли.</p>
        </div>
      </div>
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {NEWS.map((n) => (
                <div key={n.id} className="card-hover flex gap-0 overflow-hidden border border-gray-100 group cursor-pointer">
                  <div style={{ width: 3, background: ACCENT, flexShrink: 0 }} />
                  <div className="p-6 flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="tag-blue">{n.category}</span>
                      <span className="text-xs flex items-center gap-1" style={{ color: "#8FA3B5" }}><Icon name="Calendar" size={11} /> {n.date}</span>
                    </div>
                    <h3 className="font-montserrat font-bold text-base mb-3 leading-snug" style={{ color: NAVY }}>{n.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{n.text}</p>
                    <div className="mt-4 flex items-center gap-1 text-xs font-semibold font-montserrat" style={{ color: ACCENT }}>
                      Читать далее <Icon name="ArrowRight" size={12} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-6">
              <div style={{ background: "#f4f7fb", borderTop: `3px solid ${ACCENT}` }} className="p-6">
                <h3 className="font-montserrat font-bold text-sm mb-4 uppercase tracking-wide" style={{ color: NAVY }}>Подписка на новости</h3>
                <p className="text-xs text-gray-500 mb-4">Получайте важные новости компании первыми.</p>
                <input type="email" className="form-input mb-3" placeholder="Ваш email" />
                <button className="btn-blue w-full text-xs">Подписаться</button>
              </div>
              <div style={{ background: NAVY }} className="p-6">
                <h3 className="font-montserrat font-bold text-sm mb-4 uppercase tracking-wide text-white">Контакты пресс-службы</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-blue-200 opacity-80"><Icon name="User" size={14} /> Ксения Белова</div>
                  <div className="flex items-center gap-2 text-blue-200 opacity-80"><Icon name="Phone" size={14} /> +7 (495) 940-07-03</div>
                  <div className="flex items-center gap-2 text-blue-200 opacity-80"><Icon name="Mail" size={14} /> press@ao-urst.ru</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Tenders ──────────────────────────────────────────────────────────────────
function TendersSection({ user }: { user: User | null }) {
  const [tab, setTab] = useState<"active" | "closed">("active");
  const filtered = TENDERS.filter((t) => t.status === tab);

  return (
    <div className="pt-24">
      <div style={{ background: NAVY }} className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="tag-blue mb-4 inline-block">Закупки</div>
          <h1 className="font-montserrat font-black text-white text-4xl mb-4">Тендеры</h1>
          <p className="text-blue-200 opacity-80 max-w-xl">Актуальные конкурсные процедуры компании.</p>
        </div>
      </div>
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          {user?.role === "admin" && (
            <div style={{ background: "rgba(21,101,192,0.06)", border: `1px solid rgba(21,101,192,0.25)` }} className="p-5 mb-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Icon name="ShieldCheck" size={18} style={{ color: ACCENT }} />
                <span className="font-montserrat font-semibold text-sm" style={{ color: NAVY }}>Панель администратора — управление тендерами</span>
              </div>
              <button className="btn-blue text-xs py-2 px-4 flex items-center gap-2"><Icon name="Plus" size={14} /> Добавить тендер</button>
            </div>
          )}
          <div className="flex border-b border-gray-200 mb-8">
            {(["active", "closed"] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className="px-6 py-3 font-montserrat font-semibold text-sm transition-all border-b-2 -mb-px"
                style={{ borderColor: tab === t ? ACCENT : "transparent", color: tab === t ? ACCENT : "#4A6077" }}>
                {t === "active" ? "Активные" : "Завершённые"}
              </button>
            ))}
          </div>
          <div className="space-y-4">
            {filtered.map((tender) => (
              <div key={tender.id} className="border border-gray-100 p-6 card-hover flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="tag-blue">{tender.type}</span>
                    {tender.status === "active" && <span className="text-xs font-semibold font-montserrat" style={{ color: "#27ae60" }}>● Активный</span>}
                  </div>
                  <h3 className="font-montserrat font-bold text-base mb-2" style={{ color: NAVY }}>{tender.title}</h3>
                  <div className="flex gap-5 text-sm text-gray-500">
                    <span className="flex items-center gap-1.5"><Icon name="Calendar" size={13} /> Срок: {tender.deadline}</span>
                    <span className="flex items-center gap-1.5"><Icon name="DollarSign" size={13} /> {tender.budget}</span>
                  </div>
                </div>
                <div className="flex gap-3 flex-shrink-0">
                  <button className="btn-outline-navy text-xs py-2 px-4 flex items-center gap-1.5"><Icon name="FileText" size={13} /> Документация</button>
                  {tender.status === "active" && <button className="btn-blue text-xs py-2 px-4">Подать заявку</button>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Docs ─────────────────────────────────────────────────────────────────────
function DocsSection({ user }: { user: User | null }) {
  const categories = ["Все", "Учредительные", "Лицензии", "Сертификаты", "СРО", "Финансы", "Техническая"];
  const [cat, setCat] = useState("Все");
  const filtered = cat === "Все" ? DOCS : DOCS.filter((d) => d.category === cat);

  return (
    <div className="pt-24">
      <div style={{ background: NAVY }} className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="tag-blue mb-4 inline-block">Документы</div>
          <h1 className="font-montserrat font-black text-white text-4xl mb-4">Документация</h1>
          <p className="text-blue-200 opacity-80 max-w-xl">Лицензии, сертификаты и корпоративные документы компании.</p>
        </div>
      </div>
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          {!user && (
            <div style={{ background: "rgba(13,27,42,0.04)", border: "1px solid rgba(13,27,42,0.12)" }} className="p-5 mb-8 flex items-center gap-3">
              <Icon name="Lock" size={18} style={{ color: NAVY }} />
              <span className="text-sm text-gray-600">Некоторые документы доступны только авторизованным пользователям.</span>
            </div>
          )}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((c) => (
              <button key={c} onClick={() => setCat(c)}
                className="px-3 py-1.5 text-xs font-montserrat font-semibold uppercase tracking-wide transition-all border"
                style={{ background: cat === c ? NAVY : "transparent", color: cat === c ? "white" : NAVY, borderColor: "#ccd8e4" }}>
                {c}
              </button>
            ))}
          </div>
          <div className="space-y-2">
            {filtered.map((doc) => {
              const isRestricted = (doc as typeof doc & { restricted?: boolean }).restricted && !user;
              return (
                <div key={doc.id} className="flex items-center justify-between p-4 border border-gray-100 hover:border-blue-200 transition-all"
                  style={{ opacity: isRestricted ? 0.6 : 1 }}>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 text-xs font-montserrat font-black"
                      style={{ background: doc.type === "PDF" ? "rgba(231,76,60,0.08)" : "rgba(39,174,96,0.08)", color: doc.type === "PDF" ? "#e74c3c" : "#27ae60" }}>
                      {doc.type}
                    </div>
                    <div>
                      <div className="font-semibold text-sm flex items-center gap-2" style={{ color: NAVY }}>
                        {doc.name}
                        {(doc as typeof doc & { restricted?: boolean }).restricted && <Icon name="Lock" size={12} style={{ color: ACCENT }} />}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">{doc.category} · {doc.size} · обновлён {doc.date}</div>
                    </div>
                  </div>
                  <button className="flex items-center gap-2 text-xs font-montserrat font-semibold transition-colors"
                    style={{ color: isRestricted ? "#8FA3B5" : ACCENT }} disabled={!!isRestricted}>
                    <Icon name={isRestricted ? "Lock" : "Download"} size={14} />
                    {isRestricted ? "Войдите" : "Скачать"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Contacts ─────────────────────────────────────────────────────────────────
function ContactsSection() {
  const offices = [
    { city: "Москва (Главный офис)", address: "ул. Строителей, д. 18, стр. 2", phone: "+7 (495) 940-07-03", email: "info@ao-urst.ru" },
    { city: "Санкт-Петербург", address: "Невский пр., д. 112, оф. 304", phone: "+7 (812) 940-07-03", email: "spb@ao-urst.ru" },
    { city: "Екатеринбург", address: "ул. Ленина, д. 52, оф. 201", phone: "+7 (343) 940-07-03", email: "ekb@ao-urst.ru" },
  ];

  return (
    <div className="pt-24">
      <div style={{ background: NAVY }} className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="tag-blue mb-4 inline-block">Связь</div>
          <h1 className="font-montserrat font-black text-white text-4xl mb-4">Контакты</h1>
          <p className="text-blue-200 opacity-80 max-w-xl">Мы работаем по всей России. Выберите ближайший офис или напишите нам.</p>
        </div>
      </div>
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <div style={{ width: 48, height: 3, background: ACCENT, marginBottom: 16 }} />
            <h2 className="section-title mb-6">Написать нам</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-montserrat font-semibold uppercase tracking-wider mb-1.5" style={{ color: NAVY }}>Имя</label>
                  <input className="form-input" placeholder="Ваше имя" />
                </div>
                <div>
                  <label className="block text-xs font-montserrat font-semibold uppercase tracking-wider mb-1.5" style={{ color: NAVY }}>Компания</label>
                  <input className="form-input" placeholder="Название компании" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-montserrat font-semibold uppercase tracking-wider mb-1.5" style={{ color: NAVY }}>Email</label>
                <input type="email" className="form-input" placeholder="email@company.ru" />
              </div>
              <div>
                <label className="block text-xs font-montserrat font-semibold uppercase tracking-wider mb-1.5" style={{ color: NAVY }}>Телефон</label>
                <input className="form-input" placeholder="+7 (___) ___-__-__" />
              </div>
              <div>
                <label className="block text-xs font-montserrat font-semibold uppercase tracking-wider mb-1.5" style={{ color: NAVY }}>Тема обращения</label>
                <select className="form-input">
                  <option>Строительный проект</option>
                  <option>Участие в тендере</option>
                  <option>Партнёрство</option>
                  <option>Другое</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-montserrat font-semibold uppercase tracking-wider mb-1.5" style={{ color: NAVY }}>Сообщение</label>
                <textarea className="form-input" rows={4} placeholder="Опишите ваш запрос..." />
              </div>
              <button className="btn-blue w-full">Отправить сообщение</button>
            </div>
          </div>
          <div>
            <div style={{ width: 48, height: 3, background: ACCENT, marginBottom: 16 }} />
            <h2 className="section-title mb-6">Наши офисы</h2>
            <div className="space-y-4 mb-8">
              {offices.map((o, i) => (
                <div key={i} className="p-5 border border-gray-100 card-hover">
                  <h3 className="font-montserrat font-bold text-sm mb-3" style={{ color: ACCENT }}>{o.city}</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-start gap-2.5"><Icon name="MapPin" size={14} className="mt-0.5 flex-shrink-0" style={{ color: NAVY }} /> {o.address}</div>
                    <div className="flex items-center gap-2.5"><Icon name="Phone" size={14} style={{ color: NAVY }} /> {o.phone}</div>
                    <div className="flex items-center gap-2.5"><Icon name="Mail" size={14} style={{ color: NAVY }} /> {o.email}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ background: NAVY }} className="p-6">
              <h3 className="font-montserrat font-bold text-white text-sm mb-4">Горячая линия</h3>
              <div className="text-2xl font-montserrat font-black mb-1" style={{ color: "#42A5F5" }}>+7 (495) 940-07-03</div>
              <div className="text-blue-200 opacity-60 text-xs">Пн–Пт, 9:00–18:00</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer({ setSection }: { setSection: (s: Section) => void }) {
  const labels: Record<Section, string> = { home: "Главная", about: "О компании", projects: "Проекты", news: "Новости", tenders: "Тендеры", docs: "Документация", contacts: "Контакты" };
  return (
    <footer style={{ background: "#07111C" }}>
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div style={{ background: ACCENT, width: 32, height: 32 }} className="flex items-center justify-center">
              <Icon name="Building2" size={16} className="text-white" />
            </div>
            <div>
              <div className="font-montserrat font-black text-white text-sm">АО УРСТ</div>
              <div style={{ color: "#4A6077" }} className="text-xs">с 2013 года</div>
            </div>
          </div>
          <p style={{ color: "#4A6077" }} className="text-xs leading-relaxed">Полный цикл строительства от проектирования до сдачи объекта.</p>
        </div>
        <div>
          <div className="font-montserrat font-bold text-xs uppercase tracking-widest mb-4" style={{ color: "#8FA3B5" }}>Навигация</div>
          <div className="space-y-2">
            {(["home", "about", "projects", "news"] as Section[]).map((s) => (
              <button key={s} onClick={() => setSection(s)} className="block text-xs transition-colors hover:text-white" style={{ color: "#4A6077" }}>{labels[s]}</button>
            ))}
          </div>
        </div>
        <div>
          <div className="font-montserrat font-bold text-xs uppercase tracking-widest mb-4" style={{ color: "#8FA3B5" }}>Услуги</div>
          <div className="space-y-2 text-xs" style={{ color: "#4A6077" }}>
            {["Метро и тоннели", "Дорожное строительство", "ПГС", "Инженерная инфраструктура", "Проектирование"].map((s) => <div key={s}>{s}</div>)}
          </div>
        </div>
        <div>
          <div className="font-montserrat font-bold text-xs uppercase tracking-widest mb-4" style={{ color: "#8FA3B5" }}>Контакты</div>
          <div className="space-y-2 text-xs" style={{ color: "#4A6077" }}>
            <div className="flex items-center gap-2"><Icon name="Phone" size={11} /> +7 (495) 940-07-03</div>
            <div className="flex items-center gap-2"><Icon name="Mail" size={11} /> info@ao-urst.ru</div>
            <div className="flex items-center gap-2"><Icon name="MapPin" size={11} /> Москва, ул. Строителей, 18</div>
          </div>
        </div>
      </div>
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }} className="py-4 px-4">
        <div className="max-w-7xl mx-auto text-center text-xs" style={{ color: "#4A6077" }}>
          © 2026 АО «УРСТ». Все права защищены.
        </div>
      </div>
    </footer>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Index() {
  const [section, setSection] = useState<Section>("home");
  const [user, setUser] = useState<User | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [section]);

  const handleLogin = (u: User) => { setUser(u); setShowLogin(false); };

  return (
    <div>
      <Header
        activeSection={section}
        setSection={(s) => { setSection(s); setMobileMenuOpen(false); }}
        user={user}
        onLoginClick={() => setShowLogin(true)}
        onLogout={() => setUser(null)}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
      <main>
        {section === "home" && <HomeSection setSection={setSection} />}
        {section === "about" && <AboutSection />}
        {section === "projects" && <ProjectsSection />}
        {section === "news" && <NewsSection />}
        {section === "tenders" && <TendersSection user={user} />}
        {section === "docs" && <DocsSection user={user} />}
        {section === "contacts" && <ContactsSection />}
      </main>
      <Footer setSection={setSection} />
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} onLogin={handleLogin} />}
    </div>
  );
}
