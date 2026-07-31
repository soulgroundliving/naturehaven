import React from 'react';
import { Link } from 'react-router-dom';
import JournalShell from '@/components/JournalShell';
import usePageMeta from '@/hooks/usePageMeta';
import { PROPERTY } from '@/data/propertyFacts';
import { useLanguage } from '@/contexts/LanguageContext';

// This site's OWN privacy policy — scoped to what naturehaven-living.vercel.app
// itself does (nothing that identifies a visitor). It used to be that the
// cookie banner + footer linked straight to the tenant app's privacy.html,
// which documents an entirely different data set (KYC docs, CCTV, meter
// readings, gamification, marketplace chat, etc.) that a website visitor
// never triggers just by browsing this site. That page is real and still
// governs the tenant app + booking flow — this page links out to it
// (PROPERTY.tenantAppPrivacyUrl) for the moment someone leaves via LINE.
const PrivacyPage: React.FC = () => {
  const { lang } = useLanguage();

  usePageMeta({
    title:
      lang === 'th'
        ? 'นโยบายความเป็นส่วนตัว — Nature Haven'
        : 'Privacy Policy — Nature Haven',
    description:
      lang === 'th'
        ? 'นโยบายความเป็นส่วนตัวของเว็บไซต์ naturehaven-living.vercel.app — เว็บไซต์นี้ไม่มีคุกกี้ติดตามและไม่มีแบบฟอร์มเก็บข้อมูลส่วนบุคคล'
        : 'Privacy policy for naturehaven-living.vercel.app — no tracking cookies, no personal-data forms.',
    canonical: `${PROPERTY.url}/privacy`,
  });

  const sections =
    lang === 'th'
      ? [
          {
            h: '1. ขอบเขตของนโยบายนี้',
            body: [
              'นโยบายฉบับนี้ครอบคลุมเฉพาะเว็บไซต์การตลาด naturehaven-living.vercel.app เท่านั้น — ไม่ใช่แอปพลิเคชันสำหรับผู้เช่า (Nature Haven Resident App) ซึ่งเป็นระบบคนละชุดที่เก็บข้อมูลคนละประเภทโดยสิ้นเชิง',
              'หากคุณเป็นผู้เช่าหรือกำลังใช้งานแอปของโครงการอยู่ นโยบายที่ใช้บังคับกับคุณคือนโยบายความเป็นส่วนตัวของแอปผู้เช่า ไม่ใช่หน้านี้ — ดูลิงก์ด้านล่าง',
            ],
          },
          {
            h: '2. ข้อมูลที่เว็บไซต์นี้จัดเก็บ',
            body: [
              'เว็บไซต์นี้ไม่มีแบบฟอร์มกรอกข้อมูลส่วนบุคคล และไม่ใช้คุกกี้ติดตาม (tracking cookie) สิ่งที่จัดเก็บไว้ในเบราว์เซอร์ของคุณมีเพียง:',
            ],
            list: [
              'nh_lang — ภาษาที่คุณเลือก (ไทย/อังกฤษ) เก็บถาวรใน localStorage',
              "nh_intro_done — สถานะว่าคุณเคยดูอินโทรของเว็บไซต์แล้ว เก็บชั่วคราวใน sessionStorage (หายเมื่อปิดแท็บ)",
              'nh_cookie_consent — ตัวเลือกที่คุณกดในแบนเนอร์แจ้งเตือนนี้เอง เก็บถาวรใน localStorage',
            ],
            after: 'ข้อมูลทั้งหมดนี้อยู่ในเบราว์เซอร์ของคุณเท่านั้น ไม่ถูกส่งขึ้นเซิร์ฟเวอร์ของเรา และไม่สามารถระบุตัวตนคุณได้',
          },
          {
            h: '3. การวิเคราะห์เว็บไซต์',
            body: [
              'เราใช้ Vercel Web Analytics ซึ่งเป็นระบบวิเคราะห์แบบไม่ใช้คุกกี้ (cookieless) เก็บเฉพาะสถิติภาพรวม เช่น หน้าที่มีผู้เข้าชมและเว็บไซต์ต้นทางที่พาคุณมา โดยไม่สร้างรหัสระบุตัวตนและไม่ติดตามคุณข้ามเว็บไซต์อื่น',
            ],
          },
          {
            h: '4. เมื่อคุณออกจากเว็บไซต์นี้ไปที่ LINE',
            body: [
              'ปุ่ม "ทักไลน์" และ "นัดชมห้องส่วนตัว" ทุกจุดพาคุณออกจากเว็บไซต์นี้ไปยัง LINE Official Account ของโครงการ',
              'ข้อมูลใด ๆ ที่คุณให้ไว้จากจุดนั้นเป็นต้นไป — เช่น ชื่อ เบอร์โทร ความสนใจจองห้อง หรือขั้นตอนทำสัญญาเช่า — อยู่ภายใต้นโยบายความเป็นส่วนตัวของแอปผู้เช่า Nature Haven ซึ่งดำเนินการโดย The Green Haven ไม่ใช่เว็บไซต์นี้',
            ],
          },
          {
            h: '5. สิทธิ์ของคุณ',
            body: [
              'เนื่องจากเว็บไซต์นี้ไม่เก็บข้อมูลที่ระบุตัวตนคุณได้ จึงไม่มีข้อมูลส่วนบุคคลให้ขอเข้าถึง แก้ไข หรือลบจากเว็บไซต์นี้โดยตรง',
              'หากต้องการล้างข้อมูลที่เก็บในเบราว์เซอร์ ให้ล้างข้อมูลเว็บไซต์ (site data) ของ naturehaven-living.vercel.app ในการตั้งค่าเบราว์เซอร์ของคุณ หากคำถามเกี่ยวข้องกับข้อมูลผู้เช่าหรือการจอง กรุณาติดต่อผ่าน LINE',
            ],
          },
          {
            h: '6. การเปลี่ยนแปลงนโยบาย',
            body: [
              'หากเว็บไซต์นี้เริ่มเก็บข้อมูลเพิ่มเติมในอนาคต (เช่น เพิ่มแบบฟอร์มติดต่อ) เราจะปรับปรุงนโยบายนี้ให้ตรงกับความเป็นจริงก่อนเริ่มใช้งานฟีเจอร์นั้น',
            ],
          },
        ]
      : [
          {
            h: '1. Scope of this policy',
            body: [
              "This policy covers only the marketing website naturehaven-living.vercel.app — not the Nature Haven Resident App, which is a separate system collecting an entirely different set of data.",
              "If you're a tenant or currently using the resident app, the policy that applies to you is the Resident App Privacy Policy, not this page — see the link below.",
            ],
          },
          {
            h: '2. What this website stores',
            body: ["This website has no data-collection forms and sets no tracking cookies. The only things stored in your browser are:"],
            list: [
              'nh_lang — your chosen language (Thai/English), kept permanently in localStorage',
              "nh_intro_done — whether you've seen the site's intro animation, kept in sessionStorage (cleared when you close the tab)",
              'nh_cookie_consent — the choice you make in this notice banner, kept permanently in localStorage',
            ],
            after: "All of this lives in your browser only — none of it is sent to our servers, and none of it identifies you.",
          },
          {
            h: '3. Website analytics',
            body: [
              'We use Vercel Web Analytics, a cookieless analytics system. It records only aggregate statistics — which pages get visited and which sites referred you — without creating an identifier or tracking you across other websites.',
            ],
          },
          {
            h: '4. When you leave this site for LINE',
            body: [
              'Every "Message us on LINE" and "Book a private viewing" button takes you off this website to the project\'s LINE Official Account.',
              "Anything you provide from that point on — your name, phone number, booking interest, or the lease process — is governed by the Nature Haven Resident App Privacy Policy, operated by The Green Haven, not by this website.",
            ],
          },
          {
            h: '5. Your rights',
            body: [
              "Because this website doesn't collect data that identifies you, there's no personal data here to request access to, correct, or delete directly.",
              'To clear what\'s stored in your browser, clear the site data for naturehaven-living.vercel.app in your browser settings. For anything related to tenant or booking data, please reach us on LINE.',
            ],
          },
          {
            h: '6. Changes to this policy',
            body: [
              "If this website starts collecting more than it does today (for example, a contact form), we'll update this policy to match before that feature goes live.",
            ],
          },
        ];

  return (
    <JournalShell>
      <article className="frosted-page backdrop-blur-xl">
        <div className="container-main py-12 md:py-16">
          <div className="mx-auto w-full max-w-[720px]">
            <Link
              to="/"
              className="font-sans text-xs uppercase tracking-[0.12em] sec-text-60 transition-opacity duration-300 hover:opacity-70"
            >
              ← {lang === 'th' ? 'กลับหน้าแรก' : 'Back home'}
            </Link>

            <h1 className="mt-6 font-serif text-[26px] leading-[1.35] sec-text md:text-4xl md:leading-[1.3]">
              {lang === 'th' ? 'นโยบายความเป็นส่วนตัว' : 'Privacy Policy'}
            </h1>
            <p className="mt-3 font-sans text-[13px] sec-text-60">
              {lang === 'th'
                ? 'สำหรับเว็บไซต์ naturehaven-living.vercel.app · มีผลบังคับใช้ 31 กรกฎาคม 2569'
                : 'For naturehaven-living.vercel.app · Effective July 31, 2026'}
            </p>

            <div className="mt-10">
              {sections.map((s, i) => (
                <div key={i} className="mb-9">
                  <h2 className="mb-3 font-sans text-xl font-medium leading-snug sec-text md:text-[22px]">
                    {s.h}
                  </h2>
                  {s.body.map((p, j) => (
                    <p key={j} className="mb-3 font-sans text-[16px] font-light leading-[1.9] sec-text-90">
                      {p}
                    </p>
                  ))}
                  {'list' in s && s.list && (
                    <ul className="mb-3 ml-5 list-disc space-y-1.5 font-sans text-[16px] font-light leading-[1.7] sec-text-90">
                      {s.list.map((li, k) => (
                        <li key={k}>{li}</li>
                      ))}
                    </ul>
                  )}
                  {'after' in s && s.after && (
                    <p className="font-sans text-[16px] font-light leading-[1.9] sec-text-90">{s.after}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </article>
    </JournalShell>
  );
};

export default PrivacyPage;
