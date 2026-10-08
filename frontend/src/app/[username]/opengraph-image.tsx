import { ImageResponse } from 'next/og';

export const alt = 'SmartCard Digital Profile';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = await params;
  const username = resolvedParams?.username || 'smriti';

  let name = 'Smriti Jha';
  let title = 'Full Stack Developer';
  let company = 'SmartCard Technologies';
  let bio = 'Building modern digital experiences.';
  let profileImage = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80';
  let themeColor = '#2563EB';

  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';
    const res = await fetch(`${backendUrl}/api/cards/${username}`, { next: { revalidate: 60 } });
    if (res.ok) {
      const data = await res.json();
      const card = data.data || data;
      if (card?.name) {
        name = card.name;
        title = card.title || card.role || title;
        company = card.company || company;
        bio = card.bio || bio;
        profileImage = card.profileImage || profileImage;
        themeColor = card.themeColor || themeColor;
      }
    }
  } catch {
    // Use fallback values
  }

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#0B0F17',
          color: '#FFFFFF',
          padding: '60px 80px',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Background glow accent */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            backgroundColor: themeColor,
            opacity: 0.25,
            filter: 'blur(100px)',
          }}
        />

        {/* Top Header: Brand & Live Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: themeColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                fontWeight: 'bold',
                fontSize: '20px',
              }}
            >
              S
            </div>
            <span
              style={{
                fontSize: '24px',
                fontWeight: '700',
                letterSpacing: '-0.5px',
                color: '#FFFFFF',
              }}
            >
              SmartCard
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(37, 99, 235, 0.15)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              padding: '8px 18px',
              borderRadius: '999px',
              color: '#93C5FD',
              fontSize: '14px',
              fontWeight: '600',
            }}
          >
            <span>LIVE DIGITAL CARD</span>
          </div>
        </div>

        {/* Center: Profile Card Display */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '40px',
            backgroundColor: 'rgba(19, 25, 36, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '28px',
            padding: '40px 50px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
          }}
        >
          {/* Avatar Photo */}
          <div
            style={{
              width: '130px',
              height: '130px',
              borderRadius: '999px',
              border: `4px solid ${themeColor}`,
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#1E293B',
            }}
          >
            <img
              src={profileImage}
              alt={name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>

          {/* User Bio and Info */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              flex: 1,
            }}
          >
            <div
              style={{
                fontSize: '38px',
                fontWeight: '800',
                color: '#FFFFFF',
                letterSpacing: '-1px',
                lineHeight: 1.1,
              }}
            >
              {name}
            </div>

            <div
              style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#93C5FD',
              }}
            >
              {title} {company ? `• ${company}` : ''}
            </div>

            <div
              style={{
                fontSize: '16px',
                color: '#94A3B8',
                marginTop: '4px',
                lineHeight: 1.4,
              }}
            >
              &ldquo;{bio}&rdquo;
            </div>
          </div>
        </div>

        {/* Footer: Slogan & URL */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '24px',
          }}
        >
          <div
            style={{
              fontSize: '16px',
              color: '#94A3B8',
              fontWeight: '500',
            }}
          >
            Your professional identity in one link. Zero NFC required.
          </div>

          <div
            style={{
              fontSize: '16px',
              fontFamily: 'monospace',
              color: '#60A5FA',
              fontWeight: '600',
            }}
          >
            smartcard.app/{username}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
