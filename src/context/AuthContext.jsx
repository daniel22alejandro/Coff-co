import { createContext, useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState(() => {
    const cookieData = Cookies.get('UsuarioContext');
    return cookieData ? JSON.parse(cookieData) : null;
  });

  // Función para iniciar sesión y guardar los datos tanto en el estado como en la cookie
  const iniciarSesion = (data) => {
    setAuthData(data);  

    Cookies.set('UsuarioContext', JSON.stringify(data), { expires: 1 }); 
  };

  // Función para eliminar el contexto cuando se cierra la sesion
  const cerrarSesion = () => {
    console.log('Sesion Finalizada');
    setAuthData(null);
    Cookies.remove("Token")
    Cookies.remove('UsuarioContext');  
  };

  useEffect(() => {
    // Ver los datos guardados en el contexto cada vez que authData cambia
   
  }, [authData]);

  return (
    <AuthContext.Provider value={{ authData, iniciarSesion, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  );
};

