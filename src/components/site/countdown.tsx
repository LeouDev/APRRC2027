"use client";

import { useEffect, useState } from "react";

function getTimeLeft(target: Date) {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export function Countdown({ targetDate }: { targetDate: string }) {
  const target = new Date(targetDate);
  const [timeLeft, setTimeLeft] = useState<ReturnType<typeof getTimeLeft>>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTimeLeft(getTimeLeft(target));
    const id = setInterval(() => setTimeLeft(getTimeLeft(target)), 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetDate]);

  if (!mounted) return <div className="h-28" aria-hidden />;

  if (!timeLeft) {
    return (
      <div className="rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 px-8 py-6 text-center text-2xl font-bold text-white shadow-lg">
        The Event Is Here
      </div>
    );
  }

  const units = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <div className="grid grid-cols-4 gap-3 sm:gap-4" role="timer" aria-live="polite">
      {units.map((u) => (
        <div
          key={u.label}
          className="flex flex-col items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-2 py-4 backdrop-blur-md sm:px-4 sm:py-6"
        >
          <span className="text-2xl font-black tabular-nums text-white sm:text-4xl">
            {String(u.value).padStart(2, "0")}
          </span>
          <span className="mt-1 text-[10px] font-medium uppercase tracking-widest text-white/70 sm:text-xs">
            {u.label}
          </span>
        </div>
      ))}
    </div>
  );
}
