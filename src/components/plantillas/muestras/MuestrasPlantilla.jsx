import React, { useState, useContext, useEffect } from "react";
import Mybutton from "../../atoms/Mybutton";
import TableMolecula from "../../molecules/table/TableMolecula";
import Thead from "../../molecules/table/Thead";
import Th from "../../atoms/Th";
import Tbody from "../../molecules/table/Tbody";
import Td from "../../atoms/Td";
import { FaRegEdit } from "react-icons/fa";
import ModalOrganismo from "../../organismo/Modal/ModalOrganismo";
import { Switch } from "@nextui-org/react";
import PaginationMolecula from "../../molecules/pagination/PaginationMolecula";
import MuestrasFormulario from "../../molecules/Formulario/MuestrasFormulario";
import FincaFormulario from "../../molecules/Formulario/FincaFormulario";
import ClienteFormulario from "../../molecules/Formulario/ClienteFormulario";
import Search from "../../atoms/Search";
import { AuthContext } from "../../../context/AuthContext";
import { useGetMuestrasQuery } from "../../../store/api/muestra";
import { useGetServicioQuery } from "../../../store/api/servicio/serviciosSlice.js";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

const MuestrasPlantilla = () => {
  const [showModal, setShowModal] = useState(false);
  const [showFincaModal, setShowFincaModal] = useState(false);
  const [showClienteModal, setShowClienteModal] = useState(false);
  const [datosDelFormulario, setDatosDelFormulario] = useState("");
  const [pages, setPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedMuestra, setSelectedMuestra] = useState(null);

  // Obtener los datos de muestras con refetch
  const {
    data: dataMuestras,
    isLoading,
    refetch: refetchMuestras,
  } = useGetMuestrasQuery();

  // Obtener los datos de servicios y monitorear cambios
  const { data: servicios } = useGetServicioQuery(undefined, {
    pollingInterval: 3000, // Verificar cambios cada 3 segundos
  });

  const { authData } = useContext(AuthContext);
  const { t } = useTranslation();
  const userRole = authData.usuario.rol;

  // Efecto para actualizar las muestras cuando cambian los servicios
  useEffect(() => {
    if (servicios) {
      refetchMuestras();
    }
  }, [servicios, refetchMuestras]);

  const handleImageClick = (muestra) => {
    setSelectedMuestra(muestra);
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
    setSelectedMuestra(null);
  };

  const handleModal = () => {
    setShowModal(true);
  };

  const handleFincaModal = () => {
    setShowFincaModal(true);
  };

  const handleClienteModal = () => {
    setShowClienteModal(true);
  };

  const cantidad = 4;
  const final = pages * cantidad;
  const inicial = final - cantidad;

  const handlePageChange = (page) => {
    setPages(page);
  };

  const filteredData = dataMuestras
    ? dataMuestras.filter((muestra) => {
        return muestra?.codigo_muestra?.toLowerCase().includes(searchTerm.toLowerCase());
      })
    : [];

  const numeroPagina = Math.ceil((filteredData?.length || 0) / cantidad);
  const DataArrayPaginacion = filteredData
    ? filteredData?.slice(inicial, final)
    : [];

  const handleEdit = (muestra) => {
    setDatosDelFormulario(muestra);
    setShowModal(true);
  };

  const closemodal = () => {
    setDatosDelFormulario("");
    setShowModal(false);
    // Actualizar la lista después de cerrar el modal
    refetchMuestras();
  };

  const closeFincaModal = () => {
    setShowFincaModal(false);
    // Actualizar la lista después de cerrar el modal
    refetchMuestras();
  };

  const closeClienteModal = () => {
    setShowClienteModal(false);
    // Actualizar la lista después de cerrar el modal
    refetchMuestras();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <section className="w-full mt-5 gap-4 flex flex-wrap flex-col">
      <h2 className="text-2xl px-20 font-bold">{t("muestras")}</h2>

      <div className="px-20 flex gap-4 items-center">
        {(userRole === "administrador" ||
          userRole === "encargado" ||
          userRole === "operario") && (
          <Mybutton color={"primary"} onClick={handleModal}>
            {t("agregarMuestra")}
          </Mybutton>
        )}
        {(userRole === "administrador" || userRole === "encargado") && (
          <Mybutton color={"secondary"} onClick={handleFincaModal}>
            {t("agregarFinca")}
          </Mybutton>
        )}
        {(userRole === "administrador" || userRole === "encargado") && (
          <Mybutton color={"secondary"} onClick={handleClienteModal}>
            {t("agregarCliente")}
          </Mybutton>
        )}

        <div className="ml-auto">
          <Search
            label={t("buscarMuestra")}
            placeholder={t("codigoMuestra")}
            onchange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {showModal && (
        <ModalOrganismo
          title={
            datosDelFormulario ? t("editarMuestra") : t("registrarMuestra")
          }
          visible={showModal}
          closeModal={closemodal}
        >
          <MuestrasFormulario
            dataValue={datosDelFormulario}
            closeModal={closemodal}
            onSuccess={() => {
              closemodal();
              refetchMuestras();
            }}
          />
        </ModalOrganismo>
      )}

      {showFincaModal && (
        <ModalOrganismo
          title={t("agregarFinca")}
          visible={showFincaModal}
          closeModal={closeFincaModal}
        >
          <FincaFormulario
            closeModal={closeFincaModal}
            onSuccess={() => {
              closeFincaModal();
              refetchMuestras();
            }}
          />
        </ModalOrganismo>
      )}

      {showClienteModal && (
        <ModalOrganismo
          title={t("agregarCliente")}
          visible={showClienteModal}
          closeModal={closeClienteModal}
        >
          <ClienteFormulario
            closeModal={closeClienteModal}
            onSuccess={() => {
              closeClienteModal();
              refetchMuestras();
            }}
          />
        </ModalOrganismo>
      )}

      <div className="w-full px-20 overflow-x-auto">
        <TableMolecula>
          <Thead>
            <Th>ID</Th>
            <Th>{t("Codigo")}</Th>
            <Th>{t("cantidad")}</Th>
            <Th>{t("unidad")}</Th>
            <Th>{t("fecha")}</Th>
            <Th>{t("finca")}</Th>
            <Th>{t("usuario")}</Th>
            <Th>{t("servicios")}</Th>
            <Th>{t("estado")}</Th>
            <Th>{t("altura")}</Th>
            <Th>{t("variedad")}</Th>
            <Th>{t("observaciones")}</Th>
            <Th>{t("imagen")}</Th>
            <Th>{userRole === "administrador" ? t("acciones") : ""}</Th>
          </Thead>
          <Tbody>
            {DataArrayPaginacion?.map((muestra) => (
              <tr key={muestra.id_muestra}>
                <Td>{muestra.id_muestra}</Td>
                <Td>{muestra.codigo_muestra}</Td>
                <Td>{muestra.cantidadEntrada}</Td>
                <Td>{muestra.UnidadMedida}</Td>
                <Td>{muestra.fecha_muestra}</Td>
                <Td>{muestra.finca}</Td>
                <Td>{muestra.usuario}</Td>
                <Td>{muestra.fk_idTipoServicio}</Td>
                <Td>
                  <Switch
                    isSelected={muestra.estado === "terminado"}
                    color={
                      muestra.estado === "terminado" ? "success" : "default"
                    }
                    onClick={()=>toast.error("La muestra no puede cambiar de estado...")}
                  >
                    {muestra.estado}
                  </Switch>
                </Td>
                <Td>{muestra.altura}</Td>
                <Td>{muestra.variedad}</Td>
                <Td>{muestra.observaciones}</Td>
                <Td>
                  {muestra.fotoMuestra && (
                    <img
                      src={`${import.meta.env.VITE_BASE_URL_MUESTRA}/${
                        muestra.fotoMuestra
                      }`}
                      alt="Muestra"
                      className="cursor-pointer h-8 w-8 rounded object-cover"
                      onClick={() => handleImageClick(muestra)}
                    />
                  )}
                </Td>
                <Td>
                  <div className="flex items-center space-x-4">
                    {userRole === "administrador" && (
                      <button
                        className="group bg-none flex cursor-pointer items-center justify-center h-[30px] w-[60px] rounded-[5px] border-none hover:rounded-full hover:bg-gray-400/30"
                        onClick={() => handleEdit(muestra)}
                      >
                        <FaRegEdit />
                      </button>
                    )}
                  </div>
                </Td>
              </tr>
            ))}
          </Tbody>
        </TableMolecula>
      </div>

      {showImageModal && selectedMuestra && (
        <ModalOrganismo
          title={`Imagen de la Muestra: ${selectedMuestra.codigo_muestra}`}
          visible={true}
          closeModal={closeImageModal}
        >
          <div className="flex justify-center items-center">
            <img
              src={`${import.meta.env.VITE_BASE_URL_MUESTRA}/${
                selectedMuestra.fotoMuestra
              }`}
              alt={`Muestra ${selectedMuestra.codigo_muestra}`}
              className="max-w-full max-h-[80vh] object-contain"
            />
          </div>
        </ModalOrganismo>
      )}

      <div className="flex justify-center mt-5">
        <PaginationMolecula
          initialPage={pages}
          total={numeroPagina}
          onChange={(page)=>setPages(page)}
        />
        {/*  <PaginationMolecula
          total={numeroPagina}
          initialPage={pages}
          onChange={handlePageChange}
        /> */}
      </div>
    </section>
  );
};

export default MuestrasPlantilla;
