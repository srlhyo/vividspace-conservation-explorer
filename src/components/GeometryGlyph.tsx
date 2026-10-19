export function GeometryGlyph({
  representation,
  selected = false,
}: {
  representation: 'boundary' | 'point'
  selected?: boolean
}) {
  return representation === 'boundary' ? (
    <span
      aria-label="Mapped as administrative boundary"
      className={`mt-0.5 size-4 shrink-0 rounded-[4px] border-2 ${selected ? 'border-amber-600 bg-gold/40' : 'border-forest bg-forest/15'}`}
    />
  ) : (
    <span
      aria-label="Mapped as location point"
      className={`mt-0.5 size-4 shrink-0 rounded-full border-2 border-white ring-1 ${selected ? 'bg-gold ring-amber-600' : 'bg-forest ring-forest'}`}
    />
  )
}
