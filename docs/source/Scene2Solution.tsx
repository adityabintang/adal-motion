/*
 DESIGN — QashierWise 15s, Scene 2 "AI Agent ON"
 Idea: the purple wipe becomes the brand, the brand becomes the product (match cut), the product answers the chats.
 Palette: #6115ED purple, #F4F0FF lavender ground, white cards, #14112B ink, #22C55E done-green. Type: Inter.
 Tempo (scene-local s, VO): 0.44 "QashierWise", 1.54 "AI agent", 2.3 "balas WhatsApp otomatis", 3.64 "24 jam",
   5.0 "Terima pesanan", 5.94 "reservasi", 6.92 "beres!".
 Sections: Premise (logo pop + wordmark) -> Turn (full-frame purple morphs into the dashboard card, logo lands in the sidebar)
   -> Showcase (cursor turns AI on, replies type in, unread badges clear) -> Build (dashboard shrinks, feature cards fan out)
   -> Payoff (checks) -> exit: purple circle from centre (into Scene 3).
*/
import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, interpolate, interpolateColors, spring, Easing} from 'remotion';
import {useProjectFonts, ProjectFont} from '@adal/fonts';

const FONTS: ProjectFont[] = [{family: 'Inter', src: 'assets/fonts/Inter/Inter-Variable.ttf', weight: '100 900'}];

export const compositionConfig = {id: 'Scene2Solution', fps: 30, durationInFrames: 225, width: 1920, height: 1080, defaultProps: {}};

const PURPLE = '#6115ED';
const INK = '#14112B';
const GREY = '#8A879C';
const LINE = '#ECEAF3';
const RED = '#EF4444';
const GREEN = '#22C55E';

const cl = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const p = (t: number, a: number, b: number, ease = Easing.out(Easing.cubic)) => interpolate(t, [a, b], [0, 1], {...cl, easing: ease});
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

const AV = ['#10B981', '#8B5CF6', '#F59E0B', '#3B82F6', '#EC4899', '#14B8A6', '#F97316', '#6366F1'];

const Logo: React.FC<{size: number; bg: string; fg: string}> = ({size, bg, fg}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{display: 'block', flexShrink: 0}}>
    <rect x="0" y="0" width="100" height="100" rx="24" fill={bg} />
    <circle cx="50" cy="47" r="23" fill="none" stroke={fg} strokeWidth="12" />
    <path d="M57 56 L73 74" stroke={fg} strokeWidth="12" strokeLinecap="round" />
  </svg>
);

const Avatar: React.FC<{name: string; size: number; color: string}> = ({name, size, color}) => {
  const initials = name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div style={{width: size, height: size, borderRadius: size / 2, background: color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: size * 0.38, flexShrink: 0}}>
      {initials}
    </div>
  );
};

const Check: React.FC<{size: number}> = ({size}) => (
  <div style={{width: size, height: size, borderRadius: size / 2, background: GREEN, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 26px rgba(34,197,94,0.45)', border: '5px solid white'}}>
    <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24">
      <path d="M4 12.5 L10 18 L20 6" fill="none" stroke="white" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

const Typing: React.FC<{right: number; top: number; dots: (k: number) => number}> = ({right, top, dots}) => (
  <div style={{position: 'absolute', right, top, background: '#E9E1FF', borderRadius: '20px 20px 6px 20px', padding: '18px 22px', display: 'flex', gap: 8}}>
    {[0, 1, 2].map((k) => (
      <div key={k} style={{width: 12, height: 12, borderRadius: 6, background: PURPLE, opacity: dots(k)}} />
    ))}
  </div>
);

const CONTACTS = [
  {n: 'Bu Sari', m: 'Bisa pesan meja 4 orang?', c: 9},
  {n: 'Rina', m: 'Kak, masih buka?', c: 12},
  {n: 'Dimas', m: 'Ready stok ukuran L?', c: 7},
  {n: 'Andi', m: 'Ongkir ke Bekasi berapa?', c: 5},
  {n: 'Pak Budi', m: 'Halo?? Kok belum dibales', c: 4},
  {n: 'Mbak Wulan', m: 'Bisa COD?', c: 3},
  {n: 'Yoga', m: 'Info harga dong', c: 2},
  {n: 'Toko Berkah', m: 'Masih ada?', c: 1},
];
const MENU = ['Dashboard', 'Contacts', 'Messages', 'Templates', 'AI Agent', 'Reservasi', 'Kalender', 'Orders', 'Payment'];

const CARD = {x: 160, y: 140, w: 1600, h: 840};

export const Scene2Solution: React.FC = () => {
  useProjectFonts(FONTS);
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const sp = (start: number, damping = 12, stiffness = 170) => spring({frame: frame - Math.round(start * fps), fps, config: {damping, stiffness, mass: 0.8}});

  const pop = sp(0.05, 10, 160);
  const wm = p(t, 0.4, 0.85);
  const m = p(t, 1.2, 1.85, Easing.inOut(Easing.cubic));
  const cm = p(t, 1.8, 1.92);
  const co = p(t, 1.92, 2.2);
  const tl = p(t, 1.7, 2.6, Easing.inOut(Easing.cubic));
  const drift = p(t, 2.6, 4.7, Easing.linear);
  const fl = p(t, 4.7, 5.3, Easing.inOut(Easing.cubic));
  const ex = p(t, 7.08, 7.44, Easing.in(Easing.cubic));

  const rotY = (-7 * tl + 3 * drift) * (1 - fl);
  const rotX = (5 * tl - 1.5 * drift) * (1 - fl);
  const sc = lerp(1, 0.48, fl) * (1 - 0.45 * ex);
  const ty = lerp(0, 40, fl);

  const rx = lerp(0, CARD.x, m);
  const ry = lerp(0, CARD.y, m);
  const rw = lerp(1920, CARD.w, m);
  const rh = lerp(1080, CARD.h, m);
  const rr = lerp(0, 28, m);
  const cardFill = PURPLE;
  const wr = p(t, 1.8, 2.2, Easing.inOut(Easing.cubic));

  const bigAnchor = lerp(960 - 100, 492, wm);
  const ax = lerp(bigAnchor, CARD.x + 28, m);
  const ay = lerp(540, CARD.y + 44, m);
  const ls = lerp(1, 0.22, m) * interpolate(pop, [0, 1], [0, 1]);
  const sqColor = interpolateColors(cm, [0, 1], ['#FFFFFF', PURPLE]);
  const qColor = interpolateColors(cm, [0, 1], [PURPLE, '#FFFFFF']);
  const wmColor = interpolateColors(cm, [0, 1], ['#FFFFFF', INK]);
  const burst = p(t, 0.05, 0.6);

  const cmv = p(t, 1.95, 2.45, Easing.inOut(Easing.cubic));
  const TX = CARD.x + 1531;
  const TY = CARD.y + 126;
  const curX = lerp(CARD.x + 1250, TX, cmv);
  const curY = lerp(CARD.y + 700, TY, cmv);
  const curO = p(t, 1.9, 2.05) * (1 - p(t, 3.0, 3.3));
  const press = 1 - 0.2 * (p(t, 2.42, 2.5) * (1 - p(t, 2.5, 2.62)));
  const on = sp(2.5, 14, 220);
  const glow = t >= 2.5 ? Math.exp(-(t - 2.5) * 2.2) : 0;
  const ring = p(t, 2.5, 3.1);
  const chip = sp(3.64, 13, 200);

  const badgeOff = (i: number) => p(t, 2.9 + i * 0.2, 3.05 + i * 0.2);
  const bell = Math.max(0, Math.ceil(interpolate(t, [2.8, 4.5], [99, 0], cl)));

  const typing1 = t >= 2.75 && t < 3.15;
  const r1 = sp(3.15, 13, 210);
  const typing2 = t >= 3.5 && t < 3.85;
  const r2 = sp(3.85, 13, 210);
  const c3 = sp(4.35, 13, 210);
  const dots = (k: number) => 0.35 + 0.65 * Math.max(0, Math.sin(t * 14 - k));

  const lp = sp(5.0, 14, 120);
  const rp = sp(5.94, 14, 120);
  const ch1 = sp(6.3, 12, 200);
  const ch2 = sp(6.5, 12, 200);
  const ck = [sp(6.9, 10, 220), sp(6.98, 10, 220), sp(7.06, 10, 220)];
  const suck = (x: number) => lerp(x, 960, 0.6 * ex);
  const exO = 1 - p(t, 7.2, 7.44);
  const circ = lerp(0, 1250, ex);
  const leftCX = suck(lerp(960, 320, lp));
  const rightCX = suck(lerp(960, 1610, rp));
  return (
    <AbsoluteFill style={{background: '#F4F0FF', fontFamily: 'Inter', overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: -300 + t * 20, top: -260, width: 1100, height: 1100, borderRadius: 550, background: 'radial-gradient(circle, rgba(139,92,246,0.28), rgba(139,92,246,0) 65%)'}} />
      <div style={{position: 'absolute', right: -360 + t * 16, bottom: -420, width: 1200, height: 1200, borderRadius: 600, background: 'radial-gradient(circle, rgba(97,21,237,0.20), rgba(97,21,237,0) 65%)'}} />
      <AbsoluteFill style={{backgroundImage: 'radial-gradient(rgba(97,21,237,0.10) 2px, transparent 2.5px)', backgroundSize: '40px 40px'}} />

      <AbsoluteFill style={{transform: `translateY(${ty}px) scale(${sc})`, transformOrigin: '960px 540px', opacity: ex > 0 ? exO : 1}}>
        <AbsoluteFill style={{transform: `perspective(2600px) rotateX(${rotX}deg) rotateY(${rotY}deg)`, transformOrigin: '960px 560px'}}>
          <div style={{position: 'absolute', left: rx, top: ry, width: rw, height: rh, borderRadius: rr, background: cardFill, boxShadow: m > 0.3 ? `0 40px 120px rgba(60,20,140,${0.25 * m})` : 'none'}} />
          {wr > 0 ? <div style={{position: 'absolute', left: CARD.x, top: CARD.y, width: CARD.w, height: CARD.h, borderRadius: 28, background: 'white', clipPath: `circle(${wr * 1900}px at 60px 44px)`}} /> : null}
          {burst > 0 && burst < 1 ? (
            <svg width="1920" height="1080" style={{position: 'absolute', left: 0, top: 0}}>
              {Array.from({length: 12}).map((_, i) => {
                const a = (i / 12) * Math.PI * 2;
                const r0 = 150 + burst * 120;
                const r1 = 190 + burst * 260;
                return <line key={i} x1={860 + Math.cos(a) * r0} y1={540 + Math.sin(a) * r0} x2={860 + Math.cos(a) * r1} y2={540 + Math.sin(a) * r1} stroke="white" strokeOpacity={1 - burst} strokeWidth={10} strokeLinecap="round" />;
              })}
            </svg>
          ) : null}

          <div style={{position: 'absolute', left: CARD.x, top: CARD.y, width: CARD.w, height: CARD.h, borderRadius: 28, overflow: 'hidden', opacity: co}}>
            <div style={{position: 'absolute', left: 0, top: 0, width: 250, height: CARD.h, borderRight: `1px solid ${LINE}`, background: 'white'}}>
              {MENU.map((it, i) => {
                const act = i === 2;
                return (
                  <div key={it} style={{position: 'absolute', left: 14, right: 14, top: 104 + i * 56, height: 48, borderRadius: 12, background: act ? '#F1EBFF' : 'transparent', display: 'flex', alignItems: 'center', gap: 14, paddingLeft: 14}}>
                    <div style={{width: 22, height: 22, borderRadius: 6, background: act ? PURPLE : '#CFCBDC'}} />
                    <span style={{fontSize: 19, fontWeight: act ? 700 : 500, color: act ? PURPLE : '#3B3850'}}>{it}</span>
                  </div>
                );
              })}
            </div>
            <div style={{position: 'absolute', left: 250, top: 0, right: 0, height: 84, borderBottom: `1px solid ${LINE}`, background: 'white', display: 'flex', alignItems: 'center', paddingLeft: 32}}>
              <div>
                <div style={{fontSize: 28, fontWeight: 800, color: INK}}>Messages</div>
                <div style={{fontSize: 16, color: GREY}}>Chat WhatsApp pelanggan</div>
              </div>
              <div style={{position: 'absolute', right: 40, top: 22}}>
                <svg width="36" height="36" viewBox="0 0 24 24"><path d="M6 17 V11 a6 6 0 0 1 12 0 V17 L20 19 H4 Z M10 21 h4" fill={INK} /></svg>
                <div style={{position: 'absolute', left: 18, top: -10, padding: '2px 9px', borderRadius: 14, background: bell > 0 ? RED : GREEN, color: 'white', fontSize: 16, fontWeight: 800, border: '3px solid white', whiteSpace: 'nowrap'}}>{bell >= 99 ? '99+' : bell > 0 ? bell : 'OK'}</div>
              </div>
            </div>
            <div style={{position: 'absolute', left: 250, top: 84, width: 380, bottom: 0, borderRight: `1px solid ${LINE}`, background: 'white'}}>
              <div style={{position: 'absolute', left: 18, right: 18, top: 18, height: 48, borderRadius: 12, background: '#F4F3F8', display: 'flex', alignItems: 'center', paddingLeft: 18, fontSize: 17, color: GREY}}>Cari kontak...</div>
              {CONTACTS.map((c, i) => {
                const off = badgeOff(i);
                return (
                  <div key={c.n} style={{position: 'absolute', left: 10, right: 10, top: 84 + i * 80, height: 74, borderRadius: 14, background: i === 0 ? '#F3EEFF' : 'transparent', display: 'flex', alignItems: 'center', gap: 14, padding: '0 14px'}}>
                    <Avatar name={c.n} size={50} color={AV[i]} />
                    <div style={{flex: 1, minWidth: 0}}>
                      <div style={{fontSize: 19, fontWeight: 700, color: INK}}>{c.n}</div>
                      <div style={{fontSize: 15, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: off > 0.5 ? PURPLE : GREY, fontWeight: off > 0.5 ? 700 : 400}}>{off > 0.5 ? 'Dibalas AI' : c.m}</div>
                    </div>
                    <div style={{minWidth: 30, height: 30, padding: '0 8px', borderRadius: 15, background: RED, color: 'white', fontSize: 15, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${1 - off})`}}>{c.c}</div>
                  </div>
                );
              })}
            </div>            <div style={{position: 'absolute', left: 630, top: 84, right: 0, bottom: 0, background: '#FAF9FD'}}>
              <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 84, background: 'white', borderBottom: `1px solid ${LINE}`, display: 'flex', alignItems: 'center', gap: 16, paddingLeft: 28}}>
                <Avatar name="Bu Sari" size={50} color={AV[0]} />
                <div>
                  <div style={{fontSize: 22, fontWeight: 800, color: INK}}>Bu Sari</div>
                  <div style={{fontSize: 15, color: GREY}}>Pelanggan via WhatsApp</div>
                </div>
              </div>
              <div style={{position: 'absolute', left: 640, top: 25, transform: `scale(${chip})`, transformOrigin: 'right center', background: '#EFE7FF', color: PURPLE, fontWeight: 800, fontSize: 17, padding: '7px 16px', borderRadius: 18, display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap'}}>
                <div style={{width: 10, height: 10, borderRadius: 5, background: GREEN}} />
                AI aktif 24/7
              </div>
              <div style={{position: 'absolute', left: 832, top: 30, fontSize: 19, fontWeight: 800, color: PURPLE}}>AI</div>
              <div style={{position: 'absolute', left: 868, top: 25, width: 66, height: 34, borderRadius: 17, background: interpolateColors(on, [0, 1], ['#D9D6E3', PURPLE]), boxShadow: `0 0 ${30 * glow}px ${10 * glow}px rgba(97,21,237,${0.5 * glow})`}}>
                <div style={{position: 'absolute', top: 4, left: lerp(4, 36, on), width: 26, height: 26, borderRadius: 13, background: 'white', boxShadow: '0 2px 6px rgba(0,0,0,0.2)'}} />
              </div>
              <div style={{position: 'absolute', left: 871 - 60 * ring, top: 12 - 60 * ring, width: 60 + 120 * ring, height: 60 + 120 * ring, borderRadius: '50%', border: `4px solid ${PURPLE}`, opacity: ring > 0 && ring < 1 ? 1 - ring : 0}} />

              <div style={{position: 'absolute', left: 32, top: 116, background: 'white', border: `1px solid ${LINE}`, borderRadius: '20px 20px 20px 6px', padding: '14px 20px', fontSize: 22, color: INK}}>Kak, masih buka?</div>
              <div style={{position: 'absolute', left: 32, top: 190, background: 'white', border: `1px solid ${LINE}`, borderRadius: '20px 20px 20px 6px', padding: '14px 20px', fontSize: 22, color: INK}}>Bisa pesan meja 4 orang?</div>

              {typing1 ? <Typing right={32} top={290} dots={dots} /> : null}
              {t >= 3.15 ? (
                <>
                  <div style={{position: 'absolute', right: 34, top: 262, fontSize: 15, fontWeight: 800, color: PURPLE, opacity: Math.min(1, r1 * 2)}}>AI Agent</div>
                  <div style={{position: 'absolute', right: 32, top: 288, background: PURPLE, color: 'white', borderRadius: '20px 20px 6px 20px', padding: '14px 22px', fontSize: 22, fontWeight: 500, whiteSpace: 'nowrap', transform: `scale(${interpolate(r1, [0, 1], [0.6, 1])})`, transformOrigin: 'right bottom', opacity: Math.min(1, r1 * 2)}}>Halo kak! Kami buka sampai jam 9 malam ya</div>
                </>
              ) : null}
              {typing2 ? <Typing right={32} top={370} dots={dots} /> : null}
              {t >= 3.85 ? (
                <div style={{position: 'absolute', right: 32, top: 370, background: PURPLE, color: 'white', borderRadius: '20px 20px 6px 20px', padding: '14px 22px', fontSize: 22, fontWeight: 500, whiteSpace: 'nowrap', transform: `scale(${interpolate(r2, [0, 1], [0.6, 1])})`, transformOrigin: 'right bottom', opacity: Math.min(1, r2 * 2)}}>Bisa kak, meja untuk 4 orang sudah dicatat</div>
              ) : null}
              {t >= 4.35 ? (
                <div style={{position: 'absolute', left: 32, top: 452, background: 'white', border: `1px solid ${LINE}`, borderRadius: '20px 20px 20px 6px', padding: '14px 20px', fontSize: 22, color: INK, whiteSpace: 'nowrap', transform: `scale(${interpolate(c3, [0, 1], [0.6, 1])})`, transformOrigin: 'left bottom', opacity: Math.min(1, c3 * 2)}}>Wah cepet banget, makasih kak!</div>
              ) : null}

              <div style={{position: 'absolute', left: 28, right: 28, bottom: 26, height: 56, borderRadius: 16, background: 'white', border: `1px solid ${LINE}`, display: 'flex', alignItems: 'center', paddingLeft: 20, fontSize: 18, color: GREY}}>Ketik pesan...</div>
            </div>
          </div>

          <div style={{position: 'absolute', left: ax, top: ay, transform: `translate(0,-50%) scale(${ls})`, transformOrigin: 'left center', display: 'flex', alignItems: 'center', gap: 40}}>
            <Logo size={200} bg={sqColor} fg={qColor} />
            <div style={{fontSize: 110, fontWeight: 800, color: wmColor, letterSpacing: -2, clipPath: `inset(0 ${(1 - wm) * 100}% 0 0)`, transform: `translateX(${(1 - wm) * -30}px)`, whiteSpace: 'nowrap'}}>QashierWise</div>
          </div>

          <div style={{position: 'absolute', left: curX, top: curY, opacity: curO, transform: `scale(${press})`, transformOrigin: '0 0'}}>
            <svg width="54" height="54" viewBox="0 0 24 24"><path d="M4 2 L4 19 L8.5 15 L11.5 22 L14.5 20.8 L11.5 14 L18 14 Z" fill={INK} stroke="white" strokeWidth="1.4" strokeLinejoin="round" /></svg>
          </div>

          <div style={{position: 'absolute', left: CARD.x + CARD.w - 70, top: CARD.y - 60, transform: `scale(${ck[1] * 1.6})`, transformOrigin: 'center'}}>
            <Check size={84} />
          </div>
        </AbsoluteFill>
      </AbsoluteFill>

      {lp > 0.001 ? (
        <div style={{position: 'absolute', left: leftCX - 270, top: 600 - 177, width: 540, transform: `rotate(${lerp(0, -6, lp)}deg) scale(${lerp(0.7, 1, lp) * (1 - 0.5 * ex)})`, opacity: Math.min(1, lp * 2) * exO}}>
          <div style={{position: 'absolute', top: -82, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
            <div style={{background: PURPLE, color: 'white', fontWeight: 800, fontSize: 28, padding: '10px 26px', borderRadius: 30}}>Pesanan & Menu</div>
          </div>
          <div style={{borderRadius: 24, overflow: 'hidden', background: 'white', boxShadow: '0 30px 80px rgba(60,20,140,0.22)', border: `1px solid ${LINE}`}}>
            <Img src={staticFile('assets/card_menu.png')} style={{width: 540, display: 'block'}} />
          </div>
          <div style={{position: 'absolute', left: -24, top: -24, transform: `scale(${ck[0]})`}}>
            <Check size={72} />
          </div>
        </div>
      ) : null}

      {rp > 0.001 ? (
        <div style={{position: 'absolute', left: rightCX - 260, top: 600 - 190, width: 520, transform: `rotate(${lerp(0, 6, rp)}deg) scale(${lerp(0.7, 1, rp) * (1 - 0.5 * ex)})`, opacity: Math.min(1, rp * 2) * exO}}>
          <div style={{position: 'absolute', top: -82, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
            <div style={{background: PURPLE, color: 'white', fontWeight: 800, fontSize: 28, padding: '10px 26px', borderRadius: 30}}>Reservasi</div>
          </div>
          <div style={{borderRadius: 24, background: 'white', boxShadow: '0 30px 80px rgba(60,20,140,0.22)', border: `1px solid ${LINE}`, padding: 32}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 16, marginBottom: 22}}>
              <div style={{width: 56, height: 56, borderRadius: 14, background: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <svg width="30" height="30" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="3" fill="none" stroke="white" strokeWidth="2.2" /><path d="M3 10 H21 M8 3 V7 M16 3 V7" stroke="white" strokeWidth="2.2" strokeLinecap="round" /></svg>
              </div>
              <div>
                <div style={{fontSize: 28, fontWeight: 800, color: INK}}>Reservasi baru</div>
                <div style={{fontSize: 18, color: GREY}}>Dari chat WhatsApp</div>
              </div>
            </div>
            {[['Nama', 'Bu Sari'], ['Jumlah', '4 orang'], ['Waktu', 'Sabtu, 19.00'], ['Meja', 'A11']].map(([k, v]) => (
              <div key={k} style={{display: 'flex', justifyContent: 'space-between', padding: '11px 0', borderTop: `1px solid ${LINE}`, fontSize: 22}}>
                <span style={{color: GREY}}>{k}</span>
                <span style={{color: INK, fontWeight: 700}}>{v}</span>
              </div>
            ))}
            <div style={{marginTop: 14, display: 'inline-block', background: '#DCFCE7', color: '#15803D', fontWeight: 800, fontSize: 20, padding: '8px 18px', borderRadius: 20}}>Terkonfirmasi</div>
          </div>
          <div style={{position: 'absolute', right: -24, top: -24, transform: `scale(${ck[2]})`}}>
            <Check size={72} />
          </div>
        </div>
      ) : null}

      <div style={{position: 'absolute', left: suck(1290), top: 830, transform: `scale(${ch1 * (1 - 0.5 * ex)})`, opacity: exO, display: 'flex', alignItems: 'center', gap: 12, background: 'white', borderRadius: 40, padding: '12px 24px 12px 12px', boxShadow: '0 14px 36px rgba(60,20,140,0.18)'}}>
        <div style={{width: 40, height: 40, borderRadius: 10, background: '#3B82F6'}} />
        <span style={{fontSize: 24, fontWeight: 700, color: INK}}>Google Calendar</span>
      </div>
      <div style={{position: 'absolute', left: suck(1590), top: 830, transform: `scale(${ch2 * (1 - 0.5 * ex)})`, opacity: exO, display: 'flex', alignItems: 'center', gap: 12, background: 'white', borderRadius: 40, padding: '12px 24px 12px 12px', boxShadow: '0 14px 36px rgba(60,20,140,0.18)'}}>
        <div style={{width: 40, height: 40, borderRadius: 20, background: '#25D366'}} />
        <span style={{fontSize: 24, fontWeight: 700, color: INK}}>Pengingat WA</span>
      </div>
      <div style={{position: 'absolute', left: 960 - circ, top: 580 - circ, width: circ * 2, height: circ * 2, borderRadius: '50%', background: PURPLE}} />
    </AbsoluteFill>
  );
};