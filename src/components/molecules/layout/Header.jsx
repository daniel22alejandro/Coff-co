import React, { useState, useRef, useContext } from "react";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import Cookies from 'js-cookie';
import usuarioImagen from "../../../../public/usuario.png";
import SelectDocumentos from "../../atoms/SelectDocumentos";
import { TraslateContex } from "../../../context/TranslationoContex";
import { useTranslation } from "react-i18next";
import { MdOutlineGTranslate } from "react-icons/md";

const Header = ({ color }) => {

    const { cerrarSesion } = useContext(AuthContext); //LLAMDO DEL CONTEXTO
    const navigate = useNavigate();

    //CIERRE DE SESION UTILIZANDO FUNCION DEL CONTEXTO
    const handleLogout = () => {
        cerrarSesion();
    };

    //MANEJO DE CIERRE Y APERTURA DEL MENU DE PERFIL
    const [open, setOpen] = useState(false);
    const { t } = useTranslation();
    const { changeLanguage, language } = useContext(TraslateContex);
    const menuRef = useRef();
    const imgRef = useRef();
    window.addEventListener("click", (e) => {
        if (e.target !== menuRef.current && e.target !== imgRef.current) {
            setOpen(false);
        }
    });
    const idioma = [
        { value: "en", label: t("ingles") },
        { value: "es", label: t("espanol") },
    ];

    //OPCIONES DEL MENU Y NAVEGACION
    const Menus = [
        t("miPerfil"),
        t("logos"),
        t("ayuda"),
        t("salir")
    ];
    
    const handleMenuClick = (menu) => {
        setOpen(false);
    
        switch (menu) {
            case t("miPerfil"):
                navigate("/perfil");
                break;
            case t("logos"):
                navigate("/logos");
                break;
            case t("ayuda"):
                navigate("/ayuda");
                break;
            case t("salir"):
                handleLogout();
                navigate("/");
                break;
            default:
                break;
        }
    };

    return (
        <>
            <header className={`inset-x-0 top-0 pl-2 pr-4 ${color} z-50`}>
                <nav className="flex items-center justify-between " aria-label="Global" >
                    <div className="flex lg:flex-1">
                        <figure className="h-16 w-16 flex items-center justify-between">
                            <LazyLoadImage
                                src={"/logo-sena-verde.jpg"}
                                className="h-10 w-full pl-2"
                                effect="opacity"
                                alt="logo-sena"
                            /> |
                        </figure>
                       
                        <figure className="h-16 w-18 ml-1 flex items-center justify-between">
                            <LazyLoadImage
                                src={"/logotics.jpeg"}
                                className="h-14 w-full cursor-pointer"
                                effect="opacity"
                                alt="logo-sena"
                            /> 
                        </figure>
                        
                        {/* <div className="flex justify-center items-center font-semibold ml-2 text-3xl">
                           Coffco
                        </div> */}
                    </div>

                    <div className="w-[200px]">
                        <SelectDocumentos
                            value={language}
                            data={idioma}
                            items={"value"}
                            label={<MdOutlineGTranslate size={28} />}
                            ValueItem={"label"}
                            onChange={(e) => changeLanguage(e.target.value)}
                        />
                    </div>

                    <div className="relative">
                        <i  ref={imgRef}
                            onClick={() => setOpen(!open)}
                            className="bi bi-person-circle cursor-pointer text-4xl pl-3">
                        </i>
                        {open && (
                            <div ref={menuRef} className="bg-white p-3 w-40 shadow-lg absolute -left-32 top-16 ">
                                <ul>
                                    {Menus.map((menu) => (
                                        <li className="p-2 text-lg cursor-pointer rounded hover:bg-blue-100"
                                            key={menu}
                                            onClick={() => handleMenuClick(menu)}
                                        >
                                        {menu}
                                        </li>
                                    ))}
                                </ul>
                            </div>)}
                    </div>
                </nav>
            </header>
        </>
    );
};

export default Header;
