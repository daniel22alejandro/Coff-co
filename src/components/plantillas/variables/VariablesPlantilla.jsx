import React, { useContext, useEffect, useState } from "react";
import {
  useGetVariablesQuery,
  useUpdateEstadoMutation,
} from "../../../store/api/variables";
import { Switch } from "@nextui-org/react";
import TableMolecula from "../../molecules/table/TableMolecula";
import Tbody from "../../molecules/table/Tbody";
import Thead from "../../molecules/table/Thead";
import Th from "../../atoms/Th";
import { confirmAlert } from "react-confirm-alert";
import Td from "../../atoms/Td";
import ModalOrganismo from "../../organismo/Modal/ModalOrganismo";
import { FaRegEdit } from "react-icons/fa";
import Mybutton from "../../atoms/Mybutton";
import VariablesFormulario from "../../molecules/Formulario/VariablesFormulario";
import PaginationMolecula from "../../molecules/pagination/PaginationMolecula";
import Search from "../../atoms/Search";
import { toast } from "react-toastify";
import { AuthContext } from "../../../context/AuthContext";
import ToolTip from "../../molecules/toolTip/ToolTip";
import { useTranslation } from "react-i18next";


const VariablesPlantilla = () => {
  const { t } = useTranslation();
  const [showModal, setShowMdal] = useState(false);
  const [datosDelFormulario, setDatosDelFormulario] = useState("");
  const [pages, setPages] = useState(1);
  const [inactivos, setInactivos] = useState(true);
  const [isChecked, setIsChecked] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { authData } = useContext(AuthContext)
  const {
    data: dataVariables,
    isLoading,
    isError,
    error,
  } = useGetVariablesQuery();
  const [updateEstado,{ isLoading: isLoadingCambio, isError: isErrorCambio, error: errorCambio, data, isSuccess },] = useUpdateEstadoMutation();
  const rol = authData.usuario.rol

  const handleModal = () => {
    setShowMdal(true);
  };

  const cantidad = 4;
  const final = pages * cantidad;
  const inicial = final - cantidad;
  const handlePageChange = (page) => {
    setPages(page);
  };



  const filtro = dataVariables && dataVariables.length > 0 ? dataVariables.filter(
    (variable) => {
      const isCheck = isChecked ? "activo" : "inactivo";
      const estadoVariableMatch = variable.estado === isCheck;
      const nombreVariableMatch =
        searchTerm === "" ||
        (variable.nombre &&
          variable.nombre.toLowerCase().includes(searchTerm.toLowerCase()));
      return (estadoVariableMatch && nombreVariableMatch)

    }
  ) : []
  const numeroPagina = Math.ceil((filtro?.length || 0) / cantidad);
  const DataArrayPaginacion = filtro
    ? filtro?.slice(inicial, final)
    : [];
  const handleEdit = (variable) => {
    setDatosDelFormulario(variable);
    setShowMdal(true);
  };

  const closemodal = () => {
    setDatosDelFormulario("");
    setShowMdal(false);
  };
  const hadleEstado = (checked) => {
    setIsChecked(checked);
    setInactivos(!inactivos);
  };
  useEffect(
    () => {
      if (isSuccess) {
        toast.success(`${data.message}`);
      }
      if (
        isErrorCambio
      ) {
        toast.error(`${errorCambio.error}`);
      }
    },
    [dataVariables, isErrorCambio]
  )
  const handleSwitchChange = (checked, id) => {
    try {
      if (rol !== "administrador") {
        toast.error("No tienes permisos para cambiar el estado");
        return;
      }
      confirmAlert({
        title: "Confirmación de Cambiar el estado activo",
        message: `¿Estás seguro de que quieres Cambiar el Estado al Documento ${id}?`,
        buttons: [
          {
            label: "Sí",
            onClick: async () => {
              try {

                updateEstado({
                  id: id,
                  estado: checked ? "activo" : "inactivo",
                });


              } catch (error) {
                if (
                  isErrorCambio
                ) {
                  toast.error("Error al Cambiar el estado");
                }
              }
            },
          },
          {
            label: "No",
            onClick: () => toast.info("Operación cancelada"),
          },
        ],
        closeOnClickOutside: true,
      });

    } catch (error) {
      console.error("Error al procesar la solicitud", error);
    }
  };
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <section className="w-full   mt-5 gap-4 flex flex-wrap flex-col">
      <h2 className="text-2xl px-20 font-bold">{t("variables")}</h2>
      <div className="px-20   w-full flex flex-wrap justify-between items-center">
        {
          rol === "administrador" &&
          (
            <>
              <Mybutton color={"primary"} onClick={handleModal}>
               {t("nuevo")}
              </Mybutton>
            </>
          )
        }

        <div className="flex items-center mb-2 w-full max-w-[550px]">
          <Search
            label={""}
            placeholder={t("buscar")}
            onchange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Switch
          color={isChecked ? "success" : "default"}
          isSelected={isChecked}
          onValueChange={(checked) => hadleEstado(checked)}
        >
         {t("estado")}
        </Switch>

      </div>

      {showModal && (
        <ModalOrganismo
          title={t("registrarVariable")}
          visible={showModal}
          closeModal={closemodal}
        >
          <VariablesFormulario
            dataValue={datosDelFormulario}
            closeModal={closemodal}
          />
        </ModalOrganismo>
      )}
      <div className="w-full px-20 overflow-x-auto ">
        <TableMolecula>
          <Thead>
            <Th>ID</Th>
            <Th>{t('nombre')}</Th>
            <Th>{t('tipoDeDatos')}</Th>
            <Th>{t('unidadMedida')}</Th>
            <Th>{t('estado')}</Th>

            <Th>{rol === "administrador" ? (t("acciones")) : ""}</Th>


          </Thead>
          <Tbody>
            {DataArrayPaginacion?.map((variable) => (
              <tr key={variable.idVariable}>
                <Td>{variable.idVariable}</Td>
                <Td>{variable.nombre}</Td>
                <Td>{variable.tipo_dato}</Td>
                <Td>{variable.UnidadMedida}</Td>
                <Td>
                  <Switch
                    color={variable.estado === "activo" ? "success" : "default"}
                    isSelected={variable.estado === "activo"}
                    onValueChange={(checked) =>
                      handleSwitchChange(checked, variable.idVariable)
                    }
                  >
                    {variable.estado}
                  </Switch>
                </Td>

                <Td>
                  <div className=" gap-3 flex flex-graw">
                    {
                      rol === "administrador" && (
                        <>
                          <ToolTip
                            content={t("editar")}
                            placement="top"
                            icon={() => (
                              <FaRegEdit
                                className="cursor-pointer"
                                size={"30px"}
                                onClick={() => handleEdit(variable)}
                              />
                            )}

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

export default VariablesPlantilla;
