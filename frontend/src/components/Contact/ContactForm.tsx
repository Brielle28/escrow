import { useState } from "react";
import { contactPageCopy } from "../../utils/Contact/contactCopy";

const topicValues = ["escrow", "partnership", "press", "other"] as const;
type TopicValue = (typeof topicValues)[number];

function topicLabel(v: TopicValue): string {
  switch (v) {
    case "escrow":
      return contactPageCopy.formTopicEscrow;
    case "partnership":
      return contactPageCopy.formTopicPartnership;
    case "press":
      return contactPageCopy.formTopicPress;
    default:
      return contactPageCopy.formTopicOther;
  }
}

const inputClass =
  "mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-900 shadow-sm outline-none ring-0 transition-[border-color,box-shadow] placeholder:text-gray-400 focus:border-brand-500/40 focus:shadow-[0_0_0_3px_rgba(85,179,107,0.18)]";
const labelClass = "text-sm font-semibold text-gray-800";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState<TopicValue>("escrow");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  function validate(): string | null {
    if (!name.trim()) return contactPageCopy.validationName;
    const em = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) return contactPageCopy.validationEmail;
    if (message.trim().length < 20) return contactPageCopy.validationMessage;
    return null;
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const err = validate();
    if (err) {
      setError(err);
      setStatus("error");
      return;
    }
    setError("");
    setStatus("sending");
    window.setTimeout(() => {
      setStatus("sent");
    }, 650);
  }

  if (status === "sent") {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-[0_2px_24px_-12px_rgba(15,23,42,0.1)] ring-1 ring-black/5 sm:p-10">
        <h2 className="text-xl font-bold text-gray-900">{contactPageCopy.formSuccessTitle}</h2>
        <p className="mt-3 text-sm leading-relaxed text-gray-600 sm:text-base">{contactPageCopy.formSuccessBody}</p>
        <button
          type="button"
          onClick={() => {
            setName("");
            setEmail("");
            setTopic("escrow");
            setMessage("");
            setStatus("idle");
          }}
          className="mt-8 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-50"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-gray-200 bg-white p-6 shadow-[0_2px_24px_-12px_rgba(15,23,42,0.1)] ring-1 ring-black/5 sm:p-8"
      noValidate
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-1">
          <label htmlFor="contact-name" className={labelClass}>
            {contactPageCopy.formNameLabel}
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={contactPageCopy.formNamePlaceholder}
            className={inputClass}
          />
        </div>
        <div className="sm:col-span-1">
          <label htmlFor="contact-email" className={labelClass}>
            {contactPageCopy.formEmailLabel}
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={contactPageCopy.formEmailPlaceholder}
            className={inputClass}
          />
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="contact-topic" className={labelClass}>
          {contactPageCopy.formTopicLabel}
        </label>
        <select id="contact-topic" name="topic" value={topic} onChange={(e) => setTopic(e.target.value as TopicValue)} className={inputClass}>
          {topicValues.map((v) => (
            <option key={v} value={v}>
              {topicLabel(v)}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-5">
        <label htmlFor="contact-message" className={labelClass}>
          {contactPageCopy.formMessageLabel}
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={contactPageCopy.formMessagePlaceholder}
          className={`${inputClass} resize-y min-h-[120px]`}
        />
      </div>

      {status === "error" && error ? (
        <p className="mt-4 text-sm font-medium text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-6 w-full rounded-xl bg-brand-500 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-brand-500/25 transition-colors hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
      >
        {status === "sending" ? contactPageCopy.formSending : contactPageCopy.formSubmit}
      </button>
    </form>
  );
}
