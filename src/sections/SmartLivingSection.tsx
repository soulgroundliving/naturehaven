import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import {
  KeyIcon,
  ShieldIcon,
  WifiIcon,
  LeafIcon,
} from '@/components/icons';
import {
  Search,
  CalendarCheck,
  Receipt,
  Wrench,
  PawPrint,
  Home as HomeIcon,
  Calendar,
  MessageCircle,
  User,
  type LucideIcon,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { TR } from '@/lib/translations';

gsap.registerPlugin(ScrollTrigger);

type SimpleIcon = React.FC<{ size?: number; className?: string }>;

const FEATURE_ICONS: SimpleIcon[] = [KeyIcon, ShieldIcon, WifiIcon];
const APP_FEATURE_ICONS: LucideIcon[] = [CalendarCheck, Receipt, Wrench, PawPrint];

const PhoneTile: React.FC<{
  Icon: LucideIcon | SimpleIcon;
  title: string;
  sub: string;
  accent?: boolean;
}> = ({ Icon, title, sub, accent = false }) => (
  <div
    className={`rounded-lg p-3 aspect-[1.4] flex flex-col justify-between border ${
      accent ? 'bg-sage-green/30 border-transparent' : 'bg-pure-white border-dark-charcoal/12'
    }`}
  >
    <Icon size={18} className={accent ? 'text-sage-green' : 'text-dark-charcoal/60'} />
    <div>
      <div className="text-[11px] font-medium text-dark-charcoal leading-tight">{title}</div>
      <div className="text-[9px] text-dark-charcoal/55 mt-0.5 leading-tight">{sub}</div>
    </div>
  </div>
);

const SmartLivingSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { lang } = useLanguage();
  const sl = TR.smart;
  const features = sl.features[lang];
  const appFeatures = sl.appFeatures[lang];
  const sustainable = sl.sustainable[lang];

  useGSAP(
    () => {
      if (!sectionRef.current) return;
      if (window.matchMedia('(max-width: 767px)').matches) return;

      const left = sectionRef.current.querySelectorAll('.sl-left-anim');
      gsap.from(left, {
        x: -20,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: left[0] as Element,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });

      const phone = sectionRef.current.querySelector('.sl-phone-anim');
      if (phone) {
        gsap.from(phone, {
          y: 30,
          opacity: 0,
          scale: 0.97,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: phone as Element,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        });
      }

      const right = sectionRef.current.querySelectorAll('.sl-right-anim');
      gsap.from(right, {
        x: 20,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        delay: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: right[0] as Element,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="smart-living"
      className="section-padding frosted-section backdrop-blur-xl"
    >
      <div className="container-main">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.9fr_1fr] gap-8 lg:gap-16 items-start">

          {/* LEFT */}
          <div>
            <p className="sl-left-anim section-label sec-text-60 mb-4 tracking-[0.2em]">
              {sl.leftLabel[lang]}
            </p>
            <h2 className="sl-left-anim font-serif text-2xl md:text-4xl lg:text-[44px] sec-text leading-[1.15] mb-5">
              {sl.leftHeadline[lang].split('\n').map((line, i, arr) => (
                <React.Fragment key={i}>{line}{i < arr.length - 1 && <br />}</React.Fragment>
              ))}
            </h2>
            <p className="sl-left-anim font-sans text-[15px] font-light sec-text-70 leading-relaxed mb-8 max-w-md">
              {sl.leftBody[lang]}
            </p>

            <div className="sl-left-anim flex flex-col gap-5">
              {features.map(({ label, sub }, i) => {
                const Icon = FEATURE_ICONS[i];
                return (
                  <div key={i} className="flex items-start gap-2.5">
                    <Icon size={20} className="sec-text-80 flex-shrink-0 mt-[2px]" />
                    <div>
                      <p className="font-sans text-[15px] font-normal sec-text-90 leading-snug">{label}</p>
                      <p className="font-sans text-[13px] sec-text-60 leading-snug mt-0.5">{sub}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="sl-left-anim mt-7 pt-6 border-t sec-border">
              <p className="font-sans text-[10px] sec-text-60 uppercase tracking-[0.2em] mb-4">
                {lang === 'th' ? 'ฟีเจอร์ในแอป' : 'In the app'}
              </p>
              <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                {appFeatures.map(({ label, sub }, i) => {
                  const Icon = APP_FEATURE_ICONS[i];
                  return (
                    <div key={i} className="flex items-start gap-2">
                      <Icon size={13} className="sec-text-60 flex-shrink-0 mt-[2px]" />
                      <div>
                        <p className="font-sans text-[15px] font-medium sec-text-80 leading-snug">{label}</p>
                        <p className="font-sans text-[13px] sec-text-60 leading-snug mt-0.5">{sub}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* CENTER — Phone mockup (static). On mobile it sits AFTER the copy
              (context first) and is capped smaller so it doesn't eat the whole
              first screen. */}
          <div className="sl-phone-anim flex justify-center">
            {/* Fixed display box reserves the on-screen footprint; the phone is
                authored once at its natural 300px width (where all six tiles +
                the nav bar fit) and uniformly scaled down to fill the box — so
                the content never clips and stays perfectly proportioned at every
                breakpoint. Replaces the old max-h cap, which shrank the frame
                but not its fixed-size content, clipping the bottom rows. */}
            <div className="relative w-[200px] h-[422px] sm:w-[260px] sm:h-[549px] lg:w-[300px] lg:h-[633px]">
            <div
              className="absolute top-0 left-0 origin-top-left scale-[0.6667] sm:scale-[0.8667] lg:scale-100 w-[300px] h-[633px] bg-near-black rounded-[36px] p-3"
              style={{
                boxShadow: '0 24px 48px rgba(31,27,22,0.22), inset 0 0 0 2px rgba(255,255,255,0.06)',
              }}
            >
              <div className="absolute top-[18px] left-1/2 -translate-x-1/2 w-24 h-[22px] bg-near-black rounded-xl z-10" />
              <div className="w-full h-full bg-[#F5F2EE] rounded-[26px] overflow-hidden flex flex-col">
                <div className="px-5 pt-4 pb-1 flex justify-between text-[11px] text-dark-charcoal font-medium">
                  <span>9:41</span><span>● ● ●</span>
                </div>
                <div className="px-5 pt-5 pb-4 flex justify-between items-center border-b border-dark-charcoal/10">
                  <div>
                    <span className="block text-[9px] text-dark-charcoal/45 uppercase tracking-[0.35em] mb-1">NATURE HAVEN</span>
                    <span className="font-serif text-[18px] font-light leading-tight">Good morning.</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-soft-taupe/50 border border-dark-charcoal/10" />
                </div>
                <div className="mx-5 mt-4 mb-4 px-3.5 py-2.5 bg-pure-white rounded-full flex gap-2 items-center text-[11px] text-dark-charcoal/40 shadow-sm">
                  <Search size={13} /><span>Search the residence…</span>
                </div>
                <div className="px-5 grid grid-cols-2 gap-2">
                  <PhoneTile Icon={CalendarCheck} title="Booking"     sub="Common spaces"   accent />
                  <PhoneTile Icon={Receipt}       title="Payments"    sub="Auto · LINE Pay" />
                  <PhoneTile Icon={KeyIcon}       title="My Door"     sub="Open · Lock" />
                  <PhoneTile Icon={Wrench}        title="Maintenance" sub="Request anytime" />
                  <PhoneTile Icon={PawPrint}      title="Pet"         sub="Vaccinations" />
                  <PhoneTile Icon={LeafIcon}      title="Air Quality" sub="PM2.5 · 18" />
                </div>
                <div className="mt-auto px-5 py-3.5 border-t border-dark-charcoal/10 flex justify-around items-center">
                  <HomeIcon      size={17} className="text-sage-green" />
                  <Calendar      size={17} className="text-dark-charcoal/35" />
                  <MessageCircle size={17} className="text-dark-charcoal/35" />
                  <User          size={17} className="text-dark-charcoal/35" />
                </div>
              </div>
            </div>
            </div>
          </div>

          {/* RIGHT — Sustainability */}
          <div>
            <p className="sl-right-anim section-label sec-text-60 mb-4 tracking-[0.2em]">
              {sl.rightLabel[lang]}
            </p>
            <h3 className="sl-right-anim font-serif text-2xl md:text-4xl lg:text-[40px] sec-text leading-[1.15] mb-2">
              {sl.rightHeadline[lang].split('\n').map((line, i, arr) => (
                <React.Fragment key={i}>{line}{i < arr.length - 1 && <br />}</React.Fragment>
              ))}
            </h3>
            <ul className="mt-8 flex flex-col">
              {sustainable.map(({ title, body }, i) => (
                <li
                  key={i}
                  className="sl-right-anim py-6 border-t sec-border last:border-b flex gap-5 items-start"
                >
                  <span className="font-serif text-[22px] font-light sec-text-60 min-w-[36px] leading-none pt-1">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h4 className="font-sans text-[15px] font-medium sec-text-90 mb-1.5">{title}</h4>
                    <p className="font-sans text-sm sec-text-70 leading-relaxed">{body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
};

export default SmartLivingSection;
