import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { LineIcon } from '@/components/icons';

gsap.registerPlugin(ScrollTrigger);

const ContactSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      const items = sectionRef.current.querySelectorAll('.contact-animate');
      gsap.from(items, {
        y: 20,
        opacity: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });
    },
    { scope: sectionRef }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form is presentational - no backend
  };

  const inputClasses = (field: string) =>
    `w-full bg-transparent border-0 border-b font-sans text-base text-pure-white py-3 px-0 outline-none transition-colors duration-300 placeholder:text-warm-brown/50 ${
      focusedField === field || formData[field as keyof typeof formData]
        ? 'border-sage-green'
        : 'border-warm-brown/40'
    }`;

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="section-padding bg-near-black"
    >
      <div className="container-main">
        <div className="text-center mb-12">
          <p className="contact-animate section-label text-warm-brown mb-4">
            Contact
          </p>
          <h2 className="contact-animate font-serif text-4xl md:text-5xl lg:text-6xl xl:text-[80px] text-pure-white leading-[1.1]">
            Reserve your space quietly.
          </h2>
        </div>

        {/* CTA Row */}
        <div className="contact-animate text-center mb-16">
          <a
            href="https://lin.ee/ZoujovB6"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-3 bg-sage-green text-pure-white font-sans text-sm uppercase tracking-wide px-10 py-4 rounded-full overflow-hidden transition-transform duration-200 active:scale-[0.98] hover:shadow-lg"
          >
            <span className="absolute inset-0 bg-[#4a6e5d] translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-out" />
            <LineIcon className="relative z-10" size={20} />
            <span className="relative z-10">Reserve via LINE</span>
          </a>
          <p className="font-sans text-base font-light text-warm-brown mt-6">
            or fill out the form below and we&apos;ll be in touch
          </p>
        </div>

        {/* Contact Form */}
        <form
          onSubmit={handleSubmit}
          className="contact-animate max-w-[800px] mx-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 mb-8">
            <div>
              <label className="block font-sans text-xs uppercase tracking-[0.05em] text-warm-brown mb-2">
                Your Name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
                className={inputClasses('name')}
              />
            </div>
            <div>
              <label className="block font-sans text-xs uppercase tracking-[0.05em] text-warm-brown mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                className={inputClasses('email')}
              />
            </div>
            <div>
              <label className="block font-sans text-xs uppercase tracking-[0.05em] text-warm-brown mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="+66 ..."
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                onFocus={() => setFocusedField('phone')}
                onBlur={() => setFocusedField(null)}
                className={inputClasses('phone')}
              />
            </div>
            <div>
              <label className="block font-sans text-xs uppercase tracking-[0.05em] text-warm-brown mb-2">
                Message
              </label>
              <textarea
                placeholder="Tell us what you're looking for..."
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                onFocus={() => setFocusedField('message')}
                onBlur={() => setFocusedField(null)}
                rows={4}
                className={`w-full bg-transparent border rounded-lg font-sans text-base text-pure-white py-3 px-4 outline-none transition-colors duration-300 resize-none placeholder:text-warm-brown/50 ${
                  focusedField === 'message' || formData.message
                    ? 'border-sage-green'
                    : 'border-warm-brown/30'
                }`}
              />
            </div>
          </div>

          <button
            type="submit"
            className="group relative w-full md:w-auto inline-flex items-center justify-center gap-3 bg-transparent border border-pure-white text-pure-white font-sans text-sm uppercase tracking-wide px-10 py-4 rounded-full overflow-hidden transition-transform duration-200 active:scale-[0.98]"
          >
            <span className="absolute inset-0 bg-pure-white translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-out" />
            <span className="relative z-10 group-hover:text-near-black transition-colors duration-500">
              Send Inquiry
            </span>
          </button>
        </form>

        {/* Contact Details */}
        <div className="contact-animate flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 mt-16">
          <span className="font-sans text-base text-warm-brown">
            hello@naturehaven.co
          </span>
          <span className="text-warm-brown/40 hidden md:inline">•</span>
          <span className="font-sans text-base text-warm-brown">
            Available via LINE
          </span>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;