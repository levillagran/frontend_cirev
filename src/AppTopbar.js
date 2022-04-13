import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { Menu } from 'primereact/menu';
import { Toast } from 'primereact/toast';
import { confirmPopup } from 'primereact/confirmpopup';

import AuthService from './service/auth.service';

export const AppTopbar = (props) => {
    const menu = useRef(null);
    const toast = useRef(null);

    const overlayMenuItems = [
        {
            label: 'Cerrar sesión',
            icon: 'pi pi-fw pi-power-off',
            command: (event) => {
                confirmPopup({
                    target: event.currentTarget,
                    message: 'Desea cerrar sesión?',
                    icon: 'pi pi-exclamation-triangle',
                    accept,
                    reject
                });
            }
        }
    ];

    const toggleMenu = (event) => {
        menu.current.toggle(event);
    };

    const accept = () => {
        AuthService.logout()
        window.location.href = "/";
        toast.current.show({ severity: 'info', summary: 'Confirmado', detail: 'Cierre de sesión sadisfactorio', life: 5000 });
    };

    const reject = () => {
        toast.current.show({ severity: 'error', summary: 'Cancelado', detail: 'No cerró sesión', life: 3000 });
    };

    return (
        <div className="layout-topbar">
            <Toast ref={toast} />
            <Link to="/app" className="layout-topbar-logo">
                <img src={'assets/layout/images/lgc_topBar.jpg'} alt="logo" />
                <span>CIREV | MOLECULAR</span>
            </Link>
            <button type="button" className="p-link  layout-menu-button layout-topbar-button" onClick={props.onToggleMenuClick}>
                <i className="pi pi-bars" />
            </button>

            <button type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={props.onMobileTopbarMenuClick}>
                <i className="pi pi-ellipsis-v" />
            </button>

            <ul className={classNames("layout-topbar-menu lg:flex origin-top", { 'layout-topbar-menu-mobile-active': props.mobileTopbarMenuActive })}>
                <li>
                    <div className=" mt-3 ml-6">
                        <span className="text-900 font-medium">Usuario: <span className="mt-1 text-600 mr-2 ">{props.user.usuario}</span></span>
                    </div>
                </li>
                <li>
                    <button className="p-link layout-topbar-button" onClick={toggleMenu}  >
                        <i className="pi pi-user" />
                        <span>Perfil</span>
                    </button>
                    <Menu model={overlayMenuItems} ref={menu} popup />
                </li>
            </ul>
        </div>
    );
}
