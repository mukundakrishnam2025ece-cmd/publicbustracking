// SIMULATED GPS — stands in for real driver-phone GPS until Phase 13.
// Moves a bus along its route's stop-to-stop path at a roughly constant
// speed, looping back to the start when it reaches the end.

import { Stop } from "./mock-data";

export type SimulatedPosition = {
  lat: number;
  lng: number;
  headingDeg: number;
  speedKmh: number;
  nextStop: Stop | null;
  etaToNextStopMin: number;
};

function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function headingDeg(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const y = Math.sin(((b.lng - a.lng) * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180);
  const x =
    Math.cos((a.lat * Math.PI) / 180) * Math.sin((b.lat * Math.PI) / 180) -
    Math.sin((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.cos(((b.lng - a.lng) * Math.PI) / 180);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

// elapsedSeconds: time since the simulation "started" for this bus.
// stops: ordered stops for the bus's route. speedKmh: constant demo speed.
export function getSimulatedPosition(
  stops: Stop[],
  elapsedSeconds: number,
  speedKmh: number
): SimulatedPosition {
  if (stops.length < 2) {
    const only = stops[0];
    return {
      lat: only?.lat ?? 0,
      lng: only?.lng ?? 0,
      headingDeg: 0,
      speedKmh: 0,
      nextStop: null,
      etaToNextStopMin: 0,
    };
  }

  const speedKmPerSec = speedKmh / 3600;
  let distanceRemaining = speedKmPerSec * elapsedSeconds;

  // total route length, for looping
  let totalLength = 0;
  for (let i = 0; i < stops.length - 1; i++) {
    totalLength += distanceKm(stops[i], stops[i + 1]);
  }
  distanceRemaining = distanceRemaining % totalLength; // loop the route

  for (let i = 0; i < stops.length - 1; i++) {
    const legLength = distanceKm(stops[i], stops[i + 1]);
    if (distanceRemaining <= legLength) {
      const t = legLength === 0 ? 0 : distanceRemaining / legLength;
      const lat = stops[i].lat + (stops[i + 1].lat - stops[i].lat) * t;
      const lng = stops[i].lng + (stops[i + 1].lng - stops[i].lng) * t;
      const remainingOnLeg = legLength - distanceRemaining;
      return {
        lat,
        lng,
        headingDeg: headingDeg(stops[i], stops[i + 1]),
        speedKmh,
        nextStop: stops[i + 1],
        etaToNextStopMin: speedKmh > 0 ? (remainingOnLeg / speedKmh) * 60 : 0,
      };
    }
    distanceRemaining -= legLength;
  }

  // fallback (shouldn't reach here due to modulo above)
  const last = stops[stops.length - 1];
  return {
    lat: last.lat,
    lng: last.lng,
    headingDeg: 0,
    speedKmh,
    nextStop: null,
    etaToNextStopMin: 0,
  };
}
