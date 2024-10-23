import React, { useContext, useState } from "react";
import Mybutton from "../../atoms/Mybutton";
import TableMolecula from "../../molecules/table/TableMolecula";
import Thead from "../../molecules/table/Thead";
import Th from "../../atoms/Th";
import Tbody from "../../molecules/table/Tbody";
import { MdDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import {
  useActualizarEstadoPrecioMutation,
  useActualizarPrecioMutation,
  useEliminarPrecioMutation,
  useGetPreciosQuery,
  useRegistrarPrecioMutation,
} from "../../../store/api/precios/preciosSlice";
import PaginationMolecula from "../../molecules/pagination/PaginationMolecula";
import { Spinner, Switch } from "@nextui-org/react";
import { toast } from "react-toastify";
import Td from "../../atoms/Td";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import ModalOrganismo from "../../organismo/Modal/ModalOrganismo";
import { useGetTipoServicioQuery } from "../../../store/api/TipoServicio";
import { useForm } from "react-hook-form";
import ToolTip from "../../molecules/toolTip/ToolTip";
import InputAtomo from "../../atoms/Input";
import SelectAtomo from "../../atoms/Select";
import Search from "../../atoms/Search";
import { AuthContext } from "../../../context/AuthContext";
import { useTranslation } from "react-i18next";

const PreciosPlantilla = () => {

  const {t} = useTranslation()

  const [paginaActual, setPaginaActual] = useState(1);
  const { authData } = useContext(AuthContext)
  const itemsPorPagina = 4;
  const [tipoServicioActual, setTipoServicioActual] = useState("");
  const [UnidadMedida, setUnidadMedida] = useState("");
  const [filtro, setfiltro] = useState("");


  const { data: dataTipoServicio, isLoading: isLoadingTipoServicio } =
    useGetTipoServicioQuery();
  const {
    data: dataPrecio,
    isLoading: isLoadingPrecio,
    refetch,
  } = useGetPreciosQuery();
  const [registrarPrecio, { isLoading }] = useRegistrarPrecioMutation();
  const [actualizarPrecio] = useActualizarPrecioMutation();
  const [actualizarEstadoPrecio] = useActualizarEstadoPrecioMutation();
  const [eliminarPrecio] = useEliminarPrecioMutation();
  const rol = authData.usuario.rol
  const [visible, setVisible] = useState(false);
  const [precioSeleccionado, setPrecioSeleccionado] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm();
 
  const filteredData =
    dataPrecio && dataPrecio.length > 0
      ? dataPrecio.filter((item) => {
        const NombrePrecio =
          filtro === "" ||
          (item.nombreServicio &&
            item.nombreServicio.toLowerCase().includes(filtro.toLowerCase()));
        const presentacion =
          filtro === "" ||
          (item.presentacion &&
            item.presentacion.toLowerCase().includes(filtro.toLowerCase()));
        return NombrePrecio || presentacion;
      })
      : [];

  const indexOfLastItem = paginaActual * itemsPorPagina;
  const indexOfFirstItem = indexOfLastItem - itemsPorPagina;
  const articulosActualesPrecio = dataPrecio
    ? filteredData.slice(indexOfFirstItem, indexOfLastItem)
    : [];

  const totalPages = Math.ceil((filteredData?.length || 0) / itemsPorPagina);
  if (isLoadingPrecio || isLoadingTipoServicio || isLoading) {
    return (
      <Spinner className="flex justify-center items-center h-screen bg-gray-100" />
    );
  }
 
  const abrirModal = (precio) => {

    if (precio) {
      setPrecioSeleccionado(precio);
      reset({
        presentacion: precio.presentacion,
        precio: precio.precio,
        fk_idTipoServicio: precio.fk_idTipoServicio,
      });
      setTipoServicioActual(precio.nombreServicio);
      setUnidadMedida(precio.UnidadMedida)
    } else {
      setPrecioSeleccionado(null);
      reset({
        presentacion: "",
        precio: "",
        fk_idTipoServicio: "",
      });
      setTipoServicioActual("");
    }
    setVisible(true);
  };

  const cerrarModal = () => {
    setVisible(false);
    reset();
    setTipoServicioActual("");
  };

  const onSubmit = async (datosDelFormulario) => {

    try {
      const payload = {
        presentacion: datosDelFormulario.presentacion,
        precio: datosDelFormulario.precio,
        fk_idTipoServicio: datosDelFormulario.fk_idTipoServicio,
        unidaMedida: UnidadMedida
      };

      if (precioSeleccionado) {
        await actualizarPrecio({
          id: precioSeleccionado.idPrecio,
          ...payload,
        }).unwrap();
        toast.success("Precio actualizado con exito");
      } else {
        await registrarPrecio(payload).unwrap();
        toast.success("Precio registrado con éxito");
      }
      cerrarModal();
      refetch();
    } catch (error) {
      console.error("Error al procesar la solicitud", error);
      toast.error("Error al procesar la solicitud");
    }
  };

  const manejadorCambioEstadoSwitch = (checked, id) => {
    const nuevoEstado = checked ? "activo" : "inactivo";
    if (rol !== "administrador") {
      toast.error("No tiene permisos para cambiar el estado del precio");
      return;
    }

    const precioActual = dataPrecio.find((precio) => precio.idPrecio === id);

    if (!precioActual) {
      toast.error("Registro de precio no encontrado");
      return;
    }

    const payload = {
      id: id,
      estado_precio: nuevoEstado,
    };
    actualizarEstadoPrecio(payload)
      .unwrap()
      .then(() => {
        toast.success("Estado actualizado con éxito");
        refetch();
      })
      .catch((error) => {
        console.error("Error al actualizar el estado del ambiente", error);
        toast.error("Error al actualizar el estado del ambiente");
      });
  };

  const handleEliminarPrecio = (id, presentacion) => {
    confirmAlert({
      title: (
        <div>
          <span>
            <b>Confirmación de eliminación</b>
          </span>
        </div>
      ),
      message: (
        <div>
          ¿Estás seguro de que quieres eliminar el precio
          <span style={{ color: "red", fontWeight: "bold" }}>
            {" "}
            {presentacion}
          </span>
          ?
        </div>
      ),
      buttons: [
        {
          label: "Sí",
          onClick: async () => {
            try {
              await eliminarPrecio(id).unwrap();
              toast.success("Precio eliminado con éxito");
            } catch (error) {
              console.error("Error al eliminar el precio", error);
              toast.error("Error al eliminar el precio");
            }
          },
        },
        {
          label: "No",
          onClick: () => toast.info("Eliminación cancelada"),
        },
      ],
      closeOnClickOutside: true,
    });
  };
  const dataUnidadMedida = [
    { value: "Lb", label: "Libras" },
    { value: "Kg", label: "Kilogramos" },
    { value: "N/A", label: "N/A" },
  ]


  return (
    <>
      <div className="w-auto h-screen  flex flex-col gap-8 bg-gray-100">
        <div className="pt-10 pl-20 justify-center flex items-center">
          {
            rol === "administrador" && (
              <>
                <Mybutton color={"primary"} onClick={() => abrirModal(null)}>
                  <b>{t('Nuevo Precio')}</b>
                </Mybutton>
              </>
            )
          }

          <Search
            label={""}
            placeholder={t("buscar precio")}
            onchange={(e) => setfiltro(e.target.value)} />
        </div>
        <div className="w-full px-20 h-auto overflow-y-auto">
          <TableMolecula>
            <Thead>
              <Th>ID</Th>
              <Th>{t('Presentacion')}</Th>
              <Th>{t('Precio')}</Th>
              <Th>{t('Tipo servicio')}</Th>
              <Th>{t('unidadMedida')}</Th>
              <Th>{t('estado')}</Th>
              <Th>{rol === "administrador" ? t('acciones') : ""}</Th>
            </Thead>
            <Tbody>
              {articulosActualesPrecio.length > 0 ? (
                articulosActualesPrecio.map((precio) => (
                  <tr className="hover:bg-slate-200" key={precio.idPrecio}>
                    <Td>{precio.idPrecio}</Td>
                    <Td>{precio.presentacion}</Td>
                    <Td>{precio.precio}</Td>
                    <Td>{precio.nombreServicio}</Td>
                    <Td>{precio.UnidadMedida}</Td>
                    <Td>

                      <>
                        <Switch
                          color={
                            precio.estado_precio === "activo"
                              ? "success"
                              : "default"
                          }
                          isSelected={precio.estado_precio === "activo"}
                          onValueChange={(checked) =>
                            manejadorCambioEstadoSwitch(
                              checked,
                              precio.idPrecio,
                              dataTipoServicio.idTipoServicio
                            )
                          }
                        >
                          {precio.estado_precio}
                        </Switch>
                      </>


                    </Td>
                    <Td>
                      <div className="flex flex-row gap-6">

                        {
                          rol === "administrador" && (
                            <ToolTip
                              content="Actualizar"
                              placement="right"
                              icon={() => (
                                <FaRegEdit
                                  size={"35px"}
                                  onClick={() => abrirModal(precio)}
                                  className="cursor-pointer transform hover:scale-y-110 hover:scale-x-110 transition duration-300 "
                                />
                              )}
                            />
                          )
                        }


                      </div>
                    </Td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center">
                    <h1 className="text-2xl">
                      <b>{t('No hay datos')}</b>
                    </h1>
                  </td>
                </tr>
              )}
            </Tbody>
          </TableMolecula>
        </div>
        <div className="flex justify-center mt-4">
          <PaginationMolecula
            total={totalPages}
            initialPage={paginaActual}
            onChange={(pagina) => setPaginaActual(pagina)}
          />
        </div>
      </div>
      <div className="flex">
        <ModalOrganismo
          visible={visible}
          closeModal={cerrarModal}
          // title={precioSeleccionado ? "Actualizar precio" : "Nuevo precio"}
          onSubmit={handleSubmit(onSubmit)}
        >
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col items-center"
          >
            <h2 className="text-2xl font-bold mb-4 text-center">
              {precioSeleccionado ? t("Actualizar Precio") : t("Nuevo Precio")}
            </h2>
            <div className="flex flex-col py-6 gap-2">
              <InputAtomo
                type="text"
                id="presentacion"
                name="presentacion"
                placeholder={t("Presentacion")}
                register={register}
                erros={errors}
              />
              <InputAtomo
                type="number"
                id="precio"
                name="precio"
                placeholder={t("Ingrese el precio")}
                register={register}
                erros={errors}
              />
              <div>
                <div className="flex gap-2 flex-col">
                  <SelectAtomo
                    data={dataTipoServicio}
                    label={t("tipoServicios")}
                    onChange={(e) => {
                      setValue("fk_idTipoServicio", e.target.value);
                      setTipoServicioActual(e.target.value);
                    }}
                    items="idTipoServicio"
                    ValueItem="nombreServicio"
                    value={tipoServicioActual}
                  />
                  <SelectAtomo
                    value={UnidadMedida}
                    data={dataUnidadMedida}
                    items={"value"}
                    label={t('unidadMedida')}
                    ValueItem={"label"}
                    onChange={(e) => setUnidadMedida(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-6">
              <Mybutton color={"primary"} type="submit">
                {precioSeleccionado ? t("actualizar") : t('registrar')}
              </Mybutton>
            </div>
          </form>
        </ModalOrganismo>
      </div>
    </>
  );
};

export default PreciosPlantilla;