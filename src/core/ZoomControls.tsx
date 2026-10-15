const CSS = `
.rcm-zoom {
  --rcm-zoom-fg: var(--rcm-zoom-color, var(--rcm-tooltip-color, #fafafa));
  position: absolute;
  right: 12px;
  bottom: 12px;
  z-index: 5;
  display: flex;
  flex-direction: column;
  padding: 3px;
  gap: 2px;
  border-radius: var(--rcm-zoom-radius, 12px);
  background: var(--rcm-zoom-bg, var(--rcm-tooltip-bg, rgba(24, 24, 27, 0.86)));
  border: 1px solid var(--rcm-zoom-border, var(--rcm-tooltip-border, rgba(255, 255, 255, 0.08)));
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.12),
    0 10px 28px -8px rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(10px) saturate(150%);
  -webkit-backdrop-filter: blur(10px) saturate(150%);
}

.rcm-zoom__button {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 0;
  border-radius: calc(var(--rcm-zoom-radius, 12px) - 3px);
  background: transparent;
  color: var(--rcm-zoom-fg);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition:
    background-color 120ms ease-out,
    opacity 120ms ease-out,
    transform 120ms ease-out;
}

.rcm-zoom__button:hover:not(:disabled) {
  background: color-mix(in srgb, var(--rcm-zoom-fg) 12%, transparent);
}

.rcm-zoom__button:active:not(:disabled) {
  transform: scale(0.9);
}

.rcm-zoom__button:focus-visible {
  outline: 2px solid var(--rcm-zoom-focus, #3b82f6);
  outline-offset: 1px;
}

.rcm-zoom__button:disabled {
  opacity: 0.35;
  cursor: default;
}

.rcm-zoom__divider {
  height: 1px;
  margin: 0 6px;
  background: color-mix(in srgb, var(--rcm-zoom-fg) 14%, transparent);
}

@media (prefers-reduced-motion: reduce) {
  .rcm-zoom__button {
    transition: none;
  }
}
`;

const Icon = ({ plus }: { plus: boolean }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <path d={plus ? "M8 3.5v9M3.5 8h9" : "M3.5 8h9"} />
  </svg>
);

interface Props {
  canZoomIn: boolean;
  canZoomOut: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

export function ZoomControls({ canZoomIn, canZoomOut, onZoomIn, onZoomOut }: Props) {
  return (
    <>
      <style>{CSS}</style>
      <div className="rcm-zoom" role="group" aria-label="Zoom">
        <button
          type="button"
          className="rcm-zoom__button"
          aria-label="Zoom in"
          disabled={!canZoomIn}
          onClick={onZoomIn}
        >
          <Icon plus />
        </button>
        <div className="rcm-zoom__divider" />
        <button
          type="button"
          className="rcm-zoom__button"
          aria-label="Zoom out"
          disabled={!canZoomOut}
          onClick={onZoomOut}
        >
          <Icon plus={false} />
        </button>
      </div>
    </>
  );
}
