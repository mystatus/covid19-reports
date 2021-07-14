import {
  useCallback,
  useState,
} from 'react';

export default function useInitialLoading() {
  const [initialLoadStep, setInitialLoadStep] = useState(0);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  const incrementInitialLoadStep = useCallback((isFinalStep = false) => {
    setInitialLoadStep(initialLoadStep + 1);
    if (isFinalStep) {
      setInitialLoadComplete(true);
    }
  }, [initialLoadStep]);

  return [initialLoadStep, incrementInitialLoadStep, initialLoadComplete] as const;
}
