import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from "react";

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export const MAX_ZOOM = 8;
// Scale change of one zoom button press
const ZOOM_STEP = 1.6;
const ANIMATION_MS = 220;
// A press must move this far, in pixels, before it becomes a pan
const DRAG_THRESHOLD = 3;

/**
 * The visible part of the map. `x` and `y` are its top-left corner, as
 * fractions of the full map, so the state does not depend on the viewBox.
 */
export interface Zoom {
  scale: number;
  x: number;
  y: number;
}

export const NO_ZOOM: Zoom = { scale: 1, x: 0, y: 0 };

interface Point {
  x: number;
  y: number;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const pan = (zoom: Zoom, dx: number, dy: number): Zoom => {
  const max = 1 - 1 / zoom.scale;
  return {
    scale: zoom.scale,
    x: clamp(zoom.x + dx, 0, max),
    y: clamp(zoom.y + dy, 0, max),
  };
};

/** Scales by `factor` and keeps the point at (fx, fy) of the visible area in place. */
export const zoomAround = (zoom: Zoom, factor: number, fx: number, fy: number): Zoom => {
  let scale = clamp(zoom.scale * factor, 1, MAX_ZOOM);
  // Snap rounding errors, so a full zoom out shows the whole map again
  if (scale < 1.001) scale = 1;
  return pan(
    { scale, x: zoom.x, y: zoom.y },
    fx / zoom.scale - fx / scale,
    fy / zoom.scale - fy / scale,
  );
};

const prefersReducedMotion = () =>
  typeof matchMedia === "function" &&
  matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Zoom and pan state for the map SVG. Buttons zoom around the center.
 * Ctrl/⌘ + wheel and trackpad pinch zoom around the pointer, a plain wheel
 * still scrolls the page. Drag pans a zoomed map, two fingers pinch.
 */
export function useZoom(
  svgRef: RefObject<SVGSVGElement | null>,
  enabled: boolean,
  resetKey: string,
) {
  const [zoom, setZoom] = useState(NO_ZOOM);
  const [panning, setPanning] = useState(false);

  // A new map, or turning zoom off, starts from the full view again
  const resetOn = `${enabled} ${resetKey}`;
  const [lastResetOn, setLastResetOn] = useState(resetOn);
  if (lastResetOn !== resetOn) {
    setLastResetOn(resetOn);
    setZoom(NO_ZOOM);
  }

  const zoomRef = useRef(zoom);
  useIsoLayoutEffect(() => {
    zoomRef.current = zoom;
  });

  const frame = useRef(0);
  const targetScale = useRef(1);
  const stopAnimation = useCallback(() => {
    if (frame.current) cancelAnimationFrame(frame.current);
    frame.current = 0;
  }, []);
  useEffect(() => stopAnimation, [resetOn, stopAnimation]);

  const zoomBy = useCallback(
    (factor: number) => {
      const from = zoomRef.current;
      // Presses during an animation build on its target, not its current frame
      const base = frame.current ? targetScale.current : from.scale;
      const to = clamp(base * factor, 1, MAX_ZOOM);
      stopAnimation();
      targetScale.current = to;
      if (prefersReducedMotion() || typeof requestAnimationFrame !== "function") {
        setZoom(zoomAround(from, to / from.scale, 0.5, 0.5));
        return;
      }
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / ANIMATION_MS);
        const eased = 1 - (1 - t) ** 3;
        setZoom(zoomAround(from, (to / from.scale) ** eased, 0.5, 0.5));
        frame.current = t < 1 ? requestAnimationFrame(step) : 0;
      };
      frame.current = requestAnimationFrame(step);
    },
    [stopAnimation],
  );

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || !enabled) return;
    const onWheel = (e: WheelEvent) => {
      // Trackpad pinch also arrives as a wheel event with ctrlKey set
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      const rect = svg.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      stopAnimation();
      // Firefox can report lines instead of pixels
      const delta = clamp(e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY, -50, 50);
      const fx = (e.clientX - rect.left) / rect.width;
      const fy = (e.clientY - rect.top) / rect.height;
      setZoom((z) => zoomAround(z, 2 ** (-delta / 100), fx, fy));
    };
    svg.addEventListener("wheel", onWheel, { passive: false });
    return () => svg.removeEventListener("wheel", onWheel);
  }, [enabled, svgRef, stopAnimation]);

  const pointers = useRef(new Map<number, Point>());
  const pressStart = useRef<Point>({ x: 0, y: 0 });
  // Set once a press moves, so the click that ends a pan does not select a region
  const moved = useRef(false);

  const onPointerDown = (e: ReactPointerEvent<SVGSVGElement>) => {
    if (!enabled || (e.pointerType === "mouse" && e.button !== 0)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 1) {
      moved.current = false;
      pressStart.current = { x: e.clientX, y: e.clientY };
    }
  };

  const onPointerMove = (e: ReactPointerEvent<SVGSVGElement>) => {
    const prev = pointers.current.get(e.pointerId);
    if (!prev) return;
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const next = { x: e.clientX, y: e.clientY };
    const pinching = pointers.current.size === 2;

    if (!moved.current) {
      const distance = Math.hypot(next.x - pressStart.current.x, next.y - pressStart.current.y);
      // A full map has nothing to pan, so leave the press to clicks
      if (distance < DRAG_THRESHOLD || (!pinching && zoomRef.current.scale === 1)) return;
      moved.current = true;
      setPanning(true);
      stopAnimation();
    }
    pointers.current.set(e.pointerId, next);
    // Capture only after the threshold, so hover still works on a plain press
    if (!svg.hasPointerCapture?.(e.pointerId)) svg.setPointerCapture?.(e.pointerId);

    if (!pinching) {
      const dx = (prev.x - next.x) / rect.width;
      const dy = (prev.y - next.y) / rect.height;
      setZoom((z) => pan(z, dx / z.scale, dy / z.scale));
      return;
    }

    const other = [...pointers.current].find(([id]) => id !== e.pointerId)?.[1];
    if (!other) return;
    const before = Math.hypot(prev.x - other.x, prev.y - other.y);
    if (!before) return;
    const factor = Math.hypot(next.x - other.x, next.y - other.y) / before;
    // Zoom around the old midpoint, then move it with the fingers
    const fx = ((prev.x + other.x) / 2 - rect.left) / rect.width;
    const fy = ((prev.y + other.y) / 2 - rect.top) / rect.height;
    const dx = (prev.x - next.x) / 2 / rect.width;
    const dy = (prev.y - next.y) / 2 / rect.height;
    setZoom((z) => {
      const zoomed = zoomAround(z, factor, fx, fy);
      return pan(zoomed, dx / zoomed.scale, dy / zoomed.scale);
    });
  };

  const onPointerEnd = (e: ReactPointerEvent<SVGSVGElement>) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size === 0) setPanning(false);
  };

  const onClickCapture = (e: ReactMouseEvent<SVGSVGElement>) => {
    if (!moved.current) return;
    moved.current = false;
    e.stopPropagation();
  };

  return {
    zoom,
    panning,
    canZoomIn: zoom.scale < MAX_ZOOM,
    canZoomOut: zoom.scale > 1,
    zoomIn: () => zoomBy(ZOOM_STEP),
    zoomOut: () => zoomBy(1 / ZOOM_STEP),
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: onPointerEnd,
      onPointerCancel: onPointerEnd,
      onClickCapture,
    },
  };
}
