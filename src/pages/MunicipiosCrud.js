import React, { useState, useEffect, useRef } from 'react';

import '../css/InputFile.css';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton } from 'primereact/radiobutton';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { AutoComplete } from 'primereact/autocomplete';
import { Calendar } from 'primereact/calendar';
import { ScrollPanel } from 'primereact/scrollpanel';
import { ScrollTop } from 'primereact/scrolltop';

import MunicipioService from '../service/MunicipioService';
import CantonService from '../service/CantonService';
import ProvinciaService from '../service/ProvinciaService';
import EstadoService from '../service/EstadoService';

import { locale, addLocale } from 'primereact/api';

import { Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { Worker } from '@react-pdf-viewer/core';

export const MunicipiosCrud = () => {

    let emptyMunicipio = {
        id: null,
        canton: '',
        fechaAdd: null,
        estado: null,
        observaciones: '',
        archivo: [],
    };

    let muniAux = {
        id: null,
        canton: '',
        fechaAdd: null,
        estado: null,
        observaciones: '',
        archivo: '',
    };

    const [municipios, setMunicipios] = useState(null);
    const [estados, setEstados] = useState(null);
    const [estadosDes, setEstadosDes] = useState();
    const [estado, setEstado] = useState();
    const [comprobante, setComprobante] = useState(null);

    const [observaciones, setObservaciones] = useState();

    const [municipioDialog, setMunicipioDialog] = useState(false);
    const [municipio, setMunicipio] = useState(emptyMunicipio);
    const [municipioAux, setMunicipioAux] = useState(muniAux);

    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const [calendarValue, setCalendarValue] = useState(null);

    const [cantonSeleccionado, setCantonSeleccionado] = useState(null);
    const [cantones, setCantones] = useState(null);
    const [cantonesFull, setCantonesFull] = useState(null);
    const [cantonFiltrado, setCantonFiltrado] = useState([]);

    const [provinciaSeleccionado, setProvinciaSeleccionado] = useState(null);
    const [provincias, setProvincia] = useState(null);
    const [provinciaFiltrado, setProvinciaFiltrado] = useState([]);

    const [radioValue, setRadioValue] = useState(null);

    const [pdfDialog, setPdfDialog] = useState(false);
    const defaultLayoutPluginInstance = defaultLayoutPlugin();
    const [viewPdf, setViewPdf] = useState(null);

    const [editar, setEditar] = useState(false);
    const [archivo, setArchivo] = useState(false);

    useEffect(() => {
        async function getMunicipios() {
            const municipios = await MunicipioService.getMunicipios();
            setMunicipios(municipios);
        }
        getMunicipios();
        async function getCantones() {
            const cantones = await CantonService.getCantones();
            setCantonesFull(cantones);
            const cant = [];
            cantones.map((e) => {
                cant.push({ "name": e.canton + ' | ' + e.provincia, "code": e.cantonId });
            });
            setCantones(cant);
        }
        getCantones();
        async function getProvincia() {
            const provincias = await ProvinciaService.getProvincias();
            const prov = [];
            provincias.map((e) => {
                if (e.id > 0) { prov.push({ "name": e.provincia, "code": e.id }); }
            });
            setProvincia(prov);
        }
        getProvincia();
        async function getEstados() {
            const estados = await EstadoService.getEstados();
            setEstados(estados);
            setEstado(estados[1]);
            setRadioValue(estados[1].estado);
            setEstadosDes(estados[1].descripcion);
        }
        getEstados();
    }, []);

    const searchCanton = (event) => {
        setTimeout(() => {
            if (!event.query.trim().length) {
                setCantonFiltrado([...cantones]);
            }
            else {
                setCantonFiltrado(cantones.filter((canton) => {
                    return canton.name.toLowerCase().startsWith(event.query.toLowerCase());
                }));
            }
        }, 250);
    };

    const searchProvincia = (event) => {
        setTimeout(() => {
            if (!event.query.trim().length) {
                setProvinciaFiltrado([...provincias]);
            }
            else {
                setProvinciaFiltrado(provincias.filter((provinica) => {
                    return provinica.name.toLowerCase().startsWith(event.query.toLowerCase());
                }));
            }
        }, 250);
    };

    const setCantonSeleccionadoMetodo = (canton) => {
        municipio.id = canton.value.code
        setCantonSeleccionado(canton.value)
        cantonesFull.map((e) => {
            if (e.cantonId === canton.value.code) {
                municipio.canton = e.canton;
            }
        });
    }

    const setfechaAdd = (fechaAdd) => {
        municipio.fechaAdd = fechaAdd;
        setCalendarValue(fechaAdd);
    }

    const hideProvincia = (canton) => {
        cantonesFull.map((e) => {
            if (e.cantonId === canton.code) {
                setProvinciaSeleccionado(e.provincia);
            }
        });
    }

    const changeState = (estado) => {
        estados.map((e) => {
            if (e.estado === estado) {
                setEstado(e);
                setEstadosDes(e.descripcion);
                municipio.estado = e.id;
            }
        });
    }

    const openNew = () => {
        setMunicipio(emptyMunicipio);
        setCantonSeleccionado('');
        setProvinciaSeleccionado('');
        setEstado(estados[1]);
        setRadioValue(estados[1].estado);
        setEstadosDes(estados[1].descripcion);
        setCalendarValue('');
        if (!municipio.fechaAdd) {
            municipio.fechaAdd = new Date();
            setCalendarValue(municipio.fechaAdd);
        }
        else {
            setCalendarValue(municipio.fechaAdd);
        }
        if (!municipio.estado) {
            municipio.estado = estado.id;
        }
        else {
            estado.id = municipio.estado;
            estados.map((e) => {
                if (e.id = estado.id) {
                    setRadioValue(e.estado);
                    setEstadosDes(e.descripcion);
                }
            });
        }
        setObservaciones('')
        setEditar(false);
        setArchivo(false);
        setSubmitted(false);
        setMunicipioDialog(true);
        setMunicipio(municipio)
    }

    const hideDialog = () => {
        setSubmitted(false);
        setMunicipioDialog(false);
        setPdfDialog(false);
    }

    const saveMunicipio = () => {
        setSubmitted(true);
        async function postMunicipios() {
            if (editar && archivo) {
                setMunicipioAux(muniAux);
                municipioAux.id = municipio.id;
                municipioAux.canton = municipio.canton;
                municipioAux.fechaAdd = municipio.fechaAdd;
                municipioAux.estado = municipio.estado;
                municipioAux.observaciones = municipio.observaciones;
                municipioAux.achivo = "";
                const municipios = await MunicipioService.postMunicipios(municipioAux);
                setMunicipios(municipios);
            }else{
                const municipios = await MunicipioService.postMunicipios(municipio);
                setMunicipios(municipios);
            }
        }
        async function getCantones() {
            const cantones = await CantonService.getCantones();
            setCantonesFull(cantones);
            const cant = [];
            cantones.map((e) => {
                cant.push({ "name": e.canton + ' | ' + e.provincia, "code": e.cantonId });
            });
            setCantones(cant);
        }
        if (municipio.fechaAdd && municipio.estado && (municipio.archivo.length > 0 || (editar && archivo)) && municipio.id > 0) {
            postMunicipios();
            getCantones();
            toast.current.show({ severity: 'success', summary: 'Exito', detail: 'Adhesión / actualización exitosa', life: 5000 });
            setMunicipioDialog(false);
            setMunicipio(emptyMunicipio);
        }
        else {
            toast.current.show({ severity: 'warn', summary: 'Aviso', detail: 'Ingrese toda la información', life: 5000 });
        }
    }

    const editMunicipio = (muni) => {
        setMunicipio(emptyMunicipio);
        municipio.id = muni.cantonId;
        municipio.canton = muni.canton;
        municipio.fechaAdd = new Date(muni.fechaUS);
        estados.map((e) => {
            if (e.estado === muni.estado)
                municipio.estado = e.id;
            setRadioValue(muni.estado);
            changeState(muni.estado);
        })
        setCantonSeleccionadoMetodo({
            value: {
                code: municipio.id,
                name: municipio.canton
            }
        });
        setProvinciaSeleccionado(muni.provincia);
        setCalendarValue(municipio.fechaAdd);
        if (muni.observaciones) {
            municipio.observaciones = muni.observaciones;
            setObservaciones(municipio.observaciones)
        }
        else {
            municipio.observaciones = "";
            setObservaciones("")
        }
        setEditar(true);
        setArchivo(muni.archivo);
        setMunicipio(municipio);
        setMunicipioDialog(true);
    }

    const exportCSV = () => {
        dt.current.exportCSV();
    }

    const viewDoc = (muni) => {
        async function getComprobanteApi() {
            const municipio = await MunicipioService.getComprobante(muni.cantonId);
            if (municipio !== null) {
                setViewPdf(municipio);
            }
            else {
                setViewPdf(null);
            }
            setPdfDialog(true);
        }
        getComprobanteApi();
    }

    const onInputChange = (e) => {
        const val = (e.target && e.target.value) || '';
        municipio.observaciones = val;
        setObservaciones(val)
    }

    const onFileChange = (e) => {
        const file = e.target.files[0]
        const reader = new FileReader();
        let baseURL = "";
        reader.readAsDataURL(file);
        reader.onload = () => {
            baseURL = reader.result;
            municipio.archivo = baseURL;

        };
    }

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Nuevo" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                </div>
            </React.Fragment>
        )
    }

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="Exportar adheridos" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
            </React.Fragment>
        )
    }

    const statusBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Estado</span>
                <span className={`status-canton-badge status-${rowData.estado.toLowerCase()}`}>{rowData.estado}</span>
            </>
        )
    }

    const dateBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Fecha adheción</span>
                {rowData.fecha}
            </>
        );
    }

    const codeContonBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Código cantón</span>
                {rowData.cantonId}
            </>
        );
    }

    const cantonBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Cantón</span>
                {rowData.canton}
            </>
        );
    }

    const codeStateBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Código provincia</span>
                {rowData.provinciaId}
            </>
        );
    }

    const stateBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Provincia</span>
                {rowData.provincia}
            </>
        );
    }

    const voucherBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-eye" className="p-button-rounded p-button-info mr-2" onClick={() => viewDoc(rowData)} title="Ver acta"></Button>
            </div>
        );
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-warning mr-2" onClick={() => editMunicipio(rowData)} title="Editar" />
            </div>
        );
    }

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Gestión de municipios</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    const municipioDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveMunicipio} />
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

    const cargaArchivo = () => {
        setEditar(true);
        setArchivo(false);
    }

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable ref={dt} value={municipios} rowHover scrollable
                        dataKey="id" paginator rows={5} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Página {first} / {last} , {totalRecords} municipios"
                        globalFilter={globalFilter} emptyMessage="Municipios no encontrados." header={header}>
                        <Column body={actionBodyTemplate} style={{ width: '1rem' }}></Column>
                        <Column body={voucherBodyTemplate} style={{ width: '2rem' }}></Column>
                        <Column field="estado" header="Estado" sortable body={statusBodyTemplate} style={{ width: '3rem' }}></Column>
                        <Column field="fecha" header="Fecha adheción" sortable body={dateBodyTemplate} style={{ width: '3rem' }}></Column>
                        <Column field="cantonId" header="Código cantón" body={codeContonBodyTemplate} sortable style={{ width: '3rem' }}></Column>
                        <Column field="canton" header="Cantón" sortable body={cantonBodyTemplate} style={{ width: '5rem' }}></Column>
                        <Column field="provinciaId" header="Código provincia" body={codeStateBodyTemplate} sortable style={{ width: '3rem' }}></Column>
                        <Column field="provincia" header="Provincia" body={stateBodyTemplate} sortable style={{ width: '5rem' }}></Column>
                    </DataTable>

                    <Dialog visible={municipioDialog} style={{ width: '700px' }} header="Adherir Municipio" modal className="p-fluid" footer={municipioDialogFooter} onHide={hideDialog}>
                        <div className="mb-3">
                            <img src='/assets/layout/images/mnc.jpg' width="600" height="150" className="mt-0 mx-auto mb-5 block shadow-2" />
                        </div>
                        <div className="formgrid grid">
                            <div className="field col-4">
                                <label htmlFor="name">Cantón</label>
                                <AutoComplete placeholder="Buscar" id="dd" dropdown value={cantonSeleccionado} onChange={(e) => { setCantonSeleccionadoMetodo(e); hideProvincia(e.value); }} suggestions={cantonFiltrado} completeMethod={searchCanton} field="name" />
                                {submitted && !municipio.id && <small className="p-invalid">Cantón es requerido.</small>}
                            </div>
                            <div className="field col-4">
                                <label htmlFor="name">Provincia</label>
                                <AutoComplete placeholder="Buscar" id="dd" dropdown value={provinciaSeleccionado} onChange={(e) => setProvinciaSeleccionado(e.value)} suggestions={provinciaFiltrado} completeMethod={searchProvincia} field="name" />
                                {submitted && !municipio.id && <small className="p-invalid">Provincia es requerido.</small>}
                            </div>
                            <div className="field col-4">
                                <label htmlFor="name">Fecha adhesión</label>
                                <Calendar showIcon showButtonBar value={calendarValue} onChange={(e) => setfechaAdd(e.value)}></Calendar>
                                {submitted && !municipio.fechaAdd && <small className="p-invalid">Fecha es requerido.</small>}
                            </div>
                        </div>
                        <div className="formgrid grid">
                            <div className="field col-6">
                                <label className="mb-3">Estado</label>
                                <div className="formgroup-inline ml-3">
                                    <div className="field-radiobutton">
                                        <RadioButton inputId="option1" name="estado" value="Adherido" checked={radioValue === 'Adherido'} onChange={(e) => { setRadioValue(e.value); changeState(e.value); }} />
                                        <label htmlFor="option1">Adherido</label>
                                    </div>
                                    <div className="field-radiobutton">
                                        <RadioButton inputId="option2" name="estado" value="No adherido" checked={radioValue === 'No adherido'} onChange={(e) => { setRadioValue(e.value); changeState(e.value); }} />
                                        <label htmlFor="option2">No Adherido</label>
                                    </div>
                                </div>
                                <ScrollPanel style={{ height: '40px' }}>
                                    <p>
                                        {estadosDes}
                                    </p>
                                    <ScrollTop target="parent" className="custom-scrolltop" threshold={10} icon="pi pi-arrow-up"></ScrollTop>
                                </ScrollPanel>

                            </div>
                            <div className="field col-6">
                                <label htmlFor="name">Observaciones</label>
                                <small> (opcional)</small>
                                <InputTextarea id="estado" value={observaciones} onChange={(e) => onInputChange(e)} required rows={3} cols={20} autoResize />
                            </div>
                        </div>
                        <div className="formgrid grid mt-4 ml-3">
                            {!editar && !archivo &&
                                <div className="field col-12">
                                    <label>Comprobante</label>
                                    <br />
                                    <input type="file" name="archivo" accept="application/pdf" onChange={(e) => onFileChange(e)} ></input>
                                    <br />
                                    <small> (extencion .pdf, tamaño máximo 2Mb)</small>
                                    {submitted && municipio.archivo.length === 0 && <small className="p-invalid">Debe escoger el archivo habilitante.</small>}
                                </div>
                            }
                            {editar && !archivo &&
                                <div className="field col-12">
                                    <label>Comprobante</label>
                                    <br />
                                    <input type="file" name="archivo" accept="application/pdf" onChange={(e) => onFileChange(e)} ></input>
                                    <br />
                                    <small> (extencion .pdf, tamaño máximo 2Mb)</small>
                                    {submitted && municipio.archivo.length === 0 && <small className="p-invalid">Debe escoger el archivo habilitante.</small>}
                                </div>
                            }
                            {editar && archivo &&
                                <div className="field col-12">
                                    <label htmlFor="pass">Ya existe una acta cargada  </label>
                                    <Button label="Actualizar acta" icon="pi pi-undo" className="p-button-warning ml-3" style={{ width: '11em' }} onClick={cargaArchivo} />
                                </div>
                            }
                        </div>
                    </Dialog>
                    <Dialog visible={pdfDialog} style={{ width: '700px' }} header="Vista de acta de adheción" modal className="p-fluid" onHide={hideDialog}>
                        <div className='pdf-container'>
                            {viewPdf && <><Worker workerUrl="https://unpkg.com/pdfjs-dist@2.6.347/build/pdf.worker.min.js">
                                <Viewer fileUrl={viewPdf}
                                    plugins={[defaultLayoutPluginInstance]} />
                            </Worker></>}
                            {!viewPdf && <>Archivo pdf no seleccionado</>}
                        </div>
                    </Dialog>
                </div>
            </div >
        </div >
    );
}