'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Rejestracja użytkownika
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    if (response.ok) {
      // Automatyczne logowanie po rejestracji
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.ok) {
        router.push('/');
      }
    } else {
      const error = await response.json();
      console.error('Registration error:', error);
      // tutaj możesz wyświetlić błąd użytkownikowi
      return;
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="name"
        required
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Hasło"
        required
      />
      <button type="submit">Zarejestruj się</button>
    </form>
  );
}

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.ok) {
        router.push('/');
      } else {
        console.error('Login error:', result?.error);
        // Add some user feedback here
      }
    } catch (error) {
      console.error('Login error:', error);
      // Add some user feedback here
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Hasło"
        required
      />
      <button type="submit">Zaloguj się</button>
    </form>
  );
}
