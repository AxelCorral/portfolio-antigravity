/**
 * Colour maths shared by the UI-loop probes, injected into the page with
 * `page.addInitScript({ path })` so every probe measures the *same* numbers.
 *
 * Tailwind v4 emits every utility colour as `oklch()` and `getComputedStyle`
 * hands it back unresolved. A parser that only knows `rgb()` does not fail
 * loudly on that: it returns null, the node is skipped, and the probe reports a
 * cleaner page than the one on screen. That is exactly how the first run of
 * `ui-hierarchy-probe.mjs` measured 15 of the 35 text nodes of `#capabilities`
 * (cycle 021). Every notation the browser can emit is parsed here, once.
 *
 * Calibration (cycle 021, unchanged): oklch(0.707 0.022 261.325) -> (153,161,175)
 * for an expected (156,163,175), and oklab(0.888647 -0.00422654 0.0253462) ->
 * (222,219,200), i.e. exactly what the browser resolves `text-primary` to.
 */
(() => {
  const srgbFromOklab = (L, a, b) => {
    const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
    const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
    const s_ = L - 0.0894841775 * a - 1.291485548 * b;
    const l = l_ ** 3;
    const m = m_ ** 3;
    const s = s_ ** 3;
    const lin = [
      4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
      -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
      -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
    ];
    return lin.map((v) => {
      const e = v <= 0.0031308 ? 12.92 * v : 1.055 * Math.abs(v) ** (1 / 2.4) - 0.055;
      return Math.max(0, Math.min(255, e * 255));
    });
  };

  const parseColor = (c) => {
    if (!c || c === "transparent" || c === "none") return { r: 0, g: 0, b: 0, a: 0 };
    const rgb = c.match(/rgba?\(([^)]+)\)/);
    if (rgb) {
      const [r, g, b, a = 1] = rgb[1].split(/[,\s/]+/).filter(Boolean).map(parseFloat);
      return { r, g, b, a };
    }
    const lab = c.match(/oklab\(([^)]+)\)/i);
    if (lab) {
      const parts = lab[1].split("/");
      const [Lr, ar, br] = parts[0].trim().split(/\s+/);
      const L = Lr.endsWith("%") ? parseFloat(Lr) / 100 : parseFloat(Lr);
      const alphaRaw = parts[1]?.trim();
      const alpha =
        alphaRaw === undefined
          ? 1
          : alphaRaw.endsWith("%")
            ? parseFloat(alphaRaw) / 100
            : parseFloat(alphaRaw);
      const [r, g, bl] = srgbFromOklab(L, parseFloat(ar), parseFloat(br));
      return { r, g, b: bl, a: Number.isNaN(alpha) ? 1 : alpha };
    }
    const ok = c.match(/oklch\(([^)]+)\)/i);
    if (ok) {
      const parts = ok[1].split("/");
      const [Lr, Cr, Hr] = parts[0].trim().split(/\s+/);
      const L = Lr.endsWith("%") ? parseFloat(Lr) / 100 : parseFloat(Lr);
      const C = Cr.endsWith("%") ? (parseFloat(Cr) / 100) * 0.4 : parseFloat(Cr);
      const H = parseFloat(Hr ?? "0") || 0;
      const ar = parts[1]?.trim();
      const a = ar === undefined ? 1 : ar.endsWith("%") ? parseFloat(ar) / 100 : parseFloat(ar);
      const h = (H * Math.PI) / 180;
      const [r, g, b] = srgbFromOklab(L, C * Math.cos(h), C * Math.sin(h));
      return { r, g, b, a: Number.isNaN(a) ? 1 : a };
    }
    return null;
  };

  const over = (fg, bg) => ({
    r: fg.r * fg.a + bg.r * (1 - fg.a),
    g: fg.g * fg.a + bg.g * (1 - fg.a),
    b: fg.b * fg.a + bg.b * (1 - fg.a),
    a: 1,
  });

  const lum = ({ r, g, b }) => {
    const f = (v) => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };

  const ratio = (a, b) => {
    const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
    return (hi + 0.05) / (lo + 0.05);
  };

  const bgOf = (el) => {
    let acc = null;
    let node = el;
    while (node && node !== document.documentElement.parentNode) {
      const c = parseColor(getComputedStyle(node).backgroundColor);
      if (c && c.a > 0) acc = acc ? over(acc, c) : c;
      if (acc && acc.a >= 0.999) return acc;
      node = node.parentElement;
    }
    const base = { r: 0, g: 0, b: 0, a: 1 };
    return acc ? over(acc, base) : base;
  };

  /** Opacity actually applied to a node = product of the whole ancestor chain. */
  const effectiveOpacity = (el) => {
    let o = 1;
    let node = el;
    while (node && node.nodeType === 1) {
      const v = parseFloat(getComputedStyle(node).opacity);
      if (!Number.isNaN(v)) o *= v;
      node = node.parentElement;
    }
    return o;
  };

  window.__probe = { parseColor, over, lum, ratio, bgOf, effectiveOpacity };
})();
