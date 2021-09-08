import {
  useEffect,
  useRef,
  useState,
} from 'react';

export function useSticky<RefType extends HTMLElement = HTMLElement>(bufferTop = 0, smoothing = 0) {
  const stickyRef = useRef<RefType | null>(null);
  const [sticky, setSticky] = useState(false);

  useEffect(() => {
    const eventsToBind = [
      [document, 'scroll'],
      [window, 'resize'],
      [window, 'orientationchange'],
    ] as const;

    const observe = () => {
      if (stickyRef.current) {
        const computedTop = getComputedStyle(stickyRef.current).top;
        if (computedTop === 'auto') {
          console.warn('A sticky ref element should not be statically positioned');
        }
        const refPageOffset = stickyRef.current.getBoundingClientRect().top - (sticky ? smoothing : 0);
        const stickyOffset = parseInt(computedTop, 10) - (bufferTop + smoothing) - (sticky ? 0 : smoothing);
        const stickyActive = refPageOffset <= stickyOffset;

        if (stickyActive && !sticky) {
          setSticky(true);
        } else if (!stickyActive && sticky) {
          setSticky(false);
        }
      }
    };
    observe();

    eventsToBind.forEach(eventPair => {
      eventPair[0].addEventListener(eventPair[1], observe);
    });

    return () => {
      eventsToBind.forEach(eventPair => {
        eventPair[0].removeEventListener(eventPair[1], observe);
      });
    };
  }, [stickyRef, sticky, smoothing, bufferTop]);

  return [stickyRef, sticky] as const;
}
