import { useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';

// Replace VIDEO_SRC with your own video file placed in /public/video/hero.mp4
// Or use a direct URL to a hosted video.
const VIDEO_SRC = 'https://videos.pexels.com/video-files/3571264/3571264-hd_1920_1080_24fps.mp4';

const letters = ['T', 'H', 'Æ', 'M', 'SPACE', 'Æ', 'T', 'E', 'R', 'N', 'U', 'M'];

const ScrollVideoHero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Drive video currentTime with scroll
  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    video.currentTime = progress * video.duration;
  });

  // Title fades out as we start scrolling
  const titleOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const titleY = useTransform(scrollYProgress, [0, 0.25], ['0%', '-8%']);

  // "Défiler" indicator fades out quickly
  const scrollHintOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  // Tagline appears mid-scroll, fades at the end
  const taglineOpacity = useTransform(scrollYProgress, [0.3, 0.5, 0.8, 1], [0, 1, 1, 0]);
  const taglineY = useTransform(scrollYProgress, [0.3, 0.5], ['20px', '0px']);

  // Overlay darkens slightly in the middle
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0.55, 0.35, 0.45, 0.7]);

  return (
    <div ref={containerRef} style={{ height: '300vh' }}>
      <div className="sticky top-0 h-screen overflow-hidden">

        {/* Video */}
        <video
          ref={videoRef}
          src={VIDEO_SRC}
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Dark overlay */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: overlayOpacity,
            background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)',
          }}
        />

        {/* Gradient top + bottom */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, rgba(5,5,5,0.6) 0%, transparent 20%, transparent 75%, rgba(5,5,5,0.8) 100%)',
          }}
        />

        {/* Brand name — visible at start */}
        <motion.div
          style={{ opacity: titleOpacity, y: titleY }}
          className="absolute inset-0 flex flex-col items-center justify-center"
        >
          <div className="flex items-baseline justify-center flex-wrap">
            {letters.map((letter, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ delay: 0.3 + i * 0.06, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="font-display leading-none"
                style={{
                  fontSize: letter === 'SPACE' ? 'clamp(1rem, 3vw, 3rem)' : 'clamp(2.8rem, 7vw, 8rem)',
                  letterSpacing: '0.05em',
                  color: 'hsl(43, 50%, 72%)',
                  textShadow: (i === 2 || i === 5)
                    ? '0 0 40px hsl(43 60% 65% / 0.8), 0 0 80px hsl(43 60% 65% / 0.3)'
                    : '0 2px 20px rgba(0,0,0,0.5)',
                  fontWeight: (i === 2 || i === 5) ? '500' : '300',
                  display: 'inline-block',
                  width: letter === 'SPACE' ? '2rem' : 'auto',
                  visibility: letter === 'SPACE' ? 'hidden' : 'visible',
                }}
              >
                {letter === 'SPACE' ? ' ' : letter}
              </motion.span>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 1 }}
            className="font-display italic mt-8"
            style={{ fontSize: 'clamp(0.85rem, 1.5vw, 1.2rem)', color: 'rgba(196,149,106,0.55)', letterSpacing: '0.05em' }}
          >
            Le souffle de l&apos;âme.
          </motion.p>
        </motion.div>

        {/* Tagline mid-scroll */}
        <motion.div
          style={{ opacity: taglineOpacity, y: taglineY }}
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
        >
          <div className="h-px w-16 mb-10" style={{ background: 'linear-gradient(to right, transparent, hsl(43,50%,54%), transparent)' }} />
          <p
            className="font-display italic text-center px-8"
            style={{ fontSize: 'clamp(1.2rem, 3vw, 2.2rem)', color: 'hsl(43,50%,72%)', letterSpacing: '0.04em', maxWidth: '700px', lineHeight: 1.6 }}
          >
            "Chaque parfum est une empreinte.<br />
            <span style={{ color: 'rgba(255,255,255,0.7)' }}>Chaque sillage, une présence.</span>"
          </p>
          <div className="h-px w-16 mt-10" style={{ background: 'linear-gradient(to right, transparent, hsl(43,50%,54%), transparent)' }} />
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          style={{ opacity: scrollHintOpacity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="font-body text-[9px] tracking-[0.3em] uppercase" style={{ color: 'rgba(196,149,106,0.5)' }}>
            Défiler
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            className="w-px h-10"
            style={{ background: 'linear-gradient(to bottom, hsl(43,50%,54%), transparent)' }}
          />
        </motion.div>

      </div>
    </div>
  );
};

export default ScrollVideoHero;
