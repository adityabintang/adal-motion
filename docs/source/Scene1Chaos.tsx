/*
 DESIGN — QashierWise 15s, Scene 1 "Chat Numpuk"
 Idea: an UMKM owner's WhatsApp drowns in unanswered chats; QashierWise's AI answers them.
 Ambition: clean, polished SaaS explainer (reference: SnapYT explainer) — clarity first, snappy motion.
 Palette: #6115ED brand purple, #EEF0F6 ground, #14112B ink, #EF4444 alert red. Type: Inter (OFL).
 Tempo (scene-local s, from the VO): 0.33 "Masih balas chat", 2.74 "Chat numpuk", 3.54 "pelanggan kabur".
 Sections: Hook (phone rises, bubbles pop) -> Build (pile-up, shake, red mood) -> Turn (customers drift away, purple circle wipe = match into Scene 2's purple).
*/
import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, interpolateColors, spring, Easing} from 'remotion';
import {useProjectFonts, ProjectFont} from '@adal/fonts';

const FONTS: ProjectFont[] = [{family: 'Inter', src: 'assets/fonts/Inter/Inter-Variable.ttf', weight: '100 900'}];

export const compositionConfig = {id: 'Scene1Chaos', fps: 30, durationInFrames: 129, width: 1920, height: 1080, defaultProps: {}};

const PURPLE = '#6115ED';
const INK = '#14112B';
const GREY = '#8A879C';
const RED = '#EF4444';
const WA = '#25D366';

const cl = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const p = (t: number, a: number, b: number, ease = Easing.out(Easing.cubic)) => interpolate(t, [a, b], [0, 1], {...cl, easing: ease});
const hash = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
const hit = (t: number, at: number, k = 10) => (t >= at ? Math.exp(-(t - at) * k) : 0);

const AV = ['#8B5CF6', '#F59E0B', '#10B981', '#3B82F6', '#EC4899', '#14B8A6', '#F97316', '#6366F1'];

const Avatar: React.FC<{name: string; size: number; color: string}> = ({name, size, color}) => {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  return (
    <div style={{width: size, height: size, borderRadius: size / 2, background: color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: size * 0.38, flexShrink: 0}}>
      {initials}
    </div>
  );
};

type B = {x: number; y: number; text: string; name: string; color: string; scale: number; opacity: number; rot?: number; small?: boolean; alert?: boolean};
const Bubble: React.FC<B> = (b) => (
  <div
    style={{
      position: 'absolute', left: b.x, top: b.y,
      transform: `translate(-50%,-50%) scale(${b.scale}) rotate(${b.rot ?? 0}deg)`,
      opacity: b.opacity, display: 'flex', alignItems: 'center', gap: 14, background: 'white', borderRadius: 28,
      padding: b.small ? '10px 22px 10px 10px' : '16px 28px 16px 16px',
      boxShadow: '0 18px 44px rgba(20,17,43,0.16)',
      border: b.alert ? `4px solid ${RED}` : '1px solid rgba(20,17,43,0.06)', whiteSpace: 'nowrap',
    }}
  >
    <Avatar name={b.name} size={b.small ? 40 : 58} color={b.color} />
    <div style={{display: 'flex', flexDirection: 'column'}}>
      {!b.small ? <div style={{fontSize: 19, color: GREY, fontWeight: 600, marginBottom: 2}}>{b.name}</div> : null}
      <div style={{fontSize: b.small ? 24 : 31, color: INK, fontWeight: 650}}>{b.text}</div>
    </div>
  </div>
);

const MAIN = [
  {text: 'Kak, masih buka?', name: 'Rina', x: 380, y: 250, t: 0.55},
  {text: 'Ready stok ukuran L?', name: 'Dimas', x: 1560, y: 290, t: 0.95},
  {text: 'Bisa pesan meja 4 orang?', name: 'Bu Sari', x: 360, y: 560, t: 1.35},
  {text: 'Ongkir ke Bekasi berapa?', name: 'Andi', x: 1580, y: 600, t: 1.75},
  {text: 'Halo?? Kok belum dibales', name: 'Pak Budi', x: 420, y: 860, t: 2.1},
];
const PILE = ['Kak?', 'Min??', 'Info harga dong', 'Masih ada?', 'Halooo', 'Bisa COD?', 'Tolong dibalas', 'Jam berapa buka?', 'Diskon ga?', 'P'];
const ROWS = [
  {n: 'Rina', m: 'Kak, masih buka?', max: 27},
  {n: 'Dimas', m: 'Ready stok ukuran L?', max: 18},
  {n: 'Bu Sari', m: 'Bisa pesan meja 4 orang?', max: 15},
  {n: 'Andi', m: 'Ongkir ke Bekasi berapa?', max: 11},
  {n: 'Pak Budi', m: 'Halo?? Kok belum dibales', max: 9},
  {n: 'Mbak Wulan', m: 'Bisa COD?', max: 8},
  {n: 'Yoga', m: 'Info harga dong', max: 6},
  {n: 'Toko Berkah', m: 'Masih ada?', max: 5},
];

export const Scene1Chaos: React.FC = () => {
  useProjectFonts(FONTS);
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const sp = (start: number, damping = 12, stiffness = 170) => spring({frame: frame - Math.round(start * fps), fps, config: {damping, stiffness, mass: 0.8}});

  // phone
  const rise = sp(0.0, 16, 110);
  const phoneY = interpolate(rise, [0, 1], [1000, 0]);
  const phoneRot = interpolate(rise, [0, 1], [-8, 0]);
  const env = p(t, 2.65, 2.85) * (1 - p(t, 3.35, 3.7));
  const shakeX = Math.sin(t * 70) * 14 * env;
  const shakeR = Math.sin(t * 55) * 2.2 * env;
  const red = p(t, 2.6, 3.4);
  const leave = p(t, 3.5, 4.1, Easing.in(Easing.cubic));

  const counts = ROWS.map((r, i) => Math.floor(interpolate(t, [0.5 + i * 0.12, 3.3], [0, r.max], cl)));
  const total = counts.reduce((a, b) => a + b, 0);
  const pulse = 1 + 0.22 * MAIN.reduce((a, b) => a + hit(t, b.t), 0) + 0.15 * hit(t, 2.65, 6);

  const bg = interpolateColors(red, [0, 1], ['#EEF0F6', '#FCE8EA']);
  const PW = 440;
  const PH = 860;
  const PX = 960 - PW / 2;
  const PYt = 560 - PH / 2;

  // wipe
  const r = interpolate(t, [3.78, 4.24], [0, 2150], {...cl, easing: Easing.in(Easing.quad)});
  const r2 = interpolate(t, [3.72, 4.2], [0, 2250], {...cl, easing: Easing.in(Easing.quad)});

  return (
    <AbsoluteFill style={{background: bg, fontFamily: 'Inter', overflow: 'hidden'}}>
      <AbsoluteFill style={{backgroundImage: 'radial-gradient(rgba(20,17,43,0.09) 2px, transparent 2.5px)', backgroundSize: '40px 40px', backgroundPosition: `${t * 12}px ${t * 6}px`}} />
      <div style={{position: 'absolute', left: 960 - 520, top: 560 - 520, width: 1040, height: 1040, borderRadius: 520, background: `radial-gradient(circle, rgba(239,68,68,${0.38 * red}) 0%, rgba(239,68,68,0) 65%)`}} />

      {/* phone */}
      <div style={{position: 'absolute', left: PX + shakeX, top: PYt + phoneY, width: PW, height: PH, transform: `rotate(${phoneRot + shakeR}deg)`, borderRadius: 66, background: '#15131F', padding: 14, boxShadow: '0 50px 110px rgba(20,17,43,0.30)'}}>
        <div style={{position: 'relative', width: '100%', height: '100%', borderRadius: 54, background: 'white', overflow: 'hidden'}}>
          <div style={{position: 'absolute', left: '50%', top: 14, width: 120, height: 32, marginLeft: -60, borderRadius: 16, background: '#15131F'}} />
          <div style={{position: 'absolute', left: 30, top: 70, right: 30}}>
            <div style={{fontSize: 17, fontWeight: 700, color: WA}}>WhatsApp</div>
            <div style={{fontSize: 38, fontWeight: 800, color: INK, marginTop: 2}}>Chat</div>
          </div>
          {ROWS.map((row, i) => {
            const c = counts[i];
            const bs = c > 0 ? 1 + 0.3 * hit(t, 0.5 + i * 0.12, 8) : 0;
            return (
              <div key={row.n} style={{position: 'absolute', left: 22, right: 22, top: 170 + i * 82, height: 74, display: 'flex', alignItems: 'center', gap: 14, borderBottom: '1px solid #F0EFF4'}}>
                <Avatar name={row.n} size={52} color={AV[i % AV.length]} />
                <div style={{flex: 1, minWidth: 0}}>
                  <div style={{fontSize: 21, fontWeight: 700, color: INK}}>{row.n}</div>
                  <div style={{fontSize: 16, color: GREY, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{row.m}</div>
                </div>
                <div style={{minWidth: 34, height: 34, padding: '0 8px', borderRadius: 17, background: WA, color: 'white', fontSize: 17, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${bs})`}}>{c}</div>
              </div>
            );
          })}
          <AbsoluteFill style={{background: `rgba(239,68,68,${0.12 * red})`}} />
        </div>
        {/* total badge */}
        <div style={{position: 'absolute', right: -40, top: -34, padding: '6px 18px', borderRadius: 40, background: RED, color: 'white', fontSize: 38, fontWeight: 900, border: '6px solid white', boxShadow: '0 12px 30px rgba(239,68,68,0.45)', transform: `scale(${(total > 0 ? 1 : 0) * pulse})`}}>
          {total >= 99 ? '99+' : total}
        </div>
      </div>

      {/* main bubbles */}
      {MAIN.map((b, i) => {
        const s = sp(b.t, 11, 190);
        const dir = b.x < 960 ? -1 : 1;
        return (
          <Bubble key={b.text} x={b.x + dir * 520 * leave} y={b.y + Math.sin((t + i) * 2.2) * 6} text={b.text} name={b.name} color={AV[i]} scale={interpolate(s, [0, 1], [0.3, 1])} opacity={Math.min(1, s * 3) * (1 - leave)} />
        );
      })}
      {/* pile-up */}
      {PILE.map((txt, i) => {
        const at = 2.62 + i * 0.07;
        const s = sp(at, 10, 220);
        const a = hash(i + 3) * Math.PI * 2;
        const R = 470 + hash(i + 11) * 170;
        const x = 960 + Math.cos(a) * R;
        const y = 540 + Math.sin(a) * (300 + hash(i + 23) * 120);
        const dir = x < 960 ? -1 : 1;
        return (
          <Bubble key={txt} small x={x + dir * 600 * leave} y={y} text={txt} name={ROWS[i % ROWS.length].n} color={AV[(i + 3) % AV.length]} rot={(hash(i + 31) - 0.5) * 16} scale={interpolate(s, [0, 1], [0.2, 1])} opacity={Math.min(1, s * 3) * (1 - leave)} />
        );
      })}
      {/* the customer who leaves */}
      {(() => {
        const s = sp(3.52, 12, 200);
        return <Bubble x={960} y={150} alert text="Ya udah, beli di tempat lain aja" name="Rina" color={AV[0]} scale={interpolate(s, [0, 1], [0.3, 1])} opacity={Math.min(1, s * 3)} />;
      })()}

      {/* purple circle wipe */}
      <div style={{position: 'absolute', left: 1700 - r2, top: 950 - r2, width: r2 * 2, height: r2 * 2, borderRadius: '50%', background: '#8B5CF6'}} />
      <div style={{position: 'absolute', left: 1700 - r, top: 950 - r, width: r * 2, height: r * 2, borderRadius: '50%', background: PURPLE}} />
    </AbsoluteFill>
  );
};