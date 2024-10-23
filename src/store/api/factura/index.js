import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getCookie } from "../../../utils";


export const facturasApi = createApi({
    reducerPath: "facturas",
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_BASE_URL,
        headers: {
            "Content-Type": "application/json",
            token: `${getCookie("Token")}`,
        },
    }),
    endpoints: (build) => ({
        GeneraFactura: build.mutation({
            query: (data) => ({
                url: "facturas/generar",
                method: "POST",
                body: data,
                headers: {
                    token: `${getCookie("Token")}`,
                  },
            }),
            providesTags: ["Facturas"],
        }),
        GeneraFacturaAlquiler: build.mutation({
            query: (data) => ({
                url: "facturas/alquiler",
                method: "POST",
                body: data,
                headers: {
                    token: `${getCookie("Token")}`,
                  },
            }),
            transformErrorResponse: (response, arg) => {
                return {
                    originalArg: arg,
                    error: response?.data?.message,
                };
            },
            providesTags: ["Facturas"],
        }),
    })
})



export const { useGeneraFacturaMutation, useGeneraFacturaAlquilerMutation } = facturasApi;