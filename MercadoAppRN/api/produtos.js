import { API_BASE_URL } from './config';

const base = `${API_BASE_URL}/api/produtos`;

export async function listarProdutos(busca = '') {
  const url = busca ? `${base}?busca=${encodeURIComponent(busca)}` : base;
  const r = await fetch(url);
  if (!r.ok) throw new Error('Erro ao carregar produtos');
  return r.json();
}

export async function obterProduto(id) {
  const r = await fetch(`${base}/${id}`);
  if (!r.ok) throw new Error('Produto não encontrado');
  return r.json();
}

export async function criarProduto(dados) {
  const r = await fetch(base, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  });
  if (!r.ok) throw new Error('Erro ao criar produto');
  return r.json();
}

export async function atualizarProduto(id, dados) {
  const r = await fetch(`${base}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  });
  if (!r.ok) throw new Error('Erro ao atualizar produto');
  return r.json();
}

export async function conferirProduto(id, novaDataValidade = null) {
  const r = await fetch(`${base}/${id}/conferir`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(novaDataValidade ? { novaDataValidade } : {}),
  });
  if (!r.ok) throw new Error('Erro ao conferir');
  return r.json();
}

export async function excluirProduto(id) {
  const r = await fetch(`${base}/${id}`, { method: 'DELETE' });
  if (!r.ok) throw new Error('Erro ao excluir');
}
