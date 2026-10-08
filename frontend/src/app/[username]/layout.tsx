import { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const username = resolvedParams?.username || 'smriti';

  let name = 'Smriti Jha';
  let title = 'Full Stack Developer';
  let company = 'SmartCard Technologies';
  let bio = 'Building modern digital experiences. 100% digital business cards.';
  let profileImage = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80';

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
      }
    }
  } catch {
    // Fallback defaults
  }

  const pageTitle = `${name} — ${title}${company ? ` at ${company}` : ''}`;
  const pageDescription = bio || `Connect with ${name} on SmartCard. High performance digital identity.`;
  const url = `https://smartcard.app/${username}`;

  return {
    title: pageTitle,
    description: pageDescription,
    applicationName: 'SmartCard',
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url,
      siteName: 'SmartCard',
      type: 'profile',
      images: [
        {
          url: `/${username}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: `${name} — SmartCard`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      images: [`/${username}/opengraph-image`],
    },
  };
}

export default function PublicCardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
