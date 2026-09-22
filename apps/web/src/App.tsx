import { useState } from "react";
import type { FormEvent } from "react";
import "./index.css";

type CreateLinkResponse = {
  code: string;
  destination: string;
  shortUrl: string;
};

const apiUrl = import.meta.env.VITE_API_URL;

export default function App() {
  const [destination, setDestination] = useState("");
  const [alias, setAlias] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setShortUrl("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`${apiUrl}/links`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          destination,
          ...(alias.trim() ? { alias: alias.trim() } : {}),
        }),
      });

      const data = (await response.json()) as CreateLinkResponse & {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to create a short link.");
      }

      setShortUrl(data.shortUrl);
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Unable to create a short link.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="page">
      <section className="card">
        <p className="eyebrow">URL Shortener</p>
        <h1>Turn long links into simple ones.</h1>
        <p className="intro">
          Paste a destination URL and create a short, shareable link.
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="destination">Destination URL</label>
          <div className="form-row">
            <input
              id="destination"
              type="url"
              value={destination}
              onChange={(event) => setDestination(event.target.value)}
              placeholder="https://example.com/article"
              required
            />
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Shorten"}
            </button>
          </div>

          <label className="alias-label" htmlFor="alias">
            Custom alias <span>optional</span>
          </label>
          <input
            id="alias"
            type="text"
            value={alias}
            onChange={(event) => setAlias(event.target.value)}
            placeholder="my-project"
            minLength={4}
            maxLength={24}
            pattern="[A-Za-z0-9-]+"
          />
        </form>

        {error && <p className="message error">{error}</p>}

        {shortUrl && (
          <section className="result" aria-live="polite">
            <p>Your short link</p>
            <a href={shortUrl} target="_blank" rel="noreferrer">
              {shortUrl}
            </a>
          </section>
        )}
      </section>
    </main>
  );
}


