import { NextResponse } from "next/server";

import { SITE } from "@/lib/constants";


/**
 * Spec 3: /cv redirects to the CV PDF. The cv_download analytics event is fired
 * by the CvLink component on click, because a server redirect has no access to
 * the analytics client.
 */
export function GET(request: Request) {
  return NextResponse.redirect(new URL(SITE.cvPath, request.url), 307);
}
