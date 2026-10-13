import {
  Fragment,
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from "react";
import type { Country, ViewBox, Region, CustomStyleType } from "./types";
import { Tooltip } from "./Tooltip";

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const DEFAULT_COLORS: CustomStyleType = {
  idleColor: "#444",
  hoverColor: "#dc3522",
};

export interface Props {
  data: Country;
  viewBox?: ViewBox;
  visible?: boolean;
  hoverable?: boolean;
  showTooltip?: boolean;
  tooltipText?: ReactNode | ((region: Region) => ReactNode);
  tooltipClassName?: string;
  tooltipStyle?: CSSProperties;
  customStyle?: Partial<CustomStyleType>;
  regionStyle?: (
    region: Region,
    state: { hovered: boolean },
  ) => CSSProperties | undefined;
  regionWrapper?: (regionElement: ReactElement, region: Region) => ReactElement;
  onHover?: (region: Region) => void;
  onLeave?: (region: Region) => void;
  onClick?: (region: Region) => void;
  className?: string;
  style?: CSSProperties;
}

interface RegionProps {
  region: Region;
  hovered: boolean;
  idleColor: string;
  hoverColor: string;
  clickable: boolean;
  onEnter: (region: Region, x: number, y: number) => void;
  onMove: (x: number, y: number) => void;
  onLeave: (region: Region) => void;
  onSelect: (region: Region) => void;
}

const Region = memo(function Region({
  region,
  hovered,
  idleColor,
  hoverColor,
  clickable,
  onEnter,
  onMove,
  onLeave,
  onSelect,
}: RegionProps) {
  return (
    <path
      d={region.path}
      className="rcm-region"
      data-region-id={region.id}
      data-hovered={hovered || undefined}
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      aria-label={region.name}
      style={{
        fill: hovered ? hoverColor : idleColor,
        cursor: clickable ? "pointer" : undefined,
        transition: "fill 120ms ease-out",
        outline: "none",
      }}
      onMouseEnter={(e) => onEnter(region, e.clientX, e.clientY)}
      onMouseMove={(e) => onMove(e.clientX, e.clientY)}
      onMouseLeave={() => onLeave(region)}
      onFocus={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        onEnter(region, r.left + r.width / 2, r.top);
      }}
      onBlur={() => onLeave(region)}
      onClick={() => onSelect(region)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(region);
        }
      }}
    />
  );
});

export function Map({
  data,
  viewBox,
  visible = true,
  hoverable = true,
  showTooltip = false,
  tooltipText,
  tooltipClassName,
  tooltipStyle,
  customStyle,
  regionWrapper,
  onHover,
  onLeave,
  onClick,
  className,
  style,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<Region | null>(null);
  const [tooltipRegion, setTooltipRegion] = useState<Region | null>(null);

  const latest = useRef({ hoverable, onHover, onLeave, onClick });
  useIsoLayoutEffect(() => {
    latest.current = { hoverable, onHover, onLeave, onClick };
  });

  const { idleColor, hoverColor } = { ...DEFAULT_COLORS, ...customStyle };
  const vb = viewBox ?? data.viewBox;

  const moveTooltip = useCallback((x: number, y: number) => {
    const container = containerRef.current;
    const tip = tooltipRef.current;
    if (!container || !tip) return;
    const rect = container.getBoundingClientRect();
    const localY = y - rect.top;
    tip.style.transform = `translate(${x - rect.left}px, ${localY}px)`;
    tip.dataset.placement = localY < 56 ? "bottom" : "top";
  }, []);

  const handleEnter = useCallback(
    (region: Region, x: number, y: number) => {
      if (!latest.current.hoverable) return;
      setHovered(region);
      setTooltipRegion(region);
      moveTooltip(x, y);
      latest.current.onHover?.(region);
    },
    [moveTooltip],
  );

  const handleLeave = useCallback((region: Region) => {
    setHovered((current) => (current?.id === region.id ? null : current));
    latest.current.onLeave?.(region);
  }, []);

  const handleSelect = useCallback((region: Region) => {
    latest.current.onClick?.(region);
  }, []);

  const tooltipContent = tooltipRegion
    ? typeof tooltipText === "function"
      ? tooltipText(tooltipRegion)
      : (tooltipText ?? tooltipRegion.name)
    : null;

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: "relative", width: "100%", ...style }}
      hidden={!visible}
    >
      {showTooltip && (
        <Tooltip
          ref={tooltipRef}
          content={tooltipContent}
          visible={hovered !== null}
          className={tooltipClassName}
          style={tooltipStyle}
        />
      )}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`${vb.left} ${vb.top} ${vb.width} ${vb.height}`}
        role="group"
        aria-label={data.name}
        style={{ width: "100%", height: "auto", display: "block" }}
      >
        <g>
          {data.regions.map((region) => {
            const element = (
              <Region
                key={region.id}
                region={region}
                hovered={hovered?.id === region.id}
                idleColor={idleColor}
                hoverColor={hoverColor}
                clickable={!!onClick}
                onEnter={handleEnter}
                onMove={moveTooltip}
                onLeave={handleLeave}
                onSelect={handleSelect}
              />
            );

            return regionWrapper ? (
              <Fragment key={region.id}>
                {regionWrapper(element, region)}
              </Fragment>
            ) : (
              element
            );
          })}
        </g>
      </svg>
    </div>
  );
}
