"use client";

import { useState } from "react";
import Link from "next/link";

function escHtml(str: string): string {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function renderInline(str: string): string {
  return escHtml(str)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(
      /`([^`]+)`/g,
      '<code style="background:#f0f0f0;padding:1px 4px;border-radius:3px;font-family:monospace">$1</code>'
    );
}

function renderTable(tableLines: string[]): string {
  const rows = tableLines.filter((l) => !/^\|[\s|:-]+\|$/.test(l));
  if (rows.length === 0) return "";

  const parseRow = (line: string) =>
    line
      .split("|")
      .slice(1, -1)
      .map((cell) => cell.trim());

  const [headerLine, ...bodyLines] = rows;
  const headers = parseRow(headerLine);

  let t =
    '<table style="border-collapse:collapse;width:100%;margin:16px 0;font-size:14px">';
  t += "<thead><tr>";
  for (const h of headers) {
    t += `<th style="border:1px solid #ddd;padding:8px 12px;background:#f5f5f5;text-align:left;font-weight:600">${renderInline(h)}</th>`;
  }
  t += "</tr></thead><tbody>";
  for (const line of bodyLines) {
    const cells = parseRow(line);
    t += "<tr>";
    for (let j = 0; j < headers.length; j++) {
      t += `<td style="border:1px solid #ddd;padding:8px 12px;vertical-align:top">${renderInline(cells[j] ?? "")}</td>`;
    }
    t += "</tr>";
  }
  t += "</tbody></table>";
  return t;
}

function markdownToHtml(md: string): string {
  const lines = md.split("\n");
  let html = "";
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("```")) {
      i++;
      let code = "";
      while (i < lines.length && !lines[i].startsWith("```")) {
        code += lines[i] + "\n";
        i++;
      }
      i++;
      html += `<pre style="background:#f6f6f6;padding:12px;border-radius:4px;font-size:13px;font-family:monospace;overflow-x:auto;white-space:pre-wrap">${escHtml(code.trimEnd())}</pre>\n`;
      continue;
    }

    const h1 = line.match(/^# (.+)$/);
    const h2 = line.match(/^## (.+)$/);
    const h3 = line.match(/^### (.+)$/);
    if (h1) {
      html += `<h1 style="border-bottom:2px solid #eee;padding-bottom:8px;margin-top:24px;font-size:1.5rem;font-weight:700">${renderInline(h1[1])}</h1>\n`;
      i++;
      continue;
    }
    if (h2) {
      html += `<h2 style="color:#333;margin-top:28px;margin-bottom:8px;font-size:1.2rem;font-weight:600">${renderInline(h2[1])}</h2>\n`;
      i++;
      continue;
    }
    if (h3) {
      html += `<h3 style="color:#555;margin-top:20px;font-weight:600">${renderInline(h3[1])}</h3>\n`;
      i++;
      continue;
    }

    if (line.startsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].startsWith("|")) {
        tableLines.push(lines[i]);
        i++;
      }
      html += renderTable(tableLines) + "\n";
      continue;
    }

    if (line.startsWith("> ")) {
      html += `<blockquote style="border-left:3px solid #ddd;padding:4px 12px;color:#666;margin:8px 0">${renderInline(line.slice(2))}</blockquote>\n`;
      i++;
      continue;
    }

    if (line.match(/^- /)) {
      let items = "";
      while (i < lines.length && lines[i].match(/^- /)) {
        const text = lines[i].slice(2);
        const taskDone = text.match(/^\[x\] (.+)/i);
        const taskOpen = text.match(/^\[ \] (.+)/);
        if (taskDone) {
          items += `<li style="margin:4px 0">☑ <s>${renderInline(taskDone[1])}</s></li>`;
        } else if (taskOpen) {
          items += `<li style="margin:4px 0">☐ ${renderInline(taskOpen[1])}</li>`;
        } else {
          items += `<li style="margin:4px 0">${renderInline(text)}</li>`;
        }
        i++;
      }
      html += `<ul style="padding-left:20px;margin:8px 0">${items}</ul>\n`;
      continue;
    }

    if (line.trim() === "") {
      i++;
      continue;
    }

    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].startsWith("#") &&
      !lines[i].startsWith("|") &&
      !lines[i].startsWith("- ") &&
      !lines[i].startsWith("> ") &&
      !lines[i].startsWith("```")
    ) {
      paraLines.push(renderInline(lines[i]));
      i++;
    }
    if (paraLines.length)
      html += `<p style="margin:8px 0">${paraLines.join("<br>")}</p>\n`;
  }

  return html;
}

export default function ReportClient() {
  const [html, setHtml] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);

  async function generate() {
    setLoading(true);
    setError(null);
    setHtml(null);
    try {
      const res = await fetch("/api/admin/report");
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const data = await res.json();
      setHtml(markdownToHtml(data.report));
      setGeneratedAt(new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Link href="/admin" className="text-sm text-slate-400 hover:text-slate-600">
                ← Admin
              </Link>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Daily Report</h1>
            {generatedAt && (
              <p className="text-xs text-slate-400 mt-1">Generated at {generatedAt}</p>
            )}
          </div>
          <button
            onClick={generate}
            disabled={loading}
            className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Generating…" : html ? "Regenerate" : "Generate Report"}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700 mb-6">
            {error}
          </div>
        )}

        {loading && (
          <div className="bg-white border border-slate-200 rounded-2xl px-8 py-16 text-center">
            <p className="text-slate-500 text-sm">Collecting data and running AI analysis…</p>
            <p className="text-slate-400 text-xs mt-2">This takes about 1–2 minutes</p>
          </div>
        )}

        {!loading && !html && !error && (
          <div className="bg-white border border-slate-200 rounded-2xl px-8 py-16 text-center">
            <p className="text-slate-400 text-sm">Click &ldquo;Generate Report&rdquo; to fetch live data and run AI analysis.</p>
          </div>
        )}

        {html && (
          <div
            className="bg-white border border-slate-200 rounded-2xl px-8 py-8"
            style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", lineHeight: "1.6", color: "#222" }}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        )}
      </div>
    </div>
  );
}
