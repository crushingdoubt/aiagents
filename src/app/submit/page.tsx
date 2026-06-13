import Link from "next/link";
import { createTicket } from "@/app/actions";

export default async function SubmitPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const { success } = await searchParams;

  return (
    <main className="flex flex-1 flex-col items-center bg-zinc-50 px-6 py-16">
      <div className="w-full max-w-lg">
        <Link
          href="/"
          className="text-sm text-zinc-500 transition hover:text-zinc-800"
        >
          ← Back
        </Link>

        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900">
          Submit a support ticket
        </h1>
        <p className="mt-2 text-zinc-600">
          Tell us what&apos;s going on and our team will get back to you.
        </p>

        {success ? (
          <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4 text-green-800">
            ✅ Thanks! Your ticket was submitted. Our team has been notified.
          </div>
        ) : null}

        <form action={createTicket} className="mt-8 space-y-5">
          <Field label="Your name" name="name" type="text" />
          <Field label="Email" name="email" type="email" />
          <Field label="Subject" name="subject" type="text" />

          <div className="space-y-1.5">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-zinc-800"
            >
              Describe the issue
            </label>
            <textarea
              id="description"
              name="description"
              rows={5}
              required
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 shadow-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-red-600 px-4 py-2.5 font-medium text-white shadow-sm transition hover:bg-red-500"
          >
            Submit ticket
          </button>
        </form>
      </div>
    </main>
  );
}

function Field({
  label,
  name,
  type,
}: {
  label: string;
  name: string;
  type: string;
}) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-zinc-800"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required
        className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 shadow-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
      />
    </div>
  );
}
