import { useTranslation } from 'react-i18next'
import { MapView } from '~/features/spots/MapView'
import { reverseGeocode } from '~/lib/mapbox/geocoding'
import { AddressAutocomplete } from '../AddressAutocomplete'
import { FieldLabel, FieldHint } from '~/components/ui/Field'
import type { AddSpotInput } from '../schema'
import type { MapStyle } from '~/lib/mapbox/map'
import type { GeocodeResult } from '~/lib/mapbox/geocoding'

interface LocationStepProps {
  values: AddSpotInput
  onChange: (patch: Partial<AddSpotInput>) => void
  mapStyle: MapStyle
  readOnly?: boolean
}

export function LocationStep({ values, onChange, mapStyle, readOnly }: LocationStepProps) {
  const { t } = useTranslation()

  async function handleMapClick(pos: { lng: number; lat: number }) {
    onChange({ position: pos })
    try {
      const result = await reverseGeocode(pos.lng, pos.lat)
      if (result) {
        onChange({
          address: result.address || result.placeName,
          city: result.city,
          region: result.region,
          country: result.country,
        })
      }
    } catch {
      // No token or network error — degrade silently
    }
  }

  function handleSelect(r: GeocodeResult) {
    onChange({
      position: { lng: r.lng, lat: r.lat },
      address: r.address || r.placeName,
      city: r.city,
      region: r.region,
      country: r.country,
    })
  }

  return (
    <div className="flex flex-col gap-3.5">
      <div>
        <FieldLabel>{t('addSpot.addressLabel')}</FieldLabel>
        {readOnly ? (
          <FieldHint>{values.address || '—'}</FieldHint>
        ) : (
          <>
            <AddressAutocomplete value={values.address} onSelect={handleSelect} />
            <FieldHint>{t('addSpot.addressHint')}</FieldHint>
          </>
        )}
        {readOnly && (
          <FieldHint style={{ fontStyle: 'italic', color: 'var(--text-3)' }}>
            {t('editSpot.locationReadOnly')}
          </FieldHint>
        )}
      </div>
      <div className="relative h-[200px] w-full overflow-hidden rounded-md border border-border bg-surface-2">
        <MapView
          spots={[]}
          activeSpotId={null}
          onSelectSpot={() => undefined}
          {...(readOnly ? {} : { onMapClick: (pos: { lng: number; lat: number }) => { void handleMapClick(pos) } })}
          addMode={!readOnly}
          newSpotPosition={values.position?.lng != null ? values.position : null}
          mapStyle={mapStyle}
          theme="light"
        />
        {!readOnly && !values.position && (
          <div className="absolute left-2.5 top-2.5 rounded-[8px] bg-surface px-2.5 py-1.5 text-[11.5px] text-text-2 shadow-[var(--shadow-sm)]">
            {t('addSpot.mapHint')}
          </div>
        )}
      </div>
    </div>
  )
}
