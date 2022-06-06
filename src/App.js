import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { Route } from 'react-router-dom';

import { AppTopbar } from './AppTopbar';
import { AppFooter } from './AppFooter';
import { AppMenu } from './AppMenu';

import { Dashboard } from './pages/Dashboard';
import { DashboardMolecular } from './pages/DashboardMolecular';
import { ProfesionalesCrud } from './pages/ProfesionalesCrud';
import { IndicadoresCrud } from './pages/IndicadoresCrud';
import { SemaforizacionCrud } from './pages/SemaforizacionCrud';

import PrimeReact from 'primereact/api';

import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import 'prismjs/themes/prism-coy.css';
import './layout/flags/flags.css';
import './layout/layout.scss';
import './App.scss';

import MenuService from './service/MenuService';
import { RequerimientosMuestras } from './pages/RequerimientosMuestras';
import { Procesamiento } from './pages/Procesamiento';
import { Secuenciacion } from './pages/Secuenciacion';
import { Aprobacion } from './pages/Aprobacion';
import { ReporteProcesamiento } from './pages/ReporteProcesamiento';
import { ReporteResultados } from './pages/ReporteResultados';

const App = () => {

    const userEmpty = {
        usuario: ''
    };

    const [layoutMode, setLayoutMode] = useState('static');
    const [layoutColorMode, setLayoutColorMode] = useState('darck')
    const [inputStyle, setInputStyle] = useState('outlined');
    const [ripple, setRipple] = useState(true);
    const [staticMenuInactive, setStaticMenuInactive] = useState(false);
    const [overlayMenuActive, setOverlayMenuActive] = useState(false);
    const [mobileMenuActive, setMobileMenuActive] = useState(false);
    const [mobileTopbarMenuActive, setMobileTopbarMenuActive] = useState(false);
    let [menuIzquierda, setMenuIzquierda] = useState([]);

    const [rol, setRol] = useState('');
    const [usuario, setUsuario] = useState(userEmpty);

    PrimeReact.ripple = true;

    let menuClick = false;
    let mobileTopbarMenuClick = false;

    useEffect(() => {
        if (mobileMenuActive) {
            addClass(document.body, "body-overflow-hidden");
        } else {
            removeClass(document.body, "body-overflow-hidden");
        }
    }, [mobileMenuActive]);

    const onToggleMenuClick = (event) => {
        menuClick = true;

        if (isDesktop()) {
            if (layoutMode === 'overlay') {
                if (mobileMenuActive === true) {
                    setOverlayMenuActive(true);
                }

                setOverlayMenuActive((prevState) => !prevState);
                setMobileMenuActive(false);
            }
            else if (layoutMode === 'static') {
                setStaticMenuInactive((prevState) => !prevState);
            }
        }
        else {
            setMobileMenuActive((prevState) => !prevState);
        }

        event.preventDefault();
    }

    const onSidebarClick = () => {
        menuClick = true;
    }

    const onMobileTopbarMenuClick = (event) => {
        mobileTopbarMenuClick = true;

        setMobileTopbarMenuActive((prevState) => !prevState);
        event.preventDefault();
    }

    const onMobileSubTopbarMenuClick = (event) => {
        mobileTopbarMenuClick = true;

        event.preventDefault();
    }

    const onMenuItemClick = (event) => {
        if (!event.item.items) {
            setOverlayMenuActive(false);
            setMobileMenuActive(false);
        }
    }
    const isDesktop = () => {
        return window.innerWidth >= 992;
    }

    const menuSeccion = [];
    const menu = [];

    useEffect(() => {
        async function getMenuIz() {
            if (localStorage.getItem('user')) {
                const user = JSON.parse(localStorage.getItem('user'));
                if (user.user.length > 0) {
                    usuario.usuario = user.user;
                }
                setRol(user.roles[0]);

                async function getMenu() {
                    const response = await MenuService.getMenu(user.roles[0], user.codeModulo);
                    response.map((e) => {
                        if (!e.parentId) {
                            menuSeccion.push(e)
                        }
                    });
                    //ordena por posicion los items
                    menuSeccion.sort((a, b) => {
                        let x = a.position;
                        let y = b.position;
                        return (x < y) ? -1 : (x > y) ? 1 : 0;
                    });
                    menuSeccion.map((e) => {
                        const aux = {
                            label: e.name,
                            items: []
                        }
                        response.sort((a, b) => {
                            let x = a.position;
                            let y = b.position;
                            return (x < y) ? -1 : (x > y) ? 1 : 0;
                        });
                        response.map((f) => {
                            if (f.parentId === e.id) {
                                const aux1 = {
                                    label: f.name,
                                    icon: f.icon,
                                    to: f.href
                                }
                                aux.items.push(aux1);
                            }
                        });
                        menu.push(aux);
                    });
                    setMenuIzquierda(menu);
                }
                getMenu();

            } else {
                //window.location.href = "/";
            }
        }
        getMenuIz()
    }, [])

    const addClass = (element, className) => {
        if (element.classList)
            element.classList.add(className);
        else
            element.className += ' ' + className;
    }

    const removeClass = (element, className) => {
        if (element.classList)
            element.classList.remove(className);
        else
            element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }

    const wrapperClass = classNames('layout-wrapper', {
        'layout-overlay': layoutMode === 'overlay',
        'layout-static': layoutMode === 'static',
        'layout-static-sidebar-inactive': staticMenuInactive && layoutMode === 'static',
        'layout-overlay-sidebar-active': overlayMenuActive && layoutMode === 'overlay',
        'layout-mobile-sidebar-active': mobileMenuActive,
        'p-input-filled': inputStyle === 'filled',
        'p-ripple-disabled': ripple === false,
        'layout-theme-light': layoutColorMode === 'darck'
    });

    return (
        <div className={wrapperClass}>
            <AppTopbar user={usuario} onToggleMenuClick={onToggleMenuClick} layoutColorMode={'darck'}
                mobileTopbarMenuActive={mobileTopbarMenuActive} onMobileTopbarMenuClick={onMobileTopbarMenuClick} onMobileSubTopbarMenuClick={onMobileSubTopbarMenuClick} />

            <div className="layout-sidebar" onClick={onSidebarClick}>
                <AppMenu model={menuIzquierda} onMenuItemClick={onMenuItemClick} layoutColorMode={layoutColorMode} />
            </div>

            <div className="layout-main-container">
                <div className="layout-main">
                    <Route path="/app" exact component={rol === 'GESTOR' ? Dashboard : DashboardMolecular} />
                    <Route path="/app/requerimientosMuestras" component={RequerimientosMuestras} exact />
                    <Route path="/app/procesamiento" component={Procesamiento} exact />
                    <Route path="/app/secuenciacion" component={Secuenciacion} exact />
                    <Route path="/app/aprobacion" component={Aprobacion} exact />
                    <Route path="/app/reporteProcesamiento" component={ReporteProcesamiento} exact />
                    <Route path="/app/reporteResultados" component={ReporteResultados} exact />
                </div>
                <AppFooter layoutColorMode={layoutColorMode} />
            </div>

        </div>
    );

}

export default App;
