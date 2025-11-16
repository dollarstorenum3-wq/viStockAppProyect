import React from 'react';
import Navegacion from './Navegacion';
import { FavoritosProvider } from './FavoritosContext';
import { CarritoProvider } from './CarritoContext';
import { ProveedorAutenticacion } from './src/contexto/AutenticacionContexto';

export default function App() {
  return (
    <ProveedorAutenticacion>
      <FavoritosProvider>
        <CarritoProvider>
          <Navegacion />
        </CarritoProvider>
      </FavoritosProvider>
    </ProveedorAutenticacion>
  );
}