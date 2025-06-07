'use client';

import React from 'react';
import FormPrazo, { Prazo } from '@/components/PrazosForms/FormPrazo';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

const Page = () => {
  const handleSubmit = async (data: Prazo) => {
    try {
      await addDoc(collection(db, 'prazos'), {
        ...data,
        notificado: false,
        historicoNotificacao: [],
      });
      alert('Prazo cadastrado com sucesso!');
    } catch (error) {
      console.error('Erro ao cadastrar prazo:', error);
    }
  };

  return <FormPrazo onSubmit={handleSubmit} />;
};

export default Page;
