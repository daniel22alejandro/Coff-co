import React, { useContext, useState, useTransition } from "react";
import {
  useGetTipoServicioQuery,
  useUpdateEstadoTipoServicioMutation
} from "../../../store/api/TipoServicio";
import TableMolecula from "../../molecules/table/TableMolecula";
import Tbody from "../../molecules/table/Tbody";
import Thead from "../../molecules/table/Thead";
import Th from "../../atoms/Th";
import Td from "../../atoms/Td";
import ModalOrganismo from "../../organismo/Modal/ModalOrganismo";
import { FaRegEdit } from "react-icons/fa";
import Mybutton from "../../atoms/Mybutton";
import TipoServicioFormulario from "../../molecules/Formulario/TipoServicioFormulario";
import PaginationMolecula from "../../molecules/pagination/PaginationMolecula";
import { Switch } from "@nextui-org/react";
import { AuthContext } from "../../../context/AuthContext";
import Search from "../../atoms/Search";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";


const TipoServicioPlantilla = () => {
  const [showModal, setShowModal] = useState(false);
  const [buscar, setBuscar] = useState("");
  const [datosDelFormulario, setDatosDelFormulario] = useState(null);
  const [pages, setPages] = useState(1);
  const { authData } = useContext(AuthContext)
  const { data: dataTipoServicios, isLoading, isError, error } = useGetTipoServicioQuery();
  const [updateEstadoTipoServicio] = useUpdateEstadoTipoServicioMutation();
  const { t } = useTranslation();

  const rol = authData.usuario.rol

  const handleModal = () => {
    setShowModal(true);
  };

  const cantidad = 4;
  const final = pages * cantidad;
  const inicial = final - cantidad;
  const handlePageChange = (page) => {
    setPages(page);
  };

  const filtro = dataTipoServicios?.filter(
    (tipoServicio) => {
      const nombreTipoServicioMatch =
        buscar === "" ||
        (tipoServicio?.nombreServicio &&
          tipoServicio?.nombreServicio.toLowerCase().includes(buscar.toLowerCase()));
      return nombreTipoServicioMatch;
    }
  )

  const numeroPagina = Math.ceil((filtro?.length || 0) / cantidad);
  const DataArrayPaginacion = filtro ? filtro.slice(inicial, final) : [];

  const handleEdit = (tipoServicio) => {
    setDatosDelFormulario(tipoServicio);
    setShowModal(true);
  };

  const closeModal = () => {
    setDatosDelFormulario(null);
    setShowModal(false);
  };
  const handleSwitchChange = async (checked, id) => {
    if (rol !== "administrador") {
      toast.error("Lo siento, no tiene permisos para realizar esta acción");
      return;
    }
    
    try {
      await updateEstadoTipoServicio({
        id: id,
        estado: checked ? "activo" : "inactivo",
      });
    } catch (error) {
      console.error("Error al procesar la solicitud", error);
      toast.error("Ocurrió un error al actualizar el estado del servicio");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <section className="w-full mt-5 gap-4 flex flex-wrap flex-col">
      <h2 className="text-2xl px-20 font-bold">{t("tipoServicios")}</h2>
      <div className="px-20 flex flex-wrap justify-around items-center">
        {
          rol === "administrador" &&
          (
            <>
              <Mybutton color="primary" onClick={handleModal}>
              {t("nuevo")}
              </Mybutton>
            </>
          )
        }
        <Search label={""} onchange={(e) => setBuscar(e.target.value)} placeholder={t("buscar")} />
      </div>
      {showModal && (
        <ModalOrganismo
          title={t("registrarServicio")}
          visible={showModal}
          closeModal={closeModal}
        >
          <TipoServicioFormulario
            dataValue={datosDelFormulario}
            closeModal={closeModal}
          />
        </ModalOrganismo>
      )}
      <div className="w-full px-20 overflow-x-auto">
        <TableMolecula>
          <Thead>
            <Th>ID</Th>
            <Th>{t("NombreServicio")}</Th>
            <Th>{t("CodigoServicio")}</Th>
            <Th>{t("estado")}</Th>
            <Th>{rol === "administrador" ? t("acciones") : ""}</Th>
          </Thead>
          <Tbody>
            {DataArrayPaginacion?.map((tipoServicio) => (
              <tr key={tipoServicio.idTipoServicio}>
                <Td>{tipoServicio.idTipoServicio}</Td>
                <Td>{tipoServicio.nombreServicio}</Td>
                <Td>{tipoServicio.codigoTipoServicio}</Td>
                <Td>
                  <Switch
                    color={tipoServicio.estado === "activo" ? "success" : "default"}
                    isSelected={tipoServicio.estado === "activo"}
                    onValueChange={(checked) => handleSwitchChange(checked, tipoServicio.idTipoServicio)}
                  >
                    {tipoServicio.estado}
                  </Switch>
                </Td>
                <Td>
                  <div className="gap-3 flex flex-graw">
                    {
                      rol === "administrador" && (
                        <>
                          <FaRegEdit
                            className="cursor-pointer"
                            size="30px"
                            onClick={() => handleEdit(tipoServicio)}
                          />
                        </>
                      )
                    }
                  </div>
                </Td>
              </tr>
            ))}
          </Tbody>
        </TableMolecula>
      </div>
      <div className="flex justify-center mt-4">
        <PaginationMolecula
          total={numeroPagina}
          initialPage={pages}
          onChange={handlePageChange}
        />
      </div>
    </section>
  );
};

export default TipoServicioPlantilla;