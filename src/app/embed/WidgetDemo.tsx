"use client";

import { useEffect, useState } from "react";

export function WidgetDemo() {
  const [snippet, setSnippet] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Build the snippet against whatever origin/basePath we're actually on.
    const src = `${window.location.origin}/cd/widget.js`;
    setSnippet(`<script src="${src}" defer></script>`);

    // Load the live widget on this page so it can be tried immediately.
    if (!document.querySelector('script[data-cd-widget]')) {
      const s = document.createElement("script");
      s.src = src;
      s.defer = true;
      s.setAttribute("data-cd-widget", "1");
      document.body.appendChild(s);
    }
  }, []);

  return (
    <div className="space-y-4">
      <pre className="overflow-x-auto rounded-lg bg-zinc-900 px-4 py-3 text-sm text-zinc-100">
        <code>{snippet}</code>
      </pre>
      <button
        onClick={() => {
          navigator.clipboard.writeText(snippet);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
      >
        {copied ? "Copied!" : "Copy snippet"}
      </button>
    </div>
  );
}
