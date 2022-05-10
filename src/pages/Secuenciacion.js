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

import SecuenciacionService from '../service/SecuenciacionService';
import EstadoService from '../service/EstadoService';
import CatalogoService from '../service/CatalogoService';

import { locale, addLocale } from 'primereact/api';

import { Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { Worker } from '@react-pdf-viewer/core';

export const Secuenciacion = () => {

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
            const reque = await SecuenciacionService.getSecuenciaciones();
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
            <h5 className="m-0">Secuenciación</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    const saveSolicitud = () => {
        setSubmitted(true);
        async function saveRequest(request) {
            const reque = await SecuenciacionService.saveSecuenciacion(request);
            setRequerimientos(reque);
        }
        if (submitted) {
            setRequest(requestEmpty);
            request.id = requerimientoId;
            request.shippingDate = dateValueShipp.getDate() + '-' + (dateValueShipp.getMonth() + 1) + '-' + dateValueShipp.getFullYear();
            request.receptionDate = dateValueRecep.getDate() + '-' + (dateValueRecep.getMonth() + 1) + '-' + dateValueRecep.getFullYear();
            //request.isShipping = isShipping;
            request.observationShipping= obsShipp;
            request.observationReception= obsRecep;
            const user = JSON.parse(localStorage.getItem('user'));
            if (processingUsersId === "" || processingUsersId === null) {
                request.processingUsersId = user.id.toString();
            } else {
                request.processingUsersId = processingUsersId + "," + user.id.toSring();
            }
            products3.map((e) => {
                setRequestDetail(requestDetailEmpty);
                requestDetail.id = e.id;
                requestDetail.primer = e.primer;
                requestDetail.sequence = e.sequence;
                requestDetail.concentration = e.concentration;
                requestDetail.isFasta = (e.isFasta === 'Sí' ? true : false);
                requestDetail.quality = e.quality;
                requestDetail.identity = e.identity;
                requestDetail.organism = e.organism;
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

    const saveSendSolicitud = () => {
        setSubmitted(true);
        async function changeStatus(chgSt) {
            const reque = await EstadoService.changeStatus(chgSt);
            setRequerimientos(reque);
        }
        if (submitted) {
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

    const createDoc = (rowData) => {
        async function getConprovante() {
            const comp = await SecuenciacionService.getCreateConprovante(rowData.id);
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
            const req = await SecuenciacionService.getSecuenciacion(request.id);
            setProyectoSeleccionado({ "name": req.areaProject, "code": req.areaProjectId });
            setRequerimientoId(request.id);
            setProcessingUsersId(req.processingUsersId);
            setAnalisisSeleccionado({ "name": req.analysis, "code": req.analysisId });
            //setIsShipping(req.isShipping);
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
                <Button icon="pi pi-filter" className="p-button-rounded p-button-success mr-1" title="Procesar" onClick={() => enterProcess(rowData)} style={{ height: '2rem', width: '2rem' }}></Button>
                <Button icon="pi pi-file" className="p-button-rounded p-button-help mr-1" onClick={() => createDoc(rowData)} title="Crear documento" style={{ height: '2rem', width: '2rem' }}></Button>
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

    const columnsShipping = [
        { field: 'idNum', header: 'Nº' },
        { field: 'placeCode', header: 'Id Muestra' },
        { field: 'primer', header: 'Primer' },
        { field: 'sequence', header: 'Secuencia' },
        { field: 'concentration', header: 'Concentración' },
    ];

    const columnsReception = [
        { field: 'idNum', header: 'Nº' },
        { field: 'placeCode', header: 'Id Muestra' },
        { field: 'isFasta', header: 'FASTA' },
        { field: 'quality', header: 'Calidad' },
        { field: 'identity', header: 'Identidad' },
        { field: 'organism', header: 'Organismo' }
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
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveSolicitud} />
            <Button label="Guardar y enviar para aprovación" icon="pi pi-check" className="p-button-text" onClick={saveSendSolicitud} disabled={isShipping || !dateValueShippAux}/>
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
                            <Column body={actionBodyTemplate} style={{ width: '6rem' }}></Column>
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
                                        <img src='/assets/demo/images/galeriaSistema/secuencia.jpg' width="160rem" height="230rem" />
                                    </div>
                                    <div className="col-10">
                                        <h3 className="m-0">Registro de secuenciación de muestras</h3>
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
                                                <label htmlFor="name">Tipo de muestra</label>
                                                <br />
                                                {tipoMuestraSeleccionado && <label className="text-500">{tipoMuestraSeleccionado.name}</label>}
                                            </div>
                                            {dateValueShippAux && <div className="col-2">
                                                <label >Fecha Envio</label>
                                                <br />
                                                <label className="text-500">{Moment(dateValueShippAux).format('DD-MM-YYYY')}</label>
                                            </div>}
                                        </div>
                                        <div className="formgroup-inline">
                                            <div className="col-3">
                                                <label htmlFor="name">Tipo</label>
                                                <div className="flex">
                                                    <div className="col-12 md:col-6">
                                                        <div className="field-radiobutton">
                                                            <RadioButton inputId="option1" name="option" checked={isShipping} onChange={(e) => setIsShipping(true)} />
                                                            <label htmlFor="option1">Envío</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-12 md:col-6">
                                                        <div className="field-radiobutton">
                                                            <RadioButton inputId="option2" name="option" checked={!isShipping} onChange={(e) => setIsShipping(false)} />
                                                            <label htmlFor="option2">Recepción</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {isShipping && <div className="col-2">
                                                <label htmlFor="dateReques">Fecha Envio</label>
                                                <Calendar id="dateReques" showIcon showButtonBar value={dateValueShipp} onChange={(e) => { setDateValueShipp(e.target.value); }}></Calendar>
                                                {submitted && !dateValueShipp && <small className="p-invalid" >Fecha es requerido.</small>}
                                            </div>}
                                            {!isShipping && <div className="col-2">
                                                <label htmlFor="dateReques">Fecha Recepción</label>
                                                <Calendar id="dateReques" showIcon showButtonBar value={dateValueRecep} onChange={(e) => { setDateValueRecep(e.target.value); }}></Calendar>
                                                {submitted && !dateValueRecep && <small className="p-invalid" >Fecha es requerido.</small>}
                                            </div>}
                                            {isShipping && <div className="col-4">
                                                <label htmlFor="obser">Observaciones Envio</label>
                                                <small> (opcional)</small>
                                                <InputTextarea id="obser" value={obsShipp} onChange={(e) => onObsShippChange(e)} rows={1} cols={20} autoResize />
                                            </div>}
                                            {!isShipping && <div className="col-4">
                                                <label htmlFor="obser">Observaciones Recepción</label>
                                                <small> (opcional)</small>
                                                <InputTextarea id="obser" value={obsRecep} onChange={(e) => onObsRecepChange(e)} rows={1} cols={20} autoResize />
                                            </div>}
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
                                            {isShipping &&
                                                columnsShipping.map(({ field, header }) => {
                                                    return <Column key={field} field={field} header={header}
                                                        style={{ width: (field === 'idNum') ? '2rem' : (field === 'placeCode') ? '8rem' : (field === 'quality' || field === 'isFasta' || field === 'identity') ? '8rem' : '15rem' }}
                                                        editor={(options) => cellEditor(options)} />
                                                })
                                            }
                                            {!isShipping &&
                                                columnsReception.map(({ field, header }) => {
                                                    return <Column key={field} field={field} header={header}
                                                        style={{ width: (field === 'idNum') ? '2rem' : (field === 'placeCode') ? '8rem' : (field === 'quality' || field === 'isFasta' || field === 'identity') ? '8rem' : '15rem' }}
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
