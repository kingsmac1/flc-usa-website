/**
 * CHECK-IN CONFIG & HELPERS
 * -------------------------
 * The actual security enforcement for GPS check-in lives server-side, in
 * the `validate_checkin_location` trigger on the check_ins table (see
 * checkin_schema.sql) — that's what actually prevents someone from
 * checking in remotely, since it can't be edited around from the browser.
 *
 * This file's distance calculation is used only for the UI: showing a
 * helpful "you're 40m away, keep walking" message, and disabling the
 * check-in button when clearly out of range, before the user even taps
 * it. Treat it as a UX nicety, not a security boundary.
 */

/**
 * The church's coordinates and check-in radius.
 *
 * >>> REPLACE lat/lng BELOW WITH THE REAL VALUES <<<
 * Get them from Google Maps: right-click the exact spot on the map for
 * 2415 Director's Row, Indianapolis, IN 46241 -> click the coordinates
 * that appear at the top of the menu to copy them.
 *
 * Keep this in sync with the same values in the Postgres trigger
 * (checkin_schema.sql) — the two aren't automatically linked.
 */
export const CHURCH_LOCATION = {
  lat: 4.982411, // TEST VALUE (your current location) -- REPLACE with real church coords before launch
  lng: 7.971364, // TEST VALUE (your current location) -- REPLACE with real church coords before launch
  radiusMeters: 150,
};

/** Distance between two lat/lng points, in meters (Haversine formula). */
export function distanceMeters(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export type LocationResult =
  | { status: "in-range"; distance: number; latitude: number; longitude: number }
  | { status: "out-of-range"; distance: number; latitude: number; longitude: number }
  | { status: "denied" }
  | { status: "unsupported" }
  | { status: "error"; message: string };

/**
 * Gets the browser's current position and compares it to the church's
 * location. Wraps the callback-based Geolocation API in a Promise for
 * easier use with async/await.
 */
export function checkLocation(): Promise<LocationResult> {
  return new Promise((resolve) => {
    if (!("geolocation" in navigator)) {
      resolve({ status: "unsupported" });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const distance = distanceMeters(
          latitude,
          longitude,
          CHURCH_LOCATION.lat,
          CHURCH_LOCATION.lng,
        );
        resolve(
          distance <= CHURCH_LOCATION.radiusMeters
            ? { status: "in-range", distance, latitude, longitude }
            : { status: "out-of-range", distance, latitude, longitude },
        );
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          resolve({ status: "denied" });
        } else {
          resolve({ status: "error", message: error.message });
        }
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  });
}

/** Today's date as "YYYY-MM-DD", matching the format used in check_ins.service_date. */
export function todayServiceDate(): string {
  return new Date().toISOString().slice(0, 10);
}
