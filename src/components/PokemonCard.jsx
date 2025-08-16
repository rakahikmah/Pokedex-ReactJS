// src/components/PokemonCard.jsx

import React, { useState, useEffect } from 'react';
import Spinner from 'react-bootstrap/Spinner'; 
import '../styles/PokemonCard.css'; 

// Objek untuk memetakan tipe Pokemon ke warna badge Bootstrap
const typeColors = {
  fire: '#F08030',
  grass: '#78C850',
  electric: '#F8D030',
  water: '#6890F0',
  ground: '#E0C068',
  rock: '#B8A038',
  fairy: '#EE99AC',
  poison: '#A040A0',
  bug: '#A8B820',
  dragon: '#7038F8',
  psychic: '#F85888',
  flying: '#A890F0',
  fighting: '#C03028',
  normal: '#A8A878',
  ice: '#98D8D8',
  ghost: '#705898',
  dark: '#705848',
  steel: '#B8B8D0',
};

function PokemonCard({ url, onCardClick }) {
  const [details, setDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      setError(null);
      setDetails(null); // Reset details saat fetch url baru
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch');
        }
        const data = await response.json();
        setDetails(data);
      } catch (err) {
        setError(err);
      }
    };
    fetchDetails();
  }, [url]);

  if (error) {
    return (
        <div className="card">
            <div className="card-body text-center text-danger">
                <small>Could not load data.</small>
            </div>
        </div>
    );
  }

  
  if (!details) {
    return (
        <div className="card" style={{minHeight: '220px'}}>
            <div className="card-body d-flex justify-content-center align-items-center">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        </div>
    );
  }

  const mainType = details.types[0].type.name;
  const cardColor = typeColors[mainType] || '#A8A878'; // Default ke warna 'normal'


  return (
   <div
      className="pokemon-card-new shadow-sm"
      style={{ backgroundColor: cardColor }}
      onClick={() => onCardClick(url)}
    >
      
      <div className="pokemon-info">
        <h5 className="card-title text-capitalize">{details.name}</h5>
        <div className="type-badges">
          {details.types.map(({ type }) => (
            <div key={type.name} className="type-badge text-capitalize">
              {type.name}
            </div>
          ))}
        </div>
      </div>

      
      <div className="pokemon-id-image">
        <img
          src={details.sprites.front_default}
          alt={details.name}
          className="pokemon-image"
        />
      </div>
    </div>
  );
}

export default PokemonCard;