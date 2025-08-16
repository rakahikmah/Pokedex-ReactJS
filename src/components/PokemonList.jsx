// src/components/PokemonList.jsx

import React, { useState, useEffect } from 'react';
import PokemonCard from './PokemonCard';
import Pagination from 'react-bootstrap/Pagination'; // Import komponen Pagination

function PokemonList({onCardClick}) {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State baru untuk pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 12; // Jumlah Pokemon per halaman

  useEffect(() => {
    const fetchPokemons = async () => {
      setLoading(true);
      
      // Hitung offset berdasarkan halaman saat ini
      const offset = (currentPage - 1) * limit;
      const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      setPokemons(data.results);
      // Hitung total halaman dari jumlah total Pokemon
      setTotalPages(Math.ceil(data.count / limit));
      
      setLoading(false);
      window.scrollTo(0, 0); // Scroll ke atas setiap ganti halaman
    };

    fetchPokemons();
  }, [currentPage]); // Re-fetch data setiap kali currentPage berubah

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  
  // Fungsi untuk merender item-item pagination
  const renderPaginationItems = () => {
    const items = [];
    const pageWindow = 2; // Jumlah halaman untuk ditampilkan di sekitar halaman saat ini

    // Tombol "First" dan "Previous"
    items.push(
      <Pagination.Prev key="prev" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
    );

    for (let number = 1; number <= totalPages; number++) {
      if (
        number === 1 ||
        number === totalPages ||
        (number >= currentPage - pageWindow && number <= currentPage + pageWindow)
      ) {
        items.push(
          <Pagination.Item key={number} active={number === currentPage} onClick={() => handlePageChange(number)}>
            {number}
          </Pagination.Item>
        );
      } else if (
        number === currentPage - pageWindow - 1 ||
        number === currentPage + pageWindow + 1
      ) {
        items.push(<Pagination.Ellipsis key={number} />);
      }
    }

    // Tombol "Next" dan "Last"
    items.push(
      <Pagination.Next key="next" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
    );

    return items;
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="row g-4"> 
        {pokemons.map(pokemon => {
          return (
            <div key={pokemon.name} className="col-lg-3 col-md-4 col-md-6">
              <PokemonCard url={pokemon.url} onCardClick={onCardClick}/>
            </div>
          );
        })}
      </div>
      
      {/* Pagination Component */}
      <div className="d-flex justify-content-center my-4">
        <Pagination>{renderPaginationItems()}</Pagination>
      </div>
    </div>
  );
}

export default PokemonList;