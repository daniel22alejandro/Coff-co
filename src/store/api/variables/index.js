import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getCookie } from "../../../utils";

export const VariablesApi = createApi({
  reducerPath: "variables",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
    headers: {
      "Content-Type": "application/json",
      token: `${getCookie("Token")}`,
    },
  }),
  endpoints: (build) => ({
    //listar variables
    getVariables: build.query({
      query: () => ({
        url: "variables/listar",
        method: "GET",
        headers :{
            token: `${getCookie("Token")}`,
        },
      }),
      
      providesTags: ["Variable"],
    }),
    getVariableActivas: build.query({
      query: () => ({
        url: "variables/listaActivas",
        method: "GET",
      }),
      providesTags: ["Variable"],
    }),
    //crear variable
    crearVariable: build.mutation({
      query: (data) => ({
        url: "variables/registrar",
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
          token: `${getCookie("Token")}`,
        },
      }),
      transformErrorResponse: (response, meta, arg) => {
        return {
          originalArg: arg,
          error: response.data.message,
        };
      },
      invalidatesTags: ["Variable"],
    }),
    //editar variable
    editarVariable: build.mutation({
      query: (data) => ({
        url: `variables/actualizar/${data.id}`,
        method: "PUT",
        body: data,
        headers: {
          token: `${getCookie("Token")}`,
      },
      }),
      transformErrorResponse: (response, meta, arg) => {
        return {
          originalArg: arg,
          error: response.data.message,
        };
      },
      invalidatesTags: ["Variable"],
    }),
    updateEstado: build.mutation({
      query: (data) => ({
        url: `variables/estado/${data.id}`,
        method: "PUT",
        body: data,
        headers: {
          token: `${getCookie("Token")}`,
      },
      }),

      invalidatesTags: ["Variable"],
    }),
    //eliminar variable
    eliminarVariable: build.mutation({
      query: (id) => ({
        url: `variables/eliminar/${id}`,
        method: "DELETE",
        headers: {
          token: `${getCookie("Token")}`,
      },
      }),
      transformErrorResponse: (response, meta, arg) => {
        return {
          originalArg: arg,
          error: response.data.message,
        };
      },
    }),
  }),
});

export const {
  useCrearVariableMutation,
  useEditarVariableMutation,
  useGetVariablesQuery,
  useEliminarVariableMutation,
  useUpdateEstadoMutation,
  useGetVariableActivasQuery,
} = VariablesApi;
