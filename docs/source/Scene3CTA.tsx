/*
 DESIGN — QashierWise 15s, Scene 3 "CTA"
 Idea: everything the product did collapses into the brand; one clear next step.
 Palette: purple radial gradient (#8A4DFF -> #6115ED -> #3F0A9E), white type, purple-on-white CTA. Type: Inter.
 Tempo (scene-local s, VO): 0.06 "QashierWise", 1.1 "chat beres", 1.98 "jualan makin laris"; settled by 2.4, still hold to 3.2.
 Sections: Payoff (mini cards spiral into the centre, flash ring) -> Sign-off (logo pop, wordmark, Coba gratis pill, URL).
*/
import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Easing} from 'remotion';
import {useProjectFonts, ProjectFont} from '@adal/fonts';

const FONTS: ProjectFont[] = [{family: 'Inter', src: 'assets/fonts/Inter/Inter-Variable.ttf', weight: '100 900'}];

export const compositionConfig = {id: 'Scene3CTA', fps: 30, durationInFrames: 96, width: 1920, height: 1080, defaultProps: {}};

const PURPLE = '#6115ED';
const cl = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const p = (t: number, a: number, b: number, ease = Easing.out(Easing.cubic)) => interpolate(t, [a, b], [0, 1], {...cl, easing: ease});
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const hash = (n: number) => {
  const x = Math.sin(n * 91.7 + 47.3) * 43758.5453;
  return x - Math.floor(x);
};

const Logo: React.FC<{size: number; bg: string; fg: string}> = ({size, bg, fg}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{display: 'block'}}>
    <rect x="0" y="0" width="100" height="100" rx="24" fill={bg} />
    <circle cx="50" cy="47" r="23" fill="none" stroke={fg} strokeWidth="12" />
    <path d="M57 56 L73 74" stroke={fg} strokeWidth="12" strokeLinecap="round" />
  </svg>
);

export const Scene3CTA: React.FC = () => {
  useProjectFonts(FONTS);
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const sp = (start: number, damping = 12, stiffness = 170) => spring({frame: frame - Math.round(start * fps), fps, config: {damping, stiffness, mass: 0.8}});

  const grad = p(t, 0.15, 0.8);
  const logoS = sp(0.32, 9, 170);
  const up = p(t, 0.6, 1.0, Easing.inOut(Easing.cubic));
  const logoY = lerp(540, 380, up);
  const wm = p(t, 0.65, 1.05);
  const pill = sp(1.45, 11, 180);
  const url = p(t, 1.75, 2.15);
  const shine = p(t, 2.0, 2.6, Easing.inOut(Easing.quad));
  const ring = p(t, 0.4, 0.95);
  const glow = p(t, 0.35, 1.2);

  return (
    <AbsoluteFill style={{background: PURPLE, fontFamily: 'Inter', overflow: 'hidden'}}>
      <AbsoluteFill style={{opacity: grad, background: 'radial-gradient(circle at 50% 45%, #8A4DFF 0%, #6115ED 48%, #3F0A9E 100%)'}} />
      <AbsoluteFill style={{opacity: 0.5 * grad, backgroundImage: 'radial-gradient(rgba(255,255,255,0.10) 2px, transparent 2.5px)', backgroundSize: '40px 40px'}} />

      {/* mini cards spiral into the centre */}
      {Array.from({length: 12}).map((_, i) => {
        const start = i * 0.015;
        const q = p(t, start, 0.44 + start, Easing.in(Easing.cubic));
        if (q >= 1) return null;
        const a0 = (i / 12) * Math.PI * 2 + hash(i) * 0.4;
        const ang = a0 + q * 1.3;
        const R = lerp(1150, 0, q);
        const w = 150 + hash(i + 5) * 90;
        const h = w * 0.62;
        return (
          <div key={i} style={{position: 'absolute', left: 960 + Math.cos(ang) * R - w / 2, top: 540 + Math.sin(ang) * R * 0.75 - h / 2, width: w, height: h, borderRadius: 16, background: 'white', boxShadow: '0 16px 40px rgba(30,0,90,0.35)', transform: `scale(${lerp(1, 0.08, q)}) rotate(${(hash(i + 9) - 0.5) * 40 + q * 90}deg)`, padding: 16, opacity: 1 - p(q, 0.85, 1, Easing.linear)}}>
            <div style={{width: '55%', height: 12, borderRadius: 6, background: '#D9CCFF', marginBottom: 10}} />
            <div style={{width: '85%', height: 10, borderRadius: 5, background: '#ECE6FA', marginBottom: 8}} />
            <div style={{width: '70%', height: 10, borderRadius: 5, background: '#ECE6FA'}} />
          </div>
        );
      })}

      {/* flash ring */}
      <div style={{position: 'absolute', left: 960 - lerp(80, 620, ring), top: 540 - lerp(80, 620, ring), width: lerp(160, 1240, ring), height: lerp(160, 1240, ring), borderRadius: '50%', border: '8px solid white', opacity: ring > 0 && ring < 1 ? 0.6 * (1 - ring) : 0}} />

      {/* glow */}
      <div style={{position: 'absolute', left: 960 - 450, top: logoY - 450, width: 900, height: 900, borderRadius: 450, background: `radial-gradient(circle, rgba(255,255,255,${0.22 * glow}) 0%, rgba(255,255,255,0) 60%)`}} />

      {/* logo */}
      <div style={{position: 'absolute', left: 960 - 110, top: logoY - 110, width: 220, height: 220, transform: `scale(${logoS})`, filter: 'drop-shadow(0 24px 50px rgba(20,0,70,0.45))'}}>
        <Logo size={220} bg="#FFFFFF" fg={PURPLE} />
      </div>

      {/* wordmark */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 520, textAlign: 'center', fontSize: 120, fontWeight: 800, letterSpacing: -3, color: 'white', opacity: wm, transform: `translateY(${(1 - wm) * 40}px)`}}>QashierWise</div>

      {/* CTA pill */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 700, display: 'flex', justifyContent: 'center'}}>
        <div style={{position: 'relative', overflow: 'hidden', background: 'white', color: PURPLE, fontSize: 46, fontWeight: 800, padding: '22px 60px', borderRadius: 60, transform: `scale(${pill})`, boxShadow: '0 20px 50px rgba(20,0,70,0.4)', display: 'flex', alignItems: 'center', gap: 18}}>
          Coba gratis
          <svg width="40" height="40" viewBox="0 0 24 24"><path d="M5 12 H19 M13 6 L19 12 L13 18" fill="none" stroke={PURPLE} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
          <div style={{position: 'absolute', top: 0, bottom: 0, width: 120, left: lerp(-160, 520, shine), background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(196,170,255,0.55), rgba(255,255,255,0))', transform: 'skewX(-20deg)'}} />
        </div>
      </div>

      {/* URL */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 850, textAlign: 'center', fontSize: 34, fontWeight: 600, color: 'rgba(255,255,255,0.85)', opacity: url, transform: `translateY(${(1 - url) * 20}px)`, letterSpacing: 0.5}}>qashierwise.com</div>
    </AbsoluteFill>
  );
};