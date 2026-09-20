import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Language Context
type Lang = 'ar' | 'en';
interface LangContextType {
  lang: Lang;
  toggleLang: () => void;
  t: (ar: string, en: string) => string;
}

const LangContext = createContext<LangContextType>({
  lang: 'ar',
  toggleLang: () => {},
  t: (ar: string) => ar,
});

const useLang = () => useContext(LangContext);

// Translations
const translations = {
  nav: {
    home: { ar: 'الرئيسية', en: 'Home' },
    about: { ar: 'من نحن', en: 'About Us' },
    services: { ar: 'خدماتنا', en: 'Services' },
    beforeAfter: { ar: 'قبل وبعد', en: 'Before & After' },
    testimonials: { ar: 'آراء العملاء', en: 'Testimonials' },
    contact: { ar: 'تواصل معنا', en: 'Contact' },
  },
  hero: {
    title: { ar: 'مجموعة التميمي', en: 'Al-Tamimi Group' },
    subtitle: { ar: 'خبراء صيانة اللوحات الإلكترونية والأجهزة المنزلية', en: 'Experts in Electronic Boards & Home Appliances Maintenance' },
    cta: { ar: 'احجز موعدك للصيانة المنزلية الآن', en: 'Book Your Home Service Now' },
  },
  about: {
    title: { ar: 'من نحن', en: 'About Us' },
    text1: { ar: 'مجموعة التميمي رائدة في مجال صيانة وبرمجة اللوحات الإلكترونية للأجهزة المنزلية. نمتلك خبرة واسعة في تشخيص وإصلاح جميع أنواع الأعطال الإلكترونية بأحدث التقنيات والأجهزة.', en: 'Al-Tamimi Group is a pioneer in the maintenance and programming of electronic boards for home appliances. We have extensive experience in diagnosing and repairing all types of electronic faults using the latest technologies and equipment.' },
    text2: { ar: 'خدمة التصليح المنزلي - نصلك إلى باب بيتك، نحدد العطل، ونعالجه فوراً. لا حاجة لنقل الجهاز - فنيونا المتخصصون يأتون إليك.', en: 'Home Repair Service - We come to your doorstep, diagnose the fault, and fix it immediately. No need to transport your appliance - our specialized technicians come to you.' },
    highlight: { ar: 'خدمة التصليح المنزلي', en: 'Home Repair Service' },
    highlightDesc: { ar: 'نصلك إلى باب بيتك، نحدد العطل، ونعالجه فوراً', en: 'We come to you, diagnose the fault, and fix it on the spot' },
  },
  services: {
    title: { ar: 'خدماتنا', en: 'Our Services' },
    items: [
      { ar: 'صيانة اللوحات الإلكترونية', en: 'Electronic Boards Maintenance', icon: 'fa-microchip', desc: { ar: 'صيانة وبرمجة جميع أنواع اللوحات الإلكترونية', en: 'Maintenance and programming of all electronic boards' } },
      { ar: 'صيانة المكيفات', en: 'Air Conditioners Maintenance', icon: 'fa-snowflake', desc: { ar: 'صيانة شاملة لأنظمة التكييف والتبريد', en: 'Comprehensive AC and cooling systems maintenance' } },
      { ar: 'صيانة الغسالات والنشافات', en: 'Washing Machines & Dryers', icon: 'fa-shirt', desc: { ar: 'إصلاح وصيانة جميع أنواع الغسالات', en: 'Repair and maintenance of all washing machines' } },
      { ar: 'صيانة الثلاجات', en: 'Refrigerators Maintenance', icon: 'fa-temperature-low', desc: { ar: 'صيانة وإصلاح الثلاجات المنزلية والتجارية', en: 'Maintenance of household and commercial refrigerators' } },
      { ar: 'صيانة الجلايات', en: 'Dishwashers Maintenance', icon: 'fa-faucet-drip', desc: { ar: 'صيانة وإصلاح غسالات الأطباق', en: 'Maintenance and repair of dishwashers' } },
    ],
  },
  whyUs: {
    title: { ar: 'لماذا تختار مجموعة التميمي؟', en: 'Why Choose Al-Tamimi Group?' },
    features: [
      { ar: 'فنيون خبراء', en: 'Expert Technicians', icon: 'fa-user-gear', desc: { ar: 'فريق متخصص ذو خبرة عالية', en: 'Highly experienced specialized team' } },
      { ar: 'خدمة منزلية سريعة', en: 'Fast Home Service', icon: 'fa-house-chimney', desc: { ar: 'نصلك أينما كنت في أسرع وقت', en: 'We reach you anywhere as fast as possible' } },
      { ar: 'قطع غيار أصلية', en: 'Original Spare Parts', icon: 'fa-certificate', desc: { ar: 'نستخدم فقط قطع الغيار الأصلية', en: 'We use only original spare parts' } },
      { ar: 'ضمان على الصيانة', en: 'Maintenance Guarantee', icon: 'fa-shield-halved', desc: { ar: 'ضمان شامل على جميع أعمال الصيانة', en: 'Comprehensive guarantee on all maintenance work' } },
    ],
  },
  beforeAfter: {
    title: { ar: 'قبل وبعد', en: 'Before & After' },
    before: { ar: 'قبل', en: 'Before' },
    after: { ar: 'بعد', en: 'After' },
    desc: { ar: 'شاهد الفرق - لوحة إلكترونية محترقة تم إصلاحها بالكامل', en: 'See the difference - a burnt electronic board fully restored' },
  },
  testimonials: {
    title: { ar: 'آراء عملائنا', en: 'What Our Clients Say' },
    items: [
      { ar: 'خدمة ممتازة! الفني وصل بسرعة وأصلح اللوحة الإلكترونية للغسالة في المنزل. أنصح بهم بشدة.', en: 'Excellent service! The technician arrived quickly and fixed the washing machine electronic board at home. Highly recommended.', name: { ar: 'أحمد محمد', en: 'Ahmed Mohammed' }, role: { ar: 'عميل منذ 2022', en: 'Client since 2022' } },
      { ar: 'أفضل شركة صيانة تعاملت معها. احترافية عالية وأسعار مناسبة. المكيف صار يبرد مثل الجديد!', en: 'The best maintenance company I dealt with. High professionalism and reasonable prices. The AC cools like new!', name: { ar: 'فاطمة العلي', en: 'Fatima Al-Ali' }, role: { ar: 'عميلة منذ 2023', en: 'Client since 2023' } },
      { ar: 'الثلاجة كانت على وشك التلف، لكن فريق التميمي أنقذها. شكراً لكم على الخدمة المتميزة.', en: 'The refrigerator was about to break down, but Al-Tamimi team saved it. Thank you for the outstanding service.', name: { ar: 'خالد العمري', en: 'Khalid Al-Omari' }, role: { ar: 'عميل منذ 2021', en: 'Client since 2021' } },
      { ar: 'سرعة في الاستجابة وجودة في العمل. صيانة الجلاية تمت في نفس اليوم. خدمة لا تُنسى!', en: 'Quick response and quality work. Dishwasher maintenance was done the same day. Unforgettable service!', name: { ar: 'نورة السعيد', en: 'Noura Al-Saeed' }, role: { ar: 'عميلة منذ 2024', en: 'Client since 2024' } },
    ],
  },
  footer: {
    title: { ar: 'تواصل معنا', en: 'Contact Us' },
    phone: { ar: 'الهاتف', en: 'Phone' },
    followUs: { ar: 'تابعنا', en: 'Follow Us' },
    location: { ar: 'موقعنا', en: 'Our Location' },
    rights: { ar: 'جميع الحقوق محفوظة © 2024 مجموعة التميمي', en: 'All Rights Reserved © 2024 Al-Tamimi Group' },
  },
};

// Navbar Component
function Navbar() {
  const { lang, toggleLang, t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#home', label: t(translations.nav.home.ar, translations.nav.home.en) },
    { href: '#about', label: t(translations.nav.about.ar, translations.nav.about.en) },
    { href: '#services', label: t(translations.nav.services.ar, translations.nav.services.en) },
    { href: '#before-after', label: t(translations.nav.beforeAfter.ar, translations.nav.beforeAfter.en) },
    { href: '#testimonials', label: t(translations.nav.testimonials.ar, translations.nav.testimonials.en) },
    { href: '#contact', label: t(translations.nav.contact.ar, translations.nav.contact.en) },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'navbar-glass shadow-lg' : 'bg-transparent'}`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
              <span className="text-dark-900 font-bold text-lg">ت</span>
            </div>
            <span className="gold-text font-bold text-xl hidden sm:block" style={{ fontFamily: lang === 'ar' ? "'Cairo', sans-serif" : "'Cinzel', serif" }}>
              {lang === 'ar' ? 'مجموعة التميمي' : 'Al-Tamimi'}
            </span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="text-gray-300 hover:text-gold-400 transition-colors duration-300 text-sm font-medium">
                {link.label}
              </a>
            ))}
          </div>

          {/* Language Toggle + Mobile Menu */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleLang}
              className="px-4 py-2 border border-gold-400/50 rounded-full text-gold-400 hover:bg-gold-400/10 transition-all duration-300 text-sm font-bold"
            >
              {lang === 'ar' ? 'EN' : 'عربي'}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden text-gold-400 text-2xl"
            >
              <i className={`fas ${mobileOpen ? 'fa-times' : 'fa-bars'}`}></i>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-dark-800/95 backdrop-blur-lg rounded-2xl mt-4 p-6 border border-gold-400/10"
            >
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block py-3 text-gray-300 hover:text-gold-400 transition-colors border-b border-dark-600 last:border-0"
                >
                  {link.label}
                </a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}

// Hero Section
function HeroSection() {
  const { t } = useLang();
  
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&q=80"
          alt="Electronic circuits background"
          className="w-full h-full object-cover"
        />
        <div className="hero-overlay absolute inset-0"></div>
      </div>

      {/* Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDuration: `${5 + Math.random() * 10}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 gold-text" style={{ fontFamily: "'Cinzel', 'Cairo', serif" }}>
            {t(translations.hero.title.ar, translations.hero.title.en)}
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed"
        >
          {t(translations.hero.subtitle.ar, translations.hero.subtitle.en)}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <a
            href="https://wa.me/962790555876"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold inline-block text-lg"
          >
            {t(translations.hero.cta.ar, translations.hero.cta.en)}
          </a>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-gold-400/50 rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-3 bg-gold-400 rounded-full mt-2"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// About Section
function AboutSection() {
  const { t } = useLang();

  return (
    <section id="about" className="py-24 px-4 bg-dark-900 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-dark-800/50 to-transparent pointer-events-none"></div>
      <div className="max-w-6xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold gold-text mb-4" style={{ fontFamily: "'Cinzel', 'Cairo', serif" }}>
            {t(translations.about.title.ar, translations.about.title.en)}
          </h2>
          <div className="section-divider mt-4"></div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <p className="text-gray-300 text-lg leading-relaxed">
              {t(translations.about.text1.ar, translations.about.text1.en)}
            </p>
            <p className="text-gray-400 text-base leading-relaxed">
              {t(translations.about.text2.ar, translations.about.text2.en)}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-dark-700/50 border border-gold-400/20 rounded-2xl p-8 gold-glow-hover transition-all duration-500"
          >
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-gold-400/20 to-gold-600/10 border border-gold-400/30 flex items-center justify-center">
                <i className="fas fa-house-chimney text-gold-400 text-3xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-gold-400 mb-3">
                {t(translations.about.highlight.ar, translations.about.highlight.en)}
              </h3>
              <p className="text-gray-300 text-lg">
                {t(translations.about.highlightDesc.ar, translations.about.highlightDesc.en)}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Services Section
function ServicesSection() {
  const { t, lang } = useLang();
  const services = translations.services.items;

  return (
    <section id="services" className="py-24 px-4 bg-dark-800 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold gold-text mb-4" style={{ fontFamily: "'Cinzel', 'Cairo', serif" }}>
            {t(translations.services.title.ar, translations.services.title.en)}
          </h2>
          <div className="section-divider mt-4"></div>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.article
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card-hover bg-dark-700/50 border border-gold-400/10 rounded-2xl p-8 text-center group cursor-pointer"
            >
              <div className="service-icon mx-auto mb-6">
                <i className={`fas ${service.icon} text-gold-400 text-2xl`}></i>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-gold-400 transition-colors">
                {lang === 'ar' ? service.ar : service.en}
              </h3>
              <p className="text-gray-400 text-sm">
                {lang === 'ar' ? service.desc.ar : service.desc.en}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

// Why Choose Us Section
function WhyUsSection() {
  const { t, lang } = useLang();
  const features = translations.whyUs.features;

  return (
    <section className="py-24 px-4 bg-dark-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold-400/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold-400/5 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold gold-text mb-4" style={{ fontFamily: "'Cinzel', 'Cairo', serif" }}>
            {t(translations.whyUs.title.ar, translations.whyUs.title.en)}
          </h2>
          <div className="section-divider mt-4"></div>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="text-center group"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-gold-400/20 to-gold-600/5 border border-gold-400/20 flex items-center justify-center group-hover:border-gold-400/50 group-hover:scale-110 transition-all duration-300">
                <i className={`fas ${feature.icon} text-gold-400 text-2xl`}></i>
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-gold-400 transition-colors">
                {lang === 'ar' ? feature.ar : feature.en}
              </h3>
              <p className="text-gray-400 text-sm">
                {lang === 'ar' ? feature.desc.ar : feature.desc.en}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Before & After Section
function BeforeAfterSection() {
  const { t } = useLang();
  const sliderRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const isDragging = useRef(false);

  const handleMove = (clientX: number) => {
    if (!sliderRef.current || !isDragging.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPosition(percent);
  };

  const handleMouseDown = () => { isDragging.current = true; };
  const handleMouseUp = () => { isDragging.current = false; };
  const handleMouseMove = (e: React.MouseEvent) => handleMove(e.clientX);
  const handleTouchMove = (e: React.TouchEvent) => handleMove(e.touches[0].clientX);

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    return () => document.removeEventListener('mouseup', handleMouseUp);
  }, []);

  return (
    <section id="before-after" className="py-24 px-4 bg-dark-800">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold gold-text mb-4" style={{ fontFamily: "'Cinzel', 'Cairo', serif" }}>
            {t(translations.beforeAfter.title.ar, translations.beforeAfter.title.en)}
          </h2>
          <div className="section-divider mt-4"></div>
          <p className="text-gray-400 mt-6 text-lg">
            {t(translations.beforeAfter.desc.ar, translations.beforeAfter.desc.en)}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="comparison-slider rounded-2xl overflow-hidden border border-gold-400/20 gold-glow"
          ref={sliderRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onTouchStart={handleMouseDown}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
        >
          {/* Before Image (full width background) */}
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <img
              src="https://images.unsplash.com/photo-1588508065123-287b28e013da?w=1200&q=80"
              alt="Before - Damaged electronic board"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 bg-red-600/90 text-white px-4 py-2 rounded-lg font-bold text-sm backdrop-blur-sm">
              {t(translations.beforeAfter.before.ar, translations.beforeAfter.before.en)}
            </div>
          </div>

          {/* After Image (clipped) */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
          >
            <img
              src="https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=1200&q=80"
              alt="After - Repaired electronic board"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 bg-green-600/90 text-white px-4 py-2 rounded-lg font-bold text-sm backdrop-blur-sm">
              {t(translations.beforeAfter.after.ar, translations.beforeAfter.after.en)}
            </div>
          </div>

          {/* Slider Handle */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-gold-400 to-gold-600 cursor-ew-resize z-10"
            style={{ left: `${position}%` }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center shadow-lg">
              <i className="fas fa-arrows-left-right text-dark-900 text-sm"></i>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Testimonials Section
function TestimonialsSection() {
  const { t, lang } = useLang();
  const [active, setActive] = useState(0);
  const testimonials = translations.testimonials.items;

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <section id="testimonials" className="py-24 px-4 bg-dark-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-dark-800/30 to-dark-900 pointer-events-none"></div>
      
      <div className="max-w-4xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold gold-text mb-4" style={{ fontFamily: "'Cinzel', 'Cairo', serif" }}>
            {t(translations.testimonials.title.ar, translations.testimonials.title.en)}
          </h2>
          <div className="section-divider mt-4"></div>
        </motion.div>

        <div className="relative min-h-[250px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="bg-dark-700/50 border border-gold-400/10 rounded-2xl p-8 md:p-12 text-center"
            >
              <div className="text-gold-400 text-4xl mb-6">
                <i className="fas fa-quote-right"></i>
              </div>
              <p className="text-gray-200 text-lg md:text-xl leading-relaxed mb-8">
                {lang === 'ar' ? testimonials[active].ar : testimonials[active].en}
              </p>
              <div>
                <p className="text-gold-400 font-bold text-lg">
                  {lang === 'ar' ? testimonials[active].name.ar : testimonials[active].name.en}
                </p>
                <p className="text-gray-400 text-sm">
                  {lang === 'ar' ? testimonials[active].role.ar : testimonials[active].role.en}
                </p>
              </div>
              {/* Stars */}
              <div className="flex justify-center gap-1 mt-4">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className="fas fa-star text-gold-400 text-sm"></i>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-3 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setActive(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === active ? 'bg-gold-400 w-8' : 'bg-dark-400 hover:bg-gold-400/50'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// Footer Section
function FooterSection() {
  const { t } = useLang();

  return (
    <footer id="contact" className="py-20 px-4 bg-dark-800 border-t border-gold-400/10">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold gold-text mb-4" style={{ fontFamily: "'Cinzel', 'Cairo', serif" }}>
            {t(translations.footer.title.ar, translations.footer.title.en)}
          </h2>
          <div className="section-divider mt-4"></div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Phone */}
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gold-400/10 border border-gold-400/20 flex items-center justify-center">
              <i className="fas fa-phone text-gold-400 text-xl"></i>
            </div>
            <h3 className="text-white font-bold mb-2">{t(translations.footer.phone.ar, translations.footer.phone.en)}</h3>
            <a href="tel:0790555876" className="text-gold-400 text-xl font-bold hover:text-gold-300 transition-colors" dir="ltr">
              0790555876
            </a>
          </div>

          {/* Social Media */}
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gold-400/10 border border-gold-400/20 flex items-center justify-center">
              <i className="fas fa-share-nodes text-gold-400 text-xl"></i>
            </div>
            <h3 className="text-white font-bold mb-4">{t(translations.footer.followUs.ar, translations.footer.followUs.en)}</h3>
            <div className="flex justify-center gap-4">
              <a
                href="https://www.facebook.com/AltamimiGroup1/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-dark-600 border border-gold-400/20 flex items-center justify-center text-gold-400 hover:bg-gold-400/20 hover:border-gold-400/50 transition-all duration-300"
              >
                <i className="fab fa-facebook-f text-lg"></i>
              </a>
              <a
                href="#"
                className="w-12 h-12 rounded-full bg-dark-600 border border-gold-400/20 flex items-center justify-center text-gold-400 hover:bg-gold-400/20 hover:border-gold-400/50 transition-all duration-300"
              >
                <i className="fab fa-instagram text-lg"></i>
              </a>
              <a
                href="https://wa.me/962790555876"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-dark-600 border border-gold-400/20 flex items-center justify-center text-gold-400 hover:bg-gold-400/20 hover:border-gold-400/50 transition-all duration-300"
              >
                <i className="fab fa-whatsapp text-lg"></i>
              </a>
            </div>
          </div>

          {/* Location */}
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gold-400/10 border border-gold-400/20 flex items-center justify-center">
              <i className="fas fa-location-dot text-gold-400 text-xl"></i>
            </div>
            <h3 className="text-white font-bold mb-2">{t(translations.footer.location.ar, translations.footer.location.en)}</h3>
          </div>
        </div>

        {/* Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl overflow-hidden border border-gold-400/10 mb-12"
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3324.0!2d35.9!3d31.95!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzHCsDU3JzAwLjAiTiAzNcKwNTQnMDAuMCJF!5e0!3m2!1sar!2sjo!4v1"
            width="100%"
            height="300"
            style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(0.8) contrast(1.2)' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Al-Tamimi Group Location"
          ></iframe>
        </motion.div>

        {/* Copyright */}
        <div className="text-center border-t border-dark-600 pt-8">
          <p className="text-gray-400 text-sm">
            {t(translations.footer.rights.ar, translations.footer.rights.en)}
          </p>
        </div>
      </div>
    </footer>
  );
}

// Floating Contact Buttons
function FloatingButtons() {
  const { lang } = useLang();
  const positionClass = lang === 'ar' ? 'right-6' : 'left-6';
  
  return (
    <div className={`fixed bottom-6 z-50 flex flex-col gap-4 ${positionClass}`}>
      {/* WhatsApp */}
      <a
        href="https://wa.me/962790555876"
        target="_blank"
        rel="noopener noreferrer"
        className="floating-btn relative w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-400 transition-colors duration-300"
        aria-label="WhatsApp"
      >
        <i className="fab fa-whatsapp text-white text-2xl"></i>
      </a>

      {/* Phone */}
      <a
        href="tel:0790555876"
        className="floating-btn relative w-14 h-14 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center shadow-lg hover:from-gold-300 hover:to-gold-500 transition-all duration-300"
        aria-label="Call Us"
        style={{ animationDelay: '0.5s' }}
      >
        <i className="fas fa-phone text-dark-900 text-xl"></i>
      </a>
    </div>
  );
}

// Main App Component
export default function App() {
  const [lang, setLang] = useState<Lang>('ar');

  const toggleLang = () => {
    setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  const t = (ar: string, en: string) => (lang === 'ar' ? ar : en);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  useEffect(() => {
    // Smooth scroll polyfill for older browsers
    document.documentElement.style.scrollBehavior = 'smooth';
  }, []);

  return (
    <LangContext.Provider value={{ lang, toggleLang, t }}>
      <div className="min-h-screen bg-dark-900 text-white overflow-x-hidden">
        <Navbar />
        <main>
          <HeroSection />
          <AboutSection />
          <ServicesSection />
          <WhyUsSection />
          <BeforeAfterSection />
          <TestimonialsSection />
        </main>
        <FooterSection />
        <FloatingButtons />
      </div>
    </LangContext.Provider>
  );
}
