import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getCookie } from "../../../utils";

export const TipoServicioApi = createApi({
    reducerPath: "tiposervicio",
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_BASE_URL,
        headers: {
            "Content-Type": "application/json",
            token: `${getCookie("Token")}`,
        },
    }),
    endpoints: (build) => ({
        GetTipoServicio: build.query({
            query: () => ({
                url: "tiposervicio/listar",
                method: "GET",
                headers: {
                    token: `${getCookie("Token")}`,
                },
            }),
            providesTags: ['TipoServicio']
        }),


        GetTipoServicioActivo: build.query({
            query: () => ({
                url: "tiposervicio/listarTipoServActivos",
                method: "GET",
                headers: {
                    token: `${getCookie("Token")}`,
                },
            }),
            providesTags: ['TipoServicio']
        }),



        PostTipoServicio: build.mutation({
            query: (data) => ({
                url: "tiposervicio/registrar",
                method: "POST",
                body: data,
                headers: {
                    token: `${getCookie("Token")}`,
                },
            }),
            transformErrorResponse: (response) => ({
                error: response.data.message,
            }),
            invalidatesTags: ["TipoServicio"],
        }),


        PutTipoServicio: build.mutation({
            query: (data) => ({
                url: `tiposervicio/actualizar/${data.id}`,
                method: "PUT",
                body: data,
                headers: {
                    token: `${getCookie("Token")}`,
                },
            }),
            transformErrorResponse: (response) => ({
                error: response.data.message,
            }),
            invalidatesTags: ["TipoServicio"],
        }),


        UpdateEstadoTipoServicio: build.mutation({
            query: (data) => ({
                url: `tiposervicio/estado/${data.id}`,
                method: "PUT",
                body: { estado: data.estado }, // Asegúrate de enviar el estado en el cuerpo
                headers: {
                    token: `${getCookie("Token")}`,
                },
            }),
            invalidatesTags: ["TipoServicio"],
        }),
        validarServcioDocumento: build.mutation({
            query: (data) => (
                console.log(data), {
                    url: `tipoServicio/validarTiposervicio`,
                    method: "POST",
                    body: data,
                    headers: {
                        token: `${getCookie("Token")}`,
                    },

                }),
            invalidatesTags: ["TipoServicio"],
        }),
        TipoServicioActivo: build.query({
            query: () => (
                {
                    url: `tipoServicio/listarActivo`,
                    method: "GET",
                    headers: {
                        token: `${getCookie("Token")}`,
                    },

                }),
            invalidatesTags: ["TipoServicio"],
        })



    }),
});

export const { useGetTipoServicioQuery, usePostTipoServicioMutation,
    usePutTipoServicioMutation, useUpdateEstadoTipoServicioMutation, 
    useValidarServcioDocumentoMutation,useTipoServicioActivoQuery, useGetTipoServicioActivoQuery } = TipoServicioApi;
