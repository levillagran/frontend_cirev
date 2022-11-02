import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { AutoComplete } from 'primereact/autocomplete';
import { Calendar } from 'primereact/calendar';
import { RadioButton } from 'primereact/radiobutton';
import { InputSwitch } from 'primereact/inputswitch';
import { Dropdown } from 'primereact/dropdown';
import Moment from 'moment';

import ProcesamientoService from '../service/ProcesamientoService';
import EstadoService from '../service/EstadoService';
import CatalogoService from '../service/CatalogoService';

import { locale, addLocale } from 'primereact/api';

import { Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { Worker } from '@react-pdf-viewer/core';

export const Procesamiento = () => {

    let emptySample =
    {
        id: '',
        code: '',
        collectionDate: '',
        taxonomic: '',
        taxonomicId: '',
        province: '',
        provinceId: '',
        canton: '',
        cantonId: '',
        parish: '',
        parishId: '',
        latitude: null,
        longitude: null,
        gender: '',
        genderId: '',
        isPreprocessed: '',
        isAccepted: '',
        isPreprocessedId: '',
        isAcceptedId: '',
        razonNoAccepted: '',
        storageId: '',
        storage: '',
        box: '',
        year: '',
        observations: ''
    };

    let requestDetailEmpty =
    {
        id: null,
        processingResults01: '',
        observationResults01: '',
        dateResults01: '',
        processingResults02: '',
        observationResults02: '',
        dateResults02: '',
        processingResults03: '',
        observationResults03: '',
        dateResults03: ''
    };

    let requestEmpty =
    {
        id: null,
        technique01Id: '',
        kitReagent01Id: '',
        technique02Id: '',
        kitReagent02Id: '',
        technique03Id: '',
        kitReagent03Id: '',
        processingUsersId: '',
        details: []
    };

    let emptyChangeStatus =
    {
        requerimientoId: null,
        estadoId: null
    };

    const toast = useRef(null);
    const dt = useRef(null);
    const [globalFilter, setGlobalFilter] = useState(null);

    const [viewPdf, setViewPdf] = useState(null);
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    const [dateValueRequest, setDateValueRequest] = useState(null);
    const [dateValueSample, setDateValueSample] = useState(null);
    const [processingUsersId, setProcessingUsersId] = useState("");

    const [submitted, setSubmitted] = useState(false);
    const [procesamientoDialog, setProcesamientoDialog] = useState(false);
    const [pdfDialog, setPdfDialog] = useState(false);

    const [requerimientos, setRequerimientos] = useState(null);
    const [requerimientoId, setRequerimientoId] = useState(null);

    const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);

    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

    const [analisisSeleccionado, setAnalisisSeleccionado] = useState(null);

    const [especificacionSeleccionado, setEspecificacionesSeleccionado] = useState(null);

    const [tipoMuestraSeleccionado, setTipoMuestraSeleccionado] = useState(null);

    const [tecnicas, setTecnicas] = useState(null);

    const [tecnicaFiltrado, setTecnicaFiltrado] = useState([]);
    const [tecnica01Seleccionado, setTecnica01Seleccionado] = useState(null);
    const [tecnica02Seleccionado, setTecnica02Seleccionado] = useState(null);
    const [tecnica03Seleccionado, setTecnica03Seleccionado] = useState(null);

    const [reactivos01Enable, setReactivos01Enable] = useState(true);
    const [reactivos02Enable, setReactivos02Enable] = useState(true);
    const [reactivos03Enable, setReactivos03Enable] = useState(true);

    const [reactivos, setReactivos] = useState(null);
    const [reactivoFiltrado, setReactivoFiltrado] = useState([]);
    const [reactivo01Seleccionado, setReactivo01Seleccionado] = useState(null);
    const [reactivo02Seleccionado, setReactivo02Seleccionado] = useState(null);
    const [reactivo03Seleccionado, setReactivo03Seleccionado] = useState(null);

    const [request, setRequest] = useState(requestEmpty);
    const [requestDetail, setRequestDetail] = useState(requestDetailEmpty);

    const [chgStatus, setChgStatus] = useState(emptyChangeStatus);

    const [tec, setTec] = useState('1');


    useEffect(() => {
        async function getRequerimientos() {
            const reque = await ProcesamientoService.getProcesamientos();
            reque.sort((a, b) => {
                let y = a.id;
                let x = b.id;
                return (x < y) ? -1 : (x > y) ? 1 : 0;
            });
            setRequerimientos(reque);
        }
        getRequerimientos();
    }, []);

    const hideDialog = () => {
        setSubmitted(false);
        setProcesamientoDialog(false);
        setPdfDialog(false);
    }

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Procesamiento</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    const tecnicasKits = () => {
        return (
            <div>
                {tec === '1' && <div className="formgroup-inline justify-content-center">
                    <div className="col-3 formgroup-inline justify-content-between align-items-center">
                        <label htmlFor="tecnica01">Técnica</label>
                        <AutoComplete placeholder="Buscar" id="tecnica01" dropdown value={tecnica01Seleccionado} onChange={(e) => { setTecnica01SeleccionadoMetodo(e); }} suggestions={tecnicaFiltrado} completeMethod={searchTecnica} field="name" />
                        {submitted && !tecnica01Seleccionado && <small style={{ color: 'red' }}>Tecnica es requerido.</small>}
                    </div>
                    <div className="col-1"></div>
                    <div className="col-3 formgroup-inline justify-content-between align-items-center">
                        <label htmlFor="kit01">Kit/Reactivos</label>
                        <AutoComplete placeholder="Buscar" id="kit01" dropdown value={reactivo01Seleccionado}
                            disabled={reactivos01Enable} onChange={(e) => { setReactivo01SeleccionadoMetodo(e); }} suggestions={reactivoFiltrado} completeMethod={searchReactivo} field="name" />
                        {submitted && !reactivo01Seleccionado && <small style={{ color: 'red' }}>Reactivo es requerido.</small>}
                    </div></div>}
                {tec === '2' && <div className="formgroup-inline justify-content-center">
                    <div className="col-3 formgroup-inline justify-content-between align-items-center">
                        <label htmlFor="tecnica02">Técnica</label>
                        <AutoComplete placeholder="Buscar" id="tecnica02" dropdown value={tecnica02Seleccionado} onChange={(e) => { setTecnica02SeleccionadoMetodo(e); }} suggestions={tecnicaFiltrado} completeMethod={searchTecnica} field="name" />
                        
                    </div>
                    <div className="col-1"></div>
                    <div className="col-3 formgroup-inline justify-content-between align-items-center">
                        <label htmlFor="kit02">Kit/Reactivos</label>
                        <AutoComplete placeholder="Buscar" id="kit02" dropdown value={reactivo02Seleccionado}
                            disabled={reactivos02Enable} onChange={(e) => { setReactivo02SeleccionadoMetodo(e); }} suggestions={reactivoFiltrado} completeMethod={searchReactivo} field="name" />
                        
                    </div></div>}
                {tec === '3' && <div className="formgroup-inline justify-content-center">
                    <div className="col-3 formgroup-inline justify-content-between align-items-center">
                        <label htmlFor="tecnica03">Técnica</label>
                        <AutoComplete placeholder="Buscar" id="tecnica03" dropdown value={tecnica03Seleccionado} onChange={(e) => { setTecnica03SeleccionadoMetodo(e); }} suggestions={tecnicaFiltrado} completeMethod={searchTecnica} field="name" />
                        
                    </div>
                    <div className="col-1"></div>
                    <div className="col-3 formgroup-inline justify-content-between align-items-center">
                        <label htmlFor="kit03">Kit/Reactivos</label>
                        <AutoComplete placeholder="Buscar" id="kit03" dropdown value={reactivo03Seleccionado}
                            disabled={reactivos03Enable} onChange={(e) => { setReactivo03SeleccionadoMetodo(e); }} suggestions={reactivoFiltrado} completeMethod={searchReactivo} field="name" />
                        
                    </div></div>}
            </div>
        )
    }

    const saveSolicitud = () => {
        setSubmitted(true);
        async function saveRequest(request) {
            console.log(request)
            const reque = await ProcesamientoService.saveProcesamiento(request);
            reque.sort((a, b) => {
                let x = a.id;
                let y = b.id;
                return (x < y) ? -1 : (x > y) ? 1 : 0;
            });
            setRequerimientos(reque);
        }
        if (tecnica01Seleccionado && submitted && reactivo01Seleccionado) {
            setRequest(requestEmpty);
            request.id = requerimientoId;
            request.technique01Id = tecnica01Seleccionado.code;
            request.kitReagent01Id = reactivo01Seleccionado.code;
            if(tecnica02Seleccionado.code) request.technique02Id = tecnica02Seleccionado.code;
            if(reactivo02Seleccionado.code) request.kitReagent02Id = reactivo02Seleccionado.code;
            if(tecnica03Seleccionado.code) request.technique03Id = tecnica03Seleccionado.code;
            if(reactivo03Seleccionado.code) request.kitReagent03Id = reactivo03Seleccionado.code;
            const user = JSON.parse(localStorage.getItem('user'));
            if (processingUsersId === "" || processingUsersId === null) {
                request.processingUsersId = user.id;
            } else {
                request.processingUsersId = processingUsersId + "," + user.id;
            }
            let uniq = [...new Set(request.processingUsersId.split(","))]
            request.processingUsersId = uniq.join();
            products3.map((e) => {
                setRequestDetail(requestDetailEmpty);
                request.details.push({
                    "id": e.id,
                    "processingResults01": e.processingResults01,
                    "observationResults01": e.observationResults01,
                    "dateResults01": e.dateResults01,
                    "processingResults02": e.processingResults02,
                    "observationResults02": e.observationResults02,
                    "dateResults02": e.dateResults02,
                    "processingResults03": e.processingResults03,
                    "observationResults03": e.observationResults03,
                    "dateResults03": e.dateResults03,
                });
            });
            saveRequest(request);
            toast.current.show({ severity: 'success', summary: 'Exito', detail: 'Procesamiento exitoso', life: 5000 });
            setProcesamientoDialog(false);
            //setUsuario(emptyUsuraio);
        } else {
            toast.current.show({ severity: 'warn', summary: 'Aviso', detail: 'Ingrese toda la información', life: 5000 });
        }
    }

    const saveSendSolicitud = () => {
        setSubmitted(true);
        async function changeStatus(chgSt) {
            const reque = await EstadoService.changeStatus(chgSt);
            //setRequerimientos(reque);
        }
        if (tecnica01Seleccionado && submitted && reactivo01Seleccionado) {
            saveSolicitud();
            chgStatus.requerimientoId = requerimientoId;
            chgStatus.estadoId = 3;
            changeStatus(chgStatus);
            toast.current.show({ severity: 'success', summary: 'Exito', detail: 'Muestras enviadas para aprovación', life: 5000 });
            setProcesamientoDialog(false);
            //setUsuario(emptyUsuraio);
        } else {
            toast.current.show({ severity: 'warn', summary: 'Aviso', detail: 'Ingrese toda la información', life: 5000 });
        }
    }

    const searchTecnica = (event) => {
        setTimeout(() => {
            if (!event.query.trim().length) {
                setTecnicaFiltrado([...tecnicas]);
            }
            else {
                setTecnicaFiltrado(tecnicas.filter((pro) => {
                    return pro.name.toLowerCase().startsWith(event.query.toLowerCase());
                }));
            }
        }, 250);
    };

    const searchReactivo = (event) => {
        setTimeout(() => {
            if (!event.query.trim().length) {
                setReactivoFiltrado([...reactivos]);
            }
            else {
                setReactivoFiltrado(reactivos.filter((pro) => {
                    return pro.name.toLowerCase().startsWith(event.query.toLowerCase());
                }));
            }
        }, 250);
    };

    const setTecnica01SeleccionadoMetodo = (tecnica) => {
        setTecnica01Seleccionado(tecnica.value)
        setReactivo01Seleccionado('');
        async function getReactivos() {
            const reactivos = await CatalogoService.getReactivos(tecnica.value.code);
            const reac = [];
            reactivos.map((e) => {
                reac.push({ "name": e.name, "code": e.id });
            });
            setReactivos(reac);
            setReactivos01Enable(false);
        }
        getReactivos();
    }

    const setReactivo01SeleccionadoMetodo = (reactivo) => {
        setReactivo01Seleccionado(reactivo.value)
    }

    const setTecnica02SeleccionadoMetodo = (tecnica) => {
        setTecnica02Seleccionado(tecnica.value)
        setReactivo02Seleccionado('');
        async function getReactivos() {
            const reactivos = await CatalogoService.getReactivos(tecnica.value.code);
            const reac = [];
            reactivos.map((e) => {
                reac.push({ "name": e.name, "code": e.id });
            });
            setReactivos(reac);
            setReactivos02Enable(false);
        }
        getReactivos();
    }

    const setReactivo02SeleccionadoMetodo = (reactivo) => {
        setReactivo02Seleccionado(reactivo.value)
    }

    const setTecnica03SeleccionadoMetodo = (tecnica) => {
        setTecnica03Seleccionado(tecnica.value)
        setReactivo03Seleccionado('');
        async function getReactivos() {
            const reactivos = await CatalogoService.getReactivos(tecnica.value.code);
            const reac = [];
            reactivos.map((e) => {
                reac.push({ "name": e.name, "code": e.id });
            });
            setReactivos(reac);
            setReactivos03Enable(false);
        }
        getReactivos();
    }

    const setReactivo03SeleccionadoMetodo = (reactivo) => {
        setReactivo03Seleccionado(reactivo.value)
    }

    const createDoc = (rowData) => {
        async function getConprovante() {
            const comp = await ProcesamientoService.getCreateConprovante(rowData.id);
            if (comp !== null) {
                setViewPdf(comp);
            }
            else {
                setViewPdf(null);
            }
            setPdfDialog(true);
        }
        getConprovante();
    }

    const enterProcess = (request) => {
        async function getRequerimiento() {
            const req = await ProcesamientoService.getProcesamiento(request.id);
            setProyectoSeleccionado({ "name": req.areaProject, "code": req.areaProjectId });
            setRequerimientoId(request.id);
            setProcessingUsersId(req.processingUsersId);
            setAnalisisSeleccionado({ "name": req.analysis, "code": req.analysisId });
            setEspecificacionesSeleccionado({ "name": req.specification, "code": req.specificationId });
            console.log(req)
            req.technique01Id ? setTecnica01Seleccionado({ "name": req.technique01, "code": req.technique01Id }) : setTecnica01Seleccionado("");
            req.technique02Id ? setTecnica02Seleccionado({ "name": req.technique02, "code": req.technique02Id }) : setTecnica02Seleccionado("");
            req.technique03Id ? setTecnica03Seleccionado({ "name": req.technique03, "code": req.technique03Id }) : setTecnica03Seleccionado("");
            req.kitReagent01Id ? setReactivo01Seleccionado({ "name": req.kitReagent01, "code": req.kitReagent01Id }) : setReactivo01Seleccionado("");
            req.kitReagent02Id ? setReactivo02Seleccionado({ "name": req.kitReagent02, "code": req.kitReagent02Id }) : setReactivo02Seleccionado("");
            req.kitReagent03Id ? setReactivo03Seleccionado({ "name": req.kitReagent03, "code": req.kitReagent03Id }) : setReactivo03Seleccionado("");
            req.technique01Id ? setReactivos01Enable(false) : setReactivos01Enable(true);
            req.technique02Id ? setReactivos02Enable(false) : setReactivos02Enable(true);
            req.technique03Id ? setReactivos03Enable(false) : setReactivos03Enable(true);
            async function getTecnicas() {
                const tecs = await CatalogoService.getTecnicas(req.specificationId);
                const tec = [];
                tecs.map((e) => {
                    tec.push({ "name": e.name, "code": e.id });
                });
                setTecnicas(tec);
            }
            getTecnicas();
            if (req.techniqueId) {
                async function getReactivos() {
                    const reactivos = await CatalogoService.getReactivos(req.techniqueId);
                    const reac = [];
                    reactivos.map((e) => {
                        reac.push({ "name": e.name, "code": e.id });
                    });
                    setReactivos(reac);
                    setReactivos01Enable(false);
                }
                getReactivos();
            }
            setTipoMuestraSeleccionado({ "name": req.typeSample, "code": req.typeSampleId });
            setDateValueRequest(new Date(req.entryDate))
            setDateValueSample(new Date());
            setProducts2([]);
            req.details.sort((a, b) => {
                let x = a.id;
                let y = b.id;
                return (x < y) ? -1 : (x > y) ? 1 : 0;
            });
            req.details.map((e, index) => {
                products2.push({ "idNum": index + 1, ...e });
            });
            setProducts3(products2);
            setSubmitted(false);
            setProcesamientoDialog(true);
        }
        getRequerimiento();
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-filter" className="p-button-rounded p-button-success mr-1" title="Procesar" onClick={() => enterProcess(rowData)} style={{ height: '2rem', width: '2rem' }}></Button>
                {/* <Button icon="pi pi-file" className="p-button-rounded p-button-help mr-1" onClick={() => createDoc(rowData)} title="Crear documento" style={{ height: '2rem', width: '2rem' }}></Button> */}
            </div>
        );
    }

    const numberBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.number}
            </>
        )
    }

    const proyectoBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.areaProject}
            </>
        )
    }

    const analisisBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.analysis}
            </>
        )
    }

    const typeSampleBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.typeSample}
            </>
        )
    }

    const numSmplesBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.numberSamples}
            </>
        )
    }

    const reqUserBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.requerimentUser}
            </>
        )
    }

    const recepUserBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.receptionUser}
            </>
        )
    }

    const entryDateBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.entryDate}
            </>
        )
    }

    ////////////////////
    const [products2, setProducts2] = useState([]);
    const [products3, setProducts3] = useState([]);

    const onInputTextChange = (options, e) => {
        let { rowData, field, originalEvent: event } = options;
        if (e.target.value.trim().length > 0) {
            rowData[field] = e.target.value;
        }
        else
            event.preventDefault();
    }

    const setDateSeleccionadoMetodo = (options, e) => {
        setDateValueSample(e.target.value);
        options.value[options.rowIndex][options.field] = e.target.value.getDate() + '-' + (e.target.value.getMonth() + 1) + '-' + e.target.value.getFullYear();
    }

    const dateEditor = (options) => {
        return (
            <Calendar id="dateReques" showIcon showButtonBar value={dateValueSample} onChange={(e) => { setDateSeleccionadoMetodo(options, e); }}></Calendar>
        );
    }

    const textEditor = (options) => {
        return <InputText type="text" onChange={(e) => onInputTextChange(options, e)} />;
    }

    const columns01 = [
        { field: 'idNum', header: 'Nº' },
        { field: 'code', header: 'Id Muestra' },
        { field: 'dateResults01', header: 'Fecha' },
        { field: 'processingResults01', header: 'Resultado' },
        { field: 'observationResults01', header: 'Observaciones' },
    ];

    const columns02 = [
        { field: 'idNum', header: 'Nº' },
        { field: 'code', header: 'Id Muestra' },
        { field: 'dateResults02', header: 'Fecha' },
        { field: 'processingResults02', header: 'Resultado' },
        { field: 'observationResults02', header: 'Observaciones' },
    ];

    const columns03 = [
        { field: 'idNum', header: 'Nº' },
        { field: 'code', header: 'Id Muestra' },
        { field: 'dateResults03', header: 'Fecha' },
        { field: 'processingResults03', header: 'Resultado' },
        { field: 'observationResults03', header: 'Observaciones' }
    ];

    const cellEditor = (options) => {
        if (options.field === 'processingResults01' || options.field === 'processingResults02' || options.field === 'processingResults03'
            || options.field === 'observationResults01' || options.field === 'observationResults02' || options.field === 'observationResults03')
            return textEditor(options);
        else if (options.field === 'dateResults01' || options.field === 'dateResults02' || options.field === 'dateResults03')
            return dateEditor(options);
    }

    ////////////////////

    const requerimientoDialogFooter = (
        <>
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveSolicitud} />
            <Button label="Guardar y eviar para validación" icon="pi pi-check" className="p-button-text" onClick={saveSendSolicitud} />
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
        </>
    );

    addLocale('es', {
        firstDayOfWeek: 1,
        dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
        dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
        dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
        monthNames: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
        monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
        today: 'Hoy',
        clear: 'Limpiar'
    });

    locale('es');

    return (
        <div className="grid">
            <div className="col-12 xl:col-12">
                <div className="carousel-demo">
                    <div className="card">
                        <Toast ref={toast} />

                        <DataTable ref={dt} value={requerimientos} rowHover scrollable size="small"
                            dataKey="id" paginator rows={5} rowsPerPageOptions={[5, 10, 25]} className=""
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="Página {first} / {last} , {totalRecords} Requerimientos"
                            globalFilter={globalFilter} emptyMessage="Requerimientos no encontrados." header={header}>
                            <Column body={actionBodyTemplate} style={{ width: '3rem' }}></Column>
                            <Column field="number" header="Número" sortable body={numberBodyTemplate} style={{ width: '8rem' }}></Column>
                            <Column field="entryDate" header="Fecha de Registro" sortable body={entryDateBodyTemplate} style={{ width: '7rem' }}></Column>
                            <Column field="project" header="Proyecto" sortable body={proyectoBodyTemplate} style={{ width: '15rem' }}></Column>
                            <Column field="analysis" header="Análisis" sortable body={analisisBodyTemplate} style={{ width: '7rem' }}></Column>
                            <Column field="typeSample" header="Tipo de Muestra" sortable body={typeSampleBodyTemplate} style={{ width: '7rem' }}></Column>
                            <Column field="numSamples" header="Nº Muestras" sortable body={numSmplesBodyTemplate} style={{ width: '6rem' }}></Column>
                            <Column field="reqUser" header="Usuario requerente" sortable body={reqUserBodyTemplate} style={{ width: '7rem' }}></Column>
                            <Column field="recepUser" header="Usuario recepción" sortable body={recepUserBodyTemplate} style={{ width: '7rem' }}></Column>
                        </DataTable>

                        <Dialog visible={procesamientoDialog} style={{ width: '98%' }} modal className="p-fluid" footer={requerimientoDialogFooter} onHide={hideDialog}>
                            <div>
                                <div className="flex">
                                    <div className="col-2 grid justify-content-center">
                                        <img src='/assets/demo/images/galeriaSistema/proceso.jpg' width="110rem" height="180rem" />
                                    </div>
                                    <div className="col-10">
                                        <h3 className="m-0">Registro del procesamiento de muestras</h3>
                                        <div className="formgroup-inline">
                                            <div className="col-2">
                                                <label >Fecha requerimiento</label>
                                                <br />
                                                <label className="text-500">{Moment(dateValueRequest).format('DD-MM-YYYY')}</label>
                                            </div>
                                            <div className="col-4">
                                                <label >Proyecto de investigación</label>
                                                <br />
                                                {proyectoSeleccionado && <label className="text-500">{proyectoSeleccionado.name}</label>}
                                            </div>
                                            <div className="col-2">
                                                <label htmlFor="name">Analisis requerido</label>
                                                <br />
                                                {analisisSeleccionado && <label className="text-500">{analisisSeleccionado.name}</label>}
                                            </div>
                                            <div className="col-2">
                                                <label htmlFor="name">Especificación del analisis</label>
                                                <br />
                                                {especificacionSeleccionado && <label className="text-500">{especificacionSeleccionado.name}</label>}
                                            </div>
                                            <div className="col-2">
                                                <label htmlFor="name">Tipo de muestra</label>
                                                <br />
                                                {tipoMuestraSeleccionado && <label className="text-500">{tipoMuestraSeleccionado.name}</label>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mx-5">
                                    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                                        <h5 className="mt-2">Muestras</h5>
                                        <div className="formgroup-inline justify-content-end">
                                            <div className="field-radiobutton">
                                                <RadioButton inputId="tec01" name="tec" value="1" onChange={(e) => setTec(e.value)} checked={tec === '1'} />
                                                <label htmlFor="tec01">Procesamiento 01</label>
                                            </div>
                                            <div className="field-radiobutton">
                                                <RadioButton inputId="tec02" name="tec" value="2" onChange={(e) => setTec(e.value)} checked={tec === '2'} />
                                                <label htmlFor="tec02">Procesamiento 02</label>
                                            </div>
                                            <div className="field-radiobutton">
                                                <RadioButton inputId="tec03" name="tec" value="3" onChange={(e) => setTec(e.value)} checked={tec === '3'} />
                                                <label htmlFor="tec03">Procesamiento 03</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-fluid mt-2">
                                        <DataTable value={products3} editMode="cell" className="editable-cells-table" rowHover scrollable inline style={{ fontSize: '14px', textAlign: 'center' }}
                                            emptyMessage="Ninguna muestra agragada." header={tecnicasKits()}>
                                            {tec === '1' &&
                                                columns01.map(({ field, header }) => {
                                                    return <Column key={field} field={field} header={header}
                                                        style={{ width: field === 'idNum' ? '1rem' : (field === 'dateResults01'|| field === 'code') ? '3rem' : '8rem' }}
                                                        editor={(options) => cellEditor(options)} />
                                                })
                                            }
                                            {tec === '2' &&
                                                columns02.map(({ field, header }) => {
                                                    return <Column key={field} field={field} header={header}
                                                        style={{ width: field === 'idNum' ? '1rem' : (field === 'dateResults02' || field === 'code') ? '3rem' : '8rem' }}
                                                        editor={(options) => cellEditor(options)} />
                                                })
                                            }
                                            {tec === '3' &&
                                                columns03.map(({ field, header }) => {
                                                    return <Column key={field} field={field} header={header}
                                                        style={{ width: field === 'idNum' ? '1rem' : (field === 'dateResults03' || field === 'code') ? '3rem' : '8rem' }}
                                                        editor={(options) => cellEditor(options)} />
                                                })
                                            }
                                        </DataTable>
                                    </div>
                                </div>
                            </div>
                        </Dialog>
                        <Dialog visible={pdfDialog} style={{ width: '750px' }} header="Evidencia" modal className="p-fluid" onHide={hideDialog}>
                            <div className='pdf-container'>
                                {viewPdf && <><Worker workerUrl="https://unpkg.com/pdfjs-dist@2.13.216/build/pdf.worker.js">
                                    <Viewer
                                        fileUrl={viewPdf}
                                        plugins={[defaultLayoutPluginInstance]}
                                    />
                                </Worker></>}
                                {!viewPdf && <>Archivo pdf no seleccionado</>}
                            </div>
                        </Dialog>
                    </div>
                </div>
            </div>
        </div>
    );
}
