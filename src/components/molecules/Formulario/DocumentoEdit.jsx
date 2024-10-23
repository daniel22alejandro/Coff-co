
import InputAtomo from '../../atoms/Input'
import { useForm } from 'react-hook-form'
import Mybutton from '../../atoms/Mybutton';
import SelectAtomo from '../../atoms/Select';
import { useGetVariableActivasQuery } from '../../../store/api/variables';
import { useGetTipoDocumentosQuery } from '../../../store/api/TipoDocumentos';
import Label from '../../atoms/Label';
import { useGetTipoServicioQuery } from '../../../store/api/TipoServicio';
import CheckboxAtomo from '../../atoms/CheckboxAtomo';
import { useLogosActivosQuery } from '../../../store/api/logos';
import { useActualizarDocumentoMutation } from '../../../store/api/documentos';
import { toast } from "react-toastify";
import { useEffect, useState } from 'react';
import SelectDocumentos from '../../atoms/SelectDocumentos';
import InputAtomoActualizar from '../../atoms/InputActualizar';
const DocumentoEdit = ({ valor, closeModalEdit }) => {

    const [file, setFile] = useState(null);
    const [ArryVariables, setArryVariables] = useState(null);
    const [logos, setlogos] = useState([])
    const [dataInput, SetDataInput] = useState("");
    const [servicio, setTipoServicio] = useState('')
    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm()
    const { data, isLoading, isError, error } = useGetTipoDocumentosQuery();
    const { data: datalogos, isLoading: loandingLogos, } = useLogosActivosQuery();
    const { data: varibles, isLoading: LoandVariables, isError: ErrorVariable, error: Error } = useGetVariableActivasQuery();
    const { data: TpoServicio, isLoading: TipoServicio, isError: tipoServicioError, error: ErroTipo } = useGetTipoServicioQuery();
    const [actualizarVersion, { isLoading: loandActualizar, isError: isErrorActualizar, error: ErrorActualizar,
        data: dataResponseActualizar, isSuccess: isSuccessActualizar }] = useActualizarDocumentoMutation()
    useEffect(() => {
        if (isSuccessActualizar) {
            toast.success(`${dataResponseActualizar?.message}`);
            closeModalEdit()
        }


    }, [isSuccessActualizar, dataResponseActualizar]);
    useEffect(() => {
        if (valor) {
            reset({
                nombre: valor?.nombre_documento,
                descripcion: valor?.descripcion,
                codigo_documentos: valor?.codigo_documentos,
                fecha_emision: valor?.fecha_emision?.split("T")[0],
                version: valor?.version,
            });
        }
    }, [valor, reset]);



    const onDataChangeVersiones = (data) => {
        setArryVariables(data)
    }
    const onDataChangeLogos = (data) => {
        setlogos(data)
    }
    const HanderEnviar = (e) => {
        setFile(e.target.files[0]);
    }
    const onSubmit = async (data) => {
        const DataForm = new FormData();


        DataForm.append('nombre', data.nombre);
        DataForm.append('id_documentos', valor.id_documentos);
        DataForm.append('descripcion', data.descripcion);
        DataForm.append('codigo', data.codigo_documentos);
        DataForm.append('fecha_emision', data.fecha_emision);
        DataForm.append('servicios', servicio);
        DataForm.append('tipo_documento', dataInput);
        DataForm.append('nombre_documento_version', valor.nombre_documento_version);
        DataForm.append('idVersion', valor.idversion);
        DataForm.append('logos', JSON.stringify(logos));
        DataForm.append('version', data.version);
        DataForm.append('variables', JSON.stringify(ArryVariables));
        if (file) {
            DataForm.append('file', file);
        }
        if (logos.length > 3 || logos.length < 3) {
            toast.info('Lo siento tienes que ingresar 3 logos');
            return;
        }

        try {
            await actualizarVersion(DataForm)


        } catch (error) {
            console.log(error)
        }
    }

    if (isLoading || loandingLogos || TipoServicio || LoandVariables || loandActualizar) {
        return <p>Loading...</p>;
    }

    if (isError || tipoServicioError || ErrorVariable || isErrorActualizar) {
        return <p>Error: {error?.message || ErroTipo?.message || Error?.message
        } </p>;
    }


    return (
        <div className='w-full flex flex-col max-h-full  '>

            <form
                className='w-full max-w-4xl md:rounded-xl  max-h-full   flex flex-col '
                onSubmit={handleSubmit(onSubmit)}
            >

                <section className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6'>
                    <div className='flex w-[230px] h-[155px] flex-col '>
                        <Label>Nombre </Label>
                        <InputAtomo
                            register={register}
                            name={'nombre'}
                            erros={errors}
                            placeholder={"Nombre"}
                            id={'nombre'}
                            type={"text"}
                        />
                    </div>
                    <div className='flex w-[230px] h-[155px] flex-col'>
                        <Label>Descripcion </Label>
                        <InputAtomo
                            register={register}
                            name={'descripcion'}
                            erros={errors}
                            placeholder={"descripcion"}
                            id={'descripcion'}
                            type={"text"}
                        />
                    </div>
                    <div className='flex w-[230px] h-[155px] flex-col'>
                        <Label>Codigo </Label>
                        <InputAtomo
                            register={register}
                            name={'codigo_documentos'}
                            erros={errors}
                            placeholder={"codigo "}
                            id={'codigo_documentos'}
                            type={"text"}
                        />
                    </div>
                    <div className='flex w-[230px] h-[155px] flex-col'>
                        <CheckboxAtomo
                            value={valor?.logos}
                            disable={true}
                            data={datalogos.data}
                            items={"nombre"}
                            valor={"idLogos"}
                            onDataChange={onDataChangeLogos}
                            cantidad={2}
                        />
                    </div>
                    <div className='flex w-[230px] h-[155px] flex-col'>
                        <Label>Fecha Emision</Label>
                        <InputAtomo
                            register={register}
                            erros={errors}
                            type={'date'}
                            name={'fecha_emision'}
                            placeholder={"Fecha De Emision"}
                        />
                    </div>
                    <div className='flex w-[230px] h-[155px] flex-col'>
                        <Label>Version </Label>
                        <InputAtomo
                            isReadOnly={true}
                            register={register}
                            name={'version'}
                            erros={errors}
                            placeholder={"version"}
                            id={'version'}
                            type={"text"}
                        />
                    </div>
                    <div className='flex w-[230px] h-[155px] flex-col'>
                        <Label>Tipo De Documento</Label>
                        <SelectDocumentos
                            value={valor?.tipo_documento}
                            ValueItem={"nombreDocumento"}
                            data={data}
                            items={"idTipoDocumento"}
                            label={"Tipo Documento"}
                            onChange={(e) => SetDataInput(e.target.value)}
                        />
                    </div>

                    {dataInput == 5 &&
                        <>

                            <section className='flex w-[230px] h-[155px] flex-col '>
                                <Label>Tipo De servicio</Label>
                                <SelectDocumentos
                                    value={valor?.tipo_servicio || ""}
                                    ValueItem={"nombreServicio"}
                                    data={TpoServicio}
                                    items={"idTipoServicio"}
                                    label={"selecione TipoServicio"}
                                    onChange={(e) => setTipoServicio(e.target.value)}
                                />
                            </section>


                            <div className='w-full h-[20px]'>
                                <CheckboxAtomo
                                    value={valor?.variables}
                                    data={varibles}
                                    items={"nombre"}
                                    valor={"idVariable"}
                                    onDataChange={onDataChangeVersiones}
                                    cantidad={6}
                                />
                            </div>

                        </>
                    }




                    <div className={`flex w-[230px] h-[155px] flex-col  `} >
                        <Label>Cargar Archivo</Label>
                        <input
                            type="file"
                            name="file"
                            accept=".pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx"
                            onChange={HanderEnviar}
                            className='w-full h-[48px] border border-gray-300 rounded-md p-2'
                        />
                    </div>
                </section>
                <div className='w-full justify-end  flex '>
                    <Mybutton color={"primary"} type={'submit'} >Actualizar</Mybutton>


                </div>

            </form>
        </div>
    );
}

export default DocumentoEdit