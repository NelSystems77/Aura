"use client";

import { useEffect } from "react";
import { getClientAnalytics } from "@/lib/firebase-client";

export function FirebaseAnalytics() {
  useEffect(() => {
    getClientAnalytics().catch(() => {});
  }, []);

  return null;
}
