import { posthog } from "posthog-js";
import { type Component, createSignal, onMount, Show } from "solid-js";
import { Button, IconButton } from "../primitives/button";
import { Card } from "../primitives/card";

type Consent = "accepted" | "declined";

const POSTHOG_KEY = import.meta.env.PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = import.meta.env.PUBLIC_POSTHOG_HOST;
const COOKIE_DOMAIN = import.meta.env.PUBLIC_COOKIE_DOMAIN;
const SECURE = import.meta.env.PUBLIC_SECURE === "true";
const ANALYTICS_ENABLED = Boolean(POSTHOG_KEY && POSTHOG_HOST);
const PERSISTENCE_KEY = `ph_${POSTHOG_KEY}_posthog`;
// Shared with the landing page, so one choice applies to both.
const CONSENT_COOKIE = "andesine-consent";
const CONSENT_MAX_AGE = 60 * 60 * 24 * 365;
const PRIVACY_URL = "https://andesine.app/privacy";

const readConsent = (): Consent | null => {
  const value = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(`${CONSENT_COOKIE}=`))
    ?.slice(CONSENT_COOKIE.length + 1);

  return value === "accepted" || value === "declined" ? value : null;
};
const writeConsent = (consent: Consent): void => {
  const attributes = [
    "path=/",
    `max-age=${CONSENT_MAX_AGE}`,
    "SameSite=Lax",
    ...(COOKIE_DOMAIN ? [`domain=${COOKIE_DOMAIN}`] : []),
    ...(SECURE ? ["Secure"] : []),
  ];

  document.cookie = `${CONSENT_COOKIE}=${consent}; ${attributes.join("; ")}`;
};
// Signed-in users agreed to the privacy policy at registration, as in the app.
const isIdentified = (): boolean => {
  try {
    const persisted = JSON.parse(localStorage.getItem(PERSISTENCE_KEY) ?? "{}");

    return persisted.$user_state === "identified";
  } catch {
    return false;
  }
};
// Without consent, events are cookieless.
const applyConsent = (choice: Consent | null): void => {
  const accepted = choice === "accepted";

  // Each change sends an event, so only changes are applied.
  if (accepted && !posthog.has_opted_in_capturing()) posthog.opt_in_capturing();
  if (!accepted && posthog.has_opted_in_capturing())
    posthog.opt_out_capturing();
};

const Analytics: Component = () => {
  const [consent, setConsent] = createSignal<Consent | null | undefined>(
    undefined,
  );

  const choose = (choice: Consent) => {
    writeConsent(choice);
    setConsent(choice);
    applyConsent(choice);
  };

  onMount(() => {
    if (!ANALYTICS_ENABLED) return;

    const identified = isIdentified();
    const initialConsent = identified ? "accepted" : readConsent();

    setConsent(initialConsent);
    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      // The host can be a relay path, e.g. `/relay`; links still open PostHog.
      ui_host: "https://us.posthog.com",
      advanced_disable_feature_flags: true,
      cross_subdomain_cookie: true,
      // Cookieless mode would clear a signed-in user's identity, which the app shares.
      ...(!identified && {
        cookieless_mode: "on_reject",
        opt_out_capturing_by_default: true,
      }),
      // The landing page's key, so one choice applies to both and never changes the app's tracking.
      consent_persistence_name: "andesine_landing_consent",
      session_recording: { maskAllInputs: true },
    });
    applyConsent(initialConsent);
  });

  return (
    <Show when={consent() === null}>
      <Card
        class="fixed bottom-3 left-3 right-3 z-80 flex flex-col gap-3 rounded-xl bg-white p-3 shadow-lg md:right-auto md:w-72"
        role="dialog"
        aria-label="Cookie preferences"
      >
        <p class="m-0 text-sm leading-5 text-gray-500">
          We use cookies to improve Andesine. <br /> Read the{" "}
          <a
            class="font-medium underline"
            href={PRIVACY_URL}
            target="_blank"
            rel="noreferrer"
          >
            privacy policy
          </a>
          .
        </p>
        <div class="flex gap-2">
          <IconButton
            class="bg-gray-50"
            icon="i-lucide:x"
            aria-label="Decline"
            onClick={() => choose("declined")}
          />
          <Button class="flex-1" onClick={() => choose("accepted")}>
            Accept
          </Button>
        </div>
      </Card>
    </Show>
  );
};

export { Analytics };
