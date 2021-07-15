import {
  DependencyList,
  EffectCallback,
  useEffect,
  useRef,
} from 'react';

export default function useEffectDebounced(effect: EffectCallback, deps?: DependencyList, delay = 500) {
  const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    clearTimeout(timeout.current!);
    timeout.current = setTimeout(effect, delay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
