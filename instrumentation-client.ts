import posthog from "posthog-js";

posthog.init("phc_i292SIJ4O9YYS4XT7QRCphQ2aXfNnOYHbjMEvol7z5y", {
  api_host: "https://tmr.aiwithmichal.com",
  defaults: "2026-01-30",
  capture_exceptions: true,
  debug: process.env.NODE_ENV === "development",
});
