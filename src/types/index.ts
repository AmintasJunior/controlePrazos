export type Prazo = {
  municipio: string;
  titulo: string;
  descricao: string;
  responsavel: string;
  contato: string;
  prazo: string; // ISO string
  alertarEm: number[]; // dias antes do prazo
  modeloId: string; // Referência ao modelo de mensagem
  notificado: boolean; // Se já foi notificado ou não
  historicoNotificacao: string[]; // Datas em ISO (ex: ["2025-04-20T10:00:00.000Z"])
};


export type ModeloMensagem = {
  nome: string;
  conteudo: string; // Mensagem com placeholders, ex: "Olá {responsavel}, ..."
};
