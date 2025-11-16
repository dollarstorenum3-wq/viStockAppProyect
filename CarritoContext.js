import React, { createContext, useState, useContext } from 'react';

const CarritoContext = createContext();

export const CarritoProvider = ({ children }) => {
  const [carrito, setCarrito] = useState([]);

  const agregarAlCarrito = (producto, cantidad = 1) => {
    setCarrito(prevCarrito => {
      const existe = prevCarrito.find(item => item.id === producto.id);
      
      if (existe) {
        return prevCarrito.map(item =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        );
      } else {
        return [...prevCarrito, { ...producto, cantidad }];
      }
    });
  };

  const quitarDelCarrito = (id) => {
    setCarrito(prevCarrito => prevCarrito.filter(item => item.id !== id));
  };

  const actualizarCantidad = (id, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      quitarDelCarrito(id);
      return;
    }

    setCarrito(prevCarrito =>
      prevCarrito.map(item =>
        item.id === id ? { ...item, cantidad: nuevaCantidad } : item
      )
    );
  };

  const limpiarCarrito = () => {
    setCarrito([]);
  };

  // En CarritoContext.js - modifica el cálculo del total
const totalCarrito = carrito.reduce((total, item) => {
  // ⚠️ CORRECCIÓN: Convertir precio a número
  const precio = typeof item.precio_unitario === 'string' 
    ? parseFloat(item.precio.replace(/[^\d.]/g, '')) 
    : parseFloat(item.precio) || 0;
  
  return total + (precio * item.cantidad);
}, 0);

const totalItems = carrito.reduce((total, item) => total + (item.cantidad || 0), 0);
  return (
    <CarritoContext.Provider value={{
      carrito,
      agregarAlCarrito,
      quitarDelCarrito,
      actualizarCantidad,
      limpiarCarrito,
      totalCarrito,
      totalItems
    }}>
      {children}
    </CarritoContext.Provider>
  );
};

export const useCarrito = () => useContext(CarritoContext);


