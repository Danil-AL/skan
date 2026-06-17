import { useRef, useCallback } from 'react';

export const useTilt = (maxTilt = 10) => {
  const ref = useRef(null);

  const handleMouseMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;

    const tiltX = (deltaY / (rect.height / 2)) * maxTilt;
    const tiltY = (deltaX / (rect.width / 2)) * maxTilt;

    el.style.transform = `perspective(600px) rotateX(${-tiltX}deg) rotateY(${tiltY}deg) scale(1.05)`;
  }, [maxTilt]);

  const handleMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)';
    el.style.transition = 'transform 0.4s ease';
  }, []);

  return { ref, handleMouseMove, handleMouseLeave };
};
