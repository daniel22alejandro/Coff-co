import React, { useState, useEffect } from "react";
import Mybutton from "../../atoms/Mybutton";
import TableMolecula from "../../molecules/table/TableMolecula";
import Thead from "../../molecules/table/Thead";
import Th from "../../atoms/Th";
import Tbody from "../../molecules/table/Tbody";
import { useGetLogosQuery, useRegistrarLogoMutation, useActualizarLogoMutation, useActualizarEstadoMutation} from "../../../store/api/logos";
import { Spinner } from "@nextui-org/react";
import PaginationMolecula from "../../molecules/pagination/PaginationMolecula";
import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";

//Importaciones para el modal
import { IoAtCircle } from "react-icons/io5";
import SelectAtomo from "../../atoms/Select";
import SelectAtomoActualizar from "../../atoms/SelectActualizar";
import ModalOrganismo from "../../organismo/Modal/ModalOrganismo";
import Logosímbolo from "../../atoms/Logosímbolo";
import UserFrom from "../../molecules/Formulario/UserFrom";
import InputAtomo from "../../atoms/Input";
import InputAtomoActualizar from "../../atoms/InputActualizar";
import CustomSwitch from "../../atoms/CustomSwitch";
import { useForm } from "react-hook-form";
import { FcOk } from "react-icons/fc";
import Td from "../../atoms/Td";


const LogosPlantilla = () => {

    //CONTROL DE LA PAGINACION
    const [paginaActual,setPaginaActual]= useState(1)
    const itemsPorPagina = 7

     // FUNCIONES CRUD
    const {data,isLoading, refetch} = useGetLogosQuery()
    //Faltan  
    const [registrarLogo, { isSuccess, datos, isError, error }] = useRegistrarLogoMutation();
    const [actualizarEstado] = useActualizarEstadoMutation();
    const [actualizarLogo]= useActualizarLogoMutation();

     //MODAL 
    const {handleSubmit, register, watch, setValue, formState: { errors },reset,} = useForm();

    //Abrir modal
    const [openModal, setOpenModal] = useState(false);
    const [openModalActualizar, setOpenModalActualizar] = useState(false);
    const [sucess, setsucess] = useState("");

    //MODAL REGISTRAR
    const handleClick = () => {setOpenModal(true);};
    const closeModal = () => {setOpenModal(false);reset()};

    //MODAL ACTUALIZAR
    const [logoSeleccionado, setLogoSeleccionado] = useState(null);
    const handleClickActualizar = (logo) => {
        console.log("Logo seleccionado:", logo); 
        setLogoSeleccionado(logo);
        setOpenModalActualizar(true);
    };
    
    //CAMBIAR EL ESTADO DEL LOGO
    const handleSwitchChange = async (id, nombre) => {
    confirmAlert({
      title: 'Confirmación',
      message: `¿Cambiar el estado del Logo ${id},  ${nombre}?`,
      buttons: [
        {
          label: 'Sí',
          onClick: async () => {
            try {
              await actualizarEstado(id).unwrap();
              toast.success("Estado actualizado con éxito");
            } catch (error) {
              console.error('Error al actualizar el estado:', error);
            }
          }
        },
        {
          label: 'No',
          onClick: () => toast.warn('Operacion cancelada')
        }
      ],
      closeOnClickOutside: true,
    });
    };  

    useEffect(() => {
        console.log("Logo seleccionado en modal:", logoSeleccionado);
    }, [logoSeleccionado]);
      
      const closeModalActualizar = () => {setOpenModalActualizar(false);reset()};
    
      //SUBMIT REGISTRAR
      const onsubmit = (data) => {
        registrarLogo(data);
        reset();
        toast.success("Logo registrado con éxito");
        setOpenModal(false);
      };
    
      //SUBMIT ACTUALIZAR
      const onsubmitActualizar = (valores) => {
        if (logoSeleccionado) {
          console.log("valores enviados:", valores);
          actualizarLogo({ data: valores, id: logoSeleccionado.idLogos });
          toast.success("Logo actualizado con éxito");
          reset();
          setOpenModalActualizar(false);
        }
      };
      
      //Para registrar
      useEffect(() => {
        if (isSuccess) {
          setsucess(datos?.message);
          toast.success(datos?.message, {
            duration: 5000,
            position: "top-center",
            style: {
              background: "#333",
              color: "#fff",
            },
            icon: <FcOk />,
          });
        }
    
        if (isError) {
          console.log(error);
          toast.error(error?.error || "Ocurrió un error", {
            duration: 5000,
            position: "top-center",
            style: {
              background: "#333",
              color: "#fff",
            },
          });
        }
      }, [isSuccess, isError, error, datos]);

    // ESTADO DE CARGA DE LA TABLA 
    if(isLoading){
        return(
        <Spinner className="flex justify-center items-center h-screen bg-gray-100" />
        )
    }
    

    const estadoOptions = [
        { value: "activo", label: "Activo" },
        { value: "inactivo", label: "Inactivo" }
    ];

    // CONTROL DE PAGINAS DE LA TABLA
    const indiceUltimoItem = paginaActual * itemsPorPagina
    const indicePrimerItem = indiceUltimoItem - itemsPorPagina
    const elementosActuales = data ? data.data.slice(indicePrimerItem,indiceUltimoItem):[]
    const totalPages = Math.ceil((data?.length||0)/itemsPorPagina)

    return(
    <div className="w-auto h-screen flex flex-col gap-8 bg-gray-100"> 

    {/* TABLA */}
      <div className="pt-10 pl-20">
        <Mybutton onClick={handleClick} color={"primary"}>Nuevo Logo<IoAtCircle/></Mybutton>
      </div>
      <div className="w-full px-20 h-auto overflow-y-auto">
        <TableMolecula lassName="w-full">
          <Thead>
            <Th>ID</Th>
            <Th>Nombre</Th>
            <Th>Ruta</Th>
            <Th>Editar</Th>
            <Th>Estado</Th>
          </Thead>
          <Tbody>
            {elementosActuales.length>0?(
              elementosActuales.map((logo)=>(
                <tr className="hover:bg-slate-200" key={logo.idLogos}>
                  <Td>{logo.idLogos}</Td>
                  <Td>{logo.nombre}</Td>
                  <Td>{logo.ruta}</Td>
                  <Td>
                  <div className="flex  items-center space-x-4">
                    
                  <button
                    className="group bg-none flex cursor-pointer items-center justify-center h-[30px] w-[60px] rounded-[5px] border-none hover:rounded-full hover:bg-gray-400/30"
                    onClick={() => handleClickActualizar(logo)}
                  >
                  <svg
                    className="icon-default block group-hover:hidden"
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    height="15"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                  </svg>
                  <svg
                    className="icon-hover hidden group-hover:block"
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    height="15"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001"/>
                  </svg>
                  </button>
                  </div>
                  </Td>
                  <Td>
                    <CustomSwitch
                        setisSelected={logo.estado === "activo"}
                        onChange={() => handleSwitchChange(logo.idLogos, logo.nombre)}
                    />
                  </Td>

                </tr>
              ))
            ):(
              <tr>
              <td colSpan={9} className="text-center">
                <h1 className="text-2xl">
                  <b>No hay datos</b>
                </h1>
              </td>
            </tr>
            )
            }

          </Tbody>
        </TableMolecula>
      </div>
      <div className="flex justify-center mt-4">
          <PaginationMolecula
          total={totalPages}
          initialPage={paginaActual}
          onChange={(pagina)=>setPaginaActual(pagina)}
          />
      </div>
    {/* FIN TABLA */}

    {/* MODAL REGISTRO*/}
    {openModal && (
          <ModalOrganismo
          logo={<Logosímbolo />}
          children={
            <UserFrom
              onsubmit={handleSubmit(onsubmit)}
              children={
                <>
                  <InputAtomo
                  register={register}
                  name={"nombre"}
                  erros={errors}
                  id={"nombre"}
                  placeholder={"Ingrese el nombre de el logo"}
                  type={"text"}
                />
                <InputAtomo
                  register={register}
                  name={"ruta"}
                  erros={errors}
                  id={"ruta"}
                  placeholder={"Ingrese la ruta de el logo"}
                  type={"text"}
                />
                {/* <SelectAtomo
                  data={estadoOptions} 
                  label={"Estado"} 
                  onChange={(e) => setValue("estado", e.target.value)} 
                  items={"value"} 
                  ValueItem={"label"} 
                  value={watch("estado")} 
                /> */}
                </>
              }
            />
          }
          visible={true}
          title={"Registro de Logo"}
          closeModal={closeModal}
        />
    )}
    {/* FIN MODAL REGISTRO*/}

    {/* MODAL ACTUALIZAR*/}
    {openModalActualizar && (
    <ModalOrganismo
      logo={<Logosímbolo />}
      children={
        <UserFrom
          onsubmit={handleSubmit(onsubmitActualizar)}
          children={
            <>
              <InputAtomoActualizar
                register={register}
                name={"nombre"}
                errores={errors}
                id={"nombre"}
                placeholder={"Ingrese el nombre del logo"}
                type={"text"}
                defaultValue={logoSeleccionado?.nombre || ""}
              />
              <InputAtomoActualizar
                register={register}
                name={"ruta"}
                errores={errors}
                id={"ruta"}
                placeholder={"Ingrese la ruta del logo"}
                type={"text"}
                defaultValue={logoSeleccionado?.ruta || ""}
              />
            </>
          }
        />
      }
      visible={true}
      title={"Actualizar Logo"}
      closeModal={closeModalActualizar}
    />

    )}
    {/* FIN MODAL ACTUALIZAR*/}
    </div>
    )
};

export default LogosPlantilla;