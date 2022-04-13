import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { Carousel } from 'primereact/carousel';
import { Dialog } from 'primereact/dialog';
import { OrganizationChart } from 'primereact/organizationchart';
import { ProgressBar } from 'primereact/progressbar';

import DashboardService from '../service/DashboardService';

import '../css/Dashboard.css';

export const Dashboard = () => {

    const numComEmpty = {
        numMenuAdd: null,
        numUsuarios: null,
        numComponentes: null,
        numEjes: null,
        numIndicadores: null, 
    };

    const responsiveOptions = [
        {
            breakpoint: '1024px',
            numVisible: 3,
            numScroll: 3
        },
        {
            breakpoint: '600px',
            numVisible: 2,
            numScroll: 2
        },
        {
            breakpoint: '480px',
            numVisible: 1,
            numScroll: 1
        }
    ];

    const [componentes, setComponentes] = useState([]);
    const [componenteDialog, setComponenteDialog] = useState(false);
    const [selection, setSelection] = useState([]);
    const [componente, setComponente] = useState([]);

    const [numMunis, setNumMunis] = useState(numComEmpty);
    const [porcentajes, setPorcentajes] = useState([]);

    useEffect(() => {
        async function getCompos() {
            const comps = await DashboardService.getComponentes();
            setComponentes(comps);
        }
        getCompos();
        async function getNumMunis() {
            const munis = await DashboardService.getNumMuni();
            numMunis.numMuniAdd = munis.numMuniAdd;
            numMunis.numUsuarios = munis.numUsuarios;
            numMunis.numComponentes = munis.numComponentes;
            numMunis.numEjes = munis.numEjes;
            numMunis.numIndicadores = munis.numIndicadores;
        }
        getNumMunis();
        async function getPorcen() {
            const porcen = await DashboardService.getPocentages();
            setPorcentajes(porcen);
        }
        getPorcen();
    }, []);

    const componentesTemplate = (comp) => {
        return (
            <div className="product-item">
                <div className="product-item-content">
                    <img src={`/assets/layout/images/componentes/${comp.image}`} alt={comp.name} width={'90'} />
                    <div>
                        <h6 className="m-1">{comp.name}</h6>
                        <div className="car-buttons mt-2">
                            <Button icon="pi pi-eye" className="p-button-warning p-button-rounded" onClick={e => verComponente(comp.id)} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const verComponente = (id) => {
        async function getCompo() {
            const comp = await DashboardService.getComponente(id);
            setComponente(comp);
            setComponenteDialog(true);

        }
        getCompo();
    }

    const hideDialog = () => {
        setComponenteDialog(false);
    }

    const nodeTemplate = (node) => {
        if (node.type === "componente") {
            return (
                <div>
                    <div className="componente">{node.label}</div>
                    <div className="node-content">
                        <img alt={node.data.avatar} src={`/assets/layout/images/componentes/${node.data.image}`} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} style={{ width: '80px' }} />
                        <div>{node.data.name}</div>
                    </div>
                </div>
            );
        }

        if (node.type === "eje") {
            return <div>Eje.- {node.label}</div>;
        }

        if (node.type === "indicador") {
            return (
                <div>
                    <div className="indicador">Indicador.- {node.label}</div>
                    <div className="mt-2">
                        <div>{node.data.name}</div>
                    </div>
                </div>
            );
        }
    };

    const ListaMunicipios = () => (
        <ul className="list-none">
            {porcentajes.map(item => (
                <li key={item.id} className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-3">
                    <div>
                        <span className="text-900 font-medium mr-2 mb-1 md:mb-0">{item.name}</span>
                    </div>
                    <div className="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                        <div className="surface-500 border-round overflow-hidden w-10rem lg:w-17rem" >
                        <ProgressBar value={item.porcentaje} color='#09C3DA'></ProgressBar>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    );

    return (
        <div className="grid">
            <div className="col-12 xl:col-12 ">
                <div className="carousel-demo">
                    <div className="card">
                        <Carousel value={componentes} numVisible={4} numScroll={1} responsiveOptions={responsiveOptions} className="custom-carousel" circular
                            autoplayInterval={2000} itemTemplate={componentesTemplate} header={<h5>Componentes</h5>} />
                    </div>
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Componentes</span>
                            <div className="text-900 font-medium text-xl">{numMunis.numComponentes}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-orange-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-forward text-orange-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-500">Objetivos claves del trabajo</span>
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Ejes</span>
                            <div className="text-900 font-medium text-xl">{numMunis.numEjes}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-indigo-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-angle-double-right text-indigo-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-500">Líneas de acción</span>
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Identificadores</span>
                            <div className="text-900 font-medium text-xl">{numMunis.numIndicadores}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-pink-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-chevron-right text-pink-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-500">Evidencias del trabajo</span>
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Profesionales</span>
                            <div className="text-900 font-medium text-xl">{numMunis.numUsuarios}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-user-plus text-blue-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-500">Profecionales de los municipios</span>
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Municipios Adheridos</span>
                            <div className="text-900 font-medium text-xl">{numMunis.numMuniAdd}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-green-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-check-circle text-green-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-500">Municipios con carta de intención</span>
                </div>
            </div>
            <div className="col-12 xl:col-9">
                <div className="card">
                    <div className="flex justify-content-between align-items-center">
                        <h5>Porcentage de avance</h5>
                    </div>
                    <div className="flex justify-content-between align-items-center ml-4">
                        <div className="mt-1 text-600 mr-2 ">Municipio</div>
                        <div className="mt-1 text-600 mr-2 ">Porcentaje</div>
                    </div>
                    <ListaMunicipios />
                </div>
            </div>
            <Dialog visible={componenteDialog} header="Componente" modal className="p-fluid" onHide={hideDialog} style={{ width: '90%' }} >
                <div className="organizationchart-demo">
                    <OrganizationChart value={componente} nodeTemplate={nodeTemplate} selection={selection} selectionMode="multiple"
                        onSelectionChange={event => setSelection(event.data)} className="company"></OrganizationChart>
                </div>
            </Dialog>
        </div>
    );
}
