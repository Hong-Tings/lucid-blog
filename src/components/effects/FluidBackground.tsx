import { useEffect, useRef } from 'react';

interface Props {
  delaySplash?: boolean; // 延迟初始喷射，等待开屏动画完成
}

/**
 * WebGL Fluid Simulation — adapted from Pavel Dobryakov's WebGL-Fluid-Simulation
 * Warm color palette for Lucid blog
 */
export default function FluidBackground({ delaySplash = false }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // --- Config ---
    const config = {
      SIM_RESOLUTION: 128,
      DYE_RESOLUTION: 1024,
      CAPTURE_RESOLUTION: 512,
      DENSITY_DISSIPATION: 0.6,
      VELOCITY_DISSIPATION: 0.08,
      PRESSURE: 0.8,
      PRESSURE_ITERATIONS: 20,
      CURL: 30,
      SPLAT_RADIUS: 0.25,
      SPLAT_FORCE: 6000,
      SHADING: true,
      COLORFUL: true,
      COLOR_UPDATE_SPEED: 10,
      PAUSED: false,
      BACK_COLOR: { r: 0, g: 0, b: 0 },
      TRANSPARENT: false,
      BLOOM: true,
      BLOOM_ITERATIONS: 8,
      BLOOM_RESOLUTION: 256,
      BLOOM_INTENSITY: 0.4,
      BLOOM_THRESHOLD: 0.6,
      BLOOM_SOFT_KNEE: 0.7,
      SUNRAYS: true,
      SUNRAYS_RESOLUTION: 196,
      SUNRAYS_WEIGHT: 1.0,
    };

    // --- WebGL Setup ---
    const params: WebGLContextAttributes = { alpha: true, depth: false, stencil: false, antialias: false, preserveDrawingBuffer: false };
    let gl = canvas.getContext('webgl2', params) as WebGL2RenderingContext | null;
    const isWebGL2 = !!gl;
    if (!gl) gl = canvas.getContext('webgl', params) as unknown as WebGL2RenderingContext;
    if (!gl) return;

    let halfFloat: OES_texture_half_float | null = null;
    let supportLinearFiltering: OES_texture_half_float_linear | null = null;

    if (isWebGL2) {
      (gl as WebGL2RenderingContext).getExtension('EXT_color_buffer_float');
      supportLinearFiltering = (gl as WebGL2RenderingContext).getExtension('OES_texture_float_linear');
    } else {
      halfFloat = (gl as unknown as WebGLRenderingContext).getExtension('OES_texture_half_float') as OES_texture_half_float | null;
      supportLinearFiltering = (gl as unknown as WebGLRenderingContext).getExtension('OES_texture_half_float_linear') as OES_texture_half_float_linear | null;
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    const halfFloatTexType = isWebGL2 ? (gl as WebGL2RenderingContext).HALF_FLOAT : (halfFloat as any)?.HALF_FLOAT_OES;

    function getSupportedFormat(internalFormat: number, format: number, type: number): { internalFormat: number; format: number } | null {
      if (!supportRenderTextureFormat(internalFormat, format, type)) {
        switch (internalFormat) {
          case (gl as WebGL2RenderingContext).R16F: return getSupportedFormat((gl as WebGL2RenderingContext).RG16F, (gl as WebGL2RenderingContext).RG, type);
          case (gl as WebGL2RenderingContext).RG16F: return getSupportedFormat((gl as WebGL2RenderingContext).RGBA16F, (gl as WebGL2RenderingContext).RGBA, type);
          default: return null;
        }
      }
      return { internalFormat, format };
    }

    function supportRenderTextureFormat(internalFormat: number, format: number, type: number): boolean {
      const texture = gl!.createTexture();
      gl!.bindTexture(gl!.TEXTURE_2D, texture);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, gl!.NEAREST);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, gl!.NEAREST);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE);
      gl!.texImage2D(gl!.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);
      const fbo = gl!.createFramebuffer();
      gl!.bindFramebuffer(gl!.FRAMEBUFFER, fbo);
      gl!.framebufferTexture2D(gl!.FRAMEBUFFER, gl!.COLOR_ATTACHMENT0, gl!.TEXTURE_2D, texture, 0);
      const status = gl!.checkFramebufferStatus(gl!.FRAMEBUFFER);
      gl!.deleteTexture(texture);
      gl!.deleteFramebuffer(fbo);
      return status === gl!.FRAMEBUFFER_COMPLETE;
    }

    let formatRGBA: { internalFormat: number; format: number } | null;
    let formatRG: { internalFormat: number; format: number } | null;
    let formatR: { internalFormat: number; format: number } | null;

    if (isWebGL2) {
      formatRGBA = getSupportedFormat((gl as WebGL2RenderingContext).RGBA16F, (gl as WebGL2RenderingContext).RGBA, halfFloatTexType);
      formatRG = getSupportedFormat((gl as WebGL2RenderingContext).RG16F, (gl as WebGL2RenderingContext).RG, halfFloatTexType);
      formatR = getSupportedFormat((gl as WebGL2RenderingContext).R16F, (gl as WebGL2RenderingContext).RED, halfFloatTexType);
    } else {
      formatRGBA = getSupportedFormat(gl.RGBA, gl.RGBA, halfFloatTexType);
      formatRG = getSupportedFormat(gl.RGBA, gl.RGBA, halfFloatTexType);
      formatR = getSupportedFormat(gl.RGBA, gl.RGBA, halfFloatTexType);
    }

    // --- Shader helpers ---
    class Program {
      uniforms: Record<string, WebGLUniformLocation> = {};
      program: WebGLProgram;
      constructor(vertexShader: WebGLShader, fragmentShader: WebGLShader) {
        this.program = createProgram(vertexShader, fragmentShader)!;
        this.uniforms = getUniforms(this.program);
      }
      bind() { gl!.useProgram(this.program); }
    }

    class Material {
      vertexShader: WebGLShader;
      fragmentShaderSource: string;
      programs: Record<number, WebGLProgram | null> = {};
      activeProgram: WebGLProgram | null = null;
      uniforms: Record<string, WebGLUniformLocation> = {};
      constructor(vertexShader: WebGLShader, fragmentShaderSource: string) {
        this.vertexShader = vertexShader;
        this.fragmentShaderSource = fragmentShaderSource;
      }
      setKeywords(keywords: string[]) {
        let hash = 0;
        for (let i = 0; i < keywords.length; i++) hash += hashCode(keywords[i]);
        let program = this.programs[hash];
        if (program == null) {
          const fragmentShader = compileShader(gl!.FRAGMENT_SHADER, this.fragmentShaderSource, keywords);
          program = createProgram(this.vertexShader, fragmentShader)!;
          this.programs[hash] = program;
        }
        if (program === this.activeProgram) return;
        this.uniforms = getUniforms(program!);
        this.activeProgram = program;
      }
      bind() { gl!.useProgram(this.activeProgram); }
    }

    function createProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram | null {
      const program = gl!.createProgram();
      gl!.attachShader(program!, vertexShader);
      gl!.attachShader(program!, fragmentShader);
      gl!.linkProgram(program!);
      return program;
    }

    function getUniforms(program: WebGLProgram): Record<string, WebGLUniformLocation> {
      const uniforms: Record<string, WebGLUniformLocation> = {};
      const count = gl!.getProgramParameter(program, gl!.ACTIVE_UNIFORMS) as number;
      for (let i = 0; i < count; i++) {
        const info = gl!.getActiveUniform(program, i);
        if (info) uniforms[info.name] = gl!.getUniformLocation(program, info.name)!;
      }
      return uniforms;
    }

    function compileShader(type: number, source: string, keywords?: string[]): WebGLShader {
      if (keywords) source = keywords.map(k => `#define ${k}\n`).join('') + source;
      const shader = gl!.createShader(type)!;
      gl!.shaderSource(shader, source);
      gl!.compileShader(shader);
      return shader;
    }

    function hashCode(s: string): number {
      let hash = 0;
      for (let i = 0; i < s.length; i++) { hash = (hash << 5) - hash + s.charCodeAt(i); hash |= 0; }
      return hash;
    }

    // --- Shaders ---
    const baseVertexShader = compileShader(gl.VERTEX_SHADER, `
      precision highp float;
      attribute vec2 aPosition;
      varying vec2 vUv;
      varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
      uniform vec2 texelSize;
      void main () {
        vUv = aPosition * 0.5 + 0.5;
        vL = vUv - vec2(texelSize.x, 0.0);
        vR = vUv + vec2(texelSize.x, 0.0);
        vT = vUv + vec2(0.0, texelSize.y);
        vB = vUv - vec2(0.0, texelSize.y);
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `);

    const blurVertexShader = compileShader(gl.VERTEX_SHADER, `
      precision highp float;
      attribute vec2 aPosition;
      varying vec2 vUv; varying vec2 vL; varying vec2 vR;
      uniform vec2 texelSize;
      void main () {
        vUv = aPosition * 0.5 + 0.5;
        float offset = 1.33333333;
        vL = vUv - texelSize * offset;
        vR = vUv + texelSize * offset;
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `);

    const blurShader = compileShader(gl.FRAGMENT_SHADER, `
      precision mediump float; precision mediump sampler2D;
      varying vec2 vUv; varying vec2 vL; varying vec2 vR;
      uniform sampler2D uTexture;
      void main () {
        vec4 sum = texture2D(uTexture, vUv) * 0.29411764;
        sum += texture2D(uTexture, vL) * 0.35294117;
        sum += texture2D(uTexture, vR) * 0.35294117;
        gl_FragColor = sum;
      }
    `);

    const copyShader = compileShader(gl.FRAGMENT_SHADER, `
      precision mediump float; precision mediump sampler2D;
      varying highp vec2 vUv; uniform sampler2D uTexture;
      void main () { gl_FragColor = texture2D(uTexture, vUv); }
    `);

    const clearShader = compileShader(gl.FRAGMENT_SHADER, `
      precision mediump float; precision mediump sampler2D;
      varying highp vec2 vUv; uniform sampler2D uTexture; uniform float value;
      void main () { gl_FragColor = value * texture2D(uTexture, vUv); }
    `);

    const colorShader = compileShader(gl.FRAGMENT_SHADER, `
      precision mediump float; uniform vec4 color;
      void main () { gl_FragColor = color; }
    `);

    const displayShaderSource = `
      precision highp float; precision highp sampler2D;
      varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
      uniform sampler2D uTexture; uniform sampler2D uBloom; uniform sampler2D uSunrays;
      uniform vec2 texelSize;
      vec3 linearToGamma (vec3 color) {
        color = max(color, vec3(0));
        return max(1.055 * pow(color, vec3(0.416666667)) - 0.055, vec3(0));
      }
      void main () {
        vec3 c = texture2D(uTexture, vUv).rgb;
        #ifdef SHADING
          vec3 lc = texture2D(uTexture, vL).rgb; vec3 rc = texture2D(uTexture, vR).rgb;
          vec3 tc = texture2D(uTexture, vT).rgb; vec3 bc = texture2D(uTexture, vB).rgb;
          float dx = length(rc) - length(lc); float dy = length(tc) - length(bc);
          vec3 n = normalize(vec3(dx, dy, length(texelSize)));
          float diffuse = clamp(dot(n, vec3(0.0, 0.0, 1.0)) + 0.7, 0.7, 1.0);
          c *= diffuse;
        #endif
        #ifdef BLOOM
          vec3 bloom = texture2D(uBloom, vUv).rgb;
          bloom = linearToGamma(bloom);
          c += bloom;
        #endif
        #ifdef SUNRAYS
          float sunrays = texture2D(uSunrays, vUv).r;
          c *= sunrays;
        #endif
        float a = max(c.r, max(c.g, c.b));
        gl_FragColor = vec4(c, a);
      }
    `;

    const splatShader = compileShader(gl.FRAGMENT_SHADER, `
      precision highp float; precision highp sampler2D;
      varying vec2 vUv; uniform sampler2D uTarget; uniform float aspectRatio;
      uniform vec3 color; uniform vec2 point; uniform float radius;
      void main () {
        vec2 p = vUv - point.xy; p.x *= aspectRatio;
        vec3 splat = exp(-dot(p, p) / radius) * color;
        vec3 base = texture2D(uTarget, vUv).xyz;
        gl_FragColor = vec4(base + splat, 1.0);
      }
    `);

    const advectionShader = compileShader(gl.FRAGMENT_SHADER, `
      precision highp float; precision highp sampler2D;
      varying vec2 vUv; uniform sampler2D uVelocity; uniform sampler2D uSource;
      uniform vec2 texelSize; uniform float dt; uniform float dissipation;
      void main () {
        vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
        vec4 result = texture2D(uSource, coord);
        float decay = 1.0 + dissipation * dt;
        gl_FragColor = result / decay;
      }
    `);

    const divergenceShader = compileShader(gl.FRAGMENT_SHADER, `
      precision mediump float; precision mediump sampler2D;
      varying highp vec2 vUv; varying highp vec2 vL; varying highp vec2 vR; varying highp vec2 vT; varying highp vec2 vB;
      uniform sampler2D uVelocity;
      void main () {
        float L = texture2D(uVelocity, vL).x; float R = texture2D(uVelocity, vR).x;
        float T = texture2D(uVelocity, vT).y; float B = texture2D(uVelocity, vB).y;
        vec2 C = texture2D(uVelocity, vUv).xy;
        if (vL.x < 0.0) L = -C.x; if (vR.x > 1.0) R = -C.x;
        if (vT.y > 1.0) T = -C.y; if (vB.y < 0.0) B = -C.y;
        float div = 0.5 * (R - L + T - B);
        gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
      }
    `);

    const curlShader = compileShader(gl.FRAGMENT_SHADER, `
      precision mediump float; precision mediump sampler2D;
      varying highp vec2 vUv; varying highp vec2 vL; varying highp vec2 vR; varying highp vec2 vT; varying highp vec2 vB;
      uniform sampler2D uVelocity;
      void main () {
        float L = texture2D(uVelocity, vL).y; float R = texture2D(uVelocity, vR).y;
        float T = texture2D(uVelocity, vT).x; float B = texture2D(uVelocity, vB).x;
        float vorticity = R - L - T + B;
        gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
      }
    `);

    const vorticityShader = compileShader(gl.FRAGMENT_SHADER, `
      precision highp float; precision highp sampler2D;
      varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
      uniform sampler2D uVelocity; uniform sampler2D uCurl; uniform float curl; uniform float dt;
      void main () {
        float L = texture2D(uCurl, vL).x; float R = texture2D(uCurl, vR).x;
        float T = texture2D(uCurl, vT).x; float B = texture2D(uCurl, vB).x;
        float C = texture2D(uCurl, vUv).x;
        vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
        force /= length(force) + 0.0001; force *= curl * C; force.y *= -1.0;
        vec2 vel = texture2D(uVelocity, vUv).xy;
        gl_FragColor = vec4(vel + force * dt, 0.0, 1.0);
      }
    `);

    const pressureShader = compileShader(gl.FRAGMENT_SHADER, `
      precision mediump float; precision mediump sampler2D;
      varying highp vec2 vUv; varying highp vec2 vL; varying highp vec2 vR; varying highp vec2 vT; varying highp vec2 vB;
      uniform sampler2D uPressure; uniform sampler2D uDivergence;
      void main () {
        float L = texture2D(uPressure, vL).x; float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x; float B = texture2D(uPressure, vB).x;
        float divergence = texture2D(uDivergence, vUv).x;
        float pressure = (L + R + B + T - divergence) * 0.25;
        gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
      }
    `);

    const gradientSubtractShader = compileShader(gl.FRAGMENT_SHADER, `
      precision mediump float; precision mediump sampler2D;
      varying highp vec2 vUv; varying highp vec2 vL; varying highp vec2 vR; varying highp vec2 vT; varying highp vec2 vB;
      uniform sampler2D uPressure; uniform sampler2D uVelocity;
      void main () {
        float L = texture2D(uPressure, vL).x; float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x; float B = texture2D(uPressure, vB).x;
        vec2 velocity = texture2D(uVelocity, vUv).xy;
        velocity.xy -= vec2(R - L, T - B);
        gl_FragColor = vec4(velocity, 0.0, 1.0);
      }
    `);

    const bloomPrefilterShader = compileShader(gl.FRAGMENT_SHADER, `
      precision mediump float; precision mediump sampler2D;
      varying vec2 vUv; uniform sampler2D uTexture; uniform vec3 curve; uniform float threshold;
      void main () {
        vec3 c = texture2D(uTexture, vUv).rgb;
        float br = max(c.r, max(c.g, c.b));
        float rq = clamp(br - curve.x, 0.0, curve.y); rq = curve.z * rq * rq;
        c *= max(rq, br - threshold) / max(br, 0.0001);
        gl_FragColor = vec4(c, 0.0);
      }
    `);

    const bloomBlurShader = compileShader(gl.FRAGMENT_SHADER, `
      precision mediump float; precision mediump sampler2D;
      varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
      uniform sampler2D uTexture;
      void main () {
        vec4 sum = vec4(0.0);
        sum += texture2D(uTexture, vL); sum += texture2D(uTexture, vR);
        sum += texture2D(uTexture, vT); sum += texture2D(uTexture, vB);
        sum *= 0.25; gl_FragColor = sum;
      }
    `);

    const bloomFinalShader = compileShader(gl.FRAGMENT_SHADER, `
      precision mediump float; precision mediump sampler2D;
      varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
      uniform sampler2D uTexture; uniform float intensity;
      void main () {
        vec4 sum = vec4(0.0);
        sum += texture2D(uTexture, vL); sum += texture2D(uTexture, vR);
        sum += texture2D(uTexture, vT); sum += texture2D(uTexture, vB);
        sum *= 0.25; gl_FragColor = sum * intensity;
      }
    `);

    const sunraysMaskShader = compileShader(gl.FRAGMENT_SHADER, `
      precision highp float; precision highp sampler2D;
      varying vec2 vUv; uniform sampler2D uTexture;
      void main () {
        vec4 c = texture2D(uTexture, vUv);
        float br = max(c.r, max(c.g, c.b));
        c.a = 1.0 - min(max(br * 20.0, 0.0), 0.8);
        gl_FragColor = c;
      }
    `);

    const sunraysShader = compileShader(gl.FRAGMENT_SHADER, `
      precision highp float; precision highp sampler2D;
      varying vec2 vUv; uniform sampler2D uTexture; uniform float weight;
      #define ITERATIONS 16
      void main () {
        float Density = 0.3; float Decay = 0.95; float Exposure = 0.7;
        vec2 coord = vUv; vec2 dir = vUv - 0.5;
        dir *= 1.0 / float(ITERATIONS) * Density;
        float illuminationDecay = 1.0;
        float color = texture2D(uTexture, vUv).a;
        for (int i = 0; i < ITERATIONS; i++) {
          coord -= dir; float col = texture2D(uTexture, coord).a;
          color += col * illuminationDecay * weight; illuminationDecay *= Decay;
        }
        gl_FragColor = vec4(color * Exposure, 0.0, 0.0, 1.0);
      }
    `);

    // --- Programs ---
    const blurProgram = new Program(blurVertexShader, blurShader);
    const copyProgram = new Program(baseVertexShader, copyShader);
    const clearProgram = new Program(baseVertexShader, clearShader);
    const colorProgram = new Program(baseVertexShader, colorShader);
    const bloomPrefilterProgram = new Program(baseVertexShader, bloomPrefilterShader);
    const bloomBlurProgram = new Program(baseVertexShader, bloomBlurShader);
    const bloomFinalProgram = new Program(baseVertexShader, bloomFinalShader);
    const sunraysMaskProgram = new Program(baseVertexShader, sunraysMaskShader);
    const sunraysProgram = new Program(baseVertexShader, sunraysShader);
    const splatProgram = new Program(baseVertexShader, splatShader);
    const advectionProgram = new Program(baseVertexShader, advectionShader);
    const divergenceProgram = new Program(baseVertexShader, divergenceShader);
    const curlProgram = new Program(baseVertexShader, curlShader);
    const vorticityProgram = new Program(baseVertexShader, vorticityShader);
    const pressureProgram = new Program(baseVertexShader, pressureShader);
    const gradientSubtractProgram = new Program(baseVertexShader, gradientSubtractShader);
    const displayMaterial = new Material(baseVertexShader, displayShaderSource);

    // --- Blit ---
    const blit = (() => {
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(0);
      return (destination: WebGLFramebuffer | null) => {
        gl.bindFramebuffer(gl.FRAMEBUFFER, destination);
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
      };
    })();

    // --- FBO helpers ---
    interface FBO { texture: WebGLTexture; fbo: WebGLFramebuffer; width: number; height: number; texelSizeX: number; texelSizeY: number; attach: (id: number) => number; }
    interface DoubleFBO { width: number; height: number; texelSizeX: number; texelSizeY: number; read: FBO; write: FBO; swap: () => void; }

    function createFBO(w: number, h: number, internalFormat: number, format: number, type: number, param: number): FBO {
      gl.activeTexture(gl.TEXTURE0);
      const texture = gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);
      const fbo = gl.createFramebuffer()!;
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      gl.viewport(0, 0, w, h);
      gl.clear(gl.COLOR_BUFFER_BIT);
      return {
        texture, fbo, width: w, height: h, texelSizeX: 1.0 / w, texelSizeY: 1.0 / h,
        attach(id) { gl.activeTexture(gl.TEXTURE0 + id); gl.bindTexture(gl.TEXTURE_2D, texture); return id; }
      };
    }

    function createDoubleFBO(w: number, h: number, internalFormat: number, format: number, type: number, param: number): DoubleFBO {
      let fbo1 = createFBO(w, h, internalFormat, format, type, param);
      let fbo2 = createFBO(w, h, internalFormat, format, type, param);
      return {
        width: w, height: h, texelSizeX: fbo1.texelSizeX, texelSizeY: fbo1.texelSizeY,
        get read() { return fbo1; }, set read(v) { fbo1 = v; },
        get write() { return fbo2; }, set write(v) { fbo2 = v; },
        swap() { const t = fbo1; fbo1 = fbo2; fbo2 = t; }
      };
    }

    // --- State ---
    let dye: DoubleFBO, velocity: DoubleFBO, divergence: FBO, curl: FBO, pressure: DoubleFBO;
    let bloom: FBO, bloomFramebuffers: FBO[] = [];
    let sunrays: FBO, sunraysTemp: FBO;

    function getResolution(resolution: number) {
      let aspectRatio = gl.drawingBufferWidth / gl.drawingBufferHeight;
      if (aspectRatio < 1) aspectRatio = 1.0 / aspectRatio;
      const min = Math.round(resolution);
      const max = Math.round(resolution * aspectRatio);
      return gl.drawingBufferWidth > gl.drawingBufferHeight
        ? { width: max, height: min } : { width: min, height: max };
    }

    function initFramebuffers() {
      if (!formatRGBA || !formatRG || !formatR) return;
      const simRes = getResolution(config.SIM_RESOLUTION);
      const dyeRes = getResolution(config.DYE_RESOLUTION);
      const texType = halfFloatTexType;
      const filtering = supportLinearFiltering ? gl.LINEAR : gl.NEAREST;

      dye = dye ? resizeDoubleFBO(dye, dyeRes.width, dyeRes.height, formatRGBA.internalFormat, formatRGBA.format, texType, filtering)
        : createDoubleFBO(dyeRes.width, dyeRes.height, formatRGBA.internalFormat, formatRGBA.format, texType, filtering);
      velocity = velocity ? resizeDoubleFBO(velocity, simRes.width, simRes.height, formatRG.internalFormat, formatRG.format, texType, filtering)
        : createDoubleFBO(simRes.width, simRes.height, formatRG.internalFormat, formatRG.format, texType, filtering);
      divergence = createFBO(simRes.width, simRes.height, formatR.internalFormat, formatR.format, texType, gl.NEAREST);
      curl = createFBO(simRes.width, simRes.height, formatR.internalFormat, formatR.format, texType, gl.NEAREST);
      pressure = createDoubleFBO(simRes.width, simRes.height, formatR.internalFormat, formatR.format, texType, gl.NEAREST);

      initBloomFramebuffers();
      initSunraysFramebuffers();
    }

    function initBloomFramebuffers() {
      if (!formatRGBA) return;
      const res = getResolution(config.BLOOM_RESOLUTION);
      bloom = createFBO(res.width, res.height, formatRGBA.internalFormat, formatRGBA.format, halfFloatTexType, supportLinearFiltering ? gl.LINEAR : gl.NEAREST);
      bloomFramebuffers = [];
      for (let i = 0; i < config.BLOOM_ITERATIONS; i++) {
        const w = res.width >> (i + 1), h = res.height >> (i + 1);
        if (w < 2 || h < 2) break;
        bloomFramebuffers.push(createFBO(w, h, formatRGBA.internalFormat, formatRGBA.format, halfFloatTexType, supportLinearFiltering ? gl.LINEAR : gl.NEAREST));
      }
    }

    function initSunraysFramebuffers() {
      if (!formatR) return;
      const res = getResolution(config.SUNRAYS_RESOLUTION);
      sunrays = createFBO(res.width, res.height, formatR.internalFormat, formatR.format, halfFloatTexType, supportLinearFiltering ? gl.LINEAR : gl.NEAREST);
      sunraysTemp = createFBO(res.width, res.height, formatR.internalFormat, formatR.format, halfFloatTexType, supportLinearFiltering ? gl.LINEAR : gl.NEAREST);
    }

    function resizeDoubleFBO(target: DoubleFBO, w: number, h: number, internalFormat: number, format: number, type: number, param: number): DoubleFBO {
      if (target.width === w && target.height === h) return target;
      const newFBO = createFBO(w, h, internalFormat, format, type, param);
      copyProgram.bind();
      gl.uniform1i(copyProgram.uniforms.uTexture, target.read.attach(0));
      blit(newFBO.fbo);
      target.read = newFBO;
      target.write = createFBO(w, h, internalFormat, format, type, param);
      target.width = w; target.height = h;
      target.texelSizeX = 1.0 / w; target.texelSizeY = 1.0 / h;
      return target;
    }

    // --- Simulation ---
    function step(dt: number) {
      gl.disable(gl.BLEND);
      gl.viewport(0, 0, velocity.width, velocity.height);

      curlProgram.bind();
      gl.uniform2f(curlProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(curlProgram.uniforms.uVelocity, velocity.read.attach(0));
      blit(curl.fbo);

      vorticityProgram.bind();
      gl.uniform2f(vorticityProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(vorticityProgram.uniforms.uVelocity, velocity.read.attach(0));
      gl.uniform1i(vorticityProgram.uniforms.uCurl, curl.attach(1));
      gl.uniform1f(vorticityProgram.uniforms.curl, config.CURL);
      gl.uniform1f(vorticityProgram.uniforms.dt, dt);
      blit(velocity.write.fbo);
      velocity.swap();

      divergenceProgram.bind();
      gl.uniform2f(divergenceProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(divergenceProgram.uniforms.uVelocity, velocity.read.attach(0));
      blit(divergence.fbo);

      clearProgram.bind();
      gl.uniform1i(clearProgram.uniforms.uTexture, pressure.read.attach(0));
      gl.uniform1f(clearProgram.uniforms.value, config.PRESSURE);
      blit(pressure.write.fbo);
      pressure.swap();

      pressureProgram.bind();
      gl.uniform2f(pressureProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(pressureProgram.uniforms.uDivergence, divergence.attach(0));
      for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) {
        gl.uniform1i(pressureProgram.uniforms.uPressure, pressure.read.attach(1));
        blit(pressure.write.fbo);
        pressure.swap();
      }

      gradientSubtractProgram.bind();
      gl.uniform2f(gradientSubtractProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(gradientSubtractProgram.uniforms.uPressure, pressure.read.attach(0));
      gl.uniform1i(gradientSubtractProgram.uniforms.uVelocity, velocity.read.attach(1));
      blit(velocity.write.fbo);
      velocity.swap();

      advectionProgram.bind();
      gl.uniform2f(advectionProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read.attach(0));
      gl.uniform1i(advectionProgram.uniforms.uSource, velocity.read.attach(0));
      gl.uniform1f(advectionProgram.uniforms.dt, dt);
      gl.uniform1f(advectionProgram.uniforms.dissipation, config.VELOCITY_DISSIPATION);
      blit(velocity.write.fbo);
      velocity.swap();

      gl.viewport(0, 0, dye.width, dye.height);
      gl.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read.attach(0));
      gl.uniform1i(advectionProgram.uniforms.uSource, dye.read.attach(1));
      gl.uniform1f(advectionProgram.uniforms.dissipation, config.DENSITY_DISSIPATION);
      blit(dye.write.fbo);
      dye.swap();
    }

    function applyBloom(source: FBO, destination: FBO) {
      if (bloomFramebuffers.length < 2) return;
      gl.disable(gl.BLEND);
      bloomPrefilterProgram.bind();
      const knee = config.BLOOM_THRESHOLD * config.BLOOM_SOFT_KNEE + 0.0001;
      gl.uniform3f(bloomPrefilterProgram.uniforms.curve, config.BLOOM_THRESHOLD - knee, knee * 2, 0.25 / knee);
      gl.uniform1f(bloomPrefilterProgram.uniforms.threshold, config.BLOOM_THRESHOLD);
      gl.uniform1i(bloomPrefilterProgram.uniforms.uTexture, source.attach(0));
      gl.viewport(0, 0, destination.width, destination.height);
      blit(destination.fbo);

      bloomBlurProgram.bind();
      let last = destination;
      for (const dest of bloomFramebuffers) {
        gl.uniform2f(bloomBlurProgram.uniforms.texelSize, last.texelSizeX, last.texelSizeY);
        gl.uniform1i(bloomBlurProgram.uniforms.uTexture, last.attach(0));
        gl.viewport(0, 0, dest.width, dest.height);
        blit(dest.fbo);
        last = dest;
      }

      gl.blendFunc(gl.ONE, gl.ONE);
      gl.enable(gl.BLEND);
      for (let i = bloomFramebuffers.length - 2; i >= 0; i--) {
        const baseTex = bloomFramebuffers[i];
        gl.uniform2f(bloomBlurProgram.uniforms.texelSize, last.texelSizeX, last.texelSizeY);
        gl.uniform1i(bloomBlurProgram.uniforms.uTexture, last.attach(0));
        gl.viewport(0, 0, baseTex.width, baseTex.height);
        blit(baseTex.fbo);
        last = baseTex;
      }

      gl.disable(gl.BLEND);
      bloomFinalProgram.bind();
      gl.uniform2f(bloomFinalProgram.uniforms.texelSize, last.texelSizeX, last.texelSizeY);
      gl.uniform1i(bloomFinalProgram.uniforms.uTexture, last.attach(0));
      gl.uniform1f(bloomFinalProgram.uniforms.intensity, config.BLOOM_INTENSITY);
      gl.viewport(0, 0, destination.width, destination.height);
      blit(destination.fbo);
    }

    function applySunrays(source: FBO, mask: FBO, destination: FBO) {
      gl.disable(gl.BLEND);
      sunraysMaskProgram.bind();
      gl.uniform1i(sunraysMaskProgram.uniforms.uTexture, source.attach(0));
      gl.viewport(0, 0, mask.width, mask.height);
      blit(mask.fbo);
      sunraysProgram.bind();
      gl.uniform1f(sunraysProgram.uniforms.weight, config.SUNRAYS_WEIGHT);
      gl.uniform1i(sunraysProgram.uniforms.uTexture, mask.attach(0));
      gl.viewport(0, 0, destination.width, destination.height);
      blit(destination.fbo);
    }

    function blur(target: FBO, temp: FBO, iterations: number) {
      blurProgram.bind();
      for (let i = 0; i < iterations; i++) {
        gl.uniform2f(blurProgram.uniforms.texelSize, target.texelSizeX, 0.0);
        gl.uniform1i(blurProgram.uniforms.uTexture, target.attach(0));
        blit(temp.fbo);
        gl.uniform2f(blurProgram.uniforms.texelSize, 0.0, target.texelSizeY);
        gl.uniform1i(blurProgram.uniforms.uTexture, temp.attach(0));
        blit(target.fbo);
      }
    }

    function render(target: WebGLFramebuffer | null) {
      if (config.BLOOM) applyBloom(dye.read, bloom);
      if (config.SUNRAYS) { applySunrays(dye.read, dye.write, sunrays); blur(sunrays, sunraysTemp, 1); }

      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.enable(gl.BLEND);

      const width = target == null ? gl.drawingBufferWidth : 0;
      const height = target == null ? gl.drawingBufferHeight : 0;
      gl.viewport(0, 0, width, height);

      const displayKeywords: string[] = [];
      if (config.SHADING) displayKeywords.push('SHADING');
      if (config.BLOOM) displayKeywords.push('BLOOM');
      if (config.SUNRAYS) displayKeywords.push('SUNRAYS');
      displayMaterial.setKeywords(displayKeywords);
      displayMaterial.bind();
      if (config.SHADING) gl.uniform2f(displayMaterial.uniforms.texelSize, 1.0 / width, 1.0 / height);
      gl.uniform1i(displayMaterial.uniforms.uTexture, dye.read.attach(0));
      if (config.BLOOM) gl.uniform1i(displayMaterial.uniforms.uBloom, bloom.attach(1));
      if (config.SUNRAYS) gl.uniform1i(displayMaterial.uniforms.uSunrays, sunrays.attach(3));
      blit(target);
    }

    // --- Splat ---
    function splat(x: number, y: number, dx: number, dy: number, color: { r: number; g: number; b: number }) {
      gl.viewport(0, 0, velocity.width, velocity.height);
      splatProgram.bind();
      gl.uniform1i(splatProgram.uniforms.uTarget, velocity.read.attach(0));
      gl.uniform1f(splatProgram.uniforms.aspectRatio, canvas.width / canvas.height);
      gl.uniform2f(splatProgram.uniforms.point, x, y);
      gl.uniform3f(splatProgram.uniforms.color, dx, dy, 0.0);
      gl.uniform1f(splatProgram.uniforms.radius, config.SPLAT_RADIUS / 100.0);
      blit(velocity.write.fbo);
      velocity.swap();

      gl.viewport(0, 0, dye.width, dye.height);
      gl.uniform1i(splatProgram.uniforms.uTarget, dye.read.attach(0));
      gl.uniform3f(splatProgram.uniforms.color, color.r, color.g, color.b);
      blit(dye.write.fbo);
      dye.swap();
    }

    // Color generator — 60% cool, 40% warm accents (bright for white background)
    function generateColor() {
      const palette = Math.random();
      let hue: number, s: number, v: number;

      if (palette < 0.30) {
        // 30% teal/cyan (0.45-0.55)
        hue = Math.random() * 0.10 + 0.45;
        s = 0.7 + Math.random() * 0.2;
        v = 0.7 + Math.random() * 0.3;
      } else if (palette < 0.50) {
        // 20% blue/indigo (0.55-0.70)
        hue = Math.random() * 0.15 + 0.55;
        s = 0.6 + Math.random() * 0.3;
        v = 0.6 + Math.random() * 0.3;
      } else if (palette < 0.60) {
        // 10% purple/violet (0.75-0.85)
        hue = Math.random() * 0.10 + 0.75;
        s = 0.6 + Math.random() * 0.3;
        v = 0.6 + Math.random() * 0.3;
      } else if (palette < 0.80) {
        // 20% warm amber/orange (0.05-0.15)
        hue = Math.random() * 0.10 + 0.05;
        s = 0.8 + Math.random() * 0.2;
        v = 0.7 + Math.random() * 0.3;
      } else if (palette < 0.90) {
        // 10% gold/yellow (0.15-0.20)
        hue = Math.random() * 0.05 + 0.15;
        s = 0.7 + Math.random() * 0.3;
        v = 0.7 + Math.random() * 0.3;
      } else {
        // 10% rose/magenta (0.90-0.98)
        hue = Math.random() * 0.08 + 0.90;
        s = 0.7 + Math.random() * 0.2;
        v = 0.6 + Math.random() * 0.3;
      }

      const c = HSVtoRGB(hue, s, v);
      c.r *= 0.15; c.g *= 0.15; c.b *= 0.15;
      return c;
    }

    function HSVtoRGB(h: number, s: number, v: number) {
      let r = 0, g = 0, b = 0;
      const i = Math.floor(h * 6), f = h * 6 - i;
      const p = v * (1 - s), q = v * (1 - f * s), t = v * (1 - (1 - f) * s);
      switch (i % 6) {
        case 0: r = v; g = t; b = p; break; case 1: r = q; g = v; b = p; break;
        case 2: r = p; g = v; b = t; break; case 3: r = p; g = q; b = v; break;
        case 4: r = t; g = p; b = v; break; case 5: r = v; g = p; b = q; break;
      }
      return { r, g, b };
    }

    function multipleSplats(amount: number) {
      for (let i = 0; i < amount; i++) {
        const color = generateColor();
        color.r *= 10.0; color.g *= 10.0; color.b *= 10.0;
        splat(Math.random(), Math.random(), 1000 * (Math.random() - 0.5), 1000 * (Math.random() - 0.5), color);
      }
    }

    // --- Resize ---
    function resizeCanvas() {
      const w = Math.floor(canvas.clientWidth * (window.devicePixelRatio || 1));
      const h = Math.floor(canvas.clientHeight * (window.devicePixelRatio || 1));
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; return true; }
      return false;
    }

    // --- Pointer handling ---
    interface Pointer { id: number; texcoordX: number; texcoordY: number; prevTexcoordX: number; prevTexcoordY: number; deltaX: number; deltaY: number; down: boolean; moved: boolean; color: { r: number; g: number; b: number }; }
    const pointers: Pointer[] = [{ id: -1, texcoordX: 0, texcoordY: 0, prevTexcoordX: 0, prevTexcoordY: 0, deltaX: 0, deltaY: 0, down: false, moved: false, color: { r: 0.15, g: 0.1, b: 0.05 } }];

    function updatePointerDownData(p: Pointer, id: number, posX: number, posY: number) {
      p.id = id; p.down = true; p.moved = false;
      p.texcoordX = posX / canvas.width; p.texcoordY = 1.0 - posY / canvas.height;
      p.prevTexcoordX = p.texcoordX; p.prevTexcoordY = p.texcoordY;
      p.deltaX = 0; p.deltaY = 0; p.color = generateColor();
    }

    function updatePointerMoveData(p: Pointer, posX: number, posY: number) {
      p.prevTexcoordX = p.texcoordX; p.prevTexcoordY = p.texcoordY;
      p.texcoordX = posX / canvas.width; p.texcoordY = 1.0 - posY / canvas.height;
      p.deltaX = p.texcoordX - p.prevTexcoordX; p.deltaY = p.texcoordY - p.prevTexcoordY;
      p.moved = Math.abs(p.deltaX) > 0 || Math.abs(p.deltaY) > 0;
    }

    function scaleByPixelRatio(input: number) { return Math.floor(input * (window.devicePixelRatio || 1)); }

    // --- Event listeners ---
    const onPointerDown = (e: PointerEvent) => {
      const posX = scaleByPixelRatio(e.offsetX); const posY = scaleByPixelRatio(e.offsetY);
      updatePointerDownData(pointers[0], -1, posX, posY);
    };
    const onPointerMove = (e: PointerEvent) => {
      const p = pointers[0];
      const posX = scaleByPixelRatio(e.offsetX); const posY = scaleByPixelRatio(e.offsetY);
      updatePointerMoveData(p, posX, posY);
    };
    const onPointerUp = () => { pointers[0].down = false; };

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);

    // --- Init & loop ---
    let lastUpdateTime = Date.now();
    let animationId: number;

    function update() {
      const now = Date.now();
      const dt = Math.min((now - lastUpdateTime) / 1000, 0.016666);
      lastUpdateTime = now;
      resizeCanvas();
      initFramebuffers();

      // Apply inputs
      pointers.forEach(p => {
        if (p.moved) {
          p.moved = false;
          const dx = p.deltaX * config.SPLAT_FORCE; const dy = p.deltaY * config.SPLAT_FORCE;
          splat(p.texcoordX, p.texcoordY, dx, dy, p.color);
        }
      });

      if (!config.PAUSED) step(dt);
      render(null);
      animationId = requestAnimationFrame(update);
    }

    resizeCanvas();
    initFramebuffers();

    // Auto-flow: periodic splats at random positions
    let autoSplatId: ReturnType<typeof setInterval>;
    const startAutoFlow = () => {
      autoSplatId = setInterval(() => {
        const count = Math.floor(Math.random() * 3) + 2; // 2-4 个
        for (let i = 0; i < count; i++) {
          const color = generateColor();
          color.r *= 10.0; color.g *= 10.0; color.b *= 10.0;
          const x = Math.random();
          const y = Math.random();
          const angle = Math.random() * Math.PI * 2;
          const force = 300 + Math.random() * 400;
          splat(x, y, Math.cos(angle) * force, Math.sin(angle) * force, color);
        }
      }, 4000);
    };

    // 初始喷射 — 从两边向中间喷射，数量更多
    const doInitialSplash = () => {
      const count = 15 + Math.floor(Math.random() * 10); // 15-24 个
      for (let i = 0; i < count; i++) {
        const color = generateColor();
        color.r *= 10.0; color.g *= 10.0; color.b *= 10.0;
        const side = i % 2; // 0=左边, 1=右边
        const x = side === 0 ? Math.random() * 0.15 : 0.85 + Math.random() * 0.15;
        const y = Math.random();
        const forceX = side === 0 ? 800 + Math.random() * 600 : -(800 + Math.random() * 600);
        const forceY = (Math.random() - 0.5) * 400;
        splat(x, y, forceX, forceY, color);
      }
      // 初始喷射后启动自动流动
      setTimeout(startAutoFlow, 500);
    };

    if (delaySplash) {
      let splashed = false;
      const splashOnce = () => {
        if (splashed) return;
        splashed = true;
        setTimeout(doInitialSplash, 500);
      };

      // 监听 preloader-done 事件
      const onPreloaderDone = () => {
        splashOnce();
        window.removeEventListener('preloader-done', onPreloaderDone);
      };
      window.addEventListener('preloader-done', onPreloaderDone);

      // 兜底：最多等 5 秒
      setTimeout(() => {
        window.removeEventListener('preloader-done', onPreloaderDone);
        splashOnce();
      }, 5000);
    } else {
      doInitialSplash();
    }

    animationId = requestAnimationFrame(update);

    // --- Cleanup ---
    return () => {
      cancelAnimationFrame(animationId);
      clearInterval(autoSplatId);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{ background: '#060606', zIndex: 0, pointerEvents: 'none' }}
    />
  );
}
