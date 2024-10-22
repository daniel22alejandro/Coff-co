import React, { useEffect, useState } from 'react'
import Mybutton from '../../atoms/Mybutton'
import { useForm } from "react-hook-form";
import InputAtomo from '../../atoms/Input';
import { useGeneraFacturaAlquilerMutation } from '../../../store/api/factura';
import { toast } from "react-toastify";
import TableMolecula from '../../molecules/table/TableMolecula';
import Th from '../../atoms/Th';
import Thead from '../../molecules/table/Thead';
import Tbody from '../../molecules/table/Tbody';
import Td from '../../atoms/Td';
import { pdf } from "@react-pdf/renderer";
import FacturaAlquile from '../../organismo/Reportes/FacturaAlquiler';
import { useTranslation } from 'react-i18next';


const FacturasAlquiler = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [dataFactura, seDatafactura] = useState([])
    const [datos, setDatos] = useState([]);
    const [generaFacturaAlquiler, { isLoading, data, isSuccess, error, isError }] = useGeneraFacturaAlquilerMutation();
    const {t}= useTranslation()

    useEffect(() => {
        if (isSuccess) {
            seDatafactura(data)
        }
        if (isError) {
            toast.error(`${error.error}`);
        }
    }, [isLoading, data, isSuccess, error])

    const downloadPDF = async (factura) => {
        if (factura) {
            try {
                const blob = await pdf(<FacturaAlquile data={factura} />).toBlob();
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = `factura_${factura.nombre}.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                toast.success("Factura generada correctamente");
            } catch (error) {
                console.error("Error al generar el PDF:", error);
                toast.error("Error al generar la factura");
            }
        }
    };


    return (

        <>
            <section>
                <form className="flex flex-col gap-3 justify-center items-center " onSubmit={handleSubmit(generaFacturaAlquiler)}>
                    <div className="w-full justify-center items-center flex-row flex gap-4">
                        <div className="w-[250px]">

                            <InputAtomo erros={errors} name={"Documento"} register={register} type={"number"} placeholder={t("buscarDocumento")} />
                        </div>
                        <Mybutton color={"primary"} type={"submit"}>
                        {t("buscarFactura")}
                        </Mybutton>
                    </div>
                    {
                        isSuccess && (
                            <>
                                <div className='w-full px-20 overflow-x-auto flex gap-2 flex-col'>
                                    <TableMolecula>
                                        <Thead>
                                            <Th>Nombre</Th>
                                            <Th>Cedula</Th>
                                            <Th>Fecha Inicio</Th>
                                            <Th>Fecha Fin</Th>
                                            <Th>Precio </Th>
                                            <Th>Accion </Th>
                                        </Thead>
                                        <Tbody>
                                            {
                                                dataFactura.map((factura, index) => (
                                                    <tr key={index}>
                                                        <Td>{factura.nombre}</Td>
                                                        <Td>{factura.cedula}</Td>
                                                        <Td>{factura.fecha}</Td>
                                                        <Td>{factura.fecha_fin}</Td>
                                                        <Td>{factura.precio}</Td>
                                                        <Td>
                                                            <Mybutton color={"primary"} onClick={() => downloadPDF(factura)}>
                                                                Generar
                                                            </Mybutton>
                                                        </Td>
                                                    </tr>
                                                ))
                                            }
                                        </Tbody>
                                    </TableMolecula>

                                </div>
                            </>
                        )
                    }



                </form>

            </section>
        </>
    )
}


export default FacturasAlquiler