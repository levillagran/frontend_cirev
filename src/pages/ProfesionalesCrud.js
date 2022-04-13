import React, { useState, useEffect, useRef } from 'react';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { AutoComplete } from 'primereact/autocomplete';
import { Calendar } from 'primereact/calendar';

import UsuarioService from '../service/UsuarioService';
import CantonService from '../service/CantonService';
import ProvinciaService from '../service/ProvinciaService';
import EstadoService from '../service/EstadoService';

import { ToggleButton } from 'primereact/togglebutton';

import { locale, addLocale } from 'primereact/api';

import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

export const ProfesionalesCrud = () => {

    let emptyMunicipio = {
        id: null,
        canton: '',
        fechaAdd: null,
        estado: null,
        observaciones: '',
        archivo: [],
    };

    let emptyUsuraio = {
        id: null,
        estado: '',
        rolId: null,
        cantonId: null,
        usuario: '',
        nombre: '',
        apellido: '',
        clave: '',
        correo: '',
        fecha: null,
    };

    let emptyRol = {
        id: null,
        name: ''
    };

    const [usuarios, setUsuarios] = useState(null);
    const [estados, setEstados] = useState(null);
    const [estadosDes, setEstadosDes] = useState();
    const [estado, setEstado] = useState();
    const [comprobante, setComprobante] = useState(null);
    const [activo, setActivo] = useState(true);

    const [observaciones, setObservaciones] = useState();
    const [nombre, setNombre] = useState();
    const [apellido, setApellido] = useState();
    const [correo, setCorreo] = useState();

    const [municipioDialog, setMunicipioDialog] = useState(false);
    const [municipio, setMunicipio] = useState(emptyMunicipio);

    const [usuarioDialog, setUsuarioDialog] = useState(false);
    const [usuario, setUsuario] = useState(emptyUsuraio);

    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const [calendarValue, setCalendarValue] = useState(null);

    const [cantonSeleccionado, setCantonSeleccionado] = useState(null);
    const [cantones, setCantones] = useState(null);
    const [cantonesFull, setCantonesFull] = useState(null);
    const [cantonFiltrado, setCantonFiltrado] = useState([]);
    const [cantonInput, setCantonInput] = useState('');

    const [rolSeleccionado, setRolSeleccionado] = useState(emptyRol);

    const [provinciaSeleccionado, setProvinciaSeleccionado] = useState(null);
    const [provincias, setProvincias] = useState(null);
    const [provinciaFiltrado, setProvinciaFiltrado] = useState([]);

    const [radioValue, setRadioValue] = useState(null);

    const [pdfDialog, setPdfDialog] = useState(false);
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    const [editar, setEditar] = useState(false);
    const [genPass, setGenPass] = useState(false);

    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;

    useEffect(() => {
        async function getUsuarios() {
            const usuarios = await UsuarioService.getUsuarios();
            setUsuarios(usuarios);
        }
        getUsuarios();
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
                if (e.id > 0) { prov.push({ "name": e.provincia, "code": e.codigo }); }
            });
            setProvincias(prov);
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
        setRolSeleccionado({
            id: 104,
            name: 'MUNICIPIO'
        })
        usuario.rolId = rolSeleccionado.id;
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
                usuario.cantonId = canton.value.code;
                usuario.usuario = e.canton.toLowerCase().split(" ").join("") + canton.value.code
                usuario.clave = '';
                for (let i = 0; i < 10; i++) {
                    usuario.clave += characters.charAt(Math.floor(Math.random() * charactersLength));
                }
            }
        });
    }

    const setfechaAdd = (fecha) => {
        usuario.fecha = fecha;
        setCalendarValue(fecha);
    }

    const hideProvincia = (canton) => {
        cantonesFull.map((e) => {
            if (e.cantonId === canton.code) {
                setProvinciaSeleccionado(e.provincia);
            }
        });
    }

    const changeState = (estado) => {
        setActivo(estado);
        usuario.estado = estado;
    }

    const openNew = () => {
        setEditar(false);
        async function getCantones() {
            const cantons = await CantonService.getCantonesSinUsuario();
            setCantonesFull(cantons);
            const cant = [];
            if (cantons.length > 0) {
                cantons.map((e) => {
                    cant.push({ "name": e.canton + ' | ' + e.provincia, "code": e.cantonId });
                });
            }
            else {
                cant.push({ "name": "No hay Municipios adheridos, sin usuario asignado aún.", "code": 0 });
            }
            setCantones(cant);
        }
        getCantones();
        setMunicipio(emptyMunicipio);
        setUsuario(emptyUsuraio);
        usuario.usuario = '';
        usuario.clave = '';
        setCantonSeleccionado('');
        setProvinciaSeleccionado('');
        setNombre('');
        setApellido('');
        setCorreo('');
        if (!usuario.fecha) {
            usuario.fecha = new Date();
            setCalendarValue(usuario.fecha);
        }
        else {
            setCalendarValue(usuario.fecha);
        }
        if (!usuario.estado) {
            setActivo(true)
            usuario.estado = activo;
        }
        else {
            setActivo(usuario.estado);
        }
        setRolSeleccionado({
            id: 104,
            name: 'MUNICIPIO'
        });
        usuario.rolId = rolSeleccionado.id;
        setSubmitted(false);
        setMunicipioDialog(true);
        setMunicipio(municipio)
        setUsuario(usuario);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setMunicipioDialog(false);
        setPdfDialog(false);
    }

    const saveUsuario = () => {
        setSubmitted(true);
        async function postUsuarios() {
            const usuarios = await UsuarioService.postUsuarios(usuario);
            setUsuarios(usuarios);
        }
        if (usuario.nombre !== '' && usuario.apellido !== '' && usuario.correo !== '' && usuario.cantonId > 0) {
            postUsuarios();
            toast.current.show({ severity: 'success', summary: 'Exito', detail: 'Usuario creado exitosa', life: 5000 });
            setMunicipioDialog(false);
            setMunicipio(emptyMunicipio);
            setUsuario(emptyUsuraio);
        }
        else {
            toast.current.show({ severity: 'warn', summary: 'Aviso', detail: 'Ingrese toda la información', life: 5000 });
        }
    }

    const generarPass = () => {
        for (let i = 0; i < 10; i++) {
            usuario.clave += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        setGenPass(true);
    }

    const editMunicipio = (muni) => {
        setEditar(true);
        setUsuario(emptyUsuraio);
        usuario.id = muni.id;
        usuario.apellido = muni.apellido;
        usuario.cantonId = muni.cantonId;
        usuario.clave = '';
        usuario.correo = muni.correo;
        municipio.id = muni.cantonId;
        municipio.canton = muni.canton;
        if (muni.estado === 'activado') {
            usuario.estado = true;
        } else {
            usuario.estado = false;
        }
        usuario.fecha = new Date(muni.fechaUS);
        setCalendarValue(usuario.fecha);
        usuario.nombre = muni.nombre;
        usuario.rolId = muni.rolId;
        setRolSeleccionado({
            id: usuario.rolId,
            name: muni.rol
        });
        setCantonInput(muni.canton);

        provincias.map((e) => {
            if (e.code == muni.provinciaId) {
                setProvinciaSeleccionado(e.name);
            }
        });
        usuario.usuario = muni.usuario;
        setActivo(usuario.estado);
        setUsuario(usuario);
        setNombre(usuario.nombre);
        setApellido(usuario.apellido);
        setCorreo(usuario.correo);
        setMunicipioDialog(true);
    }

    const exportCSV = () => {
        dt.current.exportCSV();
    }

    const onInputChangeNombre = (e) => {
        const val = (e.target && e.target.value) || '';
        usuario.nombre = val;
        setNombre(usuario.nombre);
    }

    const onInputChangeApellido = (e) => {
        const val = (e.target && e.target.value) || '';
        usuario.apellido = val;
        setApellido(usuario.apellido);
    }

    const onInputChangeEmail = (e) => {
        const val = (e.target && e.target.value) || '';
        usuario.correo = val;
        setCorreo(usuario.correo);
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
                <Button label="Exportar profesionales" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
            </React.Fragment>
        )
    }

    const statusBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Estado</span>
                <span className={`status-user-badge status-${rowData.estado.toLowerCase()}`}>{rowData.estado}</span>
            </>
        )
    }

    const rolBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Rol</span>
                {rowData.rol}
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

    const userBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Usuario</span>
                {rowData.usuario}
            </>
        );
    }

    const nameBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Nombre responsable</span>
                {rowData.nombre}
            </>
        );
    }

    const lastNameBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Apellido responsable</span>
                {rowData.apellido}
            </>
        );
    }

    const emailBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Correo</span>
                {rowData.correo}
            </>
        );
    }

    const dateBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Fecha creación</span>
                {rowData.fecha}
            </>
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
            <h5 className="m-0">Gestión de Usuarios por Cantón</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    const municipioDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveUsuario} />
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
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-3" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable ref={dt} value={usuarios} rowHover scrollable
                        dataKey="id" paginator rows={5} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Página {first} / {last} , {totalRecords} usuarios"
                        globalFilter={globalFilter} emptyMessage="Usuarios de nunicipios no encontrados." header={header}>
                        <Column body={actionBodyTemplate} style={{ width: '4rem' }}></Column>
                        <Column field="estado" header="Estado" sortable body={statusBodyTemplate} style={{ width: '7rem' }}></Column>
                        <Column field="rol" header="Rol" sortable body={rolBodyTemplate} style={{ width: '8rem' }}></Column>
                        <Column field="cantonId" header="Código cantón" body={codeContonBodyTemplate} sortable style={{ width: '5rem' }}></Column>
                        <Column field="canton" header="Cantón" sortable body={cantonBodyTemplate} style={{ width: '10rem' }}></Column>
                        <Column field="provinciaId" header="Código provincia" body={codeStateBodyTemplate} sortable style={{ width: '5rem' }}></Column>
                        <Column field="provincia" header="Provincia" body={stateBodyTemplate} sortable style={{ width: '10rem' }}></Column>
                        <Column field="usuario" header="Usuario" body={userBodyTemplate} sortable style={{ width: '16rem' }}></Column>
                        <Column field="nombre" header="Nombre responsable" body={nameBodyTemplate} sortable style={{ width: '10rem' }}></Column>
                        <Column field="apellido" header="Apellido responsable" body={lastNameBodyTemplate} sortable style={{ width: '10rem' }}></Column>
                        <Column field="correo" header="Correo" body={emailBodyTemplate} sortable style={{ width: '16rem' }}></Column>
                        <Column field="fecha" header="Fecha creación" body={dateBodyTemplate} sortable style={{ width: '8rem' }}></Column>
                    </DataTable>

                    <Dialog visible={municipioDialog} style={{ width: '1000px' }} header="Crear profecional" modal className="p-fluid" footer={municipioDialogFooter} onHide={hideDialog}>
                        <div className="grid align-items-center justify-content-center">
                            <div className="col-4 lg:col-3 xl:col-6 align-items-center justify-content-center">
                                <img src='/assets/layout/images/usrs_mnc (2).jpg' width="100%" />
                            </div>
                            <div className="col-12 lg:col-6 xl:col-6 align-items-center justify-content-center">
                                {!editar && <div className="field">
                                    <label htmlFor="canton">Cantón</label>
                                    <AutoComplete placeholder="Buscar" id="canton" dropdown value={cantonSeleccionado} onChange={(e) => { setCantonSeleccionadoMetodo(e); hideProvincia(e.value); }} suggestions={cantonFiltrado} completeMethod={searchCanton} field="name" />
                                </div>
                                }
                                {editar && <div className="field">
                                    <label htmlFor="canton">Cantón</label>
                                    <InputText id="canton" type="text" value={cantonInput} readOnly />
                                </div>}
                                {submitted && !municipio.canton && <small className="p-invalid">Cantón es requerido.</small>}
                                <div className="formgrid grid">
                                    <div className="field col">
                                        <label htmlFor="provincia">Provincia</label>
                                        <AutoComplete id="provincia" value={provinciaSeleccionado} onChange={(e) => setProvinciaSeleccionado(e.value)} suggestions={provinciaFiltrado} completeMethod={searchProvincia} field="name" readOnly />
                                        {submitted && !municipio.canton && <small className="p-invalid">Provincia es requerido.</small>}
                                    </div>
                                    <div className="field col">
                                        <label htmlFor="rol">Rol</label>
                                        <InputText id="rol" type="text" value={rolSeleccionado.name} readOnly />
                                    </div>
                                </div>
                                <div className="formgrid grid">
                                    <div className="field col">
                                        <label htmlFor="name2">Usuario</label>
                                        <InputText id="name2" type="text" value={usuario.usuario} readOnly />
                                    </div>
                                    {!editar && <div className="field col">
                                        <label htmlFor="pass">Contraseña</label>
                                        <InputText id="pass" type="text" value={usuario.clave} readOnly />
                                    </div>}
                                    {editar && !genPass && <div className="field col">
                                        <label htmlFor="pass">Recuperar contraseña</label>
                                        <Button label="Recuperar contraseña" icon="pi pi-undo" className="p-button-warning" onClick={generarPass} />
                                    </div>}
                                    {genPass && <div className="field col">
                                        <label htmlFor="pass">Contraseña</label>
                                        <InputText id="pass" type="text" value={usuario.clave} readOnly />
                                    </div>}
                                </div>
                                <div className="field">
                                    <label htmlFor="name">Nombre responsable</label>
                                    <InputText id="name" tupe="text" value={nombre} onChange={(e) => onInputChangeNombre(e)} />
                                    {submitted && !nombre && <small className="p-invalid">Nombre responsable es requerido.</small>}
                                </div>
                                <div className="field">
                                    <label htmlFor="surname">Apellido responsable</label>
                                    <InputText id="surname" tupe="text" value={apellido} onChange={(e) => onInputChangeApellido(e)} />
                                    {submitted && !apellido && <small className="p-invalid">Apellido responsable es requerido.</small>}
                                </div>
                                <div className="field">
                                    <label htmlFor="email">Correo electrónico</label>
                                    <InputText id="email" type="email" value={correo} onChange={(e) => onInputChangeEmail(e)} />
                                    {submitted && !correo && <small className="p-invalid">Correo electrónico es requerido.</small>}
                                </div>
                                <div className="formgrid grid">
                                    <div className="field col">
                                        <label>Fecha creación</label>
                                        <Calendar showIcon showButtonBar value={calendarValue} onChange={(e) => setfechaAdd(e.value)}></Calendar>
                                        {submitted && !calendarValue && <small className="p-invalid">Fecha es requerido.</small>}
                                    </div>
                                    <div className="field col">
                                        <label>Estado</label>
                                        <br />
                                        <ToggleButton checked={activo} onChange={(e) => changeState(e.value)} onLabel="Activado" offLabel="Desactivado" onIcon="pi pi-check" offIcon="pi pi-times" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Dialog>
                </div>
            </div >
        </div >
    );
}