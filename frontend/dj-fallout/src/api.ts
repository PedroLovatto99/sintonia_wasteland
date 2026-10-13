const API_URL = '/api'

export interface Musica {
  id: number
  nome_musica: string
  artista: string
  duracao: number
  url: string
}

async function get<T>(rota: string): Promise<T> {
  const res = await fetch(`${API_URL}${rota}`)
  if (!res.ok) throw new Error(`${rota} respondeu ${res.status}`)
  return res.json()
}

export const buscarProximaMusica = () => get<Musica>('/proxima-musica')

export const buscarFalaDJ = async () => (await get<{ fala: string }>('/chamar-dj')).fala
