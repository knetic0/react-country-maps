import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CountryMap, type Country } from "../src";
import germany from "../src/countries/germany";
import turkey from "../src/countries/turkey";

afterEach(cleanup);

const twoRegions: Country = {
  id: "XX",
  name: "Test Land",
  viewBox: { left: 10, top: 20, width: 200, height: 100 },
  regions: [
    { id: "west", name: "West", path: "M10,20 H110 V120 H10 Z" },
    { id: "east", name: "East", path: "M110,20 H210 V120 H110 Z" },
  ],
};

const region = (container: HTMLElement, id: string) => {
  const element = container.querySelector<SVGPathElement>(`[data-region-id="${id}"]`);
  if (!element) throw new Error(`Region ${id} not rendered`);
  return element;
};

const tooltip = (container: HTMLElement) => container.querySelector<HTMLDivElement>(".rcm-tooltip");

describe("rendering", () => {
  it("renders one path per region of a generated country", () => {
    const { container } = render(<CountryMap data={germany} />);
    expect(container.querySelectorAll(".rcm-region")).toHaveLength(germany.regions.length);
    expect(screen.getByRole("group", { name: "Germany" })).toBeTruthy();
  });

  it("renders the hand-made Turkey data", () => {
    const { container } = render(<CountryMap data={turkey} />);
    expect(container.querySelectorAll(".rcm-region")).toHaveLength(81);
    // Turkey paths already have gaps, so no mask is used
    expect(container.querySelector("mask")).not.toBeNull();
  });

  it("writes the viewBox in left top width height order", () => {
    const { container } = render(<CountryMap data={twoRegions} />);
    expect(container.querySelector("svg")?.getAttribute("viewBox")).toBe("10 20 200 100");
  });

  it("uses the viewBox prop instead of data.viewBox", () => {
    const { container } = render(
      <CountryMap data={twoRegions} viewBox={{ left: 1, top: 2, width: 3, height: 4 }} />,
    );
    expect(container.querySelector("svg")?.getAttribute("viewBox")).toBe("1 2 3 4");
  });

  it("hides the map without unmounting it when visible is false", () => {
    const { container } = render(<CountryMap data={twoRegions} visible={false} />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.hidden).toBe(true);
    expect(container.querySelectorAll(".rcm-region")).toHaveLength(2);
  });

  it("removes the border mask when borderWidth is 0", () => {
    const { container, rerender } = render(<CountryMap data={twoRegions} />);
    expect(container.querySelector("mask")).not.toBeNull();
    rerender(<CountryMap data={twoRegions} borderWidth={0} />);
    expect(container.querySelector("mask")).toBeNull();
  });

  it("passes className and style to the container", () => {
    const { container } = render(
      <CountryMap data={twoRegions} className="my-map" style={{ maxWidth: 300 }} />,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toBe("my-map");
    expect(root.style.maxWidth).toBe("300px");
  });
});

describe("hover", () => {
  it("calls onHover and onLeave and highlights the hovered region", () => {
    const onHover = vi.fn();
    const onLeave = vi.fn();
    const { container } = render(
      <CountryMap
        data={twoRegions}
        customStyle={{ idleColor: "rgb(1, 1, 1)", hoverColor: "rgb(2, 2, 2)" }}
        onHover={onHover}
        onLeave={onLeave}
      />,
    );
    const west = region(container, "west");
    expect(west.style.fill).toBe("rgb(1, 1, 1)");

    fireEvent.mouseEnter(west, { clientX: 50, clientY: 50 });
    expect(onHover).toHaveBeenCalledWith(twoRegions.regions[0]);
    expect(west.dataset.hovered).toBe("true");
    expect(west.style.fill).toBe("rgb(2, 2, 2)");
    expect(region(container, "east").style.fill).toBe("rgb(1, 1, 1)");

    fireEvent.mouseLeave(west);
    expect(onLeave).toHaveBeenCalledWith(twoRegions.regions[0]);
    expect(west.dataset.hovered).toBeUndefined();
    expect(west.style.fill).toBe("rgb(1, 1, 1)");
  });

  it("uses the default colors for keys missing from customStyle", () => {
    const { container } = render(
      <CountryMap data={twoRegions} customStyle={{ hoverColor: "rgb(2, 2, 2)" }} />,
    );
    expect(region(container, "west").style.fill).toBe("rgb(68, 68, 68)");
  });

  it("does nothing on hover when hoverable is false", () => {
    const onHover = vi.fn();
    const onLeave = vi.fn();
    const { container } = render(
      <CountryMap data={twoRegions} hoverable={false} showTooltip onHover={onHover} onLeave={onLeave} />,
    );
    const west = region(container, "west");
    fireEvent.mouseEnter(west);
    fireEvent.mouseLeave(west);
    expect(onHover).not.toHaveBeenCalled();
    expect(onLeave).not.toHaveBeenCalled();
    expect(west.dataset.hovered).toBeUndefined();
    expect(tooltip(container)?.dataset.visible).toBe("false");
  });

  it("uses the latest callbacks without remounting", () => {
    const first = vi.fn();
    const second = vi.fn();
    const { container, rerender } = render(<CountryMap data={twoRegions} onHover={first} />);
    rerender(<CountryMap data={twoRegions} onHover={second} />);
    fireEvent.mouseEnter(region(container, "west"));
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
  });
});

describe("click and keyboard", () => {
  it("calls onClick on click", () => {
    const onClick = vi.fn();
    const { container } = render(<CountryMap data={twoRegions} onClick={onClick} />);
    fireEvent.click(region(container, "east"));
    expect(onClick).toHaveBeenCalledWith(twoRegions.regions[1]);
  });

  it("makes regions focusable buttons only when onClick is set", () => {
    const { container, rerender } = render(<CountryMap data={twoRegions} />);
    expect(region(container, "west").getAttribute("role")).toBeNull();
    expect(region(container, "west").getAttribute("tabindex")).toBeNull();

    rerender(<CountryMap data={twoRegions} onClick={() => {}} />);
    expect(screen.getByRole("button", { name: "West" }).getAttribute("tabindex")).toBe("0");
    expect(container.querySelectorAll('.rcm-region[role="button"]')).toHaveLength(2);
  });

  it("activates a region with Enter and Space, not with other keys", () => {
    const onClick = vi.fn();
    const { container } = render(<CountryMap data={twoRegions} onClick={onClick} />);
    const west = region(container, "west");

    fireEvent.keyDown(west, { key: "Enter" });
    fireEvent.keyDown(west, { key: " " });
    fireEvent.keyDown(west, { key: "a" });
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it("prevents page scroll when Space activates a region", () => {
    const { container } = render(<CountryMap data={twoRegions} onClick={() => {}} />);
    const notCancelled = fireEvent.keyDown(region(container, "west"), { key: " " });
    expect(notCancelled).toBe(false);
  });

  it("treats keyboard focus like hover", () => {
    const onHover = vi.fn();
    const onLeave = vi.fn();
    const { container } = render(
      <CountryMap data={twoRegions} showTooltip onClick={() => {}} onHover={onHover} onLeave={onLeave} />,
    );
    const west = region(container, "west");

    act(() => west.focus());
    expect(document.activeElement).toBe(west);
    expect(onHover).toHaveBeenCalledWith(twoRegions.regions[0]);
    expect(west.dataset.hovered).toBe("true");
    expect(tooltip(container)?.dataset.visible).toBe("true");

    act(() => west.blur());
    expect(onLeave).toHaveBeenCalledWith(twoRegions.regions[0]);
    expect(west.dataset.hovered).toBeUndefined();
  });
});

describe("tooltip", () => {
  it("is not rendered unless showTooltip is set", () => {
    const { container } = render(<CountryMap data={twoRegions} />);
    expect(tooltip(container)).toBeNull();
  });

  it("shows the region name by default", () => {
    const { container } = render(<CountryMap data={twoRegions} showTooltip />);
    fireEvent.mouseEnter(region(container, "west"));
    expect(tooltip(container)?.dataset.visible).toBe("true");
    expect(tooltip(container)?.textContent).toBe("West");
  });

  it("accepts a string", () => {
    const { container } = render(<CountryMap data={twoRegions} showTooltip tooltipText="Static" />);
    fireEvent.mouseEnter(region(container, "east"));
    expect(tooltip(container)?.textContent).toBe("Static");
  });

  it("accepts a function of the region", () => {
    const { container } = render(
      <CountryMap data={twoRegions} showTooltip tooltipText={(r) => `${r.name} (${r.id})`} />,
    );
    fireEvent.mouseEnter(region(container, "east"));
    expect(tooltip(container)?.textContent).toBe("East (east)");
  });

  it("accepts a ReactNode", () => {
    const { container } = render(
      <CountryMap data={twoRegions} showTooltip tooltipText={<strong data-testid="rich">Rich</strong>} />,
    );
    fireEvent.mouseEnter(region(container, "west"));
    expect(screen.getByTestId("rich").textContent).toBe("Rich");
  });

  it("keeps its content while it fades out", () => {
    const { container } = render(<CountryMap data={twoRegions} showTooltip />);
    const west = region(container, "west");
    fireEvent.mouseEnter(west);
    fireEvent.mouseLeave(west);
    expect(tooltip(container)?.dataset.visible).toBe("false");
    expect(tooltip(container)?.getAttribute("aria-hidden")).toBe("true");
    expect(tooltip(container)?.textContent).toBe("West");
  });

  it("applies tooltipClassName and tooltipStyle", () => {
    const { container } = render(
      <CountryMap data={twoRegions} showTooltip tooltipClassName="tip" tooltipStyle={{ color: "red" }} />,
    );
    expect(tooltip(container)?.className).toBe("rcm-tooltip tip");
    expect(container.querySelector<HTMLElement>(".rcm-tooltip__content")?.style.color).toBe("red");
  });

  it("follows the pointer and flips below it near the top edge", () => {
    const { container } = render(<CountryMap data={twoRegions} showTooltip />);
    const root = container.firstElementChild as HTMLElement;
    vi.spyOn(root, "getBoundingClientRect").mockReturnValue(new DOMRect(100, 100, 400, 200));
    const west = region(container, "west");

    fireEvent.mouseEnter(west, { clientX: 150, clientY: 250 });
    expect(tooltip(container)?.style.transform).toBe("translate(50px, 150px)");
    expect(tooltip(container)?.dataset.placement).toBe("top");

    fireEvent.mouseMove(west, { clientX: 160, clientY: 120 });
    expect(tooltip(container)?.style.transform).toBe("translate(60px, 20px)");
    expect(tooltip(container)?.dataset.placement).toBe("bottom");
  });
});

describe("styling props", () => {
  it("applies regionStyle with the hover state", () => {
    const regionStyle = vi.fn((r: { id: string }, { hovered }: { hovered: boolean }) =>
      r.id === "east" ? { fill: hovered ? "rgb(9, 9, 9)" : "rgb(5, 5, 5)", opacity: 0.5 } : undefined,
    );
    const { container } = render(<CountryMap data={twoRegions} regionStyle={regionStyle} />);
    const east = region(container, "east");
    expect(east.style.fill).toBe("rgb(5, 5, 5)");
    expect(east.style.opacity).toBe("0.5");
    expect(regionStyle).toHaveBeenCalledWith(twoRegions.regions[1], { hovered: false });

    fireEvent.mouseEnter(east);
    expect(east.style.fill).toBe("rgb(9, 9, 9)");
    expect(regionStyle).toHaveBeenCalledWith(twoRegions.regions[1], { hovered: true });
  });

  it("wraps regions with regionWrapper", () => {
    const { container } = render(
      <CountryMap
        data={twoRegions}
        regionWrapper={(element, r) => <a href={`/r/${r.id}`}>{element}</a>}
      />,
    );
    const links = container.querySelectorAll("a");
    expect(links).toHaveLength(2);
    expect(links[0].getAttribute("href")).toBe("/r/west");
    expect(links[0].querySelector(".rcm-region")).not.toBeNull();
  });
});

describe("multiple maps", () => {
  it("use separate mask ids and separate hover state", () => {
    const { container } = render(
      <>
        <CountryMap data={twoRegions} showTooltip />
        <CountryMap data={twoRegions} showTooltip />
      </>,
    );
    const maps = Array.from(container.children) as HTMLElement[];
    const maskIds = maps.map((map) => map.querySelector("mask")?.id);
    expect(new Set(maskIds).size).toBe(2);
    maps.forEach((map, i) => {
      expect(map.querySelector("g")?.getAttribute("mask")).toBe(`url(#${maskIds[i]})`);
    });

    fireEvent.mouseEnter(region(maps[0], "west"));
    expect(region(maps[0], "west").dataset.hovered).toBe("true");
    expect(region(maps[1], "west").dataset.hovered).toBeUndefined();
    expect(tooltip(maps[0])?.dataset.visible).toBe("true");
    expect(tooltip(maps[1])?.dataset.visible).toBe("false");
  });
});

describe("zoom", () => {
  const viewBox = (container: HTMLElement) =>
    container.querySelector("svg")?.getAttribute("viewBox")?.split(" ").map(Number);

  // jsdom has no layout, so give the map a size before pointer and wheel events
  const sized = (container: HTMLElement) => {
    const svg = container.querySelector("svg") as SVGSVGElement;
    vi.spyOn(svg, "getBoundingClientRect").mockReturnValue(new DOMRect(0, 0, 400, 200));
    return svg;
  };

  it("shows zoom buttons by default, with zoom out disabled at full size", () => {
    render(<CountryMap data={twoRegions} />);
    expect(screen.getByRole("group", { name: "Zoom" })).toBeTruthy();
    expect(screen.getByRole<HTMLButtonElement>("button", { name: "Zoom in" }).disabled).toBe(false);
    expect(screen.getByRole<HTMLButtonElement>("button", { name: "Zoom out" }).disabled).toBe(true);
  });

  it("zooms in around the center and back out to the full map", async () => {
    const { container } = render(<CountryMap data={twoRegions} />);
    fireEvent.click(screen.getByRole("button", { name: "Zoom in" }));
    await waitFor(() => expect(viewBox(container)?.[2]).toBeCloseTo(200 / 1.6));
    const [left, top, width, height] = viewBox(container)!;
    expect(left + width / 2).toBeCloseTo(110);
    expect(top + height / 2).toBeCloseTo(70);

    fireEvent.click(screen.getByRole("button", { name: "Zoom out" }));
    await waitFor(() => expect(viewBox(container)).toEqual([10, 20, 200, 100]));
    expect(screen.getByRole<HTMLButtonElement>("button", { name: "Zoom out" }).disabled).toBe(true);
  });

  it("zooms with ctrl + wheel around the pointer, and leaves a plain wheel to the page", () => {
    const { container } = render(<CountryMap data={twoRegions} />);
    const svg = sized(container);

    expect(fireEvent.wheel(svg, { deltaY: -50, clientX: 0, clientY: 0 })).toBe(true);
    expect(viewBox(container)).toEqual([10, 20, 200, 100]);

    expect(fireEvent.wheel(svg, { deltaY: -50, ctrlKey: true, clientX: 0, clientY: 0 })).toBe(false);
    const [left, top, width] = viewBox(container)!;
    expect(width).toBeLessThan(200);
    // The top-left corner was under the pointer, so it stays in place
    expect([left, top]).toEqual([10, 20]);
  });

  it("pans a zoomed map by dragging, without selecting a region", () => {
    const onClick = vi.fn();
    const { container } = render(<CountryMap data={twoRegions} onClick={onClick} />);
    const svg = sized(container);
    fireEvent.wheel(svg, { deltaY: -50, ctrlKey: true, clientX: 0, clientY: 0 });

    fireEvent.pointerDown(svg, { pointerId: 1, clientX: 100, clientY: 100, button: 0, pointerType: "mouse" });
    fireEvent.pointerMove(svg, { pointerId: 1, clientX: 60, clientY: 100, pointerType: "mouse" });
    fireEvent.pointerUp(svg, { pointerId: 1, pointerType: "mouse" });
    expect(viewBox(container)?.[0]).toBeGreaterThan(10);

    fireEvent.click(region(container, "west"));
    expect(onClick).not.toHaveBeenCalled();
    fireEvent.click(region(container, "west"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not pan a map at full size", () => {
    const { container } = render(<CountryMap data={twoRegions} />);
    const svg = sized(container);
    fireEvent.pointerDown(svg, { pointerId: 1, clientX: 100, clientY: 100, button: 0, pointerType: "mouse" });
    fireEvent.pointerMove(svg, { pointerId: 1, clientX: 20, clientY: 100, pointerType: "mouse" });
    expect(viewBox(container)).toEqual([10, 20, 200, 100]);
  });

  it("hides the buttons but keeps gestures when showZoomControls is false", () => {
    const { container } = render(<CountryMap data={twoRegions} showZoomControls={false} />);
    expect(screen.queryByRole("group", { name: "Zoom" })).toBeNull();
    fireEvent.wheel(sized(container), { deltaY: -50, ctrlKey: true });
    expect(viewBox(container)?.[2]).toBeLessThan(200);
  });

  it("turns zoom off and hides the buttons when zoomable is false", () => {
    const { container } = render(<CountryMap data={twoRegions} zoomable={false} />);
    expect(screen.queryByRole("group", { name: "Zoom" })).toBeNull();
    expect(fireEvent.wheel(sized(container), { deltaY: -50, ctrlKey: true })).toBe(true);
    expect(viewBox(container)).toEqual([10, 20, 200, 100]);
  });

  it("resets the zoom when zoomable is turned off", () => {
    const { container, rerender } = render(<CountryMap data={twoRegions} />);
    fireEvent.wheel(sized(container), { deltaY: -50, ctrlKey: true });
    expect(viewBox(container)?.[2]).toBeLessThan(200);
    rerender(<CountryMap data={twoRegions} zoomable={false} />);
    expect(viewBox(container)).toEqual([10, 20, 200, 100]);
  });
});
