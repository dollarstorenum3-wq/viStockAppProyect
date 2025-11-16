import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../database/firebaseconfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const AutenticacionContexto = createContext();

export function ProveedorAutenticacion({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [esInvitado, setEsInvitado] = useState(false);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usuarioFirebase) => {
      if (usuarioFirebase) {
        setUsuario(usuarioFirebase);
        setEsInvitado(false);
      } else {
        setUsuario(null);
      }
      setCargando(false);
    });

    return () => unsubscribe();
  }, []);

  const entrarComoInvitado = () => {
    setEsInvitado(true);
    setUsuario(null);
  };

  const cerrarSesion = () => {
    if (esInvitado) {
      setEsInvitado(false);
    } else {
      signOut(auth);
    }
    setUsuario(null);
  };

  return (
    <AutenticacionContexto.Provider value={{
      usuario,
      esInvitado,
      entrarComoInvitado,
      cerrarSesion,
      cargando
    }}>
      {children}
    </AutenticacionContexto.Provider>
  );
}

export const usarAutenticacion = () => useContext(AutenticacionContexto);