export type MapViewMarker = {
  id: string;
  lat: number;
  lng: number;
};

export type MapViewProps = {
  markers: readonly MapViewMarker[];
  className?: string;
};

const MAP_PADDING = 0.12;

export function MapView({ markers, className }: Readonly<MapViewProps>) {
  const lats = markers.map((marker) => marker.lat);
  const lngs = markers.map((marker) => marker.lng);
  const minLat = lats.length > 0 ? Math.min(...lats) : 0;
  const maxLat = lats.length > 0 ? Math.max(...lats) : 0;
  const minLng = lngs.length > 0 ? Math.min(...lngs) : 0;
  const maxLng = lngs.length > 0 ? Math.max(...lngs) : 0;
  const latSpan = Math.max(maxLat - minLat, 0.001);
  const lngSpan = Math.max(maxLng - minLng, 0.001);

  return (
    <div
      role="img"
      aria-label={`Mapa de demostración con ${markers.length} propiedades`}
      className={`relative h-full w-full overflow-hidden bg-[#ece9e0] ${className ?? ""}`}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full opacity-60"
      >
        <rect width="100" height="100" fill="#ece9e0" />
        <path d="M0 28 L100 24 M0 55 L100 62 M0 81 L100 78 M22 0 L30 100 M64 0 L58 100" stroke="#d8d4c6" strokeWidth="1" />
        <path d="M0 40 L100 38 M8 0 L12 100" stroke="#c9c2b0" strokeWidth="2" />
        <path d="M0 66 L100 70 M82 0 L86 100" stroke="#c9c2b0" strokeWidth="2" />
        <rect x="24" y="18" width="16" height="12" fill="#d5e8d4" stroke="#b7cfb5" strokeWidth="0.8" />
        <rect x="70" y="70" width="18" height="14" fill="#d5e8d4" stroke="#b7cfb5" strokeWidth="0.8" />
        <rect x="40" y="40" width="10" height="8" fill="#cddceb" stroke="#aec3da" strokeWidth="0.8" />
      </svg>
      {markers.map((marker) => {
        const left = ((marker.lng - minLng) / lngSpan) * (100 - MAP_PADDING * 2) + MAP_PADDING;
        const top =
          100 - (((marker.lat - minLat) / latSpan) * (100 - MAP_PADDING * 2) + MAP_PADDING);
        return (
          <span
            key={marker.id}
            aria-hidden="true"
            className="absolute block h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-rose-500 shadow-[0_2px_6px_rgba(24,24,27,0.35)]"
            style={{ left: `${left}%`, top: `${top}%` }}
          />
        );
      })}
    </div>
  );
}
