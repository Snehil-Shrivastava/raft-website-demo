"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const GetBadgeForm = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isModalOpen = searchParams.get("getBadge") === "true";

  const [formData, setFormData] = useState({ name: "", email: "" });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const closeModal = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("getBadge");
    const query = params.toString();
    router.push(`${pathname}${query ? `?${query}` : ""}`, { scroll: false });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    console.log("data from outside try catch block", JSON.stringify(formData));

    try {
      const res = await fetch("/api/submit-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      console.log("data", data);

      if (!res.ok) {
        throw new Error(data?.error?.error?.message || "Something went wrong");
      }

      setSubmitted(true);
    } catch (err) {
      console.log("error", err);
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-99 select-none bg-black/50 backdrop-blur-sm text-white ${
        isModalOpen ? "pointer-events-auto" : "pointer-events-none hidden"
      }`}
      onClick={closeModal}
    >
      <div
        className="h-full w-full flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-4/5 max-w-200 bg-white text-black rounded-md p-6 shadow-[0_0_20px_4px_rgba(0,0,0,0.25)]">
          <button
            type="button"
            onClick={closeModal}
            aria-label="Close"
            className="absolute right-3 top-3 text-xl leading-none text-gray-400 hover:text-gray-700 cursor-pointer"
          >
            &times;
          </button>

          {submitted ? (
            <div className="py-6 text-center">
              <h2 className="text-lg font-semibold mb-2">You&apos;re in!</h2>
              <p className="text-sm text-gray-600">
                We&apos;ll email you your badge shortly.
              </p>
              <button
                type="button"
                onClick={closeModal}
                className="mt-4 rounded-md bg-black text-white px-4 py-2 text-sm cursor-pointer"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-lg font-semibold mb-1">Get your badge</h2>
              <p className="text-sm text-gray-600 mb-4">
                Enter your details and we&apos;ll send your badge over.
              </p>
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <label className="flex flex-col gap-1 text-sm">
                  Name
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </label>

                <label className="flex flex-col gap-1 text-sm">
                  Email
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </label>

                {error && <p className="text-sm text-red-600">{error}</p>}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-2 rounded-md bg-black text-white px-4 py-2 text-sm cursor-pointer hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Submitting…" : "Submit"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GetBadgeForm;
