import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getCookie } from "../../../utils";


export const preciosSlice = createApi({
    reducerPath:'precios',
    baseQuery: fetchBaseQuery({
        baseUrl:import.meta.env.VITE_BASE_URL,
        headers:{
            'Content-Type': 'application/json',
            token: `${getCookie('Token')}`
        }
    }),

    endpoints:(build)=>({
        getPrecios:build.query({
            query:()=>({
                url:'precio/listar',
                method:'GET',
                headers :{
                    token: `${getCookie("Token")}`,
                },
            }),
            
            providesTags:['precios']
        }),

        registrarPrecio: build.mutation({
            query:(data)=>({
                url:'precio/registrar',
                method:'POST',
                body:data,
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
            invalidatesTags:['precios']
        }),

        actualizarPrecio: build.mutation({
            query:(data)=>({
                url:`precio/actualizar/${data.id}`,
                method:'PUT',
                headers :{
                    token: `${getCookie("Token")}`,
                },
                body:data,
            }),
            transformErrorResponse:(response,meta,arg)=>{
                return{
                    originalArg:arg,
                    error:response.data.message
                }
            },
            invalidatesTags:['precios']
        }),


        actualizarEstadoPrecio:build.mutation({
            query:(data)=>({
                url:`precio/actualizarestadoprecio/${data.id}`,
                method:'PUT',
                body:data,
                headers :{
                    token: `${getCookie("Token")}`,
                },  
            }),
            transformErrorResponse:(response,meta,arg)=>{
                return{
                    originalArg:arg,
                    error:response.data.message
                }
            },
            invalidatesTags:['precios']
        }),


        eliminarPrecio:build.mutation({
            query:(id)=>({
                url:`precio/eliminar/${id}`,
                method:'DELETE',
                headers :{
                    token: `${getCookie("Token")}`,
                },
            }),
            transformErrorResponse:(response,meta,arg)=>{
                return{
                    originalArg:arg,
                    error:response.data.message,
                }
            },
            invalidatesTags:['precios']
        })
    })
})

export const { useGetPreciosQuery, useRegistrarPrecioMutation,useActualizarEstadoPrecioMutation,useActualizarPrecioMutation,useEliminarPrecioMutation } = preciosSlice