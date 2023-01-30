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
import { FileUpload } from 'primereact/fileupload';
import { ProgressBar } from 'primereact/progressbar';
import { Tag } from 'primereact/tag';
import Moment from 'moment';

import ResultadoService from '../../service/coleccion/ResultadoService';

import { locale, addLocale } from 'primereact/api';

import { Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { Worker } from '@react-pdf-viewer/core';

export const ReporteResultadosColeccion = () => {

    let requestEmpty =
    {
        id: null,
        reportDate: '',
        reportResults: '',
        observationsReport: null,
        anexos: null,
        observationsClient: null,
        reportByUserId: null
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

    const [viewPdf, setViewPdf] = useState(null);
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    const [dateValueRequest, setDateValueRequest] = useState(null);
    const [isInternal, setIsInternal] = useState(true);
    const [isSequence, setIsSequence] = useState(false);
    const [numSample, setNumSample] = useState(0);
    const [numProcessedSample, setNumProcessedSample] = useState(0);

    const [submitted, setSubmitted] = useState(false);
    const [loadDialog, setLoadDialog] = useState(false);
    const [pdfDialog, setPdfDialog] = useState(false);
    const [solicitudDialog, setSolicitudDialog] = useState(false);

    const [requerimientos, setRequerimientos] = useState(null);
    const [requerimientoId, setRequerimientoId] = useState(null);

    const [obsResults, setObsResults] = useState(null);
    const [obsClient, setObsClient] = useState(null);
    const [anexos, setAnexos] = useState(null);

    const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);

    const [analisisSeleccionado, setAnalisisSeleccionado] = useState(null);

    const [tipoMuestraSeleccionado, setTipoMuestraSeleccionado] = useState(null);

    const [results, setResults] = useState('');

    const [request, setRequest] = useState(requestEmpty);

    const [evidencia, setEvidencia] = useState('');
    const [evidenciaUpload, setEvidenciaUpload] = useState(evidenceLoad);
    const [reqLoadId, setReqLoadId] = useState(null);
    const [subirButon, setSubirButon] = useState(false);

    useEffect(() => {
        async function getRequerimientos() {
            const reque = await ResultadoService.getRequerimientos();
            setRequerimientos(reque);
        }
        getRequerimientos();
    }, []);

    const hideDialog = () => {
        setSubmitted(false);
        setSolicitudDialog(false);
        setPdfDialog(false);
        setLoadDialog(false);
    }

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Requerimientos</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    const saveSolicitud = () => {
        setSubmitted(true);
        async function saveRequest(request) {
            const reque = await ResultadoService.saveRequerimiento(request);
            setRequerimientos(reque);
        }
        if (true) {
            setRequest(requestEmpty);
            request.id = requerimientoId;
            request.observationsReport = obsResults;
            request.anexos = anexos;
            request.observationsClient = obsClient;
            const user = JSON.parse(localStorage.getItem('user'));
            request.reportByUserId = user.id;
            saveRequest(request);
            toast.current.show({ severity: 'success', summary: 'Exito', detail: 'Solicitud guardada exitosamente', life: 5000 });
            setSolicitudDialog(false);
            //setUsuario(emptyUsuraio);
        } else {
            toast.current.show({ severity: 'warn', summary: 'Aviso', detail: 'Ingrese toda la información', life: 5000 });
        }
    }

    const editRequest = (request) => {
        setRequerimientoId(request.id);
        async function getRequerimiento() {
            const req = await ResultadoService.getRequerimiento(request.id);
            setObsResults(req.observationsReport);
            setAnexos(req.anexos);
            setObsClient(req.observationsClient);
            setSubmitted(false);
            setSolicitudDialog(true);
        }
        getRequerimiento();
    }

    const createDoc = (rowData) => {
        async function getConprovante() {
            const comp = await ResultadoService.getCreateConprovante(rowData.id);
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

    const loadDoc = (rowData) => {
        setSubirButon(false);
        setReqLoadId(rowData.id);
        setLoadDialog(true);
        setEvidenciaUpload(evidenceLoad);
    }

    const viewDoc = (rowData) => {
        async function getConprovante() {
            const comp = await ResultadoService.getConprovante(rowData.id);
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

    const onFileChange = (e) => {
        const file = e.target.files[0]
        const reader = new FileReader();
        let baseURL = "";
        reader.readAsDataURL(file);
        reader.onload = () => {
            baseURL = reader.result;
            setEvidencia(baseURL);
        };
        setSubirButon(true);
    }

    const saveEvidence = () => {
        setSubmitted(true);
        async function postSaveEvidence() {
            console.log(reqLoadId);
            evidenciaUpload.id = reqLoadId;
            evidenciaUpload.evidence = evidencia;
            const user = JSON.parse(localStorage.getItem('user'));
            evidenciaUpload.userId = user.id;
            const reque = await ResultadoService.postSaveEvidence(evidenciaUpload);
            setRequerimientos(reque);
        }
        if (reqLoadId !== null) {
            postSaveEvidence();
            toast.current.show({ severity: 'success', summary: 'Exito', detail: 'Evidencia psubida con exito.', life: 5000 });
            setLoadDialog(false);
        }
        setReqLoadId(null);
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-warning mr-1" title="Editar requerimiento" onClick={() => editRequest(rowData)} style={{ height: '2rem', width: '2rem' }}></Button>
                <Button icon="pi pi-file" className="p-button-rounded p-button-help mr-1" onClick={() => createDoc(rowData)} title="Crear documento" style={{ height: '2rem', width: '2rem' }}></Button>
                <Button icon="pi pi-upload" className="p-button-rounded p-button-success mr-1" onClick={() => loadDoc(rowData)} title="Subir documento" style={{ height: '2rem', width: '2rem' }}></Button>
                <Button icon="pi pi-eye" className="p-button-rounded p-button-info mr-1" onClick={() => viewDoc(rowData)} title="Ver documento" style={{ height: '2rem', width: '2rem' }}></Button>
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

    const sequenceBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.isSequenced ? 'Sí' : 'No'}
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

    const individualsBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.numberIndividuals}
            </>
        )
    }

    const storagesBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.numberStorages}
            </>
        )
    }

    const mountsBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.numberMounts}
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

    const onResultsChange = (e) => {
        const val = (e.target && e.target.value) || '';
        setResults(val);
    }

    const onObsResultsChange = (e) => {
        const val = (e.target && e.target.value) || '';
        setObsResults(val);
    }

    const onAnexosChange = (e) => {
        const val = (e.target && e.target.value) || '';
        setAnexos(val);
    }

    const onObsClientChange = (e) => {
        const val = (e.target && e.target.value) || '';
        setObsClient(val);
    }

    ////////////////////
    const [products2, setProducts2] = useState([]);
    const [products3, setProducts3] = useState([]);

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

    ////////////////////

    const requerimientoDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveSolicitud} />
        </>
    );

    const uploadDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Subir" icon="pi pi-check" className="p-button-text" onClick={saveEvidence} disabled={!subirButon} />
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
                            <Column body={actionBodyTemplate} style={{ width: '11rem' }}></Column>
                            <Column field="number" header="Número de requerimiento" sortable body={numberBodyTemplate} style={{ width: '10rem' }}></Column>
                            <Column field="entryDate" header="Fecha Ingreso" sortable body={entryDateBodyTemplate} style={{ width: '6rem' }}></Column>
                            <Column field="project" header="Proyecto" sortable body={proyectoBodyTemplate} style={{ width: '15rem' }}></Column>
                            <Column field="analysis" header="Análisis" sortable body={analisisBodyTemplate} style={{ width: '7rem' }}></Column>
                            <Column field="numSamples" header="Nº contenedores tubos" sortable body={numSmplesBodyTemplate} style={{ width: '10rem' }}></Column>
                            <Column field="numIndividual" header="Nº Total de especímenes" sortable body={individualsBodyTemplate} style={{ width: '10rem' }}></Column>
                            <Column field="numStored" header="Nº de especímenes Almacenados" sortable body={storagesBodyTemplate} style={{ width: '10rem' }}></Column>
                            <Column field="numMount" header="Nº de especímenes Montados" sortable body={mountsBodyTemplate} style={{ width: '10rem' }}></Column>
                        </DataTable>

                        <Dialog visible={solicitudDialog} style={{ width: '50%' }} modal className="p-fluid" header="Información de registro de reporte de resultados" footer={requerimientoDialogFooter} onHide={hideDialog}>
                            <div>
                                <div className="flex">
                                    <div className="col-4 grid justify-content-center">
                                        <img src='/assets/demo/images/galeriaSistema/resultados.jpg' width="100%"/>
                                    </div>
                                    <div className="col-8">
                                    <div className="col-12">
                                            <label htmlFor="obser">Observaciones de resultados</label>
                                            <InputTextarea id="obser" value={obsResults} onChange={(e) => onObsResultsChange(e)} rows={2} cols={20} autoResize />
                                        </div>
                                        <div className="col-12">
                                            <label htmlFor="obser">Anexos</label>
                                            <InputTextarea id="obser" value={anexos} onChange={(e) => onAnexosChange(e)} rows={2} cols={20} autoResize />
                                        </div>
                                        <div className="col-12">
                                            <label htmlFor="obser">Observaciones del cliente</label>
                                            <InputTextarea id="obser" value={obsClient} onChange={(e) => onObsClientChange(e)} rows={2} cols={20} autoResize />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Dialog>
                        <Dialog visible={pdfDialog} style={{ width: '750px' }} header="Reporte de resultados" modal className="p-fluid" onHide={hideDialog}>
                            <div className='pdf-container'>
                                {viewPdf && <><Worker workerUrl="https://unpkg.com/pdfjs-dist@2.13.216/build/pdf.worker.js">
                                    <Viewer
                                        fileUrl={viewPdf}
                                        plugins={[defaultLayoutPluginInstance]}
                                    />
                                </Worker></>}
                                {!viewPdf && <>Archivo no cargado</>}
                            </div>
                        </Dialog>
                        <Dialog visible={loadDialog} style={{ width: '700px' }} header="Subir archivo" modal className="p-fluid" footer={uploadDialogFooter} onHide={hideDialog}>
                            <div className="formgrid grid mt-4 ml-3">
                                <div className="field col-12">
                                    <input type="file" name="archivo" accept="application/pdf" onChange={(e) => onFileChange(e)} style={{ width: '40rem' }}></input>
                                    <br />
                                    <small> (extencion .pdf, tamaño máximo 2Mb)</small>
                                </div>
                            </div>
                        </Dialog>
                    </div>
                </div>
            </div>
        </div>
    );
}
