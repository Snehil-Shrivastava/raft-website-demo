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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: wire this up to whatever endpoint/action should issue the badge
    console.log("Get badge form submitted:", formData);
    setSubmitted(true);
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
        <div className="relative w-4/5 max-w-200 bg-white text-black rounded-md py-6 px-10 shadow-[0_0_20px_4px_rgba(0,0,0,0.25)] h-150 max-sm:w-9/10 max-sm:px-2 max-sm:py-8">
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
              {/* <h2 className="text-lg font-semibold mb-1">Get your badge</h2>
              <p className="text-sm text-gray-600 mb-4">
                Enter your details and we&apos;ll send your badge over.
              </p> */}

              {/* <form onSubmit={handleSubmit} className="flex flex-col gap-3">
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

                <button
                  type="submit"
                  className="mt-2 rounded-md bg-black text-white px-4 py-2 text-sm cursor-pointer hover:opacity-90"
                >
                  Submit
                </button>
              </form> */}
              <iframe
                className="airtable-embed"
                src="https://airtable.com/embed/apppjD9WWCVbqQ8SP/pagH6fWcvFjOOL3cM/form"
                frameBorder="0"
                width="100%"
                height="100%"
                style={{ background: "transparent", border: "1px solid #ccc" }}
              ></iframe>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GetBadgeForm;
