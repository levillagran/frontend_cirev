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

import AprobacionService from '../service/AprobacionService';
import EstadoService from '../service/EstadoService';
import CatalogoService from '../service/CatalogoService';

import { locale, addLocale } from 'primereact/api';

import { Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { Worker } from '@react-pdf-viewer/core';

export const Aprobacion = () => {

    let requestDetailEmpty =
    {
        id: null,
        primer: '',
        sequence: '',
        concentration: '',
        isFasta: '',
        quality: null,
        identity: null,
        organism: ''
    };

    let requestEmpty =
    {
        id: null,
        shippingDate: '',
        receptionDate: '',
        observationShipping: '',
        observationReception: '',
        processingUsersId: '',
        details: []
    };

    let condiciones = [
        { name: 'Sí', code: true },
        { name: 'No', code: false }
    ];

    let emptyChangeStatus =
    {
        userId: null,
        requerimientoId: null,
        estadoId: null
    };

    const toast = useRef(null);
    const dt = useRef(null);
    const [globalFilter, setGlobalFilter] = useState(null);

    const [viewPdf, setViewPdf] = useState(null);
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    const [dateValueRequest, setDateValueRequest] = useState(null);
    const [dateValueShipp, setDateValueShipp] = useState(null);
    const [dateValueShippAux, setDateValueShippAux] = useState(null);
    const [dateValueRecep, setDateValueRecep] = useState(null);
    const [processingUsersId, setProcessingUsersId] = useState("");
    const [isSequence, setIsSequence] = useState(false);

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
    const [tecnicaSeleccionado, setTecnicaSeleccionado] = useState(null);

    const [reactivosEnable, setReactivosEnable] = useState(true);
    const [reactivos, setReactivos] = useState(null);
    const [reactivoFiltrado, setReactivoFiltrado] = useState([]);
    const [reactivoSeleccionado, setReactivoSeleccionado] = useState(null);

    const [request, setRequest] = useState(requestEmpty);
    const [requestDetail, setRequestDetail] = useState(requestDetailEmpty);

    const [isShipping, setIsShipping] = useState(true);
    const [obsShipp, setObsShipp] = useState('');
    const [obsRecep, setObsRecep] = useState('');
    const [aceptadoSeleccionado, setAceptadoSeleccionado] = useState(null);

    const [chgStatus, setChgStatus] = useState(emptyChangeStatus);

    useEffect(() => {
        async function getRequerimientos() {
            const user = JSON.parse(localStorage.getItem('user'));
            const reque = await AprobacionService.getAprobaciones(user.id);
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
            <h5 className="m-0">Validación</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    const saveSolicitud = () => {
        setSubmitted(true);
        async function changeStatus(chgSt) {
            const reque = await EstadoService.changeStatusValidator(chgSt);
            setRequerimientos(reque);
        }
        if (submitted) {
            const user = JSON.parse(localStorage.getItem('user'));
            chgStatus.userId = user.id;
            chgStatus.requerimientoId = requerimientoId;
            chgStatus.estadoId = 4;
            changeStatus(chgStatus);
            toast.current.show({ severity: 'success', summary: 'Exito', detail: 'Muestras validadas', life: 5000 });
            setProcesamientoDialog(false);
            //setUsuario(emptyUsuraio);
        } else {
            toast.current.show({ severity: 'warn', summary: 'Aviso', detail: 'Ingrese toda la información', life: 5000 });
        }
    }

    const saveReplaySolicitud = () => {
        setSubmitted(true);
        async function changeStatus(chgSt) {
            const reque = await EstadoService.changeStatusValidator(chgSt);
            setRequerimientos(reque);
        }
        if (submitted) {
            const user = JSON.parse(localStorage.getItem('user')); 
            chgStatus.userId = user.id;
            chgStatus.requerimientoId = requerimientoId;
            chgStatus.estadoId = 2;
            changeStatus(chgStatus);
            toast.current.show({ severity: 'success', summary: 'Exito', detail: 'Muestras validadas', life: 5000 });
            setProcesamientoDialog(false);
            //setUsuario(emptyUsuraio);
        } else {
            toast.current.show({ severity: 'warn', summary: 'Aviso', detail: 'Ingrese toda la información', life: 5000 });
        }
    }

    const createDoc = (rowData) => {
        async function getConprovante() {
            const comp = await AprobacionService.getCreateConprovante(rowData.id);
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
            const req = await AprobacionService.getAprobacion(request.id);
            console.log(req)
            setProyectoSeleccionado({ "name": req.areaProject, "code": req.areaProjectId });
            setRequerimientoId(request.id);
            setProcessingUsersId(req.processingUsersId);
            setAnalisisSeleccionado({ "name": req.analysis, "code": req.analysisId });
            setEspecificacionesSeleccionado({ "name": req.specification, "code": req.specificationId });
            setIsSequence(req.isSequenced);
            req.techniqueId ? setTecnicaSeleccionado({ "name": req.technique, "code": req.techniqueId }) : setTecnicaSeleccionado("");
            req.kitReagentId ? setReactivoSeleccionado({ "name": req.kitReagent, "code": req.kitReagentId }) : setReactivoSeleccionado("");
            setObsShipp(req.observationShipping);
            setObsRecep(req.observationReception);

            setTipoMuestraSeleccionado({ "name": req.typeSample, "code": req.typeSampleId });
            setDateValueRequest(new Date(req.entryDate))

            req.shippingDate ? setDateValueShipp(new Date(req.shippingDate)) : setDateValueShipp(new Date());
            req.shippingDate ? setDateValueShippAux(new Date(req.shippingDate)) : setDateValueShippAux(null);
            req.receptionDate ? setDateValueRecep(new Date(req.receptionDate)) : setDateValueRecep(new Date());
            setProducts2([]);
            req.details.map((e, index) => {
                products2.push({ "idNum": index + 1, ...e });
            });
            setProducts3(products2);
            setSubmitted(false);
            setProcesamientoDialog(true);
        }
        getRequerimiento();
    }

    const onObsShippChange = (e) => {
        const val = (e.target && e.target.value) || '';
        setObsShipp(val);
    }

    const onObsRecepChange = (e) => {
        const val = (e.target && e.target.value) || '';
        setObsRecep(val);
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-check" className="p-button-rounded p-button-warning mr-1" title="Validar" onClick={() => enterProcess(rowData)} style={{ height: '2rem', width: '2rem' }}></Button>
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

    const onIsAcceptedChange = (options, e) => {
        setAceptadoSeleccionado(e);
        options.value[options.rowIndex][options.field] = e.name;
    }

    const textEditor = (options) => {
        return <InputText type="text" onChange={(e) => onInputTextChange(options, e)} />;
    }

    const numberEditor = (options) => {
        return <InputText type="number" min={'0'} max={'100'} step={'1'} onChange={(e) => onInputTextChange(options, e)} />;
    }

    const optionEditor = (options) => {
        return <Dropdown value={aceptadoSeleccionado} options={condiciones} onChange={(e) => { onIsAcceptedChange(options, e.target.value); }} optionLabel="name" />;
    }

    const columnsSecuenced = [
        { field: 'idNum', header: 'Nº' },
        { field: 'placeCode', header: 'Id Muestra' },
        { field: 'primer', header: 'Primer' },
        { field: 'sequence', header: 'Secuencia' },
        { field: 'concentration', header: 'Concentración' },
        { field: 'isFasta', header: 'FASTA' },
        { field: 'quality', header: 'Calidad' },
        { field: 'identity', header: 'Identidad' },
        { field: 'organism', header: 'Organismo' }
    ];

    const columns = [
        { field: 'idNum', header: 'Nº' },
        { field: 'placeCode', header: 'Id Muestra' },
        { field: 'dateResults01', header: 'Fecha 01' },
        { field: 'processingResults01', header: 'Resultado 01' },
        { field: 'observationResults01', header: 'Observaciones 01' },
        { field: 'dateResults02', header: 'Fecha 02' },
        { field: 'processingResults02', header: 'Resultado 02' },
        { field: 'observationResults02', header: 'Observaciones 02' },
        { field: 'dateResults03', header: 'Fecha 03' },
        { field: 'processingResults03', header: 'Resultado 03' },
        { field: 'observationResults03', header: 'Observaciones 03' }
        
    ];

    const cellEditor = (options) => {
        if (options.field === 'isFasta')
            return optionEditor(options);
        else if (options.field === 'quality' || options.field === 'identity') {
            return numberEditor(options);
        }
        else {
            return textEditor(options);
        }
    }

    ////////////////////

    const requerimientoDialogFooter = (
        <>
            <Button label="Validar" icon="pi pi-check" className="p-button-text" onClick={saveSolicitud} />
            <Button label="Regresar muestras" icon="pi pi-replay" className="p-button-text" onClick={saveReplaySolicitud} />
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
                            globalFilter={globalFilter} emptyMessage="Secuenciaciones no encontrados." header={header}>
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
                                        <img src='/assets/demo/images/galeriaSistema/aprobar.jpg' width="160rem" height="230rem" />
                                    </div>
                                    <div className="col-10">
                                        <h3 className="m-0">Validación de resultados de muestras</h3>
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
                                        <div className="formgroup-inline">
                                            {!isSequence && <><div className="col-3">
                                                <label>Técnica</label>
                                                <br />
                                                {tecnicaSeleccionado && <label className="text-500">{tecnicaSeleccionado.name}</label>}
                                            </div>
                                            <div className="col-3">
                                                <label h>Kit/Reactivos</label>
                                                <br />
                                                {reactivoSeleccionado && <label className="text-500">{reactivoSeleccionado.name}</label>}
                                            </div>
                                            </>}
                                            {isSequence && <><div className="col-2">
                                                <label htmlFor="dateReques">Fecha Envio</label>
                                                <br />
                                                <label className="text-500">{Moment(dateValueShipp).format('DD-MM-YYYY')}</label>
                                            </div>
                                            <div className="col-2">
                                                <label htmlFor="dateReques">Fecha Recepción</label>
                                                <br />
                                                <label className="text-500">{Moment(dateValueRecep).format('DD-MM-YYYY')}</label>
                                            </div>
                                            <div className="col-4">
                                                <label htmlFor="obser">Observaciones Envio</label>
                                                <br />
                                                <label className="text-500">{obsShipp}</label>
                                            </div>
                                            <div className="col-4">
                                                <label htmlFor="obser">Observaciones Recepción</label>
                                                <br />
                                                <label className="text-500">{obsRecep}</label>
                                            </div>
                                            </>}
                                        </div>
                                    </div>
                                </div>
                                <div className="mx-5">
                                    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                                        <h5>Muestras</h5>
                                    </div>
                                    <div className="p-fluid mt-2">
                                        <DataTable value={products3} editMode="cell" className="editable-cells-table" rowHover scrollable inline style={{ fontSize: '14px', textAlign: 'center' }}
                                            emptyMessage="Ninguna muestra agragada.">
                                            {isSequence &&
                                                columnsSecuenced.map(({ field, header }) => {
                                                    return <Column key={field} field={field} header={header}
                                                        style={{ width: (field === 'idNum') ? '2rem' : (field === 'placeCode') ? '8rem' : (field === 'quality' || field === 'isFasta' || field === 'identity') ? '8rem' : '15rem' }}
                                                         />
                                                })
                                            }
                                            {!isSequence &&
                                                columns.map(({ field, header }) => {
                                                    return <Column key={field} field={field} header={header}
                                                        style={{ width: (field === 'idNum') ? '2rem' : (field === 'placeCode') ? '8rem' : (field === 'quality' || field === 'isFasta' || field === 'identity') ? '8rem' : '15rem' }}
                                                         />
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
