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
import { SelectButton } from 'primereact/selectbutton';
import { Tag } from 'primereact/tag';

import RequerimientoService from '../../service/RequerimientoService';
import EstadoService from '../../service/coleccion/EstadoService';
import CatalogoService from '../../service/coleccion/CatalogoService';

import { locale, addLocale } from 'primereact/api';

import { Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { Worker } from '@react-pdf-viewer/core';

export const RequerimientosColeccion = () => {

    let emptySample =
    {
        idNum: '',
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
        observations: '',
        collectorUser: '',
        collectorUserId: '',
        state: '',
        stateId: '',
        dry: '',
        dryId: '',
        numberContainersTubes: '',
        collectionMethod: '',
        collectionMethodId: ''
    };

    let requestDetailEmpty =
    {
        id: null,
        placeCode: '',
        collectionDate: '',
        taxonomicId: '',
        provinceId: '',
        cantonId: '',
        parishId: '',
        latitude: '',
        longitude: '',
        genderId: '',
        isPreprocessed: '',
        isAccepted: '',
        reazonNoAccepted: '',
        storageId: '',
        numberBox: '',
        yearCode: '',
        observationSampleDetail: '',
        collectorUserId: '',
        isAdult: '',
        isImmature: '',
        isDry: '',
        isWet: '',
        collectionMethodId: '',
        numberContainersTubes: ''
    };

    let requestEmpty =
    {
        id: null,
        entryDate: '',
        areaProjectId: '',
        analysisId: '',
        specificationId: '',
        typeSampleId: '',
        isSequenced: '',
        observationRequirement: '',
        observationEntry: '',
        requerimentUserId: '',
        receptionUserId: '',
        isCulicidae: '',
        isTriatominae: '',
        isPsychodidae: '',
        isSiphonaptera: '',
        isIxodidae: '',
        isImmatures: '',
        isAdults: '',
        isDry: '',
        isWet: '',
        isContaminated: '',
        details: []
    };

    let condiciones = [
        { name: 'Si', code: true },
        { name: 'No', code: false }
    ];

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

    let emptyChangeStatus =
    {
        requerimientoId: null,
        estadoId: null
    };

    const options = ['Si', 'No'];
    const [contaminacion, setContaminacion] = useState('No');

    const estadios = [
        { name: 'Inmaduro', code: 1 },
        { name: 'Adulto', code: 2 }
    ];
    const [estadio, setEstadio] = useState(null);
    const [estadioSeleccionado, setEstadioSeleccionado] = useState(null);

    const medios = [
        { name: 'En seco', code: 1 },
        { name: 'En húmedo', code: 2 }
    ];

    let emptyColector =
    {
        id: null,
        projectId: null,
        name: null,
        lastname: null,
        active: null,
    };

    const [medio, setMedio] = useState(null);
    const [medioSeleccionado, setMedioSeleccionado] = useState(null);

    const toast = useRef(null);
    const dt = useRef(null);
    const [globalFilter, setGlobalFilter] = useState(null);

    const [viewPdf, setViewPdf] = useState(null);
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    const [dateValueRequest, setDateValueRequest] = useState(null);
    const [dateValueSample, setDateValueSample] = useState(null);
    const [isInternal, setIsInternal] = useState(true);
    const [isSequence, setIsSequence] = useState(false);
    const [numSample, setNumSample] = useState(0);
    const [obsReques, setObsReques] = useState('');
    const [obsRegister, setObsRegister] = useState('');

    const [submitted, setSubmitted] = useState(false);
    const [loadDialog, setLoadDialog] = useState(false);
    const [pdfDialog, setPdfDialog] = useState(false);
    const [solicitudDialog, setSolicitudDialog] = useState(false);
    const [newColectorDialog, setNewColectorDialog] = useState(false);

    const [requerimientos, setRequerimientos] = useState(null);
    const [requerimientoId, setRequerimientoId] = useState(null);

    const [proyectos, setProyectos] = useState(null);
    const [proyectoFiltrado, setProyectoFiltrado] = useState([]);
    const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);

    const [metColAdul, setMetColAdul] = useState(null);
    const [metColAdulFiltrado, setMetColAdulFiltrado] = useState([]);
    const [metColAdulSeleccionado, setMetColAdulSeleccionado] = useState(null);

    const [metColInma, setMetColInma] = useState(null);
    const [metColInmaFiltrado, setMetColInmaFiltrado] = useState([]);
    const [metColInmaSeleccionado, setMetColInmaSeleccionado] = useState(null);

    const [usuarios, setUsuarios] = useState(null);
    const [usuarioFiltrado, setUsuarioFiltrado] = useState([]);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

    const [analisisEnable, setAnalisisEnable] = useState(true);
    const [analisis, setAnalisis] = useState(null);
    const [analisisFiltrado, setAnalisisFiltrado] = useState([]);
    const [analisisSeleccionado, setAnalisisSeleccionado] = useState(null);

    const [metodoEnable, setMetodoEnable] = useState(true);
    const [metodos, setMetodos] = useState(null);
    const [metodoFiltrado, setMetodoFiltrado] = useState([]);
    const [metodoSeleccionado, setMetodoSeleccionado] = useState(null);

    const [colectorEnable, setColectorEnable] = useState(true);
    const [colectores, setColectores] = useState(null);
    const [colectorFiltrado, setColectorFiltrado] = useState([]);
    const [colectorSeleccionado, setColectorSeleccionado] = useState(null);

    const [anali, setAnali] = useState(null);

    const [especificacionesEnable, setEspecificacionesEnable] = useState(true);
    const [especificaciones, setEspecificaciones] = useState(null);
    const [especificacionFiltrado, setEspecificacionFiltrado] = useState([]);
    const [especificacionSeleccionado, setEspecificacionesSeleccionado] = useState(null);

    const [tiposMuestras, setTiposMuestras] = useState(null);
    const [tipoMuestraFiltrado, setTipoMuestraFiltrado] = useState([]);
    const [tipoMuestraSeleccionado, setTipoMuestraSeleccionado] = useState(null);

    const [taxonomias, setTaxonomias] = useState(null);
    const [taxonomiaFiltrado, setTaxonomiaFiltrado] = useState([]);
    const [taxonomiaSeleccionado, setTaxonomiaSeleccionado] = useState(null);


    const [generos, setGeneros] = useState(null);
    const [generoFiltrado, setGeneroFiltrado] = useState([]);
    const [generoSeleccionado, setGeneroSeleccionado] = useState(null);

    const [almacenEnable, setAlmacenEnable] = useState(true);
    const [almacen, setAlmacen] = useState(almacenEmpty);

    const [provincias, setProvincias] = useState(null);
    const [provinciaFiltrado, setProvinciaFiltrado] = useState([]);
    const [provinciaSeleccionado, setProvinciaSeleccionado] = useState(null);

    const [cantonesEnable, setCantonesEnable] = useState(true);
    const [cantones, setCantones] = useState(null);
    const [cantonFiltrado, setCantonFiltrado] = useState([]);
    const [cantonSeleccionado, setCantonSeleccionado] = useState(null);

    const [parroquiasEnable, setParroquiasEnable] = useState(true);
    const [parroquias, setParroquias] = useState(null);
    const [parroquiaFiltrado, setParroquiaFiltrado] = useState([]);
    const [parroquiaSeleccionado, setParroquiaSeleccionado] = useState(null);

    const [aceptadoSeleccionado, setAceptadoSeleccionado] = useState(null);

    const [metColSeleccionado, setMetColSeleccionado] = useState(null);

    const [preproSeleccionado, setPreproSeleccionado] = useState(null);

    const [request, setRequest] = useState(requestEmpty);
    const [requestDetail, setRequestDetail] = useState(requestDetailEmpty);

    const [evidencia, setEvidencia] = useState('');
    const [evidenciaUpload, setEvidenciaUpload] = useState(evidenceLoad);
    const [reqLoadId, setReqLoadId] = useState(null);
    const [subirButon, setSubirButon] = useState(false);

    const [chgStatus, setChgStatus] = useState(emptyChangeStatus);

    const [newColector, setNewColector] = useState(emptyColector);
    const [nameColector, setNameColector] = useState(null);
    const [lastnameColector, setLastnameColector] = useState(null);

    useEffect(() => {
        async function getRequerimientos() {
            const reque = await RequerimientoService.getRequerimientosColeccion();
            reque.sort((a, b) => {
                let x = b.number;
                let y = a.number;
                return (x < y) ? -1 : (x > y) ? 1 : 0;
            });

            setRequerimientos(reque);
        }
        getRequerimientos();
    }, []);

    const hideDialog = () => {
        setNewColectorDialog(false);
        setSolicitudDialog(false);
        setPdfDialog(false);
        setLoadDialog(false);
    }

    const hideNewDialog = () => {
        setNewColectorDialog(false);
    }

    const viewNewDialog = () => {
        setNewColectorDialog(true);
    }

    const setIsInternalValue = (value) => {
        setIsInternal(value);
        async function getUsuarios() {
            const usuarios = await CatalogoService.getUsuarios(value);
            const users = [];
            usuarios.map((e) => {
                users.push({ "name": e.prefix + " " + e.name + " " + e.lastname + e.suffix, "code": e.id });
            });
            setUsuarios(users);
        }
        getUsuarios();
    };

    const openNew = () => {
        setProducts3([]);
        setNumSample(0);
        setProyectoSeleccionado(null);
        setEstadioSeleccionado(null);
        setMedioSeleccionado(null);
        setContaminacion('No');
        //setAnalisisSeleccionado(null);
        setUsuarioSeleccionado(null);
        setColectorSeleccionado(null);
        setObsReques('');
        setEstadio(null);
        setMedio(null);
        //setAnalisis(null);
        setAnali(null);
        // carga todos los catalogos para la pantalla
        loadCatalog();
        const fechaActual = new Date();
        setDateValueRequest(fechaActual);
        setDateValueSample(fechaActual);
        setSubmitted(false);
        setSolicitudDialog(true);
        setRequerimientoId(null);
    }

    const loadCatalog = () => {
        async function getProyectos() {
            const proyectos = await CatalogoService.getProyectos();
            const proy = [];
            proyectos.map((e) => {
                proy.push({ "name": e.name, "code": e.id });
            });
            setProyectos(proy);
        }
        getProyectos();
        async function getUsuarios() {
            const usuarios = await CatalogoService.getUsuarios(isInternal);
            const users = [];
            usuarios.map((e) => {
                users.push({ "name": e.prefix + " " + e.name + " " + e.lastname + e.suffix, "code": e.id });
            });
            setUsuarios(users);
        }
        getUsuarios();
        async function getAnalisis() {
            const generos = await CatalogoService.getAnalisis();
            const gen = [];
            generos.map((e) => {
                gen.push({ "name": e.name, "value": e.id });
            });
            setAnalisis(gen);
        }
        getAnalisis();
        async function getProvincias() {
            const provincias = await CatalogoService.getProvincias();
            const pro = [];
            provincias.map((e) => {
                pro.push({ "name": e.name, "code": e.id });
            });
            setProvincias(pro);
        }
        getProvincias();
        async function getMetodColectaAdul() {
            const metCol = await CatalogoService.getMetodColectaAdul(1);
            const met = [];
            metCol.map((e) => {
                met.push({ "name": e.name, "code": e.id });
            });
            setMetColAdul(met);
        }
        getMetodColectaAdul();
        async function getMetodColectaInma() {
            const metCol = await CatalogoService.getMetodColectaInma();
            const met = [];
            metCol.map((e) => {
                met.push({ "name": e.name, "code": e.id });
            });
            setMetColInma(met);
        }
        getMetodColectaInma();
        async function getTaxonomia() {
            const tax = await CatalogoService.getTaxonomiaColeccion();
            const taxon = [];
            tax.map((e) => {
                taxon.push({ "name": e.name, "code": e.id });
            });
            setTaxonomias(taxon);
        }
        getTaxonomia();
    }

    const colectorProyecto = (id) => {
        async function getColectores(id) {
            const colec = await CatalogoService.getColectores(id);
            const colecs = [];
            colec.map((e) => {
                colecs.push({ "name": e.name + " " + e.lastname, "code": e.id });
            });
            setColectores(colecs);
        }
        getColectores(id);
    }

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Requerimientos Colección</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
            </span>
            <div className="my-2">
                <Button label="Nuevo" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} title="Nueva Solicitud" />
            </div>
        </div>
    );

    const saveSolicitud = () => {
        setSubmitted(true);
        async function saveRequest(request) {
            const reque = await RequerimientoService.saveRequerimientoColeccion(request);
            setRequerimientos(reque);
        }
        if (products3.length > 0 && proyectoSeleccionado && usuarioSeleccionado && estadio && medio && anali) {
            setRequest(requestEmpty);
            request.id = requerimientoId;
            request.entryDate = dateValueRequest.getDate() + '-' + (dateValueRequest.getMonth() + 1) + '-' + dateValueRequest.getFullYear();
            const user = JSON.parse(localStorage.getItem('user'));
            request.receptionUserId = user.id;
            request.requerimentUserId = usuarioSeleccionado.code;
            request.areaProjectId = proyectoSeleccionado.code;
            request.isImmatures = false;
            request.isAdults = false;
            request.isDry = false;
            request.isWet = false;
            estadio.map((e) => {
                switch (e.code) {
                    case 1:
                        request.isImmatures = true;
                        break;
                    case 2:
                        request.isAdults = true;
                        break;
                    default:
                        break;
                }
            });
            medio.map((e) => {
                switch (e.code) {
                    case 1:
                        request.isDry = true;
                        break;
                    case 2:
                        request.isWet = true;
                        break;
                    default:
                        break;
                }
            });
            if (contaminacion === 'No')
                request.isContaminated = false;
            else
                request.isContaminated = true;
            request.isCulicidae = false;
            request.isTriatominae = false;
            request.isPsychodidae = false;
            request.isSiphonaptera = false;
            request.isIxodidae = false;
            anali.map((e) => {
                switch (e) {
                    case 1:
                        request.isCulicidae = true;
                        break;
                    case 2:
                        request.isTriatominae = true;
                        break;
                    case 3:
                        request.isPsychodidae = true;
                        break;
                    case 4:
                        request.isSiphonaptera = true;
                        break;
                    case 5:
                        request.isIxodidae = true;
                        break;
                    default:
                        break;
                }
            });
            request.observationRequirement = obsReques;
            //request.observationEntry = obsRegister;

            products3.map((e) => {
                request.details.push({
                    "id": e.id,
                    "placeCode": e.placeCode,
                    "collectionDate": e.collectionDate,
                    "provinceId": e.provinceId,
                    "cantonId": e.cantonId,
                    "parishId": e.parishId,
                    "latitude": e.latitude,
                    "longitude": e.longitude,
                    "isAdult": e.stateId === 2 ? true : false,
                    "collectionMethodId": e.collectionMethodId,
                    "taxonomicId": e.taxonomicId,
                    "isDry": e.dryId === 1 ? true : false,
                    "numberContainersTubes": e.numberContainersTubes,
                    "collectorUserId": e.collectorUserId,
                    "observationSampleDetail": e.observations,
                });
            });
            saveRequest(request);
            toast.current.show({ severity: 'success', summary: 'Exito', detail: 'Solicitud guardada exitosamente', life: 5000 });
            setSolicitudDialog(false);
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
        if (products3.length > 0 && proyectoSeleccionado && usuarioSeleccionado && estadio && medio && anali) {
            saveSolicitud();
            chgStatus.requerimientoId = requerimientoId;
            chgStatus.estadoId = 2;
            changeStatus(chgStatus);
            toast.current.show({ severity: 'success', summary: 'Exito', detail: 'Solicitud enviada a procesar', life: 5000 });
            setSolicitudDialog(false);
        } else {
            toast.current.show({ severity: 'warn', summary: 'Aviso', detail: 'Ingrese toda la información', life: 5000 });
        }
    }

    const saveNewColector = () => {
        async function save(colector) {
            const colec = await RequerimientoService.postSaveColector(colector);
            const colecs = [];
            colec.map((e) => {
                colecs.push({ "name": e.name + " " + e.lastname, "code": e.id });
            });
            setColectores(colecs);
        }
        if (nameColector && lastnameColector) {
            newColector.name = nameColector;
            newColector.lastname = lastnameColector;
            newColector.projectId = proyectoSeleccionado.code;
            newColector.active = true;
            save(newColector);
            toast.current.show({ severity: 'success', summary: 'Exito', detail: 'Colector registrado', life: 5000 });
            setNewColectorDialog(false);
            setNewColector(emptyColector);
            setNameColector(null);
            setLastnameColector(null);
        } else {
            toast.current.show({ severity: 'warn', summary: 'Aviso', detail: 'Colector no registrado', life: 5000 });
        }
    }

    const searchProyecto = (event) => {
        setTimeout(() => {
            if (!event.query.trim().length) {
                setProyectoFiltrado([...proyectos]);
            }
            else {
                setProyectoFiltrado(proyectos.filter((proyecto) => {
                    return proyecto.name.toLowerCase().startsWith(event.query.toLowerCase());
                }));
            }
        }, 250);
    };

    const searchAnalisis = (event) => {
        setTimeout(() => {
            if (!event.query.trim().length) {
                setAnalisisFiltrado([...analisis]);
            }
            else {
                setAnalisisFiltrado(analisis.filter((ana) => {
                    return ana.name.toLowerCase().startsWith(event.query.toLowerCase());
                }));
            }
        }, 250);
    };

    const searchEspecificacion = (event) => {
        setTimeout(() => {
            if (!event.query.trim().length) {
                setEspecificacionFiltrado([...especificaciones]);
            }
            else {
                setEspecificacionFiltrado(especificaciones.filter((espe) => {
                    return espe.name.toLowerCase().startsWith(event.query.toLowerCase());
                }));
            }
        }, 250);
    };

    const searchTipoMuestra = (event) => {
        setTimeout(() => {
            if (!event.query.trim().length) {
                setTipoMuestraFiltrado([...tiposMuestras]);
            }
            else {
                setTipoMuestraFiltrado(tiposMuestras.filter((ana) => {
                    return ana.name.toLowerCase().startsWith(event.query.toLowerCase());
                }));
            }
        }, 250);
    };

    const searchUsuario = (event) => {
        setTimeout(() => {
            if (!event.query.trim().length) {
                setUsuarioFiltrado([...usuarios]);
            }
            else {
                setUsuarioFiltrado(usuarios.filter((usuario) => {
                    return usuario.name.toLowerCase().startsWith(event.query.toLowerCase());
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
                setProvinciaFiltrado(provincias.filter((pro) => {
                    return pro.name.toLowerCase().startsWith(event.query.toLowerCase());
                }));
            }
        }, 250);
    };

    const searchCanton = (event) => {
        setTimeout(() => {
            if (!event.query.trim().length) {
                setCantonFiltrado([...cantones]);
            }
            else {
                setCantonFiltrado(cantones.filter((pro) => {
                    return pro.name.toLowerCase().startsWith(event.query.toLowerCase());
                }));
            }
        }, 250);
    };

    const searchParroquia = (event) => {
        setTimeout(() => {
            if (!event.query.trim().length) {
                setParroquiaFiltrado([...parroquias]);
            }
            else {
                setParroquiaFiltrado(parroquias.filter((pro) => {
                    return pro.name.toLowerCase().startsWith(event.query.toLowerCase());
                }));
            }
        }, 250);
    };

    const searchTaxonomia = (event) => {
        setTimeout(() => {
            if (!event.query.trim().length) {
                setTaxonomiaFiltrado([...taxonomias]);
            }
            else {
                setTaxonomiaFiltrado(taxonomias.filter((tax) => {
                    return tax.name.toLowerCase().startsWith(event.query.toLowerCase());
                }));
            }
        }, 250);
    };

    const searchGenero = (event) => {
        setTimeout(() => {
            if (!event.query.trim().length) {
                setGeneroFiltrado([...generos]);
            }
            else {
                setGeneroFiltrado(generos.filter((gen) => {
                    return gen.name.toLowerCase().startsWith(event.query.toLowerCase());
                }));
            }
        }, 250);
    };

    const setProyectoSeleccionadoMetodo = (proyecto) => {
        setProyectoSeleccionado(proyecto.value)
    }

    const setAnalisisSeleccionadoMetodo = (analisis) => {
        setAnalisisSeleccionado(analisis.value)
        setEspecificacionesSeleccionado('');
        async function getEspecificaciones() {
            const espec = await CatalogoService.getEspecificaciones(analisis.value.code);
            const espe = [];
            espec.map((e) => {
                espe.push({ "name": e.name, "code": e.id });
            });
            setEspecificaciones(espe);
            setEspecificacionesEnable(false);
        }
        getEspecificaciones();
    }

    const setEspecificacionSeleccionadoMetodo = (especificacion) => {
        setEspecificacionesSeleccionado(especificacion.value);
    }

    const setTipoMuestraSeleccionadoMetodo = (tipoMuestra) => {
        setTipoMuestraSeleccionado(tipoMuestra.value)
    }

    const setTaxonomiaSeleccionadoMetodo = (options, taxonomia) => {
        setTaxonomiaSeleccionado(taxonomia.value);
        options.value[options.rowIndex][options.field] = taxonomia.value.name;
        options.value[options.rowIndex]['taxonomicId'] = taxonomia.value.code;
    }

    const setDateSeleccionadoMetodo = (options, e) => {
        setDateValueSample(e.target.value);
        options.value[options.rowIndex][options.field] = e.target.value.getDate() + '-' + (e.target.value.getMonth() + 1) + '-' + e.target.value.getFullYear();
    }

    const setUsuarioSeleccionadoMetodo = (usuario) => {
        setUsuarioSeleccionado(usuario.value)
    }

    const setProvinicaSeleccionadoMetodo = (options, provincia) => {
        setProvinciaSeleccionado(provincia.value)
        options.value[options.rowIndex][options.field] = provincia.value.name;
        options.value[options.rowIndex]['provinceId'] = provincia.value.code;
        async function getCantones() {
            const cantons = await CatalogoService.getCantones(provincia.value.code);
            const cant = [];
            cantons.map((e) => {
                cant.push({ "name": e.name, "code": e.id });
            });
            setCantones(cant);
            setCantonesEnable(false);
        }
        getCantones();
    }

    const setCantonSeleccionadoMetodo = (options, canton) => {
        setCantonSeleccionado(canton.value)
        options.value[options.rowIndex][options.field] = canton.value.name;
        options.value[options.rowIndex]['cantonId'] = canton.value.code;
        async function getParroquias() {
            const parros = await CatalogoService.getParroquias(canton.value.code);
            const parroqui = [];
            parros.map((e) => {
                parroqui.push({ "name": e.name, "code": e.id });
            });
            setParroquias(parroqui);
            setParroquiasEnable(false);
        }
        getParroquias();
    }

    const setParroquiaSeleccionadoMetodo = (options, parroquia) => {
        setParroquiaSeleccionado(parroquia.value)
        options.value[options.rowIndex][options.field] = parroquia.value.name;
        options.value[options.rowIndex]['parishId'] = parroquia.value.code;
    }

    const editRequest = (request) => {
        async function getRequerimiento() {
            const req = await RequerimientoService.getRequerimientoColeccion(request.id);
            setProyectoSeleccionado({ "name": req.areaProject, "code": req.areaProjectId });
            colectorProyecto(req.areaProjectId);
            setRequerimientoId(request.id);
            setAnali(req.analisisIds);
            const med = [];
            req.medioIds.map(e => {
                if (e === 1) {
                    med.push({ "name": "En seco", "code": 1 });
                } else {
                    med.push({ "name": "En húmedo", "code": 2 });
                }
            });
            setMedio(med);
            const est = [];
            req.estadioIds.map(e => {
                if (e === 1) {
                    est.push({ "name": "Inmaduro", "code": 1 });
                } else {
                    est.push({ "name": "Adulto", "code": 2 });
                }
            });
            setEstadio(est);
            if (req.contaminacion)
                setContaminacion('Si');
            else
                setContaminacion('No');
            setUsuarioSeleccionado({ "name": req.requerimentUser, "code": req.requerimentUserId });

            setObsReques(req.observationRequirement);

            setNumSample(req.details.length);
            setDateValueRequest(new Date(req.entryDate));
            setDateValueSample('');

            setProducts1([]);
            setProducts2([]);
            req.details.map(e => {
                products1.push(e);
            });
            products1.sort((a, b) => {
                let x = a.id;
                let y = b.id;
                return (x < y) ? -1 : (x > y) ? 1 : 0;
            });
            products1.map((e, index) => {
                products2.push({ "idNum": index + 1, ...e });
            });
            setProducts3(products2);
            // carga todos los catalogos para la pantalla
            loadCatalog();
            setSubmitted(false);
            setSolicitudDialog(true);
        }
        getRequerimiento();
    }

    const createDoc = (rowData) => {
        async function getConprovante() {
            const comp = await RequerimientoService.getCreateConprovanteColeccion(rowData.id);
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
            const comp = await RequerimientoService.getConprovanteColeccion(rowData.id);
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
            evidenciaUpload.id = reqLoadId;
            evidenciaUpload.evidence = evidencia;
            const user = JSON.parse(localStorage.getItem('user'));
            evidenciaUpload.userId = user.id;
            const reque = await RequerimientoService.postSaveEvidenceColeccion(evidenciaUpload);
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
                {rowData.status === "Creado" && <Button icon="pi pi-pencil" className="p-button-rounded p-button-warning mr-1" title="Editar requerimiento" onClick={() => editRequest(rowData)} style={{ height: '2rem', width: '2rem' }}></Button>}
                <Button icon="pi pi-file" className="p-button-rounded p-button-help mr-1" onClick={() => createDoc(rowData)} title="Crear documento" style={{ height: '2rem', width: '2rem' }}></Button>
                {rowData.status === "Creado" && <Button icon="pi pi-upload" className="p-button-rounded p-button-success mr-1" onClick={() => loadDoc(rowData)} title="Subir documento" style={{ height: '2rem', width: '2rem' }}></Button>}
                <Button icon="pi pi-eye" className="p-button-rounded p-button-info mr-1" onClick={() => viewDoc(rowData)} title="Ver documento" style={{ height: '2rem', width: '2rem' }}></Button>
                {/* {rowData.status === "Creado" && <Button icon="pi pi-file" className="p-button-rounded p-button-help mr-1" onClick={() => createDoc(rowData)} title="Crear documento" style={{ height: '2rem', width: '2rem' }}></Button>} */}
            </div>
        );
    }

    const statusBodyTemplate = (rowData) => {
        if (rowData.status === "Creado") {
            return (
                <>
                    <Tag severity="danger" value="Registro" rounded></Tag>
                </>
            )
        } else if (rowData.status === "Registrado") {
            return (
                <>
                    <Tag severity="warning" value="Curando" rounded></Tag>
                </>
            )
        }
        else if (rowData.status === "Procesado") {
            return (
                <>
                    <Tag severity="success" value="Aprobación" rounded></Tag>
                </>
            )
        }
        else if (rowData.status === "Validado") {
            return (
                <>
                    <Tag severity="Info" value="Entregadas" rounded></Tag>
                </>
            )
        }
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

    const onObsRequesChange = (e) => {
        const val = (e.target && e.target.value) || '';
        setObsReques(val);
    }

    ////////////////////
    const [products1, setProducts1] = useState([]);
    const [products2, setProducts2] = useState([]);
    const [products3, setProducts3] = useState([]);

    const setNewSamplesDetail = () => {
        /*setProvinciaSeleccionado(null);
        setCantonSeleccionado(null);
        setParroquiaSeleccionado(null);
        setEstadioSeleccionado(null);
        setMetodoSeleccionado(null);
        setTaxonomiaSeleccionado(null);
        setMedioSeleccionado(null);
        setColectorSeleccionado(null);*/
        emptySample.idNum = numSample + 1;
        products3.push(emptySample);
        setNumSample(numSample + 1);
    }

    const setLessSamplesDetail = () => {
        emptySample.idNum = numSample - 1;
        products3.pop(emptySample);
        setNumSample(numSample - 1);
    }

    const setGeneroSeleccionadoMetodo = (options, genero) => {
        setGeneroSeleccionado(genero.value);
        options.value[options.rowIndex][options.field] = genero.value.name;
        options.value[options.rowIndex]['genderId'] = genero.value.code;
    }

    const onEstadioChange = (options, e) => {
        setEstadioSeleccionado(e.target.value);
        setMetColSeleccionado(null);
        options.value[options.rowIndex][options.field] = e.value.name;
        options.value[options.rowIndex]['stateId'] = e.value.code;
    }

    const onMetColChange = (options, e) => {
        setMetColSeleccionado(e.target.value);
        options.value[options.rowIndex][options.field] = e.value.name;
        options.value[options.rowIndex]['collectionMethodId'] = e.value.code;
    }

    const onMedioChange = (options, e) => {
        setMedioSeleccionado(e.target.value);
        options.value[options.rowIndex][options.field] = e.value.name;
        options.value[options.rowIndex]['dryId'] = e.value.code;
    }

    const onColectorChange = (options, e) => {
        setColectorSeleccionado(e.target.value);
        options.value[options.rowIndex][options.field] = e.target.value.name;
        options.value[options.rowIndex]['collectorUserId'] = e.value.code;
    }

    const onInputTextChange = (options, e) => {
        let { rowData, field, originalEvent: event } = options;
        if (e.target.value.trim().length > 0) {
            rowData[field] = e.target.value;
        }
        else
            event.preventDefault();
    }

    const onInputTextChangeBox = (options, e) => {
        let { rowData, field, originalEvent: event } = options;
        if (e.target.value.trim().length > 0) {
            if (field === 'storage') {
                if (almacen.text1.length > 0 && almacen.text2.length > 0 && almacen.text3 == null) {
                    rowData['box'] = e.target.value;
                    rowData[field] = almacen.text1 + ' ' + rowData['box'] + almacen.text2;
                } else if (almacen.text1.length > 0 && almacen.text2.length > 0 && almacen.text3.length > 0) {
                    rowData['box'] = e.target.value;
                    rowData[field] = almacen.text1 + ' ' + rowData['box'] + almacen.text2 + ' ' + rowData['year'] + almacen.text3;
                }
                rowData['storageId'] = almacen.id;
            }
        }
        else
            event.preventDefault();
    }

    const onInputTextChangeYear = (options, e) => {
        let { rowData, field, originalEvent: event } = options;
        if (e.target.value.trim().length > 0) {
            if (field === 'storage') {
                if (almacen.text1.length > 0 && almacen.text2.length > 0 && almacen.text3.length > 0) {
                    rowData['year'] = e.target.value;
                    rowData[field] = almacen.text1 + ' ' + rowData['box'] + almacen.text2 + ' ' + rowData['year'] + almacen.text3;
                }
                rowData['storageId'] = almacen.id;
            }
        }
        else
            event.preventDefault();
    }

    const textEditor = (options) => {
        if (options.field === 'longitude') {
            return <InputText type="number" min={'-92'} max={'-75'} step={'0.000001'} onChange={(e) => onInputTextChange(options, e)} style={{ width: '7rem' }} />;
        } else if (options.field === 'latitude') {
            return <InputText type="number" min={'-5.5'} max={'1.5'} step={'0.000001'} onChange={(e) => onInputTextChange(options, e)} style={{ width: '7rem' }} />;
        } else if (options.field === 'numberContainersTubes') {
            return <InputText type="number" min={'1'} max={'999'} step={'1'} onChange={(e) => onInputTextChange(options, e)} style={{ width: '4rem' }} />;
        }
        return <InputText type="text" onChange={(e) => onInputTextChange(options, e)} />;
    }

    const provincesEditor = (options) => {
        return (
            <AutoComplete placeholder="Buscar" id="dd" dropdown value={provinciaSeleccionado} onChange={(e) => { setProvinicaSeleccionadoMetodo(options, e); }}
                suggestions={provinciaFiltrado} completeMethod={searchProvincia} field="name" />
        );
    }

    const cantonEditor = (options) => {
        return (
            <AutoComplete placeholder="Buscar" id="dd" dropdown value={cantonSeleccionado} onChange={(e) => { setCantonSeleccionadoMetodo(options, e); }}
                disabled={cantonesEnable} suggestions={cantonFiltrado} completeMethod={searchCanton} field="name" />
        );
    }

    const parroquiaEditor = (options) => {
        return (
            <AutoComplete placeholder="Buscar" id="dd" dropdown value={parroquiaSeleccionado} onChange={(e) => { setParroquiaSeleccionadoMetodo(options, e); }}
                disabled={parroquiasEnable} suggestions={parroquiaFiltrado} completeMethod={searchParroquia} field="name" />
        );
    }

    const taxonomiaEditor = (options) => {
        return (
            <AutoComplete placeholder="Buscar" id="dd" dropdown value={taxonomiaSeleccionado} onChange={(e) => { setTaxonomiaSeleccionadoMetodo(options, e); }}
                suggestions={taxonomiaFiltrado} completeMethod={searchTaxonomia} field="name" />
        );
    }

    const dateEditor = (options) => {
        return (
            <Calendar id="dateReques" showIcon showButtonBar value={dateValueSample} onChange={(e) => { setDateSeleccionadoMetodo(options, e); }}></Calendar>
        );
    }

    const estadioEditor = (options) => {
        setEstadioSeleccionado(null);
        return (
            <Dropdown value={estadioSeleccionado} options={estadios} onChange={(e) => { onEstadioChange(options, e); }} optionLabel="name" />
        );
    }

    const metodoEditor = (options) => {
        setMetColSeleccionado(null);
        if (estadioSeleccionado !== null) {
            if (estadioSeleccionado.code === 1) {
                return (
                    <Dropdown value={metColSeleccionado} options={metColInma} onChange={(e) => { onMetColChange(options, e); }} optionLabel="name" />
                );
            } else {
                return (
                    <Dropdown value={metColSeleccionado} options={metColAdul} onChange={(e) => { onMetColChange(options, e); }} optionLabel="name" />
                );
            }
        } else {
            return (null);
        }
    }

    const medioEditor = (options) => {
        setMedioSeleccionado(null);
        return (
            <Dropdown value={medioSeleccionado} options={medios} onChange={(e) => { onMedioChange(options, e); }} optionLabel="name" />
        );
    }

    const columns = [
        { field: 'idNum', header: 'Nº' },
        { field: 'placeCode', header: 'Id campo' },
        { field: 'collectionDate', header: 'Fecha colecta' },
        { field: 'province', header: 'Provincia' },
        { field: 'canton', header: 'Cantón' },
        { field: 'parish', header: 'Parroquia' },
        { field: 'latitude', header: 'Latitud' },
        { field: 'longitude', header: 'Longitud' },
        { field: 'state', header: 'Estadio' },
        { field: 'collectionMethod', header: 'Método de colecta' },
        { field: 'taxonomic', header: 'Taxón' },
        { field: 'dry', header: 'Medio' },
        { field: 'numberContainersTubes', header: 'Nº contenedores / tubos' },
        { field: 'colectorUser', header: 'Nombre de colector' },
        { field: 'observations', header: 'Observaciones' }
    ];

    const cellEditor = (options) => {
        if (options.field === 'collectionDate')
            return dateEditor(options);
        else if (options.field === 'province')
            return provincesEditor(options);
        else if (options.field === 'canton')
            return cantonEditor(options);
        else if (options.field === 'parish')
            return parroquiaEditor(options);
        else if (options.field === 'state')
            return estadioEditor(options);
        else if (options.field === 'collectionMethod')
            return metodoEditor(options);
        else if (options.field === 'taxonomic')
            return taxonomiaEditor(options);
        else if (options.field === 'dry')
            return medioEditor(options);
        else if (options.field === 'colectorUser')
            return colectorEditor(options);
        else
            return textEditor(options);
    }

    ////////////////////

    const requerimientoDialogFooter = (
        <>
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveSolicitud} />
            <Button label="Guardar y enviar a procesar" icon="pi pi-check" className="p-button-text" onClick={saveSendSolicitud}  />
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
        </>
    );

    const uploadDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Subir" icon="pi pi-check" className="p-button-text" onClick={saveEvidence} disabled={!subirButon} />
        </>
    );

    const newColectorDialogFooter = (
        <>
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveNewColector} />
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideNewDialog} />
        </>
    );


    const colectorEditor = (options) => {
        setColectorSeleccionado(null);
        return (
            <div className="p-inputgroup">
                <Dropdown value={colectorSeleccionado} options={colectores} onChange={(e) => { onColectorChange(options, e); }} optionLabel="name" />
                <Button icon="pi pi-user-plus" className="p-button-success" onClick={viewNewDialog} />
            </div>
        );
    }

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
                            <Column body={actionBodyTemplate} style={{ width: '7rem' }}></Column>
                            <Column field="status" header="Estado" sortable body={statusBodyTemplate} style={{ width: '7rem' }}></Column>
                            <Column field="number" header="Número" sortable body={numberBodyTemplate} style={{ width: '9rem' }}></Column>
                            <Column field="entryDate" header="Fecha Ingreso" sortable body={entryDateBodyTemplate} style={{ width: '8rem' }}></Column>
                            <Column field="project" header="Proyecto" sortable body={proyectoBodyTemplate} style={{ width: '15rem' }}></Column>
                            <Column field="analysis" header="Análisis" sortable body={analisisBodyTemplate} style={{ width: '7rem' }}></Column>
                            <Column field="numSamples" header="Nº contenedores tubos" sortable body={numSmplesBodyTemplate} style={{ width: '6rem' }}></Column>
                            <Column field="reqUser" header="Usuario requerente" sortable body={reqUserBodyTemplate} style={{ width: '7rem' }}></Column>
                            <Column field="recepUser" header="Usuario recepción" sortable body={recepUserBodyTemplate} style={{ width: '7rem' }}></Column>
                        </DataTable>

                        <Dialog visible={solicitudDialog} style={{ width: '98%' }} modal className="p-fluid" footer={requerimientoDialogFooter} onHide={hideDialog}>
                            <div>
                                <div className="flex">
                                    <div className="col-2 grid justify-content-center">
                                        <img src='/assets/demo/images/galeriaColeccion/registrarCol.jpg' width="200rem" height="280rem" />
                                    </div>
                                    <div className="col-10">
                                        <h3 className="m-0">Registro de ingreso de requerimiento del usuario e ingreso de muestras</h3>
                                        <div className="formgroup-inline mt-2">
                                            <div className="col-2">
                                                <label htmlFor="dateReques">Fecha del requerimiento</label>
                                                <Calendar id="dateReques" showIcon showButtonBar value={dateValueRequest} onChange={(e) => { setDateValueRequest(e.target.value); }}></Calendar>
                                            </div>
                                            <div className="col-4">
                                            </div>
                                            <div className="col-3">
                                                <label htmlFor="name">Tipo usuario</label>
                                                <div className="flex">
                                                    <div className="col-12 md:col-6">
                                                        <div className="field-radiobutton">
                                                            <RadioButton inputId="option1" name="option" checked={isInternal} onChange={(e) => setIsInternalValue(true)} />
                                                            <label htmlFor="option1">Interno</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-12 md:col-6">
                                                        <div className="field-radiobutton">
                                                            <RadioButton inputId="option2" name="option" checked={!isInternal} onChange={(e) => setIsInternalValue(false)} />
                                                            <label htmlFor="option2">Externo</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-3">
                                                <label htmlFor="name">Usuario solicitante</label>
                                                <AutoComplete placeholder="Buscar" id="dd" dropdown value={usuarioSeleccionado} onChange={(e) => { setUsuarioSeleccionadoMetodo(e); }}
                                                    suggestions={usuarioFiltrado} completeMethod={searchUsuario} field="name" />
                                                {submitted && !usuarioSeleccionado && <small style={{ color: 'red' }}>Usuario es requerido.</small>}
                                            </div>
                                        </div>
                                        <div className="formgroup-inline">
                                            <div className="col-4">
                                                <label htmlFor="name">Proyecto de investigación</label>
                                                <AutoComplete placeholder="Buscar" id="dd" dropdown value={proyectoSeleccionado} onChange={(e) => { setProyectoSeleccionadoMetodo(e); colectorProyecto(e.target.value.code); }} suggestions={proyectoFiltrado} completeMethod={searchProyecto} field="name" />
                                                {submitted && !proyectoSeleccionado && <small style={{ color: 'red' }}>Proyecto es requerido.</small>}
                                            </div>
                                            <div className="col-3">
                                                <label htmlFor="name">Estadio de artrópodos</label>
                                                <SelectButton value={estadio} options={estadios} onChange={(e) => setEstadio(e.value)} optionLabel="name" multiple />
                                                {submitted && !estadio && <small style={{ color: 'red' }}>Estadio es requerido.</small>}
                                            </div>
                                            <div className="col-3">
                                                <label htmlFor="name">Tipo de medio</label>
                                                <SelectButton value={medio} options={medios} onChange={(e) => setMedio(e.value)} optionLabel="name" multiple />
                                                {submitted && !medio && <small style={{ color: 'red' }}>Medio es requerido.</small>}
                                            </div>
                                            <div className="col-2">
                                                <label htmlFor="obser">Contaminación evidente:</label>
                                                <SelectButton value={contaminacion} options={options} onChange={(e) => setContaminacion(e.value)} />
                                            </div>
                                        </div>
                                        <div className="formgroup-inline">
                                            <div className="col-7">
                                                <label htmlFor="name">Analisis requerido</label>
                                                <SelectButton value={anali} options={analisis} onChange={(e) => setAnali(e.value)} optionLabel="name" multiple />
                                                {submitted && !anali && <small style={{ color: 'red' }}>Analisis es requerido.</small>}
                                            </div>
                                            <div className="col-5">
                                                <label htmlFor="obser">Especificaciones del análisis / Observaciones:</label>
                                                <InputTextarea id="obser" value={obsReques} onChange={(e) => onObsRequesChange(e)} rows={1} cols={20} autoResize />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mx-5">
                                    <div className="p-fluid mt-2">
                                        <DataTable value={products3} editMode="cell" className="editable-cells-table" rowHover scrollable inline style={{ fontSize: '14px', textAlign: 'center' }}
                                            emptyMessage="Ninguna muestra agragada." header={"Muestras"} size="small">
                                            {
                                                columns.map(({ field, header }) => {
                                                    return <Column key={field} field={field} header={header}
                                                        style={{ width: (field === 'idNum') ? '2rem' : (field === 'placeCode') ? '8rem' : (field === 'collectionDate') ? '8rem' : (field === 'containers') ? '8rem' : (field === 'observations') ? '15rem' : (field === 'colectorUser') ? '12rem' : '7rem' }}
                                                        editor={(options) => cellEditor(options)} />
                                                })
                                            }
                                        </DataTable>
                                        <div className="mt-2 ml-2">
                                            <Button icon="pi pi-plus" className="p-button-rounded p-button-success mr-2" onClick={() => setNewSamplesDetail()} />
                                            {products3.length > 0 && <Button icon="pi pi-minus" className="p-button-rounded p-button-danger" onClick={() => setLessSamplesDetail()} />}
                                            {submitted && products3.length === 0 && <small style={{ color: 'red' }}>Agregue al menos una muestra.</small>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Dialog>
                        <Dialog visible={newColectorDialog} style={{ width: '30%' }} modal className="p-fluid" footer={newColectorDialogFooter} onHide={hideNewDialog}>
                            <div>
                                <h5 className="m-0">Registro nuevo colector</h5>
                                <div className="field mt-4">
                                    <span className="p-float-label">
                                        <InputText id="box" type="text" value={nameColector} onChange={(e) => { setNameColector(e.target.value); }} />
                                        <label htmlFor="obser">Nombres:</label>
                                    </span>
                                    {!nameColector && <small style={{ color: 'red' }}>Ingrese el nombre.</small>}
                                </div>
                                <div className="field mt-4">
                                    <span className="p-float-label">
                                        <InputText id="box" type="text" value={lastnameColector} onChange={(e) => { setLastnameColector(e.target.value); }} />
                                        <label htmlFor="obser">Apellidos:</label>
                                    </span>
                                    {!lastnameColector && <small style={{ color: 'red' }}>Ingrese el apellido.</small>}
                                </div>
                            </div>
                        </Dialog>
                        <Dialog visible={pdfDialog} style={{ width: '850px' }} header="Evidencia" modal className="p-fluid" onHide={hideDialog}>
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