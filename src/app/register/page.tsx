'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function RegisterPage() {
  const router = useRouter();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [verificando, setVerificando] = useState(false);
  const [usuario, setUsuario] = useState<any>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    if (!nome || !email || !senha) {
      setErro('Preencha todos os campos!');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        nome,
        email,
        createdAt: new Date().toISOString(),
      });

      await sendEmailVerification(user);

      setUsuario(user);
      setVerificando(true);
    } catch (error: any) {
      console.error('Erro ao registrar:', error);
      setErro('Erro ao criar conta. Tente novamente.');
    }
  };

  // Verifica se o email foi verificado a cada 3 segundos
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (verificando && usuario) {
      interval = setInterval(async () => {
        await usuario.reload(); // Atualiza dados do usuário

        if (usuario.emailVerified) {
          clearInterval(interval);
          alert('Email verificado com sucesso!');
          router.push('/login'); // Redireciona para login
        }
      }, 3000);
    }

    return () => clearInterval(interval);
  }, [verificando, usuario, router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Criar Conta</h1>

        {erro && <p className="text-red-600 text-sm mb-4 text-center">{erro}</p>}

        {verificando ? (
          <p className="text-center text-blue-600">
            Verifique seu email ({email}) e aguarde...
          </p>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nome</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full px-4 py-2 border rounded-md"
                placeholder="Seu nome"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-md"
                placeholder="exemplo@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Senha</label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full px-4 py-2 border rounded-md"
                placeholder="********"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
            >
              Cadastrar
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
