// asal_usul_x.js: "The Thing", the origin of x in 30 seconds. See STORYBOARD.md.
//   A (0–7.5)    Baghdad: a scale balances a wrapped bundle + 3 pebbles against 5 pebbles. The bundle won't open: "the thing".
//   B (7.5–15)   Toledo: Clawd can't say the "shh" sound, spots a χ in an old book, and paints two crossed strokes on the bundle.
//   C (15–22)    Printing house: the press stamps the ✕ on sheet after sheet; a paper storm.
//   D (22–30)    Classroom: the same scale in chalk, 3 dots rubbed out of both sides, the bundle opens: 2 glowing pebbles.
(() => {
  const C = {
    cloth: '#C9A06A', clothDk: '#8E6A3E', pebble: '#8B8FA3', pebbleDk: '#5E6275', wood: '#8A5A3A', woodDk: '#5C3A26',
    brass: '#D9A441', baghWall: '#2A2F63', baghWall2: '#3B3F7C', stone: '#D8B47A', stoneDk: '#B88E55',
    sepia: '#C9AE86', sepiaDk: '#9C7F58', board: '#2F5246', boardDk: '#22403A', chalk: '#EDE8D6', gold: '#FFD96A',
  };

  // ---------- props ----------
  // Two crossed brush strokes, drawn progressively: k 0..1 (first stroke 0..0.5, second 0.5..1).
  function xMark(cx, cy, s, k, col = PAL.ink, sw = 2, br = 'dry') {
    if (k <= 0) return;
    const strokes = [[[cx - s, cy - s], [cx + s * .1, cy - s * .05], [cx + s, cy + s * 1.05]], [[cx + s * .95, cy - s], [cx - s * .05, cy + s * .05], [cx - s, cy + s]]];
    strokes.forEach((P, i) => {
      const q = clamp(k * 2 - i); if (q <= 0) return;
      const pts = [P[0], [lerp(P[0][0], P[1][0], clamp(q * 2)), lerp(P[0][1], P[1][1], clamp(q * 2))]];
      if (q > .5) pts.push([lerp(P[1][0], P[2][0], (q - .5) * 2), lerp(P[1][1], P[2][1], (q - .5) * 2)]);
      inkLine(pts, sw, col, br, .3);
    });
  }
  function pebble(x, y, r, i = 0, col = C.pebble) {
    paint(ellPts(x, y - r * .7, r, r * .72, 12, 0, hash(i) * 3), { wash: mixCol(col, '#ffffff', hash(i + 7) * .2), ink: PAL.ink, sw: .6 });
  }
  // The bundle: a cloth sack with a knotted top. o.wig = wiggle angle, o.mark = ✕ progress, o.open = 0..1, o.s = size.
  function bundle(x, y, s, o = {}) {
    push(); translate(x, y); rotate(o.wig || 0);
    const open = o.open || 0;
    if (open > 0) {   // inside: two glowing pebbles rising out
      const up = backOut(seg(open, .35, 1));
      glow(0, -s * (.9 + .5 * up), s * (1.2 + 1.6 * up), C.gold, open);
      for (const i of [0, 1]) {
        const px = (i ? .32 : -.32) * s, py = -s * (.55 + .75 * up) - (i ? .1 : 0) * s;
        paint(ellPts(px, py, s * .26, s * .2, 12, 0, i), { wash: mixCol(C.pebble, C.gold, .75), ink: PAL.ink, sw: .7 });
      }
    }
    // the sack
    const neck = lerp(.32, .85, open);
    paint([[-s * .95, -s * .1], [-s * .8, -s * .7], [-s * neck, -s * 1.05], [s * neck, -s * 1.05], [s * .85, -s * .7], [s, -s * .1], [s * .7, 0], [-s * .7, 0]],
      { wash: C.cloth, ink: PAL.ink, sw: .9, curv: .6 });
    inkLine([[-s * .55, -s * .25], [-s * .2, -s * .55]], .5, C.clothDk, 'inkfine', .5);   // a fold
    if (open < .5) {   // the knot and its two ears
      const kk = 1 - open * 2;
      paint(ellPts(0, -s * 1.08, s * .2, s * .13, 10), { wash: C.clothDk, ink: PAL.ink, sw: .7 });
      paint([[0, -s * 1.1], [-s * .45 * kk, -s * (1.45 + .1 * Math.sin(T * 4))], [-s * .15, -s * 1.15]], { wash: C.cloth, ink: PAL.ink, sw: .6 });
      paint([[0, -s * 1.1], [s * .4 * kk, -s * (1.5 + .1 * Math.cos(T * 4))], [s * .15, -s * 1.15]], { wash: C.cloth, ink: PAL.ink, sw: .6 });
    } else {   // the cloth falls open: two flaps
      paint([[-s * neck, -s * 1.05], [-s * 1.15, -s * .8], [-s * .8, -s * .7]], { wash: C.clothDk, ink: PAL.ink, sw: .6 });
      paint([[s * neck, -s * 1.05], [s * 1.15, -s * .8], [s * .8, -s * .7]], { wash: C.clothDk, ink: PAL.ink, sw: .6 });
    }
    if (o.mark) xMark(0, -s * .5, s * .32, o.mark, PAL.ink, 1.6);
    pop();
  }
  // A balance scale. tilt in radians (+ = left pan down). left/right: fn(x, y) drawing the pan's load at the pan centre.
  function balance(x, y, s, tilt, left, right, o = {}) {
    const ink = o.ink || PAL.ink, col = o.col || C.brass, chalk = !!o.chalk;
    const pivot = [x, y - s * 1.6], arm = s * 1.15;
    const ends = [-1, 1].map(d => [pivot[0] + d * arm * Math.cos(tilt), pivot[1] - d * arm * Math.sin(tilt)]);
    const pans = ends.map(e => [e[0], e[1] + s * .75]);
    if (chalk) {
      inkLine([[x, y], pivot], 1.6, ink, 'dry', 0);
      inkLine([[x - s * .4, y], [x + s * .4, y]], 1.6, ink, 'dry', 0);
      inkLine([ends[0], pivot, ends[1]], 1.6, ink, 'dry', 0);
      for (let i = 0; i < 2; i++) {
        inkLine([ends[i], [pans[i][0] - s * .35, pans[i][1]]], .8, ink, 'dry', 0);
        inkLine([ends[i], [pans[i][0] + s * .35, pans[i][1]]], .8, ink, 'dry', 0);
        inkLine([[pans[i][0] - s * .4, pans[i][1]], [pans[i][0], pans[i][1] + s * .12], [pans[i][0] + s * .4, pans[i][1]]], 1.4, ink, 'dry', .6);
      }
    } else {
      boilSeed('scale-post');
      paint(rectPts(x - s * .07, pivot[1], s * .14, y - pivot[1]), { wash: col, ink, sw: .8 });
      paint(ellPts(x, y, s * .45, s * .1, 16), { wash: mixCol(col, PAL.ink, .25), ink, sw: .8 });
      paint(ribbon([ends[0], pivot, ends[1]], s * .07, s * .07), { wash: col, ink, sw: .8 });
      paint(ellPts(...pivot, s * .09, s * .09, 10), { wash: mixCol(col, '#ffffff', .3), ink, sw: .6 });
      for (let i = 0; i < 2; i++) {
        inkLine([ends[i], [pans[i][0] - s * .38, pans[i][1]]], .5, ink, 'inkfine', 0);
        inkLine([ends[i], [pans[i][0] + s * .38, pans[i][1]]], .5, ink, 'inkfine', 0);
        paint([[pans[i][0] - s * .45, pans[i][1]], [pans[i][0] + s * .45, pans[i][1]], [pans[i][0] + s * .3, pans[i][1] + s * .14], [pans[i][0] - s * .3, pans[i][1] + s * .14]], { wash: col, ink, sw: .8 });
      }
    }
    boilSeed('scale-load-l'); if (left) left(...pans[0]);
    boilSeed('scale-load-r'); if (right) right(...pans[1]);
    return pans;
  }
  // Pebbles stacked in a little pile on a pan, n of them, with `fly` (0..1) for the last one arriving.
  function pile(x, y, n, r, key = 0) {
    const spots = [[-1.3, 0], [0, 0], [1.3, 0], [-.65, -1.1], [.65, -1.1], [0, -2.1]];
    for (let i = 0; i < n; i++) pebble(x + spots[i][0] * r, y + spots[i][1] * r, r * .62, i + key);
  }
  const chalkDots = (x, y, n, r, alpha = 1) => {
    const spots = [[-1.3, 0], [0, 0], [1.3, 0], [-.65, -1.1], [.65, -1.1]];
    for (let i = 0; i < n; i++) paint(ellPts(x + spots[i][0] * r, y + spots[i][1] * r - r * .6, r * .42, r * .42, 10, 1.5), { wash: C.chalk, washOp: 230 * alpha, ink: null });
  };
  // The turban: a scholar's wrap, drawn on Clawd's head (body-local, front view coords).
  const turban = (u, sw) => {
    paint(ellPts(0, -8.9 * u, 4.4 * u, 1.2 * u, 20), { wash: PAL.cream, ink: PAL.ink, sw: sw * .8 });
    paint(ellPts(.4 * u, -10.0 * u, 3.0 * u, 1.3 * u, 18), { wash: mixCol(PAL.cream, C.stone, .3), ink: PAL.ink, sw: sw * .8 });
    inkLine([[-3.4 * u, -9.3 * u], [0, -10.3 * u], [3.2 * u, -9.1 * u]], sw * .5, C.stoneDk, 'inkfine', .6);
    paint(ellPts(0, -8.9 * u, .45 * u, .45 * u, 8), { wash: PAL.rose, ink: PAL.ink, sw: sw * .5 });
  };
  const brushTool = (u, sw) => {   // a reed pen/brush held at the arm tip
    inkLine([[0, 0], [u * 2.6, -u * .6]], sw * 1.1, C.woodDk, 'ink', 0);
    paint(ellPts(u * 2.9, -u * .68, u * .45, u * .22, 8, 0, -.22), { wash: PAL.ink, ink: null });
  };

  // ---------- A: Baghdad, the thing ----------
  function shotA(t, lt, dur) {
    const u = 25, G = 900, SX = 1260, tDrop = 1.55, tPoke = 3.6, tAsk = 4.15, tIdea = 5.6;
    const push_ = kf(lt, [[0, 1], [5.4, 1.08], [dur, 1.22]]);
    camBegin(kf(lt, [[0, 960], [dur, 1090]]) + 10 * Math.sin(lt * .5), kf(lt, [[0, 540], [dur, 600]]), push_);
    boilSeed('wall');
    paint(rectPts(-300, -300, W + 600, H + 600), { wash: C.baghWall, ink: null });
    paint(ellPts(430, 520, 700, 520, 28, 8), { fill: C.baghWall2, fillOp: 120, bleed: .25, tex: .5, ink: null });
    // arched window with a crescent moon
    boilSeed('window');
    const win = []; for (let i = 0; i <= 12; i++) { const a = Math.PI + i / 12 * Math.PI; win.push([1560 + Math.cos(a) * 150, 330 + Math.sin(a) * 170]); }
    win.push([1710, 700], [1410, 700]);
    paint(win, { wash: PAL.night, ink: PAL.ink, sw: 1.1 });
    paint(ellPts(1610, 300, 40, 40, 18), { wash: PAL.cream, ink: null });
    paint(ellPts(1630, 288, 36, 36, 18), { wash: PAL.night, ink: null });
    for (let i = 0; i < 5; i++) { boilSeed('wstar' + i); const tw = .6 + .4 * Math.sin(t * 2.5 + i * 2); paint(starPts(1470 + hash(i) * 200, 230 + hash(i + 9) * 380, 5 * tw, .35, 4), { wash: PAL.cream, ink: null }); }
    // the lamp: warm light pooling on the desk
    const LX = 430, LY = 690, flick = 1 + .06 * Math.sin(t * 13) + .04 * Math.sin(t * 7.3);
    glow(LX, LY - 60, 520 * flick, '#FFB45A', .55);
    // the desk
    boilSeed('desk');
    paint(rectPts(-200, G, W + 400, 400), { wash: C.woodDk, ink: null });
    paint(rectPts(-200, G - 18, W + 400, 36, 2), { wash: C.wood, ink: PAL.ink, sw: 1 });
    boilSeed('lamp');
    paint([[LX - 90, LY + 2], [LX - 40, LY - 40], [LX + 60, LY - 40], [LX + 110, LY - 12], [LX + 70, LY + 8], [LX - 60, LY + 8]], { wash: C.brass, ink: PAL.ink, sw: 1, curv: .5 });
    paint(rectPts(LX - 20, LY + 8, 40, G - 18 - LY - 8), { wash: mixCol(C.brass, PAL.ink, .2), ink: PAL.ink, sw: .8 });
    glow(LX - 95, LY - 40, 120 * flick, '#FFD27A', 1);
    paint([[LX - 95, LY - 5], [LX - 110 + 6 * Math.sin(t * 9), LY - 40], [LX - 95, LY - 70 + 6 * Math.sin(t * 11)], [LX - 82, LY - 38]], { wash: '#FFC45C', ink: null, curv: .7 });

    // the scale: wobbling until the last pebble lands, then balanced
    const wobble = lt < tDrop ? -.18 : -.18 * Math.exp(-(lt - tDrop) * 1.6) * Math.cos((lt - tDrop) * 7) + .02 * spring(lt, tPoke, 5, 16);
    const wig = .18 * spring(lt, tPoke + .05, 4, 22);
    const pans = balance(SX, G - 18, 250, lt < tDrop ? -.18 : wobble,
      (px, py) => { pile(px + 62, py, 3, 30, 0); bundle(px - 48, py, 78, { wig }); },
      (px, py) => pile(px, py, lt < tDrop + .02 ? 4 : 5, 34, 10));

    // Clawd: ponders, drops the 5th pebble on the right pan, pokes the bundle, it won't open, the idea: "the thing"
    const mood = emotions(lt, [[0, 'thinking', { lookX: .8, lookY: -.2 }], [1.0, 'determined', { lookX: 1 }], [tDrop + .35, 'happy', { lookX: 1 }],
      [tPoke - .3, 'playful', { lookX: 1 }], [tAsk, 'confused', { lookX: .8, emote: '?' }], [tIdea, 'idea', { lookX: .9, emote: 'bulb' }]]);
    const x = 700 + 120 * ease(seg(lt, tPoke - .6, tPoke)) - 120 * ease(seg(lt, tAsk, tAsk + .6));
    const lean = .22 * Math.sin(Math.PI * seg(lt, tPoke - .2, tPoke + .4));
    const throwK = seg(lt, 1.05, tDrop), raise = lt < 1.05 ? ease(seg(lt, .3, 1.0)) : 1 - ease(seg(lt, tDrop, tDrop + .5));
    const pointK = ease(seg(lt, tIdea + .2, tIdea + .6));
    const cl = { ...mood, view: 'q', hat: null, draw: turban, rot: (mood.rot || 0) + lean,
      aR: lerp(mood.aR ?? .2, 1.3, raise) + lean * 3, aL: lerp(mood.aL ?? .2, .7, pointK) };
    if (lt < 1.05 && lt > .3) cl.armR = (uu, sw) => pebble(uu * .6, uu * .2, uu * .45, 14);
    clawd(x, G - 18, u, cl);
    // the 5th pebble flies from Clawd's hand to the right pan
    if (lt >= 1.05 && lt < tDrop + .02) {
      boilSeed('throw');
      const p = arcPt([x + 6 * u, G - 18 - 9 * u], [pans[1][0] + 20, pans[1][1] - 60], 160, easeIn(throwK));
      pebble(p[0], p[1], 19, 14);
    }
    if (lt > tPoke && lt < tPoke + .5) { boilSeed('puff'); for (let i = 0; i < 3; i++) { const q = seg(lt, tPoke + i * .05, tPoke + .45); if (q > 0 && q < 1) paint(ellPts(pans[0][0] - 48 + (i - 1) * 50 * q * 2, pans[0][1] - 120 - 50 * q, 12 * (1 - q), 12 * (1 - q), 8), { wash: PAL.cream, washOp: 200 * (1 - q), ink: null }); } }
    const flame = toScreen(LX - 95, LY - 40);
    camEnd();
    boilSeed('transition');
    if (lt < .9) iris(...flame, lerp(0, 1700, easeIn(seg(lt, .1, .9))));
    if (lt > dur - .3) brushWipe((lt - (dur - .3)) / .6, [PAL.night, C.stoneDk]);
  }

  // ---------- B: Toledo, the mark ----------
  function shotB(t, lt, dur) {
    const u = 27, G = 930, BX = 1270, tSay1 = 1.6, tSay2 = 2.7, tSweat = 3.3, tLook = 3.7, tIdea = 4.8, tPaint0 = 5.5, tPaint1 = 6.35, tProud = 6.5;
    camBegin(kf(lt, [[0, 1100], [1.6, 960], [3.7, 860], [4.8, 900], [5.4, 1040], [dur, 1060]]), kf(lt, [[0, 680], [1.6, 560], [dur, 590]]), kf(lt, [[0, 1.35], [1.6, 1], [3.7, 1.05], [5.4, 1.18], [dur, 1.26]]));
    boilSeed('stone');
    paint(rectPts(-400, -400, W + 800, H + 800), { wash: C.stone, ink: null });
    for (let r = 0; r < 7; r++) { boilSeed('row' + r); const y = 60 + r * 120; inkLine([[-300, y], [W + 300, y]], .5, C.stoneDk, 'inkfine', 0);
      for (let c = 0; c < 9; c++) { const xx = -200 + c * 280 + (r % 2) * 140; inkLine([[xx, y], [xx, y + 120]], .5, C.stoneDk, 'inkfine', 0); } }
    // slanting window light
    boilSeed('light');
    paint([[1250, -100], [1550, -100], [1250, 900], [850, 900]], { fill: '#FFF0C8', fillOp: 120, bleed: .15, tex: .4, ink: null });
    boilSeed('floor');
    paint(rectPts(-400, G, W + 800, 500), { wash: C.stoneDk, ink: null });
    // the table with the bundle
    boilSeed('table');
    paint(rectPts(BX - 230, G - 230, 460, 30), { wash: C.wood, ink: PAL.ink, sw: 1 });
    paint(rectPts(BX - 200, G - 200, 26, 200), { wash: C.woodDk, ink: PAL.ink, sw: .8 });
    paint(rectPts(BX + 174, G - 200, 26, 200), { wash: C.woodDk, ink: PAL.ink, sw: .8 });
    boilSeed('bundleB');
    bundle(BX, G - 230, 88, { mark: seg(lt, tPaint0, tPaint1), wig: .05 * spring(lt, tPaint1, 5, 18) });
    // the lectern with the old book: a big painted χ
    const LX = 330, LY = 620;
    boilSeed('lectern');
    paint([[LX - 40, G], [LX + 40, G], [LX + 22, LY + 40], [LX - 22, LY + 40]], { wash: C.woodDk, ink: PAL.ink, sw: .9 });
    paint([[LX - 170, LY + 50], [LX + 170, LY + 50], [LX + 150, LY - 30], [LX - 150, LY - 30]], { wash: C.wood, ink: PAL.ink, sw: .9 });
    paint([[LX - 150, LY + 30], [LX, LY + 44], [LX, LY - 60], [LX - 140, LY - 72]], { wash: PAL.cream, ink: PAL.ink, sw: .8, curv: .3 });
    paint([[LX + 150, LY + 30], [LX, LY + 44], [LX, LY - 60], [LX + 140, LY - 72]], { wash: PAL.cream, ink: PAL.ink, sw: .8, curv: .3 });
    for (let i = 0; i < 4; i++) inkLine([[LX - 125, LY - 40 + i * 18], [LX - 25, LY - 34 + i * 18]], .4, C.stoneDk, 'inkfine', 0);   // lines of script (marks, not letters)
    const chiGlow = seg(lt, tLook + .3, tLook + .7) * (1 - seg(lt, tIdea + .5, tIdea + 1.2));
    if (chiGlow > 0) glow(LX + 70, LY - 10, 120, '#FFE6A0', chiGlow);
    boilSeed('chi');   // the Greek chi: two curved strokes, one sweeping
    inkLine([[LX + 22, LY - 40], [LX + 38, LY - 52], [LX + 55, LY - 30], [LX + 80, LY + 5], [LX + 102, LY + 30], [LX + 122, LY + 22]], 1.6, '#7A2E2E', 'ink', .8);
    inkLine([[LX + 110, LY - 50], [LX + 70, LY - 8], [LX + 50, LY + 18], [LX + 40, LY + 40]], 1.1, '#7A2E2E', 'ink', .8);

    // Clawd: tries to say it, can't, sees the χ, paints two crossed strokes on the bundle
    const mood = emotions(lt, [[0, 'thinking', { lookX: .9 }], [tSay1 - .3, 'determined', { lookX: .9, mouth: 'O' }], [tSay2 - .4, 'nervous', { lookX: .6, mouth: 'O' }],
      [tSweat, 'nervous', { emote: 'sweat', lookX: .3 }], [tLook, 'surprised', { lookX: -1, emote: '!' }], [tIdea, 'idea', { lookX: -1 }],
      [tPaint0 - .3, 'determined', { lookX: 1 }], [tProud, 'proud', { lookX: .8 }]]);
    const x = 760 + 220 * ease(seg(lt, tPaint0 - .5, tPaint0 - .05));
    let face = {};
    if (lt < tLook - .1) face = { view: 'q' };
    else if (lt < tLook + .1) face = turn(lt, tLook - .1, tLook + .1, .125, -.125);
    else if (lt < tIdea + .3) face = { view: 'q', flip: true };
    else if (lt < tIdea + .5) face = turn(lt, tIdea + .3, tIdea + .5, -.125, .125);
    else face = { view: 'q' };
    const strokeK = seg(lt, tPaint0, tPaint1);
    const reach = lt > tPaint0 - .3 && lt < tPaint1 + .2;
    const cl = { ...mood, ...face, draw: turban, hat: null,
      aR: reach ? .9 + .5 * Math.sin(strokeK * TAU) : (mood.aR ?? .2), aL: mood.aL ?? .2,
      armR: lt > tIdea + .4 ? brushTool : null };
    clawd(x, G, u, cl);
    // the "shhh": a wavy puff from the mouth that dissolves before it becomes anything
    for (const [ts, len] of [[tSay1, 1.0], [tSay2, .6]]) {
      const q = seg(lt, ts, ts + len); if (q <= 0 || q >= 1) continue;
      boilSeed('shh' + ts);
      const mx = x + 4.2 * u, my = G - 4.6 * u, P = [];
      for (let i = 0; i <= 8; i++) { const k = i / 8 * Math.min(1, q * 2.2); P.push([mx + k * 260 * (len > .8 ? 1 : .6), my - 20 * k + 16 * Math.sin(k * 14 - lt * 10)]); }
      if (P.length > 2 && Math.hypot(P[8][0] - P[0][0], P[8][1] - P[0][1]) > 10) paint(ribbon(P, 6, 34 * (1 - q * .5)), { wash: PAL.cream, washOp: 230 * (1 - seg(q, .55, 1)), ink: PAL.ink, sw: .5 * (1 - q) });
      for (let i = 0; i < 4; i++) { const qq = seg(q, .5 + i * .08, 1); if (qq > 0 && qq < 1) paint(ellPts(mx + 200 + i * 30, my - 30 - 60 * qq + i * 12, 8 * (1 - qq), 8 * (1 - qq), 8), { wash: PAL.cream, washOp: 200, ink: null }); }
    }
    camEnd();
    boilSeed('transition');
    if (lt < .3) brushWipe(.5 + lt / .6, [PAL.night, C.stoneDk]);
    if (lt > dur - .3) brushWipe((lt - (dur - .3)) / .6, [C.sepiaDk, PAL.ink]);
  }

  // ---------- C: the printing house, the mark spreads ----------
  function shotC(t, lt, dur) {
    const u = 26, G = 940, PX = 760, stamps = [1.0, 2.0, 2.7, 3.3, 3.8, 4.25, 4.65, 5.0], tDizzy = 5.4, tFloat = 6.0;
    const hit = stamps.reduce((s, e) => s + (lt > e ? Math.exp(-(lt - e) * 9) : 0), 0);
    const sh = shakeXY(t, 6 * clamp(hit));
    camBegin(900 + sh[0] + 15 * Math.sin(lt * .7), 540 + sh[1], kf(lt, [[0, 1.05], [dur, 1.12]]));
    boilSeed('sepia');
    paint(rectPts(-300, -300, W + 600, H + 600), { wash: C.sepia, ink: null });
    paint(ellPts(900, 420, 900, 500, 26, 8), { fill: mixCol(C.sepia, PAL.cream, .4), fillOp: 120, bleed: .3, tex: .5, ink: null });
    boilSeed('beams');
    for (const bx of [120, 1700]) paint(rectPts(bx, -200, 60, G + 200), { wash: C.sepiaDk, ink: PAL.ink, sw: .8 });
    paint(rectPts(-200, G, W + 400, 400), { wash: C.sepiaDk, ink: null });
    inkLine([[-200, G], [W + 200, G]], 1, PAL.ink, 'ink', 0);

    // the press: two posts, a crossbeam, a screw and a platen that slams on each stamp
    const down = stamps.reduce((m, e) => { const a = lt - e; return a > -.15 && a < .25 ? Math.max(m, a < 0 ? easeIn(seg(a, -.15, 0)) : 1 - ease(seg(a, .05, .25))) : m; }, 0);
    boilSeed('press');
    paint(rectPts(PX - 260, 260, 50, G - 260), { wash: C.wood, ink: PAL.ink, sw: 1 });
    paint(rectPts(PX + 210, 260, 50, G - 260), { wash: C.wood, ink: PAL.ink, sw: 1 });
    paint(rectPts(PX - 300, 220, 600, 60), { wash: C.woodDk, ink: PAL.ink, sw: 1 });
    paint(rectPts(PX - 230, G - 260, 460, 40), { wash: C.wood, ink: PAL.ink, sw: 1 });   // the bed
    const platY = lerp(420, G - 300, down);
    paint(rectPts(PX - 18, 280, 36, platY - 280), { wash: C.brass, ink: PAL.ink, sw: .8 });
    for (let k = 0; k < 5; k++) inkLine([[PX - 18, 300 + k * (platY - 300) / 5], [PX + 18, 320 + k * (platY - 300) / 5]], .5, PAL.ink, 'inkfine', 0);
    paint(rectPts(PX - 170, platY, 340, 40), { wash: C.woodDk, ink: PAL.ink, sw: 1 });
    // the lever, pulled by Clawd
    const lev = -.5 + 1.1 * down;
    const pivot = [PX + 18, 330], lend = [pivot[0] + Math.cos(lev) * 360, pivot[1] + Math.sin(lev) * 360];
    inkLine([pivot, lend], 3, C.woodDk, 'ink', 0);
    paint(ellPts(...lend, 18, 18, 10), { wash: C.wood, ink: PAL.ink, sw: .8 });
    // the sheet on the bed
    const sheetIdx = stamps.filter(e => lt > e + .25).length;
    boilSeed('bedsheet');
    paint(rectPts(PX - 120, G - 270, 240, 14), { wash: PAL.cream, ink: PAL.ink, sw: .5 });
    // flying sheets: each stamped sheet leaves on an arc, tumbling, and scatters
    for (let i = 0; i < sheetIdx; i++) {
      boilSeed('sheet' + i);
      const a = lt - stamps[i] - .25, k = clamp(a / 1.6);
      const dest = [180 + hash(i * 3) * 1500, 120 + hash(i * 5) * 420];
      const p = arcPt([PX, G - 280], dest, 300 + 200 * hash(i), easeOut(k));
      const fl = a > 1.6 ? [8 * Math.sin(lt * 2 + i), 6 * Math.sin(lt * 1.7 + i * 2)] : [0, 0];
      push(); translate(p[0] + fl[0], p[1] + fl[1]); rotate((hash(i + 1) - .5) * 2 + k * (hash(i + 2) - .5) * 6 + .1 * Math.sin(lt * 2 + i));
      const sw2 = 100, sh2 = 130;
      paint(rectPts(-sw2 / 2, -sh2 / 2, sw2, sh2, 2), { wash: PAL.cream, ink: PAL.ink, sw: .6 });
      xMark(0, 0, 26, 1, PAL.ink, 1.3, 'ink');
      pop();
    }
    // Clawd: works the lever on each stamp, happier, then dizzy in the paper storm
    const mood = emotions(lt, [[0, 'determined', { lookX: -1 }], [2.2, 'happy', { lookX: -1 }], [3.6, 'excited', { lookX: -.6, lookY: -.5 }], [tDizzy, 'dizzy']]);
    const cx = PX + 520;
    boilSeed('rope');
    const hand = [cx - 5.6 * u, G - 5.2 * u + 1.2 * u * down];
    inkLine([lend, [lerp(lend[0], hand[0], .5), lerp(lend[1], hand[1], .5) + 30], hand], 1.2, C.woodDk, 'ink', .6);
    paint(ellPts(...hand, 12, 16, 10), { wash: C.wood, ink: PAL.ink, sw: .6 });
    clawd(cx, G, u, { ...mood, view: 'q', flip: true, hat: 'top', aR: .9 - .5 * down, aL: (mood.aL ?? .2) * .5 + .3, dy: (mood.dy || 0) + .4 * down, sq: (mood.sq || 0) + .12 * down });
    camEnd();
    boilSeed('transition');
    if (lt < .3) brushWipe(.5 + lt / .6, [C.sepiaDk, PAL.ink]);
    // one sheet floats up to the camera and covers it (the paper wipe into D)
    if (lt > tFloat) {
      boilSeed('coverSheet');
      const k = easeIn(seg(lt, tFloat, dur)), s = lerp(1, 18, k);
      push(); translate(lerp(1300, 960, k), lerp(320, 540, k)); rotate(lerp(.5, 0, k)); scale(s);
      paint(rectPts(-60, -78, 120, 156, 1), { wash: PAL.cream, ink: PAL.ink, sw: .6 / Math.max(1, s * .3) });
      xMark(0, 0, 16, 1, PAL.ink, 1.1 / Math.max(1, s * .25), 'ink');
      pop();
    }
  }

  // ---------- D: today, the answer ----------
  function shotD(t, lt, dur) {
    const u = 26, G = 950, SX = 980, SY = 640, tEr1 = 2.0, tEr2 = 2.7, tGet = 3.4, tOpen = 4.4, tStar = 5.1, tProud = 6.1, tIris = 6.7;
    const camK = ease(seg(lt, tProud, tIris + .4));
    camBegin(lerp(960, SX - 150, camK) + 8 * Math.sin(lt * .6), lerp(540, SY - 120, camK), lerp(1, 1.5, camK));
    boilSeed('room');
    paint(rectPts(-300, -300, W + 600, H + 600), { wash: '#E9D6B4', ink: null });
    glow(1700, 120, 700, '#FFE2A8', .5);   // morning light
    boilSeed('board');
    paint(rectPts(300, 160, 1320, 640, 2), { wash: C.board, fill: C.boardDk, fillOp: 90, bleed: .1, tex: .5, ink: PAL.ink, sw: 1.2 });
    paint(rectPts(280, 790, 1360, 26, 2), { wash: C.wood, ink: PAL.ink, sw: 1 });
    // the chalk scale: ✕ + 3 dots vs 5 dots → rub 3 out of each side → ✕ vs 2
    const er1 = seg(lt, tEr1, tEr1 + .45), er2 = seg(lt, tEr2, tEr2 + .45);
    boilSeed('chalkscale');
    const cpans = balance(SX, SY + 70, 230, .02 * Math.sin(lt * 1.3), (px, py) => {
      xMark(px - 38, py - 38, 26, 1, C.chalk, 2.2, 'ink');
      chalkDots(px + 50, py - 4, 3, 28, 1 - er1);
    }, (px, py) => {
      boilSeed('dotsR');
      const spots = [[-1.3, 0], [0, 0], [1.3, 0], [-.65, -1.1], [.65, -1.1]];
      for (let i = 0; i < 5; i++) { const gone = i >= 2 ? er2 : 0; if (gone < 1) paint(ellPts(px + spots[i][0] * 34, py + spots[i][1] * 34 - 20, 14, 14, 10, 1.5), { wash: C.chalk, washOp: 230 * (1 - gone), ink: null }); }
    }, { chalk: true, ink: C.chalk });
    // eraser smudges sweeping over the rubbed-out dots
    for (const [ts, ex] of [[tEr1, SX - 1.15 * 230 + 50], [tEr2, SX + 1.15 * 230]]) {
      const q = seg(lt, ts, ts + .45); if (q <= 0) continue;
      boilSeed('smudge' + ts);
      paint(ellPts(ex, SY + 20, 90 * Math.min(1, q * 1.5), 38, 16, 3), { fill: mixCol(C.board, C.chalk, .3), fillOp: 90 * (1 - seg(lt, ts + 1.2, ts + 2)), bleed: .2, tex: .5, ink: null });
      if (q < 1) { const ey = SY + 20 + 20 * Math.sin(q * TAU * 2); paint(rrPts(ex - 70 + 140 * q - 40, ey - 22, 80, 44, 8), { wash: '#C77B5A', ink: PAL.ink, sw: .8 }); }
    }
    // the desk with the bundle from the beginning
    const BX = 1460;
    boilSeed('deskD');
    paint(rectPts(BX - 200, G - 170, 400, 26), { wash: C.wood, ink: PAL.ink, sw: 1 });
    paint(rectPts(BX - 180, G - 144, 22, 144), { wash: C.woodDk, ink: PAL.ink, sw: .8 });
    paint(rectPts(BX + 158, G - 144, 22, 144), { wash: C.woodDk, ink: PAL.ink, sw: .8 });
    boilSeed('floorD');
    paint(rectPts(-300, G, W + 600, 400), { wash: '#B9946A', ink: null });
    inkLine([[-300, G], [W + 300, G]], 1, PAL.ink, 'ink', 0);
    boilSeed('bundleD');
    const open = seg(lt, tOpen, tOpen + .9);
    bundle(BX, G - 170, 92, { mark: 1, open, wig: .12 * spring(lt, tOpen - .25, 6, 26) });
    if (open > .3) for (let i = 0; i < 6; i++) { const q = seg(lt, tOpen + .5 + i * .08, tOpen + 1.3 + i * .08); if (q > 0 && q < 1) { const a = -Math.PI / 2 + (i - 2.5) * .4; paint(starPts(BX + Math.cos(a) * 160 * q, G - 270 + Math.sin(a) * 150 * q, 16 * backOut(q) * (1 - q * .6), .25, 4), { wash: PAL.cream, washOp: 255 * (1 - q * q), ink: null }); } }

    // Clawd: puzzles at the board, works it out, turns to the bundle as it opens, amazed, proud
    const mood = emotions(lt, [[0, 'thinking', { lookX: .6, lookY: -.6 }], [tEr1 - .2, 'determined', { lookX: .7, lookY: -.5 }], [tGet, 'idea', { lookX: .7, lookY: -.5 }],
      [tOpen + .1, 'surprised', { lookX: 1, lookY: -.2, emote: '!' }], [tStar, 'starstruck', { lookX: 1 }], [tProud, 'proud', { lookX: .5, lookY: -.4 }]]);
    const x = 560 + 140 * ease(seg(lt, tEr1 - .5, tEr1)) + 200 * ease(seg(lt, tGet + .2, tOpen - .3));
    const rub = (lt > tEr1 && lt < tEr1 + .45) || (lt > tEr2 && lt < tEr2 + .45);
    clawd(x, G, u, { ...mood, view: 'q', aR: rub ? 1.3 + .3 * Math.sin(lt * 30) : (mood.aR ?? .2), aL: mood.aL ?? .2,
      armR: lt < tGet + .3 && lt > .8 ? (uu, sw) => paint(rrPts(0, -uu * .35, uu * .9, uu * .7, uu * .15), { wash: C.chalk, ink: PAL.ink, sw: sw * .6 }) : null });
    const markAt = toScreen(cpans[0][0] - 38, cpans[0][1] - 38);
    camEnd();
    boilSeed('transition');
    // open: the covering sheet lifts off upward (continuing the paper wipe from C)
    if (lt < .7) {
      const k = easeIn(seg(lt, 0, .7));
      push(); translate(960, 540 - 1400 * k); rotate(-.12 * k); scale(18 * (1 - .3 * k));
      paint(rectPts(-60, -78, 120, 156, 1), { wash: PAL.cream, ink: null });
      xMark(0, 0, 16, 1, PAL.ink, 1.1 / 4.5, 'ink');
      pop();
    }
    // close: an ✕-shaped iris on the chalk ✕, hold, then shut
    if (lt > tIris) {
      const r = lt < dur - .5 ? lerp(1600, 150, ease(seg(lt, tIris, dur - .7))) : lerp(150, 0, easeIn(seg(lt, dur - .4, dur - .05)));
      if (r < 6) paint(rectPts(-60, -60, W + 120, H + 120), { wash: PAL.ink, ink: null });
      else {
        const [mx, my] = markAt, P = [];
        for (let i = 0; i < 4; i++) {   // an X-shaped hole: 4 arms
          const a = Math.PI / 4 + i * Math.PI / 2, w = .32;
          P.push([mx + Math.cos(a - w) * r * .35, my + Math.sin(a - w) * r * .35], [mx + Math.cos(a - .12) * r, my + Math.sin(a - .12) * r], [mx + Math.cos(a + .12) * r, my + Math.sin(a + .12) * r], [mx + Math.cos(a + w) * r * .35, my + Math.sin(a + w) * r * .35]);
        }
        irisShape(P, PAL.ink);
      }
    }
  }

  shots([[0, shotA], [7.5, shotB], [15, shotC], [22, shotD]]);
})();
