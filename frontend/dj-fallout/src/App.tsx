import { useRadio } from './hooks/useRadio'
import pipBoy from './assets/img/pip-boy.png'
import vaultBoyDj from './assets/img/vault-boy-dj.png'
import vaultBoyMusica from './assets/img/vault-boy-musica.png'

function App() {
  const {
    audioRef, musica, modo, textoTela, iniciado, volume,
    setVolume, iniciar, aoAtualizarTempo, aoTerminarMusica,
  } = useRadio()

  const titulo =
    modo === 'dj' ? 'THREE DOG - AO VIVO' :
    modo === 'status' ? 'SYSTEM STATUS' :
    musica?.nome_musica ?? ''

  const subtitulo = modo === 'musica' ? musica?.artista ?? '' : textoTela

  return (
    <>
      <div
        className="overlay"
        style={iniciado ? { opacity: 0, pointerEvents: 'none' } : undefined}
        onClick={iniciar}
      >
        <div className="overlay-content">
          <h1>PLEASE STAND BY</h1>
          <p>[ CLIQUE PARA INICIAR O SISTEMA ]</p>
        </div>
      </div>

      <header className="vault-header">
        <h1 className="vault-text">⚡ Sintonia Wasteland ⚡</h1>
      </header>

      <main>
        <img src={vaultBoyMusica} className="side-char char-left" alt="Vault Boy Música" />

        <div className="pipboy-wrapper">
          <img src={pipBoy} alt="Pip-Boy 3000" className="pipboy-img" />

          <div className="pipboy-screen">
            <div className={`inner-container${modo === 'dj' ? ' dj-active' : ''}`}>
              <div className="radio-info">
                <h2 className={`song-title${modo === 'status' ? ' blink-text' : ''}`}>{titulo}</h2>
                <h3 className="artist-name">{subtitulo}</h3>
              </div>

              <div className="wave-container">
                {Array.from({ length: 6 }, (_, i) => <div key={i} className="bar" />)}
              </div>

              <div className="volume-controls">
                <span className="vol-label">VOL</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={e => setVolume(Number(e.target.value))}
                />
              </div>
            </div>
          </div>
        </div>

        <img src={vaultBoyDj} className="side-char char-right" alt="Vault Boy DJ" />

        <audio ref={audioRef} onTimeUpdate={aoAtualizarTempo} onEnded={aoTerminarMusica} />
      </main>

      <footer className="vault-footer">
        <small className="vault-text">© 2077 RobCo Industries</small>
      </footer>
    </>
  )
}

export default App
