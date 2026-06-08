import { ImageResponse } from 'next/og'

import { SITE_TITLE } from '@/lib/site'

export const alt = SITE_TITLE
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #0A0A0A 0%, #141414 55%, #0F172A 100%)',
          padding: '72px 80px',
        }}
      >
        <div
          style={{
            width: 180,
            height: 180,
            borderRadius: 36,
            background: 'linear-gradient(135deg, #60A5FA 0%, #2563EB 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 48,
          }}
        >
          <div
            style={{
              width: 96,
              height: 104,
              borderRadius: 14,
              background: '#F8FAFC',
              display: 'flex',
              flexDirection: 'column',
              padding: '18px 16px',
              gap: 10,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 2,
                  border: '3px solid #2563EB',
                  borderTop: 'none',
                  borderRight: 'none',
                  transform: 'rotate(-45deg)',
                  marginTop: -4,
                }}
              />
              <div style={{ width: 34, height: 4, background: '#CBD5E1', borderRadius: 2 }} />
            </div>
            <div style={{ width: 72, height: 4, background: '#CBD5E1', borderRadius: 2 }} />
            <div style={{ width: 52, height: 4, background: '#CBD5E1', borderRadius: 2 }} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div
            style={{
              fontSize: 96,
              fontWeight: 700,
              color: '#FAFAFA',
              letterSpacing: -2,
              lineHeight: 1,
            }}
          >
            To-do
          </div>
          <div style={{ fontSize: 38, color: '#A3A3A3', lineHeight: 1.2 }}>
            Organiza tu dia
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <div
              style={{
                padding: '10px 22px',
                borderRadius: 26,
                background: 'rgba(59,130,246,0.14)',
                border: '2px solid rgba(96,165,250,0.35)',
                color: '#60A5FA',
                fontSize: 22,
                fontWeight: 600,
              }}
            >
              Tareas / Notificaciones
            </div>
            <div
              style={{
                padding: '10px 22px',
                borderRadius: 26,
                background: 'rgba(255,255,255,0.06)',
                border: '2px solid rgba(255,255,255,0.12)',
                color: '#E5E5E5',
                fontSize: 22,
                fontWeight: 500,
              }}
            >
              Bandeja / Hoy / Proximo
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  )
}
