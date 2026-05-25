import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import SectionHeader from '@/components/SectionHeader';
import { useLanguage } from '@/contexts/LanguageContext';
import { TR } from '@/lib/translations';

gsap.registerPlugin(ScrollTrigger);

const testimonialData = [
  {
    quote: 'ห้องออกแบบมาเรียบง่ายแต่รู้สึกสงบมาก อากาศถ่ายเทดี ตื่นมาทุกเช้าแล้วรู้สึกผ่อนคลาย',
    name: 'คุณมินตา',
    detail: 'ผู้อยู่อาศัย · ห้อง 08',
  },
  {
    quote: 'Exactly what I was looking for — quiet, clean, and surprisingly close to everything. The north–south airflow keeps the room naturally cool.',
    name: 'Priya S.',
    detail: 'Resident · Room 14',
  },
  {
    quote: 'ชอบความเป็นส่วนตัว ไม่มีลิฟต์แต่กลับรู้สึกเหมือนบ้านมากกว่า Big C อยู่ใกล้มากสะดวกมาก',
    name: 'คุณวรรณ',
    detail: 'ผู้อยู่อาศัย · ห้อง 03',
  },
];

const TestimonialsSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { lang } = useLanguage();
  const tm = TR.testimonials;

  useGSAP(
    () => {
      if (!sectionRef.current) return;
      if (window.matchMedia('(max-width: 767px)').matches) return;

      const header = sectionRef.current.querySelector('.tm-header');
      gsap.from(header, {
        y: 20,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: header as Element,
          start: 'top 82%',
          toggleActions: 'play none none reverse',
        },
      });

      const cards = sectionRef.current.querySelectorAll('.tm-card');
      gsap.from(cards, {
        y: 28,
        opacity: 0,
        duration: 0.65,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: cards[0] as Element,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="frosted-section backdrop-blur-xl section-padding"
    >
      <div className="container-main">
        <div className="tm-header">
          <SectionHeader
            label={tm.sectionLabel[lang]}
            headline={tm.sectionHeadline[lang].split('\n').join('\n')}
            dark
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {testimonialData.map(({ quote, name, detail }) => (
            <div
              key={name}
              className="tm-card flex flex-col justify-between p-7 rounded-xl border sec-border bg-pure-white/50 backdrop-blur-sm"
            >
              <div className="font-serif text-[56px] leading-none sec-text-60 mb-3 -mt-2 select-none" aria-hidden="true">
                &ldquo;
              </div>
              <p className="font-sans text-[15px] font-light leading-relaxed sec-text-80 flex-1">{quote}</p>
              <div className="mt-6 pt-5 border-t sec-border">
                <p className="font-sans text-sm font-medium sec-text">{name}</p>
                <p className="font-sans text-xs sec-text-60 mt-0.5">{detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
