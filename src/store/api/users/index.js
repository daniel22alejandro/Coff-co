import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getCookie } from "../../../utils";

export const usuariosSlice = createApi({
  reducerPath: 'usuarios',
  baseQuery: fetchBaseQuery({
    baseUrl:import.meta.env.VITE_BASE_URL,
    headers:{
      'Content-Type': 'application/json',
      token:`${getCookie('Token')}`
    },
  }),

  endpoints:(build)=>({

    //LISTAR
  getUsuario: build.query({
    query:()=>({
      url:'/usuario/listar',
      method:'GET',
      headers: {
        token: `${getCookie("Token")}`,
      },
    }),
    providesTags:['usuarios']
  }),

  //LISTAR
  getRoles: build.query({
    query:()=>({
      url:'/usuario/listarroles',
      method:'GET',
      headers: {
        token: `${getCookie("Token")}`,
      },
    }),
    invalidatesTags:['usuarios'],
    providesTags:['usuarios']

  }),

  // LISTAR ID
  getUsuarioId: build.query({
    query: (id) => ({
      url: `/usuario/listarid/${id}`,
      method: 'GET',
      headers:{
        token:`${getCookie('Token')}`
      },
    }),
    transformErrorResponse: (response, meta, arg) => {
      console.log("Respuesta completa de error:", response);
      
      return {
        originalArg: arg,
        error: response?.data?.message || response?.statusText || "Error desconocido",
      };
    },
    providesTags:['usuarios']
  }),

  // LISTAR CLIENTES DANIEL
  getClientes: build.query({
    query: (id) => ({
      url: '/usuario/clientes',
      method: 'GET',
      headers:{
        token:`${getCookie('Token')}`
      },
    }),
    transformErrorResponse: (response, meta, arg) => {
      console.log("Respuesta completa de error:", response);
      
      return {
        originalArg: arg,
        error: response?.data?.message || response?.statusText || "Error desconocido",
      };
    },
    providesTags:['usuarios']
  }),

    //REGISTRAR
  registrarUsuario: build.mutation({
    query:(data)=>({
      url:'/usuario/registrar',
      method:'POST',
      body:data,
      headers:{
        token:`${getCookie('Token')}`
      },
    }),
    transformErrorResponse: (response) => {
      return {
        status: response.status,
        errors: response.data?.message || [response.data?.message || "Error desconocido"]
      };
    },
    invalidatesTags:['usuarios']
  }),

  //REGISTRAR DESDE EL LOGIN 
  registrarUsuarioLogin: build.mutation({
    query:(data)=>({
      url:'/usuario/registrarlogin',
      method:'POST',
      body:data,
      headers:{
        token:`${getCookie('Token')}`
      },
    }),
    transformErrorResponse: (response) => {
      return {
        status: response.status,
        errors: response.data?.errors || [response.data?.message || "Error desconocido"]
      };
    },
    invalidatesTags:['usuarios']
  }),

    //ACTUALIZAR
    actualizarUsuario: build.mutation({
      query: ({ data, id }) => ({
        url: `/usuario/actualizar/${id}`,
        method: 'PUT',
        body: data,
        headers: {
          token: `${getCookie("Token")}`,
        },
      }),
      transformErrorResponse: (response, meta, arg) => {
        console.log("Respuesta completa de error:", response);
        return {
          status: response.status,
          errors: response.data?.errors || [response.data?.message || "Error desconocido"]
        };
      },
      invalidatesTags: ['usuarios'],
    }),

    //ACTUALIZAR ESTADO ('ACTIVO' 'INACTIVO')
    actualizarEstado: build.mutation({
      query: (id) => ({
        url: `usuario/estado/${id}`,
        method: 'PUT',
        headers: {
          token: `${getCookie("Token")}`,
        },
      }),
      transformErrorResponse: (response, meta, arg) => {
        console.log("Respuesta completa de error:", response);
        return {
          originalArg: arg,
          error: response?.data?.message || response?.statusText || "Error desconocido",
        };
      },
      invalidatesTags: ['usuarios'],
    }),

    //ACTUALIZAR CONTRASEÑA (EN MI PERFIL)
    actualizarContra: build.mutation({
      query: ({data, id}) => ({
        url: `usuario/contra/${id}`,
        method: 'PUT',
        body: data,
        headers: {
          token: `${getCookie("Token")}`,
        },
      }),
      transformErrorResponse: (response, meta, arg) => {
        console.log("Respuesta completa de error:", response);
        return {
          originalArg: arg,
          error: response.data.message || "Error desconocido",
        };
      },
      invalidatesTags: ['usuarios'],
    }),

    //ELIMINAR
   eliminarUsuario:build.mutation({
    query:(id)=>({
      url:`/usuario/eliminar/${id}`,
      method:'DELETE',
      headers: {
        token: `${getCookie("Token")}`,
      },
    }),
    transformErrorResponse:(response,meta,arg)=>{
      return{
        originalArg: arg,
        error: response.data.message,
      }
    },
    invalidatesTags:['usuarios']
  })

  })

})

export const {useGetUsuarioQuery, useGetRolesQuery, useGetUsuarioIdQuery,useRegistrarUsuarioMutation, useRegistrarUsuarioLoginMutation,
  useActualizarUsuarioMutation,useEliminarUsuarioMutation,useActualizarEstadoMutation,
  useActualizarContraMutation, useGetClientesQuery, useGetClienteRolQuery} = usuariosSlice
