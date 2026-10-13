// @vitest-environment node
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { CountryMap } from "../src";
import germany from "../src/countries/germany";

describe("server rendering", () => {
  it("renders without window or document", () => {
    expect(typeof window).toBe("undefined");
    const html = renderToString(<CountryMap data={germany} showTooltip onClick={() => {}} />);
    expect(html.match(/class="rcm-region"/g)).toHaveLength(germany.regions.length);
    expect(html).toContain('role="tooltip"');
  });
});
