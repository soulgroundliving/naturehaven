import { useEffect, useRef, useState } from 'react';

export function useSectionObserver(sectionIds: string[]) {
  const [activeSection, setActiveSection] = useState('');
  const observersRef = useRef<IntersectionObserver[]>([]);

  useEffect(() => {
    observersRef.current.forEach((obs) => obs.disconnect());
    observersRef.current = [];

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        const observer = new IntersectionObserver(handleIntersection, {
          // threshold:0 fires as soon as any pixel of the section enters the
          // observation zone — critical for sections taller than the viewport
          // whose intersectionRatio never reaches 0.3 (e.g. SmartLiving).
          threshold: 0,
          rootMargin: '-80px 0px -40% 0px',
        });
        observer.observe(el);
        observersRef.current.push(observer);
      }
    });

    return () => {
      observersRef.current.forEach((obs) => obs.disconnect());
    };
  }, [sectionIds]);

  return activeSection;
}

export default useSectionObserver;