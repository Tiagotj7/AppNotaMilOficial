'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function Home() {
  const router = useRouter();

  const [modoCadastro, setModoCadastro] = useState(false);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, senha);
      console.log('Login bem-sucedido:', userCredential.user);
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Erro ao fazer login:', error);
      setErro('Falha no login. Verifique seu email e senha.');
    }
  };

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    if (!email || !senha || !nome) {
      setErro('Preencha todos os campos!');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        nome,
        email,
        createdAt: new Date().toISOString()
      });

      console.log('Usuário cadastrado:', user);
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Erro ao cadastrar:', error);
      setErro('Erro ao criar conta. Tente novamente.');
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setErro('Digite seu email para redefinir a senha.');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      alert('Email de recuperação enviado!');
    } catch (error: any) {
      console.error('Erro ao enviar email:', error);
      setErro('Erro ao enviar email. Verifique o endereço.');
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-xl">
        <h1 className="text-2xl font-bold text-center mb-6">
          {modoCadastro ? 'Criar Conta' : 'Entrar na Conta'}
        </h1>

        {erro && <p className="text-red-600 text-sm mb-4 text-center">{erro}</p>}

        <form onSubmit={modoCadastro ? handleCadastro : handleLogin} className="space-y-4">
          {modoCadastro && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Nome</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Seu nome"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="********"
              required
            />
          </div>

          {!modoCadastro && (
            <div className="text-right">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-blue-500 hover:underline"
              >
                Esqueceu a senha?
              </button>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
          >
            {modoCadastro ? 'Cadastrar' : 'Entrar'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => {
              setModoCadastro(!modoCadastro);
              setErro('');
            }}
            className="text-sm text-gray-600 hover:underline"
          >
            {modoCadastro
              ? 'Já tem conta? Entrar'
              : 'Não tem conta? Criar agora'}
          </button>
        </div>
      </div>
    </main>
  );
}
