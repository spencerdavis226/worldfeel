export function navigateWithViewTransition(
  to: string,
  navigate: (to: string) => void
) {
  const start = (cb: () => void) => {
    // Use View Transitions API if available; otherwise, just navigate
    // @ts-ignore
    if (document && (document as any).startViewTransition) {
      // @ts-ignore
      (document as any).startViewTransition(() => {
        cb();
      });
    } else {
      cb();
    }
  };

  start(() => navigate(to));
}
