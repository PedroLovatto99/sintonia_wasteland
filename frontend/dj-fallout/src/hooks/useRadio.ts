import { useEffect, useRef, useState } from 'react'
import { buscarFalaDJ, buscarProximaMusica } from '../api'
import type { Musica } from '../api'

export type Modo = 'musica' | 'status' | 'dj'

const PRELOAD_DJ_SEGUNDOS = 30

function escolherVoz() {
  const vozes = window.speechSynthesis.getVoices()
  return (
    vozes.find(v => v.name.includes('Google Português')) ||
    vozes.find(v => v.name.includes('Microsoft Daniel')) ||
    vozes.find(v => v.lang === 'pt-BR')
  )
}

export function useRadio() {
  const audioRef = useRef<HTMLAudioElement>(null)

  const [musica, setMusica] = useState<Musica | null>(null)
  const [modo, setModo] = useState<Modo>('musica')
  const [textoTela, setTextoTela] = useState('')
  const [iniciado, setIniciado] = useState(false)
  const [volume, setVolume] = useState(0.5)

  const proximoTextoDJ = useRef<string | null>(null)
  const carregandoDJ = useRef(false)

  const vozSelecionada = useRef<SpeechSynthesisVoice>(undefined)
  const falaAtual = useRef<SpeechSynthesisUtterance>(null)
  const timers = useRef<number[]>([])

  const agendar = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms))
  }

  useEffect(() => {
    const synth = window.speechSynthesis
    const carregar = () => { vozSelecionada.current = escolherVoz() }
    carregar()
    synth.addEventListener('voiceschanged', carregar)
    return () => synth.removeEventListener('voiceschanged', carregar)
  }, [])

  const carregouInicial = useRef(false)
  useEffect(() => {
    if (carregouInicial.current) return
    carregouInicial.current = true
    buscarProximaMusica()
      .then(m => {
        setMusica(m)
        if (audioRef.current) audioRef.current.src = m.url
      })
      .catch(err => console.error('Erro música:', err))
  }, [])

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
  }, [volume])

  useEffect(() => {
    const pendentes = timers.current
    return () => {
      pendentes.forEach(clearTimeout)
      window.speechSynthesis.cancel()
    }
  }, [])

  const mostrarStatus = (mensagem: string) => {
    setModo('status')
    setTextoTela(mensagem)
  }

  const iniciar = () => {
    const audio = audioRef.current
    if (!audio || !musica) return
    audio.play()
      .then(() => setIniciado(true))
      .catch(err => console.error(err))
  }

  const tocarProximaMusica = () => {
    proximoTextoDJ.current = null
    carregandoDJ.current = false

    buscarProximaMusica()
      .then(m => {
        const audio = audioRef.current
        if (!audio) return
        setMusica(m)
        setModo('musica')
        audio.src = m.url
        return audio.play()
      })
      .catch(err => console.error('Erro música:', err))
  }

  const falarDJ = (texto: string) => {
    setModo('dj')
    setTextoTela(texto)

    const synth = window.speechSynthesis
    const utterance = new SpeechSynthesisUtterance(texto)
    if (vozSelecionada.current) utterance.voice = vozSelecionada.current
    utterance.lang = 'pt-BR'
    utterance.rate = 1.1
    utterance.pitch = 0.9

    utterance.onend = () => {
      mostrarStatus('REINICIANDO PLAYLIST...')
      agendar(tocarProximaMusica, 2000)
    }
    utterance.onerror = tocarProximaMusica

    falaAtual.current = utterance
    synth.cancel()
    synth.speak(utterance)
  }

  const aoAtualizarTempo = () => {
    const audio = audioRef.current
    if (!audio || !Number.isFinite(audio.duration)) return

    const restante = audio.duration - audio.currentTime
    if (restante < PRELOAD_DJ_SEGUNDOS && !carregandoDJ.current && !proximoTextoDJ.current) {
      carregandoDJ.current = true
      buscarFalaDJ()
        .then(texto => { proximoTextoDJ.current = texto })
        .catch(err => console.error('Erro no preload:', err))
        .finally(() => { carregandoDJ.current = false })
    }
  }

  const aoTerminarMusica = () => {
    mostrarStatus('RECEBENDO TRANSMISSÃO...')

    if (proximoTextoDJ.current) {
      const texto = proximoTextoDJ.current
      proximoTextoDJ.current = null
      agendar(() => falarDJ(texto), 1000)
    } else {
      buscarFalaDJ().then(falarDJ).catch(tocarProximaMusica)
    }
  }

  return {
    audioRef,
    musica,
    modo,
    textoTela,
    iniciado,
    volume,
    setVolume,
    iniciar,
    aoAtualizarTempo,
    aoTerminarMusica,
  }
}
