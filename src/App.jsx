import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'


import Header from './components/Header';
import PokemonList from './components/PokemonList';
import PokemonDetailModal from './components/PokemonDetailModal';

function App() {
  // State untuk menyimpan URL pokemon yang akan ditampilkan di modal
  const [selectedPokemonUrl, setSelectedPokemonUrl] = useState(null);

  const handleCardClick = (url) => {
    setSelectedPokemonUrl(url);
  };

  const handleCloseModal = () => {
    setSelectedPokemonUrl(null);
  };

  return (
    <>
      <Header />
      <main>
        <PokemonList onCardClick={handleCardClick}/>
      </main>

        <PokemonDetailModal
        url={selectedPokemonUrl}
        show={!!selectedPokemonUrl}
        onHide={handleCloseModal}
      />
    </>
  )
}

export default App
