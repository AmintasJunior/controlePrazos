import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { db } from '../../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import styles from './styles.module.css';

export type Prazo = {
  municipio: string;
  processo: string;
  informacoeComplementares: string;
  responsavel: string;
  contato: string;
  prazo: string;
  modeloId: string;
  modeloTitulo?: string;
  modeloDescricao?: string;
  notificado?: boolean;
  historicoNotificacao?: string[];
  notificar?: boolean;
  notificarEm?: string;
};

type Modelo = {
  id: string;
  titulo: string;
  descricao: string;
};

const FormPrazo: React.FC<{ onSubmit: (data: Prazo) => void }> = ({ onSubmit }) => {
  const [modelos, setModelos] = useState<Modelo[]>([]);
  const [modalAberto, setModalAberto] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm<Prazo>();

  const modeloSelecionado = watch('modeloId');

  useEffect(() => {
    const fetchModelos = async () => {
      const snapshot = await getDocs(collection(db, 'modelos'));
      const lista: Modelo[] = snapshot.docs.map(doc => ({
        id: doc.id,
        titulo: doc.data().titulo,
        descricao: doc.data().descricao || '',
      }));
      setModelos(lista);
    };
    fetchModelos();
  }, []);

  // Atualiza o campo descricao com o conteúdo do modelo selecionado
  useEffect(() => {
    if (modeloSelecionado) {
      const modelo = modelos.find(m => m.id === modeloSelecionado);
      if (modelo) {
        setValue('descricao', modelo.descricao || '');
      }
    }
  }, [modeloSelecionado, modelos, setValue]);

  const openModal = () => setModalAberto(true);
  const closeModal = () => setModalAberto(false);

  const handleInternalSubmit = async (data: Prazo) => {
    onSubmit(data);
    reset();
    closeModal();
  };

  return (
    <div>
      <button onClick={openModal} className={styles.button}>
        Abrir Formulário de Prazo
      </button>

      {modalAberto && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.formContainer}>
              <span className={styles.close} onClick={closeModal}>&times;</span>

              <form onSubmit={handleSubmit(handleInternalSubmit)} className={styles.form}>
                <h2 className={styles.title}>Cadastrar Prazo</h2>

                <div className={styles.fieldGroup}>
                  <div className={styles.field}>
                    <label htmlFor="municipio" className={styles.label}>Município</label>
                    <input
                      type="text"
                      id="municipio"
                      {...register('municipio', { required: true })}
                      className={styles.input}
                    />
                    {errors.municipio && <p className={styles.error}>Campo obrigatório</p>}
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="responsavel" className={styles.label}>Responsável</label>
                    <input
                      type="text"
                      id="responsavel"
                      {...register('responsavel', { required: true })}
                      className={styles.input}
                    />
                    {errors.responsavel && <p className={styles.error}>Campo obrigatório</p>}
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <div className={styles.field}>
                    <label htmlFor="processo" className={styles.label}>Processo</label>
                    <input
                      type="text"
                      id="processo"
                      {...register('processo', { required: true })}
                      className={styles.input}
                    />
                    {errors.processo && <p className={styles.error}>Campo obrigatório</p>}
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <div className={styles.field}>
                    <label htmlFor="informacoeComplementares" className={styles.label}>Informações Complementares</label>
                    <input
                      type="text"
                      id="informacoeComplementares"
                      {...register('informacoeComplementares', { required: true })}
                      className={styles.input}
                    />
                    {errors.processo && <p className={styles.error}>Campo obrigatório</p>}
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <div className={styles.field}>
                    <label htmlFor="prazo" className={styles.label}>Prazo</label>
                    <input
                      type="date"
                      id="prazo"
                      {...register('prazo', { required: true })}
                      className={styles.input}
                    />
                    {errors.prazo && <p className={styles.error}>Campo obrigatório</p>}
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="notificarEm" className={styles.label}>Notificar Em</label>
                    <input
                      type="text"
                      id="notificarEm"
                      {...register('notificarEm')}
                      className={styles.input}
                      placeholder="Ex: 5, 10, 15"
                    />
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <div className={styles.field}>
                    <label className={styles.label}>
                      <input
                        type="checkbox"
                        {...register('notificar')}
                        className={styles.checkbox}
                      /> Notificar Via WhatsApp
                    </label>
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <div className={styles.field}>
                    <label htmlFor="modeloId" className={styles.label}>Modelo de Mensagem</label>
                    <select
                      id="modeloId"
                      {...register('modeloId', { required: true })}
                      className={styles.select}
                    >
                      <option value="">Selecione um modelo</option>
                      {modelos.map(modelo => (
                        <option key={modelo.id} value={modelo.id}>
                          {modelo.titulo}
                        </option>
                      ))}
                    </select>
                    {errors.modeloId && <p className={styles.error}>Campo obrigatório</p>}
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <div className={styles.field}>
                    <label htmlFor="descricao" className={styles.label}>Descrição da Mensagem</label>
                    <textarea
                      id="descricao"
                      {...register('descricao', { required: true })}
                      className={styles.textarea}
                    />
                    {errors.descricao && <p className={styles.error}>Campo obrigatório</p>}
                  </div>
                </div>

                <button type="submit" className={styles.button}>Salvar Prazo</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormPrazo;
