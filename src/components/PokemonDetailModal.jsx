// src/components/PokemonDetailModal.jsx

import React, { useState, useEffect } from 'react';
import { Modal, Tabs, Tab, Spinner, ProgressBar } from 'react-bootstrap';
import '../styles/PokemonDetailModal.css';

// Salin objek typeColors dari PokemonCard.jsx
const typeColors = {
  fire: '#F08030', grass: '#78C850', electric: '#F8D030', water: '#6890F0',
  ground: '#E0C068', rock: '#B8A038', fairy: '#EE99AC', poison: '#A040A0',
  bug: '#A8B820', dragon: '#7038F8', psychic: '#F85888', flying: '#A890F0',
  fighting: '#C03028', normal: '#A8A878', ice: '#98D8D8', ghost: '#705898',
  dark: '#705848', steel: '#B8B8D0',
};

const statNameMapping = {
  'hp': 'HP',
  'attack': 'Attack',
  'defense': 'Defense',
  'special-attack': 'Sp. Atk',
  'special-defense': 'Sp. Def',
  'speed': 'Speed',
};

const getStatVariant = (statValue) => {
  if (statValue < 60) return 'danger'; // Merah untuk stat rendah
  if (statValue < 90) return 'warning'; // Kuning untuk stat sedang
  return 'success'; // Hijau untuk stat tinggi
};

// Fungsi helper untuk konversi
const convertStats = (value, unit) => {
  if (unit === 'kg') return (value / 10).toFixed(1) + ' kg'; // hectograms to kg
  if (unit === 'm') return (value / 10).toFixed(1) + ' m'; // decimetres to m
  return value;
}

function PokemonDetailModal({ url, show, onHide }) {
  const [details, setDetails] = useState(null);
  const [species, setSpecies] = useState(null);
  const [loading, setLoading] = useState(false);
  const [evolutionChain, setEvolutionChain] = useState([]); 


  useEffect(() => {
    if (url) {
      const fetchDetails = async () => {
        setLoading(true);
        setEvolutionChain([]);
        const response = await fetch(url);
        const data = await response.json();
        setDetails(data);

        const speciesResponse = await fetch(data.species.url);
        const speciesData = await speciesResponse.json();
        setSpecies(speciesData);

        if (speciesData.evolution_chain.url) {
          const evolutionResponse = await fetch(speciesData.evolution_chain.url);
          const evolutionData = await evolutionResponse.json();

          let chain = [];
          let current = evolutionData.chain;
          do {
            
            const speciesUrlParts = current.species.url.split('/');
            const speciesId = speciesUrlParts[speciesUrlParts.length - 2];

            chain.push({
              name: current.species.name,
              id: speciesId,
              imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${speciesId}.png`
            });
            current = current.evolves_to[0];
          } while (!!current);
          setEvolutionChain(chain);
        }
       

        setLoading(false);
      };
      fetchDetails();
    }
  }, [url]);

  const mainType = details ? details.types[0].type.name : 'normal';
  const modalColor = typeColors[mainType] || '#A8A878';

  return (
    <Modal show={show} onHide={onHide} size="md" centered className="pokemon-modal">
      {loading || !details || !species ? (
        <div className="text-center p-5">
          <Spinner animation="border" />
        </div>
      ) : (
        <>
          <Modal.Header style={{ backgroundColor: modalColor }}>
            <div className="w-100">
              <div className="d-flex justify-content-between align-items-center">
                <h2 className="text-white text-capitalize mb-0">{details.name}</h2>
                <h4 className="text-white fw-bold">#{details.id.toString().padStart(3, '0')}</h4>
              </div>
              <div className="type-badges mt-2">
                {details.types.map(({ type }) => (
                  <div key={type.name} className="type-badge text-capitalize">{type.name}</div>
                ))}
              </div>
            </div>
          </Modal.Header>
          <Modal.Body>
            <img
              src={details.sprites.other['official-artwork'].front_default}
              alt={details.name}
              className="pokemon-detail-image"
            />
            <Tabs defaultActiveKey="about" id="pokemon-detail-tabs" className="mb-3 justify-content-center">
              <Tab eventKey="about" title="About">
                <table className="table table-borderless">
                  <tbody>
                    <tr>
                      <td className="fw-bold">Species</td>
                      <td>{species.genera.find(g => g.language.name === 'en').genus}</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Height</td>
                      <td>{convertStats(details.height, 'm')}</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Weight</td>
                      <td>{convertStats(details.weight, 'kg')}</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Abilities</td>
                      <td className="text-capitalize">{details.abilities.map(a => a.ability.name).join(', ')}</td>
                    </tr>
                  </tbody>
                </table>
              </Tab>
              <Tab eventKey="stats" title="Base Stats">
                <div className="px-2">
                  {details.stats.map((statInfo) => (
                    <div key={statInfo.stat.name} className="row align-items-center mb-2">
                      <div className="col-4 col-md-3">
                        <span className="fw-bold text-capitalize">
                          {statNameMapping[statInfo.stat.name] || statInfo.stat.name}
                        </span>
                      </div>
                      <div className="col-2 col-md-2">
                        <span className="fw-bold">{statInfo.base_stat}</span>
                      </div>
                      <div className="col-6 col-md-7">
                        <ProgressBar
                          now={statInfo.base_stat}
                          max={255} // Nilai stat maksimal di game Pokemon
                          variant={getStatVariant(statInfo.base_stat)}
                          animated
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Tab>
              <Tab eventKey="evolution" title="Evolution">
                <div className="d-flex justify-content-around align-items-center text-center p-3">
                  {evolutionChain.map((pokemon, index) => (
                    <React.Fragment key={pokemon.id}>
                      <div>
                        <img src={pokemon.imageUrl} alt={pokemon.name} style={{ width: '96px', height: '96px' }} />
                        <h6 className="text-capitalize mt-2">{pokemon.name}</h6>
                      </div>
                      {index < evolutionChain.length - 1 && (
                        <div className="fs-2 fw-bold text-muted mx-3">&rarr;</div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </Tab>
              <Tab eventKey="moves" title="Moves">
                <div className="d-flex flex-wrap justify-content-center p-2">
                  {details.moves.map(({ move }) => (
                    <span key={move.name} className="badge bg-secondary m-1 p-2">
                      {move.name.replace('-', ' ')}
                    </span>
                  ))}
                </div>
              </Tab>
            </Tabs>
          </Modal.Body>
        </>
      )}
    </Modal>
  );
}

export default PokemonDetailModal;