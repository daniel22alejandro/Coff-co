import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getCookie } from "../../../utils";

export const AlquilerSlice=createApi({
    reducerPath:"alquiler",
    baseQuery:fetchBaseQuery({
        baseUrl: import.meta.env.VITE_BASE_URL,
        headers: {
          "Content-Type": "application/json",
          token: `${getCookie("Token")}`
        }
    }),
    endpoints:(build)=>({
        //listar alquiler
        getAlquiler:build.query({
            query:()=>({
                url:'alquiler/listar',
                method:'GET',
                headers: {
                    token: `${getCookie("Token")}`,
                  },
            }),
            providesTags:['alquiler']
        }),

        //registrar alquiler
        registrarAlquiler:build.mutation({
            query:(data)=>({
                url:'alquiler/registrar',
                method:'POST',
                body:data,
                headers: {
                    token: `${getCookie("Token")}`,
                  },
            }),
            transformErrorResponse:(response,meta,arg)=>{
                return{
                    originalArg:arg,
                    error:response.data.message
                }
            },
            invalidatesTags:['alquiler']
        }),

        // listar usuarios para  alquiler
        getUsuariosAlquiler: build.query({
            query:()=>({
                url:'alquiler/listarus',
                method: 'GET',
                headers: {
                    token: `${getCookie("Token")}`,
                  },
            }),
            providesTags:['alquiler']
        }),

        // actualizar reserva 
        actualizarAlquiler: build.mutation({
            query:(data)=>({
                url:`alquiler/actualizar/${data.id}`,
                method:'PUT',
                body:data,
                headers: {
                    token: `${getCookie("Token")}`,
                  },
            }),
            transformErrorResponse:(response,meta,arg)=>{
                return{
                    originalArg:arg,
                    error:response.data.message
                }
            },
            invalidatesTags:['alquiler']
        }),

        //eliminar reserva 
        eliminarAlquiler:build.mutation({
            query:(id)=>({
                url:`alquiler/eliminar/${id}`,
                method:'DELETE',
                headers: {
                    token: `${getCookie("Token")}`,
                  },
            }),
            transformErrorResponse:(response,meta,arg)=>{
                return{
                    originalArg:arg,
                    error:response.data.message,
                }
            },
            invalidatesTags:['alquiler']
        })

    })
})

export const {useGetAlquilerQuery, useRegistrarAlquilerMutation, useGetUsuariosAlquilerQuery, useActualizarAlquilerMutation, useEliminarAlquilerMutation} = AlquilerSlice;






