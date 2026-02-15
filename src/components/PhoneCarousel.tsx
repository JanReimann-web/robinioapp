"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Slide = {
  id: string;
  label: string;
  accent: string;
  glow: string;
  videoSrc?: string;
};

type PhoneCarouselProps = {
  videoTitles?: string[];
};

const slides: Slide[] = [
  {
    id: "overview",
    label: "Homescreen",
    accent: "from-emerald-500/35 via-emerald-600/15 to-transparent",
    glow: "bg-emerald-400/30",
    videoSrc: "/MBvideo1.mp4",
  },
  {
    id: "insights",
    label: "Transaction entry",
    accent: "from-teal-400/30 via-emerald-500/20 to-transparent",
    glow: "bg-teal-400/30",
    videoSrc: "/MBvideo2.mp4",
  },
  {
    id: "goals",
    label: "Settings",
    accent: "from-green-400/30 via-emerald-500/20 to-transparent",
    glow: "bg-green-400/30",
    videoSrc: "/MBvideo3.mp4",
  },
];

export default function PhoneCarousel({ videoTitles }: PhoneCarouselProps) {
  const [index, setIndex] = useState(0);
  const [startX, setStartX] = useState<number | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);

  const titles = useMemo(
    () => (videoTitles?.length === slides.length ? videoTitles : slides.map((slide) => slide.label)),
    [videoTitles]
  );

  const translate = useMemo(
    () => `translateX(-${index * 100}%)`,
    [index]
  );

  const goPrev = () =>
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);
  const goNext = () => setIndex((prev) => (prev + 1) % slides.length);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const updateDesktopState = () => setIsDesktop(mediaQuery.matches);
    updateDesktopState();
    mediaQuery.addEventListener("change", updateDesktopState);
    return () => mediaQuery.removeEventListener("change", updateDesktopState);
  }, []);

  useEffect(() => {
    videoRefs.current.forEach((video, videoIndex) => {
      if (!video) return;
      if (videoIndex === index) {
        video.currentTime = 0;
        void video.play().catch(() => undefined);
        return;
      }
      video.pause();
      video.currentTime = 0;
    });
  }, [index, isDesktop]);

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    setStartX(event.touches[0]?.clientX ?? null);
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (startX === null) return;
    const endX = event.changedTouches[0]?.clientX ?? startX;
    const delta = endX - startX;
    if (Math.abs(delta) > 40) {
      if (delta > 0) {
        goPrev();
      } else {
        goNext();
      }
    }
    setStartX(null);
  };

  const handleVideoEnded = (slideIndex: number) => {
    if (!isDesktop || slideIndex !== index) return;
    goNext();
  };

  return (
    <div className="relative mx-auto w-full max-w-sm lg:max-w-md">
      <div className="absolute -left-10 top-8 h-32 w-32 rounded-full bg-emerald-400/20 blur-3xl" />
      <div className="absolute -right-12 bottom-6 h-32 w-32 rounded-full bg-teal-400/20 blur-3xl" />
      <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100/80">
        {titles[index] ?? slides[index]?.label}
      </p>

      <div
        className="relative overflow-hidden touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-700 ease-out"
          style={{ transform: translate }}
        >
          {slides.map((slide, slideIndex) => (
            <div key={slide.id} className="w-full flex-shrink-0 px-3">
              <div className="relative mx-auto w-full max-w-[320px] animate-phone-float">
                <div
                  className={`absolute -right-10 -top-8 h-24 w-24 rounded-full ${slide.glow} blur-3xl animate-phone-glow`}
                />
                <div className="relative overflow-hidden rounded-[44px] border border-white/15 bg-slate-950/90 shadow-2xl shadow-emerald-950/50">
                  <div className="absolute left-1/2 top-3 h-1.5 w-14 -translate-x-1/2 rounded-full bg-white/30" />
                  <div className="absolute left-1/2 top-6 h-1.5 w-10 -translate-x-1/2 rounded-full bg-white/20" />
                  <div className="p-3">
                    <div className="relative aspect-[9/19.5] overflow-hidden rounded-[36px] bg-slate-950">
                      {slide.videoSrc && (
                        <video
                          ref={(element) => {
                            videoRefs.current[slideIndex] = element;
                          }}
                          className="absolute inset-0 h-full w-full object-cover"
                          src={slide.videoSrc}
                          autoPlay={slideIndex === index}
                          loop={!isDesktop}
                          muted
                          playsInline
                          preload="metadata"
                          onEnded={() => handleVideoEnded(slideIndex)}
                        />
                      )}
                      {!slide.videoSrc && (
                        <>
                          <div
                            className={`absolute inset-0 bg-gradient-to-br ${slide.accent}`}
                          />
                          <div className="absolute inset-0">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),_transparent_60%)]" />
                          </div>
                        </>
                      )}
                      {!slide.videoSrc && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white/80">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-white/10">
                            <div className="ml-1 h-0 w-0 border-y-[7px] border-l-[12px] border-y-transparent border-l-white/70" />
                          </div>
                          <span className="mt-3 text-xs uppercase tracking-[0.3em] text-white/60">
                            9:16
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="pointer-events-none absolute inset-0 rounded-[44px] ring-1 ring-white/10" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-2">
        {slides.map((slide, slideIndex) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => setIndex(slideIndex)}
            aria-label={`Go to ${titles[slideIndex] ?? slide.label}`}
            className={`h-2.5 w-2.5 rounded-full transition ${
              slideIndex === index
                ? "bg-white"
                : "bg-white/30 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
      <p className="sr-only">{titles[index] ?? slides[index]?.label}</p>
    </div>
  );
}
