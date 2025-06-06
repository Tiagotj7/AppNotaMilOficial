import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase'; // ajuste o caminho se necessário
import { useRouter } from 'next/navigation';

const router = useRouter();

const handleCadastroSubmit = async () => {
  setLoading(true);
  try {
    const { email, senha, nome } = formData;

    const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
    const user = userCredential.user;

    // 🔥 Salva no Firestore
    await setDoc(doc(db, 'users', user.uid), {
      nome,
      email,
      createdAt: new Date(),
    });

    router.push('/dashboard'); // redireciona
  } catch (error) {
    console.error('Erro ao registrar:', error);
    alert('Erro ao registrar. Veja o console.');
  } finally {
    setLoading(false);
  }
};
