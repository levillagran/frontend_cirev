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
        placeCode: '',
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
        processingResults: '',
        observationResults: ''
    };

    let requestEmpty =
    {
        id: null,
        processingDate: '',
        techniqueId: '',
        kitReagentId: '',
        processingUsersId: '',
        details: []
    };

    let almacenEmpty =
    {
        id: null,
        text1: '',
        text2: '',
        text3: '',
        text4: '',
        text5: ''
    };

    let evidenceLoad =
    {
        id: null,
        evidence: '',
        userId: null
    };

    const toast = useRef(null);
    const dt = useRef(null);
    const [globalFilter, setGlobalFilter] = useState(null);

    const [dateValueRequest, setDateValueRequest] = useState(null);
    const [dateValueSample, setDateValueSample] = useState(null);
    const [processingUsersId, setProcessingUsersId] = useState("");

    const [submitted, setSubmitted] = useState(false);
    const [procesamientoDialog, setProcesamientoDialog] = useState(false);

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


    useEffect(() => {
        async function getRequerimientos() {
            const reque = await ProcesamientoService.getProcesamientos();
            setRequerimientos(reque);
        }
        getRequerimientos();
    }, []);

    const hideDialog = () => {
        setSubmitted(false);
        setProcesamientoDialog(false);
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

    const saveSolicitud = () => {
        setSubmitted(true);
        async function saveRequest(request) {
            const reque = await ProcesamientoService.saveProcesamiento(request);
            setRequerimientos(reque);
        }
        if (tecnicaSeleccionado && submitted && reactivoSeleccionado) {
            setRequest(requestEmpty);
            request.id = requerimientoId;
            request.processingDate = dateValueSample.getDate() + '-' + (dateValueSample.getMonth() + 1) + '-' + dateValueSample.getFullYear();
            request.techniqueId = tecnicaSeleccionado.code;
            request.kitReagentId = reactivoSeleccionado.code;
            const user = JSON.parse(localStorage.getItem('user'));
            if (processingUsersId === "" || processingUsersId === null){
                request.processingUsersId = user.id.toString();
            } else{
                request.processingUsersId = processingUsersId + "," + user.id.toSring();
            }
            products3.map((e) => {
                setRequestDetail(requestDetailEmpty);
                requestDetail.id = e.id;
                requestDetail.processingResults = e.processingResults;
                requestDetail.observationResults = e.observationResults;
                request.details.push(requestDetail);
            });
            saveRequest(request);
            toast.current.show({ severity: 'success', summary: 'Exito', detail: 'Solicitud guardada exitosamente', life: 5000 });
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

    const setTecnicaSeleccionadoMetodo = (tecnica) => {
        setTecnicaSeleccionado(tecnica.value)
        setReactivoSeleccionado('');
        async function getReactivos() {
            const reactivos = await CatalogoService.getReactivos(tecnica.value.code);
            const reac = [];
            reactivos.map((e) => {
                reac.push({ "name": e.name, "code": e.id });
            });
            setReactivos(reac);
            setReactivosEnable(false);
        }
        getReactivos();
    }

    const setReactivoSeleccionadoMetodo = (reactivo) => {
        setReactivoSeleccionado(reactivo.value)
    }

    const enterProcess = (request) => {
        async function getRequerimiento() {
            const req = await ProcesamientoService.getProcesamiento(request.id);
            setProyectoSeleccionado({ "name": req.areaProject, "code": req.areaProjectId });
            setRequerimientoId(request.id);
            setProcessingUsersId(req.processingUsersId);
            setAnalisisSeleccionado({ "name": req.analysis, "code": req.analysisId });
            setEspecificacionesSeleccionado({ "name": req.specification, "code": req.specificationId });
            console.log(req.techniqueId);
            req.techniqueId ? setTecnicaSeleccionado({ "name": req.technique, "code": req.techniqueId }) : setTecnicaSeleccionado("");
            req.kitReagentId ? setReactivoSeleccionado({ "name": req.kitReagent, "code": req.kitReagentId }) : setReactivoSeleccionado("");
            req.techniqueId ? setReactivosEnable(false) : setReactivosEnable(true);
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
                    setReactivosEnable(false);
                }
                getReactivos();
            }
            setTipoMuestraSeleccionado({ "name": req.typeSample, "code": req.typeSampleId });
            setDateValueRequest(new Date(req.entryDate))
            setDateValueSample(new Date());
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

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-filter" className="p-button-rounded p-button-success mr-1" title="Procesar" onClick={() => enterProcess(rowData)} style={{ height: '2rem', width: '2rem' }}></Button>
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

    const textEditor = (options) => {
        return <InputText type="text" onChange={(e) => onInputTextChange(options, e)} />;
    }

    const columns = [
        { field: 'idNum', header: 'Nº' },
        { field: 'placeCode', header: 'Id campo' },
        { field: 'processingResults', header: 'Resultados' },
        { field: 'observationResults', header: 'Observaciones' }
    ];

    const cellEditor = (options) => {
        if (options.field === 'processingResults' || options.field === 'observationResults')
            return textEditor(options);
    }

    ////////////////////

    const requerimientoDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveSolicitud} />
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
                            <Column field="number" header="Número" sortable body={numberBodyTemplate} style={{ width: '5rem' }}></Column>
                            <Column field="entryDate" header="Fecha Procesamiento" sortable body={entryDateBodyTemplate} style={{ width: '7rem' }}></Column>
                            <Column field="project" header="Proyecto" sortable body={proyectoBodyTemplate} style={{ width: '18rem' }}></Column>
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
                                        <img src='/assets/demo/images/galeriaSistema/proceso.jpg' width="160rem" height="230rem" />
                                    </div>
                                    <div className="col-10">
                                        <h3 className="m-0">Registro del procesamiento de puestras</h3>
                                        <div className="formgroup-inline">
                                            <div className="col-2">
                                                <label >Fecha requerimiento</label>
                                                <br />
                                                <label className="text-500">{Moment(dateValueRequest).format('DD-MM-YYYY')}</label>
                                            </div>
                                            <div className="col-3">
                                                <label >Proyecto de investigación</label>
                                                <br />
                                                {proyectoSeleccionado && <label className="text-500">{proyectoSeleccionado.name}</label>}
                                            </div>
                                            <div className="col-2">
                                                <label htmlFor="name">Analisis requerido</label>
                                                <br />
                                                {analisisSeleccionado && <label className="text-500">{analisisSeleccionado.name}</label>}
                                            </div>
                                            <div className="col-3">
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
                                            <div className="col-2">
                                                <label htmlFor="dateReques">Fecha del procesamiento</label>
                                                <Calendar id="dateReques" showIcon showButtonBar value={dateValueSample} onChange={(e) => { setDateValueSample(e.target.value); }}></Calendar>
                                                {submitted && !dateValueSample && <small className="p-invalid" >Fecha es requerido.</small>}
                                            </div>
                                            <div className="col-3">
                                                <label htmlFor="tecnicas">Técnica</label>
                                                <AutoComplete placeholder="Buscar" id="tecnicas" dropdown value={tecnicaSeleccionado} onChange={(e) => { setTecnicaSeleccionadoMetodo(e); }} suggestions={tecnicaFiltrado} completeMethod={searchTecnica} field="name" />
                                                {submitted && !tecnicaSeleccionado && <small style={{ color: 'red' }}>Tecnica es requerido.</small>}
                                            </div>
                                            <div className="col-3">
                                                <label htmlFor="name">Kit/Reactivos</label>
                                                <AutoComplete placeholder="Buscar" id="dd" dropdown value={reactivoSeleccionado}
                                                    disabled={reactivosEnable} onChange={(e) => { setReactivoSeleccionadoMetodo(e); }} suggestions={reactivoFiltrado} completeMethod={searchReactivo} field="name" />
                                                {submitted && !reactivoSeleccionado && <small style={{ color: 'red' }}>Reactivo es requerido.</small>}
                                            </div>
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
                                            {
                                                columns.map(({ field, header }) => {
                                                    return <Column key={field} field={field} header={header}
                                                        style={{ width: (field === 'idNum') ? '2rem' : (field === 'placeCode') ? '8rem' : '27rem' }}
                                                        editor={(options) => cellEditor(options)} />
                                                })
                                            }
                                        </DataTable>
                                    </div>
                                </div>
                            </div>
                        </Dialog>
                    </div>
                </div>
            </div>
        </div>
    );
}
