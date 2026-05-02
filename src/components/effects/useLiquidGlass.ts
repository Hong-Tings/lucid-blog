import { useEffect, useRef, useCallback } from 'react';

interface LiquidGlassOptions {
  enabled?: boolean;
  strength?: number; // 扭曲强度 0-1
  blur?: number;     // 模糊程度
}

export function useLiquidGlass(options: LiquidGlassOptions = {}) {
  const { enabled = true, strength = 0.3, blur = 0.25 } = options;
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const idRef = useRef('lg-' + Math.random().toString(36).substr(2, 9));

  const smoothStep = useCallback((a: number, b: number, t: number) => {
    t = Math.max(0, Math.min(1, (t - a) / (b - a)));
    return t * t * (3 - 2 * t);
  }, []);

  const roundedRectSDF = useCallback((x: number, y: number, w: number, h: number, r: number) => {
    const qx = Math.abs(x) - w + r;
    const qy = Math.abs(y) - h + r;
    return Math.min(Math.max(qx, qy), 0) + Math.sqrt(Math.max(qx, 0) ** 2 + Math.max(qy, 0) ** 2) - r;
  }, []);

  const updateShader = useCallback(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const svg = svgRef.current;
    if (!container || !canvas || !svg) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const data = new Uint8ClampedArray(w * h * 4);
    const rawValues: number[] = [];
    let maxScale = 0;

    for (let i = 0; i < data.length; i += 4) {
      const x = (i / 4) % w;
      const y = Math.floor(i / 4 / w);
      const uvx = x / w;
      const uvy = y / h;

      const ix = uvx - 0.5;
      const iy = uvy - 0.5;
      const dist = roundedRectSDF(ix, iy, 0.35, 0.35, 0.15);
      const disp = smoothStep(0.8, 0, dist - 0.15) * strength;
      const scaled = smoothStep(0, 1, disp);

      const dx = (ix * scaled + 0.5) * w - x;
      const dy = (iy * scaled + 0.5) * h - y;
      maxScale = Math.max(maxScale, Math.abs(dx), Math.abs(dy));
      rawValues.push(dx, dy);
    }

    maxScale *= 0.5;
    let idx = 0;
    for (let i = 0; i < data.length; i += 4) {
      data[i] = (rawValues[idx++] / maxScale + 0.5) * 255;
      data[i + 1] = (rawValues[idx++] / maxScale + 0.5) * 255;
      data[i + 2] = 0;
      data[i + 3] = 255;
    }

    ctx.putImageData(new ImageData(data, w, h), 0, 0);

    const feImage = svg.querySelector(`#${idRef.current}_map`) as SVGImageElement;
    const feDisp = svg.querySelector(`#${idRef.current}_disp`) as SVGFEElement;
    if (feImage) feImage.setAttributeNS('http://www.w3.org/1999/xlink', 'href', canvas.toDataURL());
    if (feDisp) feDisp.setAttribute('scale', (maxScale).toString());
  }, [strength, smoothStep, roundedRectSDF]);

  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    const container = containerRef.current;
    const id = idRef.current;

    // Create SVG filter
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg') as SVGSVGElement;
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttribute('width', '0');
    svg.setAttribute('height', '0');
    svg.style.cssText = 'position:fixed;top:0;left:0;pointer-events:none;z-index:-1;';

    const rect = container.getBoundingClientRect();
    const filterW = Math.ceil(rect.width);
    const filterH = Math.ceil(rect.height);

    svg.innerHTML = `
      <defs>
        <filter id="${id}_filter" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"
                x="0" y="0" width="${filterW}" height="${filterH}">
          <feImage id="${id}_map" width="${filterW}" height="${filterH}" />
          <feDisplacementMap id="${id}_disp" in="SourceGraphic" in2="${id}_map"
                             xChannelSelector="R" yChannelSelector="G" scale="0" />
        </filter>
      </defs>
    `;

    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.width = filterW;
    canvas.height = filterH;
    canvas.style.display = 'none';

    document.body.appendChild(svg);
    document.body.appendChild(canvas);

    svgRef.current = svg;
    canvasRef.current = canvas;

    // Apply filter to container
    container.style.backdropFilter = `url(#${id}_filter) blur(${blur}px) contrast(1.1) brightness(1.05) saturate(1.1)`;
    (container.style as any).webkitBackdropFilter = `url(#${id}_filter) blur(${blur}px) contrast(1.1) brightness(1.05) saturate(1.1)`;

    updateShader();

    return () => {
      svg.remove();
      canvas.remove();
      svgRef.current = null;
      canvasRef.current = null;
    };
  }, [enabled, blur, updateShader]);

  return containerRef;
}
