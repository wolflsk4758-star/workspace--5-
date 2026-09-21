import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from './assets/{D8F3214C-C6C4-4197-B704-6F20E78DCA08}.png';

// ===== LANGUAGE CONTEXT =====
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

// ===== TRANSLATIONS =====
const translations = {
  nav: {
    home: { ar: 'الرئيسية', en: 'Home' },
    about: { ar: 'من نحن', en: 'About Us' },
    services: { ar: 'خدماتنا', en: 'Services' },
    beforeAfter: { ar: 'قبل وبعد', en: 'Before & After' },
    gallery: { ar: 'معرض أعمالنا', en: 'Our Work' },
    testimonials: { ar: 'آراء العملاء', en: 'Testimonials' },
    contact: { ar: 'تواصل معنا', en: 'Contact' },
  },
  hero: {
    title: { ar: 'مجموعة التميمي | Al-Tamimi Group', en: 'Al-Tamimi Group | مجموعة التميمي' },
    subtitle: { ar: 'خبراء صيانة اللوحات الإلكترونية والأجهزة المنزلية', en: 'Experts in Electronic Boards & Home Appliances Maintenance' },
    cta: { ar: 'احجز موعدك للصيانة المنزلية الآن', en: 'Book Your Home Service Now' },
  },
  about: {
    title: { ar: 'من نحن', en: 'About Us' },
    text1: { ar: 'مجموعة التميمي الرائدة في مجال صيانة اللوحات الإلكترونية والأجهزة المنزلية. نمتلك خبرة طويلة وواسعة في تشخيص وإصلاح جميع أنواع الأعطال باستخدام أحدث التقنيات.', en: 'Al-Tamimi Group is a pioneer in the maintenance of electronic boards and home appliances. We have extensive experience in diagnosing and repairing all types of faults using the latest technologies.' },
    text2: { ar: 'فنيونا المتخصصون لديهم خبرة طويلة في المجال، ويأتون إليك أينما كنت. نقدم خدمة التصليح المنزلي حيث نصلك إلى باب بيتك، نحدد العطل بدقة، ونعالجه فوراً بأعلى معايير الجودة.', en: 'Our specialized technicians have long experience in the field and come to you wherever you are. We offer home repair service where we reach your doorstep, accurately diagnose the fault, and fix it immediately with the highest quality standards.' },
    highlight: { ar: 'خدمة التصليح المنزلي', en: 'Home Repair Service' },
    highlightDesc: { ar: 'نصلك إلى باب بيتك، نحدد العطل بدقة، ونعالجه فوراً بأعلى معايير الجودة', en: 'We come to your doorstep, accurately diagnose the fault, and fix it immediately with the highest quality standards' },
  },
  services: {
    title: { ar: 'خدماتنا', en: 'Our Services' },
    items: [
      {
        ar: 'صيانة اللوحات الإلكترونية', en: 'Electronic Boards Maintenance', icon: 'fa-microchip',
        desc: { ar: 'صيانة وبرمجة جميع أنواع اللوحات الإلكترونية', en: 'Maintenance and programming of all electronic boards' },
        subServices: {
          ar: ['فحص شامل للوحة الإلكترونية', 'إصلاح المسارات المحترقة', 'استبدال المكثفات والمقاومات', 'برمجة اللوحات الذكية', 'إصلاح مصادر التغذية', 'تشخيص أعطال المستشعرات'],
          en: ['Comprehensive board inspection', 'Repair of burnt traces', 'Capacitor and resistor replacement', 'Smart board programming', 'Power supply repair', 'Sensor fault diagnosis']
        }
      },
      {
        ar: 'صيانة المكيفات', en: 'Air Conditioners Maintenance', icon: 'fa-snowflake',
        desc: { ar: 'صيانة شاملة لأنظمة التكييف والتبريد', en: 'Comprehensive AC and cooling systems maintenance' },
        subServices: {
          ar: ['تنظيف الفلاتر والمبادلات', 'تعبئة غاز التبريد', 'إصلاح الضاغط (الكومبروسر)', 'صيانة اللوحة الإلكترونية', 'فحص وتسليك مواسير الصرف', 'معالجة تسريب الغاز'],
          en: ['Filter and heat exchanger cleaning', 'Refrigerant gas refilling', 'Compressor repair', 'Electronic board maintenance', 'Drain pipe inspection and cleaning', 'Gas leak treatment']
        }
      },
      {
        ar: 'صيانة الثلاجات', en: 'Refrigerators Maintenance', icon: 'fa-temperature-low',
        desc: { ar: 'صيانة وإصلاح الثلاجات المنزلية والتجارية', en: 'Maintenance of household and commercial refrigerators' },
        subServices: {
          ar: ['صيانة المبرد', 'إصلاح الإضاءة الداخلية', 'صيانة نظام التبريد', 'تعبئة غاز', 'صيانة اللوحة الإلكترونية للثلاجة', 'إصلاح الثرموستات'],
          en: ['Cooler maintenance', 'Internal lighting repair', 'Cooling system maintenance', 'Gas refilling', 'Refrigerator electronic board maintenance', 'Thermostat repair']
        }
      },
      {
        ar: 'صيانة الغسالات', en: 'Washing Machines Maintenance', icon: 'fa-shirt',
        desc: { ar: 'إصلاح وصيانة جميع أنواع الغسالات', en: 'Repair and maintenance of all washing machines' },
        subServices: {
          ar: ['إصلاح محرك الغسالة', 'صيانة لوحة التحكم الإلكترونية', 'استبدال حشوات الباب', 'تصليك خراطيم المياه', 'إصلاح نظام الطرد المركزي', 'معالجة مشاكل التصريف'],
          en: ['Washing machine motor repair', 'Electronic control board maintenance', 'Door gasket replacement', 'Water hose cleaning', 'Spin system repair', 'Drainage problem treatment']
        }
      },
      {
        ar: 'صيانة النشافات', en: 'Dryers Maintenance', icon: 'fa-wind',
        desc: { ar: 'صيانة وإصلاح جميع أنواع النشافات', en: 'Maintenance and repair of all dryers' },
        subServices: {
          ar: ['إصلاح عنصر التسخين', 'صيانة المحرك والمروحة', 'تنظيف فتحات التهوية', 'استبدال حزام النقل', 'صيانة لوحة التحكم', 'معالجة مشاكل عدم التجفيف'],
          en: ['Heating element repair', 'Motor and fan maintenance', 'Vent cleaning', 'Belt replacement', 'Control board maintenance', 'Drying problem treatment']
        }
      },
      {
        ar: 'صيانة الجلايات', en: 'Dishwashers Maintenance', icon: 'fa-faucet-drip',
        desc: { ar: 'صيانة وإصلاح غسالات الأطباق', en: 'Maintenance and repair of dishwashers' },
        subServices: {
          ar: ['إصلاح مضخة الماء', 'صيانة لوحة التحكم', 'تسليك خراطيم الصرف', 'حل مشاكل التسريب', 'استبدال الرشاشات', 'إصلاح نظام التسخين'],
          en: ['Water pump repair', 'Control board maintenance', 'Drain hose cleaning', 'Leak problem solutions', 'Spray arm replacement', 'Heating system repair']
        }
      },
    ],
  },
  whyUs: {
    title: { ar: 'لماذا تختار مجموعة التميمي؟', en: 'Why Choose Al-Tamimi Group?' },
    features: [
      { ar: 'فنيون خبراء', en: 'Expert Technicians', icon: 'fa-user-gear', desc: { ar: 'فريق مختص ذو خبرة عالية يمكن الاعتماد عليهم في جميع أنواع الأعطال والمشاكل.', en: 'A specialized team with high expertise that can be relied upon for all types of faults and problems.' } },
      { ar: 'خدمة منزلية سريعة', en: 'Fast Home Service', icon: 'fa-house-chimney', desc: { ar: 'نصلك أينما كنت في أسرع وقت في جميع أنحاء المملكة، خدمة 24 ساعة.', en: 'We reach you anywhere as fast as possible throughout the kingdom, 24-hour service.' } },
      { ar: 'قطع غيار أصلية', en: 'Original Spare Parts', icon: 'fa-certificate', desc: { ar: 'نستخدم فقط قطع الغيار الأصلية والمعتمدة لضمان أطول عمر لجهازك.', en: 'We use only original and approved spare parts to ensure the longest life for your appliance.' } },
      { ar: 'ضمان على الصيانة', en: 'Maintenance Guarantee', icon: 'fa-shield-halved', desc: { ar: 'ضمان شامل على جميع أنواع الصيانة وجميع أنواع الأعطال التي نقوم بإصلاحها.', en: 'Comprehensive guarantee on all types of maintenance and all types of faults we repair.' } },
    ],
  },
  beforeAfter: {
    title: { ar: 'قبل وبعد', en: 'Before & After' },
    before: { ar: 'قبل', en: 'Before' },
    after: { ar: 'بعد', en: 'After' },
    desc: { ar: 'اسحب المؤشر لمشاهدة الفرق - نتائج حقيقية من ورشتنا', en: 'Drag the slider to see the difference - real results from our workshop' },
    slides: [
      { title: { ar: 'لوحة إلكترونية - غسالة', en: 'Electronic Board - Washing Machine' } },
      { title: { ar: 'لوحة مكيف سبليت', en: 'Split AC Board' } },
    ],
  },
  gallery: {
    title: { ar: 'معرض أعمالنا', en: 'Our Work' },
    desc: { ar: 'لمحة عن فريقنا وورش العمل والمشاريع', en: 'A glimpse of our team, workshops, and projects' },
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

// ===== IMAGES =====
const beforeAfterImages = [
  {
    before: 'https://image.qwenlm.ai/generated-images/1e8ad0df-4e42-4078-bad5-0838ce0f6127/_result.png',
    after: 'https://image.qwenlm.ai/generated-images/7dcde22f-9ca4-4542-bbbe-c8f3fb98aba3/_result.png',
  },
  {
    before: 'https://image.qwenlm.ai/generated-images/1908606b-ca17-49f0-8382-e034e81135a0/_result.png',
    after: 'https://image.qwenlm.ai/generated-images/9e975e25-e5c8-4a70-b759-24085f551224/_result.png',
  },
];

const galleryImages = [
  'https://image.qwenlm.ai/generated-images/1594d750-1229-4c32-b259-3424ccca4076/_result.png',
  'https://image.qwenlm.ai/generated-images/19e5aee1-792b-43c3-b924-7b248f408973/_result.png',
  'https://image.qwenlm.ai/generated-images/82e5aff1-a614-4c8a-8be3-6def6dd59e4d/_result.png',
  'https://image.qwenlm.ai/generated-images/b1d8c6ad-2ad3-43c5-87cd-2cd6ea48371b/_result.png',
  'https://image.qwenlm.ai/generated-images/5396eed7-617b-4353-a930-8417a4c7ad27/_result.png',
  'https://image.qwenlm.ai/generated-images/7f28f249-9487-4966-a0a8-2391531ad315/_result.png',
];

// ===== NAVBAR =====
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
    { href: '#gallery', label: t(translations.nav.gallery.ar, translations.nav.gallery.en) },
    { href: '#testimonials', label: t(translations.nav.testimonials.ar, translations.nav.testimonials.en) },
    { href: '#contact', label: t(translations.nav.contact.ar, translations.nav.contact.en) },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'navbar-glass shadow-lg' : 'bg-transparent'}`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <a href="#home" className="flex items-center gap-3">
            <img src={logo} alt="Al-Tamimi Logo" className="w-12 h-12 object-contain" />
            <span className="gold-text font-bold text-xl hidden sm:block" style={{ fontFamily: lang === 'ar' ? "'Cairo', sans-serif" : "'Cinzel', serif" }}>
              {lang === 'ar' ? 'مجموعة التميمي' : 'Al-Tamimi'}
            </span>
          </a>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="text-gray-300 hover:text-gold-400 transition-colors duration-300 text-sm font-medium">
                {link.label}
              </a>
            ))}
          </div>

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

// ===== HERO SECTION =====
function HeroSection() {
  const { t } = useLang();

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&q=80"
          alt="Electronic circuits background"
          className="w-full h-full object-cover"
        />
        <div className="hero-overlay absolute inset-0"></div>
      </div>

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

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="brand-title text-4xl sm:text-5xl md:text-7xl font-bold mb-6 cursor-pointer inline-block" style={{ fontFamily: "'Cinzel', 'Cairo', serif" }}>
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

// ===== ABOUT SECTION =====
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

// ===== SERVICE MODAL =====
function ServiceModal({ service, onClose }: { service: typeof translations.services.items[0] | null; onClose: () => void }) {
  const { lang } = useLang();
  
  if (!service) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 modal-overlay"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.95 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative bg-dark-800 border border-gold-400/20 rounded-3xl p-8 md:p-10 max-w-lg w-full max-h-[80vh] overflow-y-auto modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-dark-600 border border-gold-400/20 flex items-center justify-center text-gold-400 hover:bg-gold-400/20 transition-all"
        >
          <i className="fas fa-times"></i>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="service-icon mx-auto mb-4">
            <i className={`fas ${service.icon} text-gold-400 text-2xl`}></i>
          </div>
          <h3 className="text-2xl font-bold text-gold-400">
            {lang === 'ar' ? service.ar : service.en}
          </h3>
          <p className="text-gray-400 mt-2">
            {lang === 'ar' ? service.desc.ar : service.desc.en}
          </p>
        </div>

        {/* Sub-services */}
        <div className="space-y-3">
          <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <i className="fas fa-list-check text-gold-400"></i>
            {lang === 'ar' ? 'الخدمات الفرعية:' : 'Sub-services:'}
          </h4>
          {(lang === 'ar' ? service.subServices.ar : service.subServices.en).map((sub, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: lang === 'ar' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-dark-700/50 border border-gold-400/10 hover:border-gold-400/30 transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-gold-400/10 flex items-center justify-center flex-shrink-0">
                <i className="fas fa-check text-gold-400 text-xs"></i>
              </div>
              <span className="text-gray-200">{sub}</span>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <a
            href="https://wa.me/962790555876"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold inline-block"
          >
            {lang === 'ar' ? 'احجز الخدمة الآن' : 'Book This Service Now'}
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ===== SERVICES SECTION =====
function ServicesSection() {
  const { lang } = useLang();
  const services = translations.services.items;
  const [selectedService, setSelectedService] = useState<typeof translations.services.items[0] | null>(null);

  return (
    <section id="services" className="py-24 px-4 bg-dark-800 relative services-cursor">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold gold-text mb-4" style={{ fontFamily: "'Cinzel', 'Cairo', serif" }}>
            {lang === 'ar' ? translations.services.title.ar : translations.services.title.en}
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
              onClick={() => setSelectedService(service)}
              className="card-hover bg-dark-700/50 border border-gold-400/10 rounded-2xl p-8 text-center group cursor-pointer"
            >
              <div className="service-icon mx-auto mb-6">
                <i className={`fas ${service.icon} text-gold-400 text-2xl`}></i>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-gold-400 transition-colors">
                {lang === 'ar' ? service.ar : service.en}
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                {lang === 'ar' ? service.desc.ar : service.desc.en}
              </p>
              <span className="text-gold-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {lang === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                <i className={`fas ${lang === 'ar' ? 'fa-arrow-left' : 'fa-arrow-right'} text-xs`}></i>
              </span>
            </motion.article>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedService && (
          <ServiceModal service={selectedService} onClose={() => setSelectedService(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}

// ===== WHY US SECTION =====
function WhyUsSection() {
  const { lang } = useLang();
  const features = translations.whyUs.features;

  return (
    <section className="py-24 px-4 bg-dark-900 relative overflow-hidden">
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
            {lang === 'ar' ? translations.whyUs.title.ar : translations.whyUs.title.en}
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
              <h3 className="text-lg font-bold text-white mb-3 group-hover:text-gold-400 transition-colors">
                {lang === 'ar' ? feature.ar : feature.en}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {lang === 'ar' ? feature.desc.ar : feature.desc.en}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ===== SINGLE COMPARISON SLIDER =====
function ComparisonSlider({ beforeImg, afterImg, beforeLabel, afterLabel }: { beforeImg: string; afterImg: string; beforeLabel: string; afterLabel: string }) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const isDragging = useRef(false);

  const handleMove = useCallback((clientX: number) => {
    if (!sliderRef.current || !isDragging.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setPosition(percent);
  }, []);

  const handleMouseDown = () => { isDragging.current = true; };
  const handleMouseUp = () => { isDragging.current = false; };
  const handleMouseMove = (e: React.MouseEvent) => handleMove(e.clientX);
  const handleTouchMove = (e: React.TouchEvent) => handleMove(e.touches[0].clientX);

  useEffect(() => {
    const handleUp = () => { isDragging.current = false; };
    document.addEventListener('mouseup', handleUp);
    return () => document.removeEventListener('mouseup', handleUp);
  }, []);

  return (
    <div
      className="comparison-slider rounded-2xl overflow-hidden border border-gold-400/20 gold-glow relative"
      ref={sliderRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onTouchStart={handleMouseDown}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
    >
      <div className="relative w-full" style={{ paddingBottom: '60%' }}>
        <img src={beforeImg} alt={beforeLabel} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute top-4 left-4 bg-red-600/90 text-white px-4 py-2 rounded-lg font-bold text-sm backdrop-blur-sm">
          {beforeLabel}
        </div>
      </div>

      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <img src={afterImg} alt={afterLabel} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute top-4 right-4 bg-green-600/90 text-white px-4 py-2 rounded-lg font-bold text-sm backdrop-blur-sm">
          {afterLabel}
        </div>
      </div>

      <div
        className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-gold-400 to-gold-600 cursor-ew-resize z-10"
        style={{ left: `${position}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center shadow-lg">
          <i className="fas fa-arrows-left-right text-dark-900 text-sm"></i>
        </div>
      </div>
    </div>
  );
}
// ===== BEFORE & AFTER CAROUSEL =====
function BeforeAfterSection() {
  const { lang } = useLang();
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % beforeAfterImages.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + beforeAfterImages.length) % beforeAfterImages.length);

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
            {lang === 'ar' ? translations.beforeAfter.title.ar : translations.beforeAfter.title.en}
          </h2>
          <div className="section-divider mt-4"></div>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            {lang === 'ar' ? translations.beforeAfter.desc.ar : translations.beforeAfter.desc.en}
          </p>
        </motion.div>

        <div className="relative">
          <div className="overflow-hidden rounded-2xl relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
              >
                <ComparisonSlider
                  beforeImg={beforeAfterImages[currentSlide].before}
                  afterImg={beforeAfterImages[currentSlide].after}
                  beforeLabel={lang === 'ar' ? translations.beforeAfter.before.ar : translations.beforeAfter.before.en}
                  afterLabel={lang === 'ar' ? translations.beforeAfter.after.ar : translations.beforeAfter.after.en}
                />
                <div className="text-center mt-6">
                  <h3 className="text-xl font-bold text-white">
                    {lang === 'ar' ? translations.beforeAfter.slides[currentSlide].title.ar : translations.beforeAfter.slides[currentSlide].title.en}
                  </h3>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Slider Controls */}
          <button onClick={prevSlide} className="absolute top-1/2 -left-4 sm:-left-12 -translate-y-1/2 w-10 h-10 rounded-full bg-dark-700 border border-gold-400/20 text-gold-400 hover:bg-gold-400/20 flex items-center justify-center transition-all z-10">
            <i className={`fas ${lang === 'ar' ? 'fa-chevron-right' : 'fa-chevron-left'}`}></i>
          </button>
          <button onClick={nextSlide} className="absolute top-1/2 -right-4 sm:-right-12 -translate-y-1/2 w-10 h-10 rounded-full bg-dark-700 border border-gold-400/20 text-gold-400 hover:bg-gold-400/20 flex items-center justify-center transition-all z-10">
            <i className={`fas ${lang === 'ar' ? 'fa-chevron-left' : 'fa-chevron-right'}`}></i>
          </button>
        </div>
      </div>
    </section>
  );
}

// ===== GALLERY SECTION =====
function GallerySection() {
  const { lang } = useLang();
  
  return (
    <section id="gallery" className="py-24 px-4 bg-dark-900 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold gold-text mb-4" style={{ fontFamily: "'Cinzel', 'Cairo', serif" }}>
            {lang === 'ar' ? translations.gallery.title.ar : translations.gallery.title.en}
          </h2>
          <p className="text-gray-400 mt-4">{lang === 'ar' ? translations.gallery.desc.ar : translations.gallery.desc.en}</p>
          <div className="section-divider mt-4"></div>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {galleryImages.map((img, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="relative group overflow-hidden rounded-xl aspect-square"
            >
              <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-dark-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <i className="fas fa-search-plus text-gold-400 text-3xl"></i>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ===== TESTIMONIALS SECTION =====
function TestimonialsSection() {
  const { lang } = useLang();
  
  return (
    <section id="testimonials" className="py-24 px-4 bg-dark-800 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold gold-text mb-4" style={{ fontFamily: "'Cinzel', 'Cairo', serif" }}>
            {lang === 'ar' ? translations.testimonials.title.ar : translations.testimonials.title.en}
          </h2>
          <div className="section-divider mt-4"></div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {translations.testimonials.items.map((testimonial, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              className="bg-dark-700/30 border border-gold-400/10 p-8 rounded-2xl relative"
            >
              <i className="fas fa-quote-right absolute top-6 right-8 text-4xl text-gold-400/10"></i>
              <div className="flex text-gold-400 mb-4 text-sm">
                {[...Array(5)].map((_, i) => <i key={i} className="fas fa-star"></i>)}
              </div>
              <p className="text-gray-300 mb-6 italic leading-relaxed">"{lang === 'ar' ? testimonial.ar : testimonial.en}"</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-dark-600 border border-gold-400/20 flex items-center justify-center">
                  <i className="fas fa-user text-gold-400"></i>
                </div>
                <div>
                  <h4 className="text-white font-bold">{lang === 'ar' ? testimonial.name.ar : testimonial.name.en}</h4>
                  <span className="text-gray-500 text-sm">{lang === 'ar' ? testimonial.role.ar : testimonial.role.en}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ===== FOOTER =====
function Footer() {
  const { lang } = useLang();
  
  return (
    <footer id="contact" className="bg-dark-950 border-t border-gold-400/10 pt-16 pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <img src={logo} alt="Al-Tamimi Logo" className="w-12 h-12 object-contain" />
              <span className="gold-text font-bold text-xl" style={{ fontFamily: lang === 'ar' ? "'Cairo', sans-serif" : "'Cinzel', serif" }}>
                {lang === 'ar' ? 'مجموعة التميمي' : 'Al-Tamimi'}
              </span>
            </div>
            <p className="text-gray-400 leading-relaxed mb-6">
              {lang === 'ar' ? translations.hero.subtitle.ar : translations.hero.subtitle.en}
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-6 border-b border-gold-400/20 pb-2 inline-block">
              {lang === 'ar' ? translations.footer.title.ar : translations.footer.title.en}
            </h3>
            <ul className="space-y-4">
              <li>
                <a href="tel:+962790555876" className="flex items-center gap-3 text-gray-400 hover:text-gold-400 transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-dark-800 flex items-center justify-center group-hover:bg-gold-400/10">
                    <i className="fas fa-phone"></i>
                  </div>
                  <span dir="ltr">+962 79 055 5876</span>
                </a>
              </li>
              <li>
                <div className="flex items-center gap-3 text-gray-400">
                  <div className="w-10 h-10 rounded-full bg-dark-800 flex items-center justify-center">
                    <i className="fas fa-location-dot text-gold-400"></i>
                  </div>
                  <span>{lang === 'ar' ? 'الأردن - عمان' : 'Amman - Jordan'}</span>
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-6 border-b border-gold-400/20 pb-2 inline-block">
              {lang === 'ar' ? translations.footer.followUs.ar : translations.footer.followUs.en}
            </h3>
            <div className="flex gap-4">
              <a href="#" className="w-12 h-12 rounded-full bg-dark-800 border border-gold-400/20 flex items-center justify-center text-gray-400 hover:text-gold-400 hover:bg-gold-400/10 transition-all hover:-translate-y-1">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="w-12 h-12 rounded-full bg-dark-800 border border-gold-400/20 flex items-center justify-center text-gray-400 hover:text-gold-400 hover:bg-gold-400/10 transition-all hover:-translate-y-1">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://wa.me/962790555876" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-dark-800 border border-gold-400/20 flex items-center justify-center text-gray-400 hover:text-green-500 hover:bg-green-500/10 transition-all hover:-translate-y-1">
                <i className="fab fa-whatsapp"></i>
              </a>
            </div>
          </div>
        </div>

        <div className="text-center pt-8 border-t border-dark-800">
          <p className="text-gray-500 text-sm">
            {lang === 'ar' ? translations.footer.rights.ar : translations.footer.rights.en}
          </p>
        </div>
      </div>
    </footer>
  );
}

// ===== MAIN APP COMPONENT =====
export default function App() {
  const [lang, setLang] = useState<Lang>('ar');

  const toggleLang = () => {
    setLang(prev => {
      const newLang = prev === 'ar' ? 'en' : 'ar';
      document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = newLang;
      return newLang;
    });
  };

  const t = (ar: string, en: string) => lang === 'ar' ? ar : en;

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <LangContext.Provider value={{ lang, toggleLang, t }}>
      <div className="min-h-screen bg-dark-900 text-gray-100 font-sans" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        <Navbar />
        <main>
          <HeroSection />
          <AboutSection />
          <ServicesSection />
          <WhyUsSection />
          <BeforeAfterSection />
          <GallerySection />
          <TestimonialsSection />
        </main>
        <Footer />
        
        {/* WhatsApp Float Button */}
        <a
          href="https://wa.me/962790555876"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 left-6 z-50 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center text-white text-3xl shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:scale-110 hover:shadow-[0_0_30px_rgba(34,197,94,0.6)] transition-all duration-300"
        >
          <i className="fab fa-whatsapp"></i>
        </a>
      </div>
    </LangContext.Provider>
  );
}