import React, { useContext, useState } from "react";
import MostrarServicios from "../../organismo/servicios/MostrarServiciosOrganismo";
import RegistrarServicio from "../../organismo/servicios/RegistrarServicioOrganismo";
import Mybutton from "../../atoms/Mybutton";
import Search from "../../atoms/Search";
import { AuthContext } from "../../../context/AuthContext";
import { useTranslation } from "react-i18next";

const ServiciosPlantilla = () => {
  const {t}=useTranslation()
  const { authData } = useContext(AuthContext);

  const [modalRegistroVisible, setModalRegistroVisible] = useState(false);
  const [filtro, setFiltro] = useState("");

  const rol = authData.usuario.rol;

  const abrirModalRegistro = () => {
    setModalRegistroVisible(true);
  };

  const cerrarModalRegistro = () => {
    setModalRegistroVisible(false);
  };

  return (
    <>
      <div className="w-auto h-screen  flex flex-col gap-8 bg-gray-100">
        <div className="pt-10 pl-20 justify-center flex  flex-row items-center">
          
            <Mybutton
              color={"primary"}
              onClick={() => abrirModalRegistro(null)}
            >
              <b>{t('Nuevo servicio')}</b>
            </Mybutton>
            <Search
            label={t('Filtro')}
            placeholder={t("Filtro por muestra...")}
            onchange={(e) => setFiltro(e.target.value)}
          />
        
          
        </div>
        <MostrarServicios filtro={filtro} />
        <RegistrarServicio
          visible={modalRegistroVisible}
          closeModal={cerrarModalRegistro}
        />
      </div>
    </>
  );
};

export default ServiciosPlantilla;