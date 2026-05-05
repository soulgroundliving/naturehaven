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
          threshold: 0.3,
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