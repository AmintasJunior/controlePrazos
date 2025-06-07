'use client'

import React from 'react';
import { useForm } from 'react-hook-form';
import { db } from '../../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import styles from './styles.module.css';

type FormData = {
  titulo: string;
  descricao: string;
};

const ModeloForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      await addDoc(collection(db, 'modelos'), {
        titulo: data.titulo,
        descricao: data.descricao,
      });
      alert('Modelo cadastrado com sucesso!');
    } catch (error) {
      console.error('Erro ao cadastrar modelo:', error);
    }
  };

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <h2 className={styles.title}>Cadastrar Modelo</h2>
        
        <div className={styles.field}>
          <label htmlFor="titulo" className={styles.label}>Título</label>
          <input
            type="text"
            id="titulo"
            {...register('titulo', { required: 'Título é obrigatório' })}
            className={styles.input}
          />
          {errors.titulo && <p className={styles.error}>{errors.titulo.message}</p>}
        </div>
        
        <div className={styles.field}>
          <label htmlFor="descricao" className={styles.label}>Descrição</label>
          <textarea
            id="descricao"
            {...register('descricao', { required: 'Descrição é obrigatória' })}
            className={styles.textarea}
          />
          {errors.descricao && <p className={styles.error}>{errors.descricao.message}</p>}
        </div>
        
        <button type="submit" className={styles.button}>Salvar Modelo</button>
      </form>
    </div>
  );
};

export default ModeloForm;
