import { useEffect, useState } from 'react';

/**
 * Hook to detect which section is currently in viewport
 * Used for highlighting active navigation on homepage while scrolling
 */
export function useActiveSection() {
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    // Create intersection observer for all sections
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the section that is most visible in viewport
        let maxVisibilityRatio = 0;
        let visibleSection = '';

        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > maxVisibilityRatio) {
            maxVisibilityRatio = entry.intersectionRatio;
            visibleSection = entry.target.id;
          }
        });

        if (visibleSection) {
          setActiveSection(visibleSection);
        }
      },
      {
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    // Observe all sections with ids
    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  return activeSection;
}
