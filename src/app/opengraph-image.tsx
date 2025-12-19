import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Ultrablue - Drizzle vs Prisma'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0a0e27 0%, #1a2456 100%)',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Logo e Título */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            marginBottom: '40px',
          }}
        >
          <div style={{ fontSize: '120px' }}>🐳</div>
          <div
            style={{
              fontSize: '72px',
              fontWeight: 'bold',
              background: 'linear-gradient(90deg, #38bdf8 0%, #60a5fa 100%)',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Ultrablue
          </div>
        </div>

        {/* Subtítulo */}
        <div
          style={{
            fontSize: '48px',
            fontWeight: '600',
            color: '#e0f2fe',
            marginBottom: '30px',
          }}
        >
          Drizzle vs Prisma
        </div>

        {/* Descrição */}
        <div
          style={{
            fontSize: '28px',
            color: '#94a3b8',
            textAlign: 'center',
            maxWidth: '900px',
            lineHeight: '1.4',
          }}
        >
          Comparativo técnico detalhado: migrações, tipagem, performance e ecossistema
        </div>

        {/* Badges */}
        <div
          style={{
            display: 'flex',
            gap: '20px',
            marginTop: '50px',
          }}
        >
          <div
            style={{
              background: 'rgba(163, 230, 53, 0.15)',
              border: '2px solid #a3e635',
              borderRadius: '12px',
              padding: '12px 24px',
              color: '#bef264',
              fontSize: '24px',
              fontWeight: '600',
            }}
          >
            Drizzle
          </div>
          <div
            style={{
              background: 'rgba(168, 85, 247, 0.15)',
              border: '2px solid #a855f7',
              borderRadius: '12px',
              padding: '12px 24px',
              color: '#c084fc',
              fontSize: '24px',
              fontWeight: '600',
            }}
          >
            Prisma
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
