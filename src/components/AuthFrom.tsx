'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';

interface AuthFormProps {
  isLogin?: boolean;
}

export default function AuthForm({ isLogin = false }: AuthFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, senha);
      } else {
        await createUserWithEmailAndPassword(auth, email, senha);
      }
      router.push('/home');
    } catch (err) {
      console.error(err);
      setError('Erro ao autenticar. Verifique suas credenciais.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
      <input
        type="email"
        placeholder="Email"
        className="p-2 border rounded text-black"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Senha"
        className="p-2 border rounded text-black"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        required
      />
      <button className="bg-blue-600 text-white px-4 py-2 rounded">
        {isLogin ? 'Entrar' : 'Cadastrar'}
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
}
