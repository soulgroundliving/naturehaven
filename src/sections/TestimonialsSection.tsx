import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import SectionHeader from '@/components/SectionHeader';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    quote:
      'ห้องออกแบบมาเรียบง่ายแต่รู้สึกสงบมาก อากาศถ่ายเทดี ตื่นมาทุกเช้าแล้วรู้สึกผ่อนคลาย',
    name: 'คุณมินตา',
    detail: 'ผู้อยู่อาศัย · ห้อง 08',
  },
  {
    quote:
      'Exactly what I was looking for — quiet, clean, and surprisingly close to everything. The north–south airflow keeps the room naturally cool.',
    name: 'Priya S.',
    detail: 'Resident · Room 14',
  },
  {
    quote:
      'ชอบความเป็นส่วนตัว ไม่มีลิฟต์แต่กลับรู้สึกเหมือนบ้านมากกว่า Big C อยู่ใกล้มากสะดวกมาก',
    name: 'คุณวรรณ',
    detail: 'ผู้อยู่อาศัย · ห้อง 03',
  },
];

const TestimonialsSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      const header = sectionRef.current.querySelector('.tm-header');
      gsap.from(header, {
        y: 20,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: header as Element,
          start: 'top 82%',
          toggleActions: 'play none none none',
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
          toggleActions: 'play none none none',
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
            label="Residents"
            headline="Life inside Nature Haven."
            dark
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map(({ quote, name, detail }) => (
            <div
              key={name}
              className="tm-card flex flex-col justify-between p-7 rounded-xl border sec-border bg-pure-white/50 backdrop-blur-sm"
            >
              {/* Decorative open-quote */}
              <div
                className="font-serif text-[56px] leading-none sec-text-60 mb-3 -mt-2 select-none"
                aria-hidden="true"
              >
                "
              </div>

              <p className="font-sans text-[15px] font-light leading-relaxed sec-text-80 flex-1">
                {quote}
              </p>

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
