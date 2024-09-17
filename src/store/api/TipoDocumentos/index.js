import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getCookie } from "../../../utils";

export const TipoDocumento = createApi({
    reducerPath: "tipodocumento",
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_BASE_URL,
        headers: {
            "Content-Type": "application/json",
            token: `${getCookie("authToken")}`,
        },
    }),

    endpoints: (build) => ({
        //listar Tipo documentos
        GetTipoDocumentos: build.query({
            query: () => ({
                url: "tipodocumento/listar",
                method: "GET",
                headers: {
                    token: `${getCookie("authToken")}`,
                },
            }),
            providesTags: ['TipoDocumento']
        }),

        //crear Tipo documento
        CrearTipoDocumento: build.mutation({
            query: (data) => ({
                url: "tipodocumento/registrar",
                method: "POST",
                body: data,
                headers: {
                    token: `${getCookie("authToken")}`,
                },
            }),
            transformErrorResponse: (response) => ({
                error: response.data.message,
            }),
            invalidatesTags: ["TipoDocumento"],
        }),

        //actualizar Tipo documento
        ActualizarTipoDocumento: build.mutation({
            query: (data) => ({
                url: `tipodocumento/actualizar/${data.id}`,
                method: "PUT",
                body: data,
                headers: {
                    token: `${getCookie("authToken")}`,
                },
            }),
            transformErrorResponse: (response) => ({
                error: response.data.message,
            }),
            invalidatesTags: ["TipoDocumento"],
        }),

        //cambiar el estado del tipoDocumento
        UpdateEstadoTipoDocumento: build.mutation({
            query: (data) => ({
                url: `tipodocumento/estado/${data.id}`,
                method: "PUT",
                body: { estado: data.estado }, // Asegúrate de enviar el estado en el cuerpo
                headers: {
                    token: `${getCookie("authToken")}`,
                },
            }),
            invalidatesTags: ["TipoDocumento"],
        }),

        //eliminar Tipo documento
        EliminarTipoDocumento: build.mutation({
            query: (id) => ({
                url: `tipodocumento/eliminar/${id}`,
                method: "DELETE",
                headers: {
                    token: `${getCookie("authToken")}`,
                },
            }),
            transformErrorResponse: (response) => ({
                error: response.data.message,
            }),
            invalidatesTags: ["TipoDocumento"],
        }),
    }),
});

export const {
    useActualizarTipoDocumentoMutation,
    useCrearTipoDocumentoMutation,
    useEliminarTipoDocumentoMutation,
    useGetTipoDocumentosQuery,
    useUpdateEstadoTipoDocumentoMutation
} = TipoDocumento;
