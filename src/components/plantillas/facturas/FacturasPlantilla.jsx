import React, { useEffect, useState } from "react";
import TableMolecula from "../../molecules/table/TableMolecula";
import Thead from "../../molecules/table/Thead";
import Th from "../../atoms/Th";
import Tbody from "../../molecules/table/Tbody";
import { useGetMuestrasterminadasQuery } from "../../../store/api/muestra";
import Td from "../../atoms/Td";
import { FaFileInvoiceDollar } from "react-icons/fa6";
import { useGeneraFacturaMutation } from "../../../store/api/factura";
import { toast } from "react-toastify";
import { pdf } from "@react-pdf/renderer";
import Facturapdf from "../../organismo/Reportes/Facturapdf";
import PaginationMolecula from "../../molecules/pagination/PaginationMolecula";
import Mybutton from "../../atoms/Mybutton";
import ModalOrganismo from "../../organismo/Modal/ModalOrganismo";
import { useForm } from "react-hook-form";
import InputAtomo from "../../atoms/Input";
import Search from "../../atoms/Search";
import FacturasAlquiler from "./FacturasAlquiler";
import { useTranslation } from "react-i18next";


const FacturasPlantilla = () => {
  const [datosFactura, setDatosDelFormulario] = useState([]);
  const [serch, setSerch] = useState("");
  const { data, isLoading, isError, error } = useGetMuestrasterminadasQuery();
  const [showModal, setShowModal] = useState(false);
  const [pages, setPages] = useState(1);
  const [generaFactura, { isLoading: isLoadingFactura, isSuccess, data: dataFactura }] = useGeneraFacturaMutation();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { t } = useTranslation();

  const handleFactura = async (codigo) => {
    console.log(codigo);
    try {
      const response = await generaFactura({ codigo });
      setDatosDelFormulario(response.data);
    } catch (error) {
      toast.error("Error al generar la factura");
    }
  };

  useEffect(() => {
    const downloadPDF = async () => {
      if (datosFactura.length > 0) {
        const blob = await pdf(<Facturapdf data={datosFactura[0]} />).toBlob();
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `factura_${datosFactura[0].codigo_muestra}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success("Factura generada correctamente");
        setDatosDelFormulario([]);
      }
    };

    downloadPDF();
  }, [datosFactura]);

  if (isLoading || isLoadingFactura) {
    return <p>Loading...</p>;
  }

  const cantidad = 4;
  const final = pages * cantidad;
  const inicial = final - cantidad;
  const handlePageChange = (page) => {
    setPages(page);
  };
  const filtro = data && data.length > 0 ? data.filter(
    (codigo) => {
      return serch === "" || (codigo.codigo_muestra &&
        codigo.codigo_muestra.toLowerCase().includes(serch.toLowerCase()))
    }

  ) : []
  const numeroPagina = Math.ceil((filtro?.length || 0) / cantidad);
  const DataArrayPaginacion = filtro
    ? filtro?.slice(inicial, final)
    : [];
  const handleFacturaAlquiler = () => {
    setShowModal(true)
  }
  const closeModal = () => {
    setShowModal(false);
  }

  return (
    <section className="w-full mt-5 gap-4 flex flex-wrap flex-col">
      <h2 className="text-2xl px-20  font-bold">{t("facturas")}</h2>
      <div className="w-full px-20 overflow-x-auto flex gap-2 flex-col ">
        {showModal &&
          <ModalOrganismo visible={showModal} closeModal={closeModal}>



            <FacturasAlquiler />



          </ModalOrganismo>}
        <div className="flex flex-row justify-between items-center">
          <Mybutton color={"primary"} onClick={handleFacturaAlquiler}>
          {t("facturaalquiler")}
          </Mybutton>
          <div>

            <Search label={""} placeholder={t("buscar")} onchange={(e) => setSerch(e.target.value)} />
          </div>

        </div>
        <TableMolecula>
          <Thead>
            <Th>ID</Th>
            <Th>{t("Codigo")}</Th>
            <Th>{t("cantidad")}</Th>
            <Th>{t("fecha")}</Th>
            <Th>{t("finca")}</Th>
            <Th>{t("usuario")}</Th>
            <Th>{t("estado")}</Th>
            <Th>{t("acciones")}</Th>
          </Thead>
          <Tbody>
            {DataArrayPaginacion?.map((muestra) => (
              <tr key={muestra.id_muestra}>
                <Td>{muestra.id_muestra}</Td>
                <Td>{muestra.codigo_muestra}</Td>
                <Td>{muestra.cantidadEntrada}</Td>
                <Td>{muestra.fecha_muestra}</Td>
                <Td>{muestra.finca || 'No Especificada'}</Td>
                <Td>{muestra.usuario}</Td>
                <Td>{muestra.estado}</Td>
                <Td>
                  <FaFileInvoiceDollar
                    size={"30px"}
                    className="cursor-pointer"
                    onClick={() => handleFactura(muestra.codigo_muestra)}
                  />
                </Td>
              </tr>
            ))}
          </Tbody>
        </TableMolecula>
      </div>
      <PaginationMolecula
        total={numeroPagina}
        initialPage={pages}
        onChange={handlePageChange}
      />
    </section>
  );
};

export default FacturasPlantilla;
