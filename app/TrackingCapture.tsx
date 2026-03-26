"use client";

/**
 * Invisible component included in the root layout.
 * On every page load it reads utm_* and ref params from the URL and
 * persists them to localStorage (first-touch: never overwrites existing data).
 * The stored params are later sent to /api/registrations/attribution when
 * the user is authenticated on the /tickets page.
 */

import { useEffect } from "react";
import { captureTrackingParams } from "@/lib/tracking-params";

export default function TrackingCapture() {
  useEffect(() => {
    captureTrackingParams();
  }, []);

  return null;
}
