'use client';
import { useEffect, useState, use } from 'react';
import { CardForm } from '@/components/CardForm';
import { useRouter } from 'next/navigation';

export default function EditCardPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') || 'fake_token' : 'fake_token';

    fetch(`/api/cards/${resolvedParams.id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      setData(data);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [resolvedParams.id, router]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <div className="w-10 h-10 border-4 border-black border-t-[#2563EB] rounded-full animate-spin"></div>
        <p className="text-gray-300 text-xs font-mono uppercase font-bold tracking-wider">Loading card details...</p>
      </div>
    );
  }

  return <CardForm initialData={data} />;
}
