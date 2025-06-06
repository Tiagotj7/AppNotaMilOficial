'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import Link from 'next/link';



export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  if (!user) {
    return <p className="text-center mt-10">Verificando login...</p>;
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      {/* Topo */}
      <div className="flex justify-between items-center p-4">
        <div>
          <h2 className="text-2xl font-bold">🎥 Live Ao Vivo</h2>
          <p className="text-sm">Bem-vindo ao seu painel, aproveite!</p>
        </div>

        {/* Usuário */}
        <div className="flex items-center gap-2">
          <span className="bg-neutral-700 rounded-full w-8 h-8 flex items-center justify-center">
            👤
          </span>
          <span>{user.email}</span>
          <button
            onClick={handleLogout}
            className="ml-2 bg-red-600 px-2 py-1 rounded"
          >
            Sair
          </button>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="flex-1 flex flex-col justify-center items-center">
        <h1 className="text-4xl mb-4">🏠 Página Inicial</h1>
        <p className="text-lg">Seu conteúdo ou dashboard aparece aqui.</p>
      </div>

      {/* Rodapé */}
      <nav className="flex justify-around bg-neutral-800 py-3">
        <Link href="/home">🏠</Link>
        <Link href="/dashboard">📊</Link>
        <Link href="/profile">👤</Link>
      </nav>
    </main>
  );
}
