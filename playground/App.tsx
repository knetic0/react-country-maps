import { useCallback, useState } from "react";
import { CountryMap } from "../src";
import type { Region } from "../src/core/types";
import { countries } from "./countries";

export default function App() {
  const [countryId, setCountryId] = useState(() => (countries.find((c) => c.id === "TR") ?? countries[0])?.id);
  const [dark, setDark] = useState(true);
  const [showTooltip, setShowTooltip] = useState(true);
  const [hoverable, setHoverable] = useState(true);
  const [richTooltip, setRichTooltip] = useState(false);
  const [idleColor, setIdleColor] = useState("#444444");
  const [hoverColor, setHoverColor] = useState("#dc3522");
  const [selected, setSelected] = useState<Region | null>(null);
  const [hovered, setHovered] = useState<Region | null>(null);
  const [log, setLog] = useState<string[]>([]);

  const country = countries.find((c) => c.id === countryId) ?? countries[0];

  const pushLog = (line: string) => setLog((prev) => [line, ...prev].slice(0, 8));

  const changeCountry = (id: string) => {
    setCountryId(id);
    setSelected(null);
    setHovered(null);
    pushLog(`country → ${countries.find((c) => c.id === id)?.name ?? id}`);
  };

  const regionStyle = useCallback(
    (region: Region, { hovered }: { hovered: boolean }) =>
      !hovered && region.id === selected?.id ? { fill: "#2563eb" } : undefined,
    [selected]
  );

  return (
    <div className={dark ? "page dark" : "page light"}>
      <header>
        <h1>react-country-maps</h1>
        <p>Playground</p>
      </header>

      <section className="controls">
        <label>
          Ülke
          <select value={country?.id ?? ""} onChange={(e) => changeCountry(e.target.value)}>
            {countries.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.regions.length})
              </option>
            ))}
          </select>
        </label>
        <label>
          <input type="checkbox" checked={dark} onChange={(e) => setDark(e.target.checked)} />
          Koyu tema
        </label>
        <label>
          <input type="checkbox" checked={showTooltip} onChange={(e) => setShowTooltip(e.target.checked)} />
          Tooltip
        </label>
        <label>
          <input type="checkbox" checked={richTooltip} onChange={(e) => setRichTooltip(e.target.checked)} />
          Zengin tooltip
        </label>
        <label>
          <input type="checkbox" checked={hoverable} onChange={(e) => setHoverable(e.target.checked)} />
          Hoverable
        </label>
        <label>
          Normal
          <input type="color" value={idleColor} onChange={(e) => setIdleColor(e.target.value)} />
        </label>
        <label>
          Hover
          <input type="color" value={hoverColor} onChange={(e) => setHoverColor(e.target.value)} />
        </label>
        <button onClick={() => setSelected(null)}>Seçimi temizle</button>
      </section>

      <main className="map-card">
        {!country ? (
          <p>src/countries altında ülke bulunamadı</p>
        ) : (
          <CountryMap
            key={country.id}
            data={country}
            showTooltip={showTooltip}
            hoverable={hoverable}
            customStyle={{ idleColor, hoverColor }}
            regionStyle={regionStyle}
            tooltipText={
              richTooltip
                ? (region) => (
                    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <strong>{region.name}</strong>
                      <span style={{ opacity: 0.7, fontSize: 12 }}>id: {region.id}</span>
                    </div>
                  )
                : undefined
            }
            style={{ maxWidth: country.viewBox.height > country.viewBox.width ? 520 : undefined, margin: "0 auto" }}
            onHover={(region) => setHovered(region)}
            onLeave={() => setHovered(null)}
            onClick={(region) => {
              setSelected(region);
              pushLog(`click → ${region.name}`);
            }}
          />
        )}
      </main>

      <section className="status">
        <div>
          <span>Hover</span>
          <strong>{hovered?.name ?? "—"}</strong>
        </div>
        <div>
          <span>Seçili</span>
          <strong>{selected?.name ?? "—"}</strong>
        </div>
      </section>

      <section className="log">
        <span>Event log</span>
        {log.length === 0 ? <p>Henüz event yok</p> : log.map((line, i) => <code key={i}>{line}</code>)}
      </section>

      <section className="multi">
        <span>Aynı sayfada ikinci harita (ID çakışması testi)</span>
        {country && <CountryMap key={country.id} data={country} showTooltip customStyle={{ idleColor: "#a1a1aa", hoverColor: "#16a34a" }} />}
      </section>
    </div>
  );
}