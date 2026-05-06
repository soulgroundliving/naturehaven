import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import {
  KeyIcon,
  CarIcon,
  LeafIcon,
  WashingIcon,
  WifiIcon,
  SparkleIcon,
  SnowflakeIcon,
  ShieldIcon,
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

gsap.registerPlugin(ScrollTrigger);

type SimpleIcon = React.FC<{ size?: number; className?: string }>;

const features: { Icon: SimpleIcon; label: string; sub: string }[] = [
  { Icon: KeyIcon,      label: 'Digital door lock',   sub: 'Unit & building' },
  { Icon: ShieldIcon,   label: 'CCTV security',        sub: '24/7 monitoring' },
  { Icon: CarIcon,      label: 'Parking',              sub: '1 space per unit' },
  { Icon: LeafIcon,     label: 'Pocket garden',        sub: 'Communal & quiet' },
  { Icon: WashingIcon,  label: 'Laundry & drying',     sub: 'On-site facility' },
  { Icon: WifiIcon,     label: 'Free Wi-Fi',           sub: 'AIS Fiber' },
  { Icon: SparkleIcon,  label: 'Cleaning service',     sub: 'Every 6 months' },
  { Icon: SnowflakeIcon,label: 'A/C cleaning',         sub: 'Yearly' },
];

const sustainable = [
  {
    num: '01',
    title: 'Solar energy integration',
    body: "Rooftop solar offsets common-area power, reducing the building's footprint year-round.",
  },
  {
    num: '02',
    title: 'Energy-conscious design',
    body: 'Cross-ventilation, blackout curtains and inverter cooling — designed to use less from day one.',
  },
  {
    num: '03',
    title: 'Long-term material durability',
    body: 'Selected for how they age — quietly, without losing their character.',
  },
];

const PhoneTile: React.FC<{
  Icon: LucideIcon | SimpleIcon;
  title: string;
  sub: string;
  accent?: boolean;
}> = ({ Icon, title, sub, accent = false }) => (
  <div
    className={`rounded-lg p-3 aspect-[1.4] flex flex-col justify-between border ${
      accent
        ? 'bg-sage-green/30 border-transparent'
        : 'bg-pure-white border-dark-charcoal/12'
    }`}
  >
    <Icon
      size={18}
      className={accent ? 'text-sage-green' : 'text-dark-charcoal/60'}
    />
    <div>
      <div className="text-[11px] font-medium text-dark-charcoal leading-tight">
        {title}
      </div>
      <div className="text-[9px] text-dark-charcoal/55 mt-0.5 leading-tight">
        {sub}
      </div>
    </div>
  </div>
);

const SmartLivingSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

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
          toggleActions: 'play none none none',
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
            toggleActions: 'play none none none',
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
          toggleActions: 'play none none none',
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

          {/* LEFT — Quietly Connected */}
          <div>
            <p className="sl-left-anim section-label sec-text-60 mb-4 tracking-[0.2em]">
              Quietly Connected
            </p>
            <h2 className="sl-left-anim font-serif text-3xl md:text-4xl lg:text-[44px] sec-text leading-[1.1] mb-5">
              Managed simply,<br />
              through one<br />
              application.
            </h2>
            <p className="sl-left-anim font-sans text-[15px] font-light sec-text-70 leading-relaxed mb-8 max-w-md">
              Smart Living gathers everything you might ever need — bookings,
              payments, maintenance, even the air around you — into a single
              quiet surface.
            </p>

            {/* Feature list */}
            <div className="sl-left-anim grid grid-cols-2 gap-x-5 gap-y-5">
              {features.map(({ Icon, label, sub }) => (
                <div key={label} className="flex items-start gap-2.5">
                  <Icon
                    size={20}
                    className="text-[#71b99e] flex-shrink-0 mt-[2px]"
                  />
                  <div>
                    <p className="font-sans text-[15px] font-normal sec-text-90 leading-snug">
                      {label}
                    </p>
                    <p className="font-sans text-[13px] sec-text-60 leading-snug mt-0.5">
                      {sub}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CENTER — Phone mockup */}
          <div className="sl-phone-anim flex justify-center order-first lg:order-none">
            <div
              className="relative w-full max-w-[300px] bg-near-black rounded-[36px] p-3"
              style={{
                aspectRatio: '9 / 19',
                boxShadow:
                  '0 24px 48px rgba(31,27,22,0.22), inset 0 0 0 2px rgba(255,255,255,0.06)',
              }}
            >
              <div className="absolute top-[18px] left-1/2 -translate-x-1/2 w-24 h-[22px] bg-near-black rounded-xl z-10" />
              <div className="w-full h-full bg-[#F5F2EE] rounded-[26px] overflow-hidden flex flex-col">
                <div className="px-5 pt-4 pb-1 flex justify-between text-[11px] text-dark-charcoal font-medium">
                  <span>9:41</span>
                  <span>● ● ●</span>
                </div>
                <div className="px-5 pt-5 pb-4 flex justify-between items-center border-b border-dark-charcoal/10">
                  <div>
                    <span className="block text-[9px] text-dark-charcoal/45 uppercase tracking-[0.35em] mb-1">
                      NATURE HAVEN
                    </span>
                    <span className="font-serif text-[18px] font-light leading-tight">
                      Good morning.
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-soft-taupe/50 border border-dark-charcoal/10" />
                </div>
                <div className="mx-5 mt-4 mb-4 px-3.5 py-2.5 bg-pure-white rounded-full flex gap-2 items-center text-[11px] text-dark-charcoal/40 shadow-sm">
                  <Search size={13} />
                  <span>Search the residence…</span>
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

          {/* RIGHT — Sustainable by Intention */}
          <div>
            <p className="sl-right-anim section-label sec-text-60 mb-4 tracking-[0.2em]">
              Sustainable by Intention
            </p>
            <h3 className="sl-right-anim font-serif text-3xl md:text-4xl lg:text-[40px] sec-text leading-[1.1] mb-2">
              Built to last —<br />
              not to impress.
            </h3>
            <ul className="mt-8 flex flex-col">
              {sustainable.map(({ num, title, body }) => (
                <li
                  key={num}
                  className="sl-right-anim py-6 border-t sec-border last:border-b flex gap-5 items-start"
                >
                  <span className="font-serif text-[22px] font-light text-sage-green/70 min-w-[36px] leading-none pt-1">
                    {num}
                  </span>
                  <div>
                    <h4 className="font-sans text-[15px] font-medium sec-text-90 mb-1.5">
                      {title}
                    </h4>
                    <p className="font-sans text-sm sec-text-70 leading-relaxed">
                      {body}
                    </p>
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
