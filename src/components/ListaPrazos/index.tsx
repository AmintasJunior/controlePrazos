'use client'

import { useEffect, useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import FormPrazo, { Prazo } from '../PrazosForms/FormPrazo';

const PrazoList = () => {
  const [prazos, setPrazos] = useState<Prazo[]>([]);
  const [editingPrazo, setEditingPrazo] = useState<Prazo | null>(null);

  const loadPrazos = async () => {
    try {
      const prazosCollection = collection(db, 'prazos');
      const prazosSnapshot = await getDocs(prazosCollection);

      const prazosList: Prazo[] = prazosSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          titulo: data.titulo,
          descricao: data.descricao,
          prazo: data.prazo,
          municipio: data.municipio,
          responsavel: data.responsavel,
          contato: data.contato,
          modeloId: data.modeloId || '',
          modeloTitulo: data.modeloTitulo || '',
          notificado: data.notificado || false,
          historicoNotificacao: data.historicoNotificacao || [],
        };
      });

      setPrazos(prazosList);
    } catch (error) {
      console.error('Erro ao carregar prazos:', error);
    }
  };

  const handleEdit = (prazo: Prazo) => {
    setEditingPrazo(prazo);
  };

  const handleUpdate = async (data: Prazo) => {
    if (!data.id) return;

    try {
      const prazoRef = doc(db, 'prazos', data.id);
      await updateDoc(prazoRef, {
        ...data,
      });
      setEditingPrazo(null);
      loadPrazos();
    } catch (error) {
      console.error('Erro ao atualizar prazo:', error);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, 'prazos', id));
    loadPrazos();
  };

  useEffect(() => {
    loadPrazos();
  }, []);

  return (
    <div>
      <h1>Prazos</h1>
      <table>
        <thead>
          <tr>
            <th>Título</th>
            <th>Descrição</th>
            <th>Prazo</th>
            <th>Município</th>
            <th>Responsável</th>
            <th>Contato</th>
            <th>Modelo</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {prazos.map((prazo) => (
            <tr key={prazo.id}>
              <td>{prazo.titulo}</td>
              <td>{prazo.descricao}</td>
              <td>{prazo.prazo}</td>
              <td>{prazo.municipio}</td>
              <td>{prazo.responsavel}</td>
              <td>{prazo.contato}</td>
              <td>{prazo.modeloTitulo}</td>
              <td>
                <button onClick={() => handleEdit(prazo)}>Editar</button>
                <button onClick={() => handleDelete(prazo.id!)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingPrazo && (
        <div>
          <h2>Editar Prazo</h2>
          <FormPrazo initialData={editingPrazo} onSubmit={handleUpdate} />
        </div>
      )}
    </div>
  );
};

export default PrazoList;
