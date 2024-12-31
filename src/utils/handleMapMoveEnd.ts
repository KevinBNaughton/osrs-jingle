import { LatLngBounds, Map } from "leaflet";

export default function handleMapMoveEnd(map: Map, outerBounds: LatLngBounds) {
  if (map) {
    const currentBounds = map.getBounds();

    if (!outerBounds.contains(currentBounds)) {
      map.fitBounds(outerBounds);
    }
  }
}
