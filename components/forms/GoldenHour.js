"use client";
// Today's light at base: the sun's arc from rise to set with where it is right
// now, and the blue and golden hours worked out for Ajmer's actual coordinates.
import { useEffect, useState } from "react";
import { site } from "@/data/site";
import { fmtMinutes, istClock, sunTimes } from "@/lib/format";

export default function GoldenHour() {
  const [now, setNow] = useState(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const date = now || new Date(0);
  const { rise, set } = sunTimes(site.base.lat, site.base.lon, date);
  const nowMin = (date.getUTCHours() * 60 + date.getUTCMinutes() + date.getUTCSeconds() / 60 + 330) % 1440;
  const t = Math.max(0, Math.min(1, (nowMin - rise) / (set - rise)));
  const up = nowMin > rise && nowMin < set;
  // A half-ellipse from the left horizon to the right one.
  const cx = 20 + t * 260;
  const cy = 110 - Math.sin(t * Math.PI) * 90;

  const rows = [
    ["Blue hour", `${fmtMinutes(rise - 30)} – ${fmtMinutes(rise)}`],
    ["Golden hour · AM", `${fmtMinutes(rise)} – ${fmtMinutes(rise + 60)}`],
    ["Golden hour · PM", `${fmtMinutes(set - 60)} – ${fmtMinutes(set)}`],
    ["Blue hour", `${fmtMinutes(set)} – ${fmtMinutes(set + 30)}`],
  ];

  return (
    <div className="border border-line bg-soot/50 p-5 font-mono text-[10px] uppercase tracking-hud text-bone/70">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-saffron" />
          Light in Ajmer today
        </span>
        <span className="text-bone">{now ? istClock(now) : "--:--:--"} IST</span>
      </div>
      <svg viewBox="0 0 300 124" className="mt-4 w-full" aria-hidden="true">
        <line x1="0" x2="300" y1="110" y2="110" stroke="rgba(237,230,218,0.25)" />
        <path d="M20 110 Q150 -70 280 110" fill="none" stroke="rgba(237,230,218,0.2)" strokeDasharray="2 5" />
        {now && (
          <>
            <circle cx={cx} cy={up ? cy : 110} r="14" fill="rgba(240,120,45,0.18)" />
            <circle cx={cx} cy={up ? cy : 110} r="5" fill={up ? "#F0782D" : "#8C857A"} />
          </>
        )}
        <text x="20" y="122" textAnchor="middle" className="fill-bone/50 font-mono" style={{ fontSize: 9 }}>
          {fmtMinutes(rise)}
        </text>
        <text x="280" y="122" textAnchor="middle" className="fill-bone/50 font-mono" style={{ fontSize: 9 }}>
          {fmtMinutes(set)}
        </text>
      </svg>
      <dl className="mt-4 space-y-2">
        {rows.map(([k, v], i) => (
          <div key={i} className="flex justify-between gap-4 border-t border-line pt-2">
            <dt className={k.startsWith("Golden") ? "text-ember" : "text-bone/50"}>{k}</dt>
            <dd className="text-bone">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
