import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getCookie } from "../../../utils";

export const usuariosSlice = createApi({
  reducerPath: 'usuarios',
  baseQuery: fetchBaseQuery({
    baseUrl:import.meta.env.VITE_BASE_URL,
    headers:{
      'Content-Type': 'application/json',
      token:`${getCookie('authToken')}`
    },
  }),

  endpoints:(build)=>({

    //LISTAR
  getUsuario: build.query({
    query:()=>({
      url:'http://localhost:3000/api/usuario/listar',
      method:'GET',
    }),
    providesTags:['usuarios']
  }),
   
    //REGISTRAR
  registrarUsuario: build.mutation({
    query:(data)=>({
      url:'http://localhost:3000/api/usuario/registrar',
      method:'POST',
      body:data,
    }),
    transformErrorResponse:(response,meta,arg)=>{
      return{
        originalArg:arg,
        error:response.data.message,
      }
    },
    invalidatesTags:['usuarios']
  }),

    //ACTUALIZAR
    actualizarUsuario: build.mutation({
      query: ({ data, id }) => ({
        url: `http://localhost:3000/api/usuario/actualizar/${id}`,
        method: 'PUT',
        body: data,
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

    //ELIMINAR
  eliminarUsuario:build.mutation({
    query:(id)=>({
      url:`http://localhost:3000/api/usuario/eliminar/${id}`,
      method:'DELETE',
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

export const {useGetUsuarioQuery,useRegistrarUsuarioMutation,useActualizarUsuarioMutation,useEliminarUsuarioMutation} = usuariosSlice
