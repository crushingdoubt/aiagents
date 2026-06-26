"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { createTicket } from "@/app/actions";

export default function SubmitPage() {
  const [supportType, setSupportType] = useState("Technical");
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    data.set("support_type", supportType);
    startTransition(async () => {
      await createTicket(data);
      setSuccess(true);
    });
  }

  return (
    <main className="flex flex-1 flex-col items-center bg-zinc-50 px-6 py-16">
      <div className="w-full max-w-lg">
        <Link href="/" className="text-sm text-zinc-500 transition hover:text-zinc-800">
          ← Back
        </Link>

        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900">
          Submit a support ticket
        </h1>
        <p className="mt-2 text-zinc-500">
          Tell us what&apos;s going on and our team will get back to you shortly.
        </p>

        {success ? (
          <div className="mt-8 rounded-2xl border border-green-100 bg-green-50 px-6 py-10 text-center">
            <div className="text-4xl">✅</div>
            <h2 className="mt-3 text-lg font-semibold text-zinc-900">Ticket submitted!</h2>
            <p className="mt-1 text-sm text-zinc-500">Our team has been notified and will be in touch soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <Field label="Your name" name="name" type="text" placeholder="Jane Smith" />
            <Field label="Email" name="email" type="email" placeholder="jane@example.com" />
            <Field label="Subject" name="subject" type="text" placeholder="Brief summary of the issue" />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-zinc-700">Support type</label>
              <div className="flex gap-3">
                {["Technical", "Billing"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSupportType(type)}
                    className={`flex-1 rounded-lg border-2 py-2.5 text-sm font-semibold transition ${
                      supportType === type
                        ? "border-red-600 bg-red-50 text-red-600"
                        : "border-zinc-200 bg-white text-zinc-500 hover:border-zinc-300 hover:text-zinc-700"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium text-zinc-700">
                Describe the issue
              </label>
              <textarea
                id="description"
                name="description"
                rows={5}
                required
                placeholder="Include any relevant details…"
                className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-zinc-900 placeholder-zinc-400 shadow-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="screenshot" className="block text-sm font-medium text-zinc-700">
                Screenshot <span className="font-normal text-zinc-400">(optional)</span>
              </label>
              <input
                id="screenshot"
                name="screenshot"
                type="file"
                accept="image/*"
                className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 shadow-sm file:mr-3 file:rounded file:border-0 file:bg-zinc-100 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-zinc-700 hover:file:bg-zinc-200"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-lg bg-red-600 px-4 py-3 font-semibold text-white shadow-sm transition hover:bg-red-500 disabled:opacity-50"
            >
              {isPending ? "Submitting…" : "Submit ticket"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}

function Field({
  label,
  name,
  type,
  placeholder,
}: {
  label: string;
  name: string;
  type: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium text-zinc-700">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required
        placeholder={placeholder}
        className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-zinc-900 placeholder-zinc-400 shadow-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
      />
    </div>
  );
}
