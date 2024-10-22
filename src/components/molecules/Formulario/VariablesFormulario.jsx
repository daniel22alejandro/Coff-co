import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import InputAtomo from "../../atoms/Input";
import SelectAtomo from "../../atoms/Select";
import {
  useCrearVariableMutation,
  useEditarVariableMutation,
} from "../../../store/api/variables";
import Mybutton from "../../atoms/Mybutton";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";


const VariablesFormulario = ({ closeModal, dataValue }) => {
  const { t } = useTranslation();

  const [tipoDato, setTipoDato] = useState("");
  const [unidadadMedida, setUnidadMedida] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();
  const [
    crearVariable,
    { isError, error, data: dataResponse, isSuccess },
  ] = useCrearVariableMutation();
  const [
    editarVariable,
    {
      isLoading: isLoadingEdit,
      isError: isErrorEdit,
      error: errorEdit,
      data: dataResponseEdit,
      isSuccess: isSuccessEdit,
    },
  ] = useEditarVariableMutation();
  const hadleEdit = async (data) => {
    try {
      if (data) {
        await editarVariable({
          id: dataValue.idVariable,
          nombre: data.nombre,
          tipo_dato: tipoDato,
          UnidadMedida: unidadadMedida

        });
      }
    } catch (error) { }
  };
  useEffect(() => {
    if (isError) {
      toast.error(`${error.error}`);
    }
    if (isErrorEdit) {
      toast.error(`${errorEdit.error}`);
    }
    if (dataValue) {
      reset({ nombre: dataValue.nombre });
      setUnidadMedida(dataValue.UnidadMedida);
      setTipoDato(dataValue.tipo_dato);
    } else {
      reset();
    }

    if (isSuccess || isSuccessEdit) {
      toast.success(`${dataResponse?.message || dataResponseEdit?.message}`);
      closeModal();
    }

  }, [dataValue, dataResponse, setValue, isSuccess, isSuccessEdit, isError, isErrorEdit]);

  console.log(dataValue);
  const onsubmit = async (data) => {
    console.log(data);
    try {
      if (!tipoDato) {
        toast.error("El tipo de dato es obligatorio");
      }
      if (data) {
        await crearVariable({
          nombre: data.nombre,
          tipo_dato: tipoDato,
          UnidadMedida: unidadadMedida
        });
      }
    } catch (error) {
      toast.error("Error al crear la variable");
    }
  };
  const TipoDatos = [
    { value: "text", label: "texto" },
    { value: "number", label: "Numeros" },
    { value: "date", label: "Fechas" },
  ];
  const UnidadadMedidas = [
    { value: "Lb", label: "Libras" },
    { value: "Kg", label: "Kilogramos" },
    { value: "N/A", label: "N/A" },
    { value: "G", label: "Gramos" },
    { value: "%", label: "Porcentaje" },
  ];

  return (
    /* data, label, onChange, items, ValueItem, value */
    <section className="w-full overflow-auto  justify-center items-center flex">
      <form
        onSubmit={handleSubmit(dataValue ? hadleEdit : onsubmit)}
        className="  flex flex-col  justify-between gap-16"
      >
        <div className="flex w-[230px] h-[155px]   flex-col gap-5 ">
          <InputAtomo
            name={"nombre"}
            erros={errors}
            placeholder={t("nombre")}
            register={register}
            type={"text"}
            id={"nombre"}
          />
          <SelectAtomo
            value={tipoDato}
            data={TipoDatos}
            items={"value"}
            label={t("tipoDeDatos")}
            ValueItem={"label"}
            onChange={(e) => setTipoDato(e.target.value)}
          />
          <SelectAtomo
            value={unidadadMedida}
            data={UnidadadMedidas}
            items={"value"}
            label={t("unidadMedida")}
            ValueItem={"label"}
            onChange={(e) => setUnidadMedida(e.target.value)}
          />
        </div>
        <div className="flex w-[230px]  flex-col ">
          <Mybutton type={"onsubmit"} color={"primary"}>
            {dataValue ? t("actualizar") : t("registrar")}
          </Mybutton>
        </div>
      </form>
    </section>
  );
};

export default VariablesFormulario;
