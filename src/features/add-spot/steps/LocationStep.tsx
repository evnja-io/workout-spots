import { useTranslation } from 'react-i18next'
import { MapView } from '~/features/spots/MapView'
import { reverseGeocode } from '~/lib/mapbox/geocoding'
import { AddressAutocomplete } from '../AddressAutocomplete'
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div>
        <label className="field-label">{t('addSpot.addressLabel')}</label>
        {readOnly ? (
          <p className="field-hint">{values.address || '—'}</p>
        ) : (
          <>
            <AddressAutocomplete value={values.address} onSelect={handleSelect} />
            <p className="field-hint">{t('addSpot.addressHint')}</p>
          </>
        )}
        {readOnly && (
          <p className="field-hint" style={{ fontStyle: 'italic', color: 'var(--text-3)' }}>
            {t('editSpot.locationReadOnly')}
          </p>
        )}
      </div>
      <div className="mini-map">
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
          <div className="mini-map-hint">{t('addSpot.mapHint')}</div>
        )}
      </div>
    </div>
  )
}
