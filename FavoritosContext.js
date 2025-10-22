import React, { createContext, useState, useContext } from 'react';

const FavoritosContext = createContext();

export const FavoritosProvider = ({ children }) => {
  const [favoritos, setFavoritos] = useState([]);

  const agregarFavorito = (producto) => {
    if (!favoritos.some(fav => fav.id === producto.id)) {
      setFavoritos([...favoritos, producto]);
    }
  };

  const quitarFavorito = (id) => {
    setFavoritos(favoritos.filter(fav => fav.id !== id));
  };

  return (
    <FavoritosContext.Provider value={{ favoritos, agregarFavorito, quitarFavorito }}>
      {children}
    </FavoritosContext.Provider>
  );
};

export const useFavoritos = () => useContext(FavoritosContext);