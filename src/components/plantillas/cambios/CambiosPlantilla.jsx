import React, { useState } from 'react'
import TableMolecula from "../../molecules/table/TableMolecula";
import Thead from "../../molecules/table/Thead";
import Th from "../../atoms/Th";
import Tbody from "../../molecules/table/Tbody";
import { useListarCambiosQuery } from '../../../store/api/servicio/serviciosSlice';
import Td from '../../atoms/Td';
import PaginationMolecula from '../../molecules/pagination/PaginationMolecula';
import Search from '../../atoms/Search';
import { FaRegEye } from "react-icons/fa";
import ToolTip from '../../molecules/toolTip/ToolTip';
import { useTranslation } from 'react-i18next';

const CambiosPlantilla = () => {

  const {t}= useTranslation()

  const { data: dataCambios, isLoading, refetch } = useListarCambiosQuery()

  const [paginaActual, setPaginaActual] = useState(1);
  const [filtro, setfiltro] = useState("");
  const itemsPorPagina = 4;

  const indiceUltimoItem = paginaActual * itemsPorPagina;
  const indicePrimerItem = indiceUltimoItem - itemsPorPagina;

console.log(dataCambios)
  const cambiosFiltrados = dataCambios
    ? dataCambios.filter((muestra) => {
      const nombre = filtro === "" ||
      muestra.codigo_muestra && muestra.codigo_muestra.toLowerCase().includes(filtro)
      return nombre;
    }
    )
    : [];
const handleListar =(data)=>{
console.log(data)
}
  const currentItems = dataCambios ? cambiosFiltrados.slice(indicePrimerItem, indiceUltimoItem) : [];
  const totalPages = Math.ceil(currentItems.length / itemsPorPagina);



  return (
    <>
      <div className="w-auto h-screen  flex flex-col gap-8 bg-gray-100">
        <Search label={""} onchange={(e) => setfiltro(e.target.value)} placeholder={t("buscar")}/>
        <div className="w-full px-20 h-auto overflow-y-auto">
          <TableMolecula>
            <Thead>
              <Th>ID</Th>
              <Th>{t("Descripción")}</Th>
              <Th>{t('Fecha')}</Th>
              <Th>{t('Muestra')}</Th>
              <Th>{t('Responsable')}</Th>
              <Th>{t('Rol')}</Th>

            </Thead>
            <Tbody>
              {currentItems.length > 0 ? (
                currentItems.map((cambio) => (
                  <tr className="hover:bg-slate-200" key={cambio.id_cambio}>
                    <Td>{cambio.id_cambio}</Td>
                    <Td>{cambio.descripcion}</Td>
                    <Td>{cambio.fecha}</Td>
                    <Td>{cambio.codigo_muestra}</Td>
                    <Td>{cambio.nombre_usuario}</Td>
                    <Td>{cambio.rol_usuario}</Td>
                  </tr>
                ))
              ) : (
                
                <tr>
                <td colSpan={10} className="text-center">
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
            onChange={ (page)=> setPaginaActual(page)}
          />
        </div>
      </div>
    </>
  )
}

export default CambiosPlantilla
