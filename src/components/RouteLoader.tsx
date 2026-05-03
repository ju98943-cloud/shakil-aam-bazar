import { useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import logoImg from "@/assets/logo.png";

export function RouteLoader() {
  const isLoading = useRouterState({ select: (s) => s.status === "pending" || s.isLoading || s.isTransitioning });
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf: number;
    let hideTimer: number;
    if (isLoading) {
      setVisible(true);
      setProgress(15);
      const start = performance.now();
      const tick = () => {
        const elapsed = performance.now() - start;
        const next = Math.min(90, 15 + (elapsed / 1200) * 75);
        setProgress(next);
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    } else if (visible) {
      setProgress(100);
      hideTimer = window.setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 350);
    }
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(hideTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  if (!visible) return null;

  return (
    <>
      {/* Top progress bar */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-0.5 bg-transparent">
        <div
          className="h-full bg-gradient-to-r from-primary via-accent to-primary shadow-[0_0_10px_var(--primary)] transition-[width] duration-200 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      {/* Center logo pulse overlay */}
      <div className="pointer-events-none fixed inset-0 z-[99] flex items-center justify-center bg-background/40 backdrop-blur-sm animate-fade-in">
        <div className="relative flex h-20 w-20 items-center justify-center">
          <span className="absolute inset-0 animate-ping rounded-2xl bg-primary/30" />
          <span className="absolute inset-0 rounded-2xl bg-primary/10" />
          <img src={logoImg} alt="" className="relative h-14 w-14 object-contain animate-pulse" />
        </div>
      </div>
    </>
  );
}