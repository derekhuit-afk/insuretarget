import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

const SAMPLE_DATA = [{"company":"Plymouth Rock Assurance","type":"Carrier","state":"MA","am_best_rating":"A","total_premium":1840000000,"combined_ratio":0.94,"surplus":680000000,"yoy_surplus_change":0.08,"pe_ratio":12.4,"acquisition_score":82,"strategic_fit":"High","key_lines":"Auto, Homeowners"},{"company":"Patriot National","type":"MGA","state":"FL","am_best_rating":"NR","total_premium":240000000,"combined_ratio":1.02,"surplus":42000000,"yoy_surplus_change":-0.14,"pe_ratio":null,"acquisition_score":61,"strategic_fit":"Medium","key_lines":"Workers Comp"},{"company":"Pacific Specialty Insurance","type":"Carrier","state":"CA","am_best_rating":"A-","total_premium":890000000,"combined_ratio":0.97,"surplus":320000000,"yoy_surplus_change":0.05,"pe_ratio":14.8,"acquisition_score":74,"strategic_fit":"High","key_lines":"E&S, Surplus Lines"}];

function getStats(data: Record<string, unknown>[]) {
  if (!data || data.length === 0) return {};
  const numericKeys = Object.keys(data[0]).filter(k => typeof data[0][k] === "number");
  const stats: Record<string, unknown> = { total_records: data.length };
  numericKeys.slice(0, 2).forEach(k => {
    const avg = data.reduce((s, r) => s + (Number(r[k]) || 0), 0) / data.length;
    stats[`avg_${k}`] = Math.round(avg * 100) / 100;
  });
  return stats;
}

export async function GET(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  const url = new URL(req.url);
  const q = url.searchParams.get("q") || "";
  
  let data = SAMPLE_DATA as Record<string, unknown>[];
  if (q) {
    data = data.filter(r =>
      Object.values(r).some(v => String(v).toLowerCase().includes(q.toLowerCase()))
    );
  }
  
  return NextResponse.json({
    data,
    stats: getStats(data),
    refreshed: new Date().toISOString()
  });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  const data = SAMPLE_DATA as Record<string, unknown>[];
  const headers = data.length > 0 ? Object.keys(data[0]) : [];
  const csv = [
    headers.join(","),
    ...data.map(r => headers.map(h => String(r[h] ?? "")).join(","))
  ].join("\n");
  
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename=insuretarget-export.csv`
    }
  });
}
