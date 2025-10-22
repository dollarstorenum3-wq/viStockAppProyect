import React from 'react';
import { FavoritosProvider } from './FavoritosContext';
import Navegacion from './Navegacion';

export default function App() {
  return (
    <FavoritosProvider>
      <Navegacion />
    </FavoritosProvider>
  );
}