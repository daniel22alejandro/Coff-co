import React, { useState } from "react";
import LogosPlantilla from "../../components/plantillas/Logos/LogosPlantilla";
import Header from "../../components/molecules/layout/Header";
import Navbar from "../../components/molecules/Navbar/Navbar";
import Footer from "../../components/molecules/Footer/Footer";

const Logos = () => {
  
  const [menuAbierto, setMenuAbierto] = useState(false);

  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto);
  };

  return (
    <>
      <div className="h-screen flex flex-col overflow-x-hidden">
        <Header  />
        <div className="flex flex-grow">
          <div
            className={`transition-all duration-300 ease-in-out ${
              menuAbierto ? "w-60" : "w-16"
            }bg-gray-100`}
          >
            <Navbar menuAbierto={menuAbierto} toggleMenu={toggleMenu} />
          </div>
          <div className="w-full overflow-auto">
            <LogosPlantilla />
          </div>
        </div>
        <div className="mt-auto w-screen">
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Logos;