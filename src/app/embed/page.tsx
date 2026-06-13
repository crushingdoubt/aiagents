import Link from "next/link";
import { WidgetDemo } from "./WidgetDemo";

export default function EmbedPage() {
  return (
    <main className="flex flex-1 flex-col items-center bg-zinc-50 px-6 py-16">
      <div className="w-full max-w-lg">
        <Link
          href="/"
          className="text-sm text-zinc-500 transition hover:text-zinc-800"
        >
          ← Home
        </Link>

        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900">
          Embed the support widget
        </h1>
        <p className="mt-2 text-zinc-600">
          Paste this snippet into any website (right before{" "}
          <code className="rounded bg-zinc-200 px-1 text-sm">&lt;/body&gt;</code>
          ). It adds a floating support button in the bottom-right corner.
        </p>

        <div className="mt-6">
          <WidgetDemo />
        </div>

        <p className="mt-8 text-sm text-zinc-500">
          👉 The live widget is already loaded on this page — look in the
          bottom-right corner and try sending a message. New tickets show up on
          the{" "}
          <Link href="/dashboard" className="text-red-600 underline">
            dashboard
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
