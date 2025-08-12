import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type CSSProperties,
  memo,
} from 'react';

type EqualityFn<T> = (a: T, b: T) => boolean;

interface AnimatedValueProps<T> {
  value: T;
  className?: string;
  fadeOutMs?: number;
  fadeInMs?: number;
  easeClassOut?: string; // e.g. 'ease-out'
  easeClassIn?: string; // e.g. 'ease-out'
  ariaLive?: 'off' | 'polite' | 'assertive';
  render?: (value: T) => ReactNode;
  isEqual?: EqualityFn<T>;
  animateInitial?: boolean; // whether to animate on first render
  variant?: 'fade' | 'fadeScaleBlur';
  timingFunction?: string; // CSS timing function like cubic-bezier
}

type Phase = 'idle' | 'fading-out' | 'fading-in';

export const AnimatedValue = memo(function AnimatedValue<T>({
  value,
  className = '',
  fadeOutMs = 220,
  fadeInMs = 320,
  easeClassOut = 'ease-out',
  easeClassIn = 'ease-out',
  ariaLive = 'off',
  render,
  isEqual,
  animateInitial = true,
  variant = 'fade',
  timingFunction,
}: AnimatedValueProps<T>) {
  const compare: EqualityFn<T> = isEqual || Object.is;
  const [displayValue, setDisplayValue] = useState<T>(value);
  const [phase, setPhase] = useState<Phase>('idle');
  const targetRef = useRef<T>(value);
  const timeoutsRef = useRef<number[]>([]);
  const initializedRef = useRef<boolean>(false);

  // Clear any outstanding timers on unmount
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach((id) => window.clearTimeout(id));
      timeoutsRef.current = [];
    };
  }, []);

  // Animate when the external value changes
  useEffect(() => {
    // Skip animation on the very first value if animateInitial is false
    if (!initializedRef.current) {
      initializedRef.current = true;
      if (!animateInitial) {
        setDisplayValue(value);
        targetRef.current = value;
        setPhase('idle');
        return;
      }
    }

    if (compare(displayValue, value)) {
      targetRef.current = value;
      return;
    }

    // Set the new target and begin fade-out if not already
    targetRef.current = value;

    // If we are currently fading-in, restart the cycle to keep transitions clean
    timeoutsRef.current.forEach((id) => window.clearTimeout(id));
    timeoutsRef.current = [];

    setPhase('fading-out');
    const outId = window.setTimeout(() => {
      setDisplayValue(targetRef.current);
      setPhase('fading-in');
      const inId = window.setTimeout(() => {
        setPhase('idle');
      }, fadeInMs);
      timeoutsRef.current.push(inId);
    }, fadeOutMs);
    timeoutsRef.current.push(outId);
  }, [value]);

  const opacityClass = phase === 'fading-out' ? 'opacity-0' : 'opacity-100';
  const transitionClass = 'transition-opacity will-change-[opacity]';
  const durationMs =
    phase === 'fading-out' ? fadeOutMs : phase === 'fading-in' ? fadeInMs : 0;
  const easeClass = phase === 'fading-out' ? easeClassOut : easeClassIn;
  const transformStyle =
    variant === 'fadeScaleBlur'
      ? {
          transform: phase === 'fading-out' ? 'scale(0.985)' : 'scale(1)',
          filter: phase === 'fading-out' ? 'blur(2px)' : 'blur(0px)',
        }
      : {};

  return (
    <span
      aria-live={ariaLive}
      className={[
        transitionClass,
        easeClass,
        opacityClass,
        'will-change-[opacity,transform,filter]',
        className,
      ].join(' ')}
      style={{
        transitionDuration: `${durationMs}ms`,
        transitionProperty: 'opacity, transform, filter',
        transitionTimingFunction: timingFunction,
        ...(transformStyle as CSSProperties),
      }}
    >
      {render ? render(displayValue) : (displayValue as unknown as ReactNode)}
    </span>
  );
});

// Remove unused default export
