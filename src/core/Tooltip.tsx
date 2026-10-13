import { forwardRef, type CSSProperties, type ReactNode } from "react";

const CSS = `
.rcm-tooltip {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  pointer-events: none;
  will-change: transform;
}

.rcm-tooltip__content {
  --rcm-bg: var(--rcm-tooltip-bg, rgba(24, 24, 27, 0.86));
  --rcm-offset: 14px;
  position: relative;
  padding: 6px 10px;
  border-radius: var(--rcm-tooltip-radius, 8px);
  background: var(--rcm-bg);
  color: var(--rcm-tooltip-color, #fafafa);
  border: 1px solid var(--rcm-tooltip-border, rgba(255, 255, 255, 0.08));
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.12),
    0 10px 28px -8px rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(10px) saturate(150%);
  -webkit-backdrop-filter: blur(10px) saturate(150%);
  font: 500 13px/1.35 var(--rcm-tooltip-font, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif);
  letter-spacing: -0.01em;
  white-space: nowrap;
  opacity: 0;
  transform: translate(-50%, calc(-100% - var(--rcm-offset))) scale(0.94);
  transform-origin: bottom center;
  transition:
    opacity 120ms ease-out,
    transform 180ms cubic-bezier(0.16, 1, 0.3, 1);
}

.rcm-tooltip[data-visible="true"] .rcm-tooltip__content {
  opacity: 1;
  transform: translate(-50%, calc(-100% - var(--rcm-offset))) scale(1);
}

.rcm-tooltip__content::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 100%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-top-color: var(--rcm-bg);
}

/* Open below the cursor when it is near the top edge */
.rcm-tooltip[data-placement="bottom"] .rcm-tooltip__content {
  --rcm-offset: 22px;
  transform: translate(-50%, var(--rcm-offset)) scale(0.94);
  transform-origin: top center;
}

.rcm-tooltip[data-placement="bottom"][data-visible="true"] .rcm-tooltip__content {
  transform: translate(-50%, var(--rcm-offset)) scale(1);
}

.rcm-tooltip[data-placement="bottom"] .rcm-tooltip__content::after {
  top: auto;
  bottom: 100%;
  border-top-color: transparent;
  border-bottom-color: var(--rcm-bg);
}

@media (prefers-reduced-motion: reduce) {
  .rcm-tooltip__content {
    transition: opacity 120ms ease-out;
  }
}
`;

interface Props {
  content: ReactNode;
  visible: boolean;
  className?: string;
  style?: CSSProperties;
}

export const Tooltip = forwardRef<HTMLDivElement, Props>(function Tooltip(
  { content, visible, className, style },
  ref
) {
  return (
    <>
      <style>{CSS}</style>
      <div
        ref={ref}
        role="tooltip"
        aria-hidden={!visible}
        data-visible={visible}
        data-placement="top"
        className={className ? `rcm-tooltip ${className}` : "rcm-tooltip"}
      >
        <div className="rcm-tooltip__content" style={style}>
          {content}
        </div>
      </div>
    </>
  );
});