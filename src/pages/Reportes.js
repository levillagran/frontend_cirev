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

import ResultadoService from '../service/ResultadoService';
import CatalogoService from '../service/CatalogoService';

import { locale, addLocale } from 'primereact/api';

import { Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { Worker } from '@react-pdf-viewer/core';

export const Reportes = () => {

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
        observations: ''
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
        observationSampleDetail: ''
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
        details: []
    };

    let condiciones = [
        { name: 'Sí', code: true },
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

    const [requerimientos, setRequerimientos] = useState(null);
    const [requerimientoId, setRequerimientoId] = useState(null);

    const [proyectos, setProyectos] = useState(null);
    const [proyectoFiltrado, setProyectoFiltrado] = useState([]);
    const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);

    const [usuarios, setUsuarios] = useState(null);
    const [usuarioFiltrado, setUsuarioFiltrado] = useState([]);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

    const [analisisEnable, setAnalisisEnable] = useState(true);
    const [analisis, setAnalisis] = useState(null);
    const [analisisFiltrado, setAnalisisFiltrado] = useState([]);
    const [analisisSeleccionado, setAnalisisSeleccionado] = useState(null);

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

    const [preproSeleccionado, setPreproSeleccionado] = useState(null);

    const [request, setRequest] = useState(requestEmpty);
    const [requestDetail, setRequestDetail] = useState(requestDetailEmpty);

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
        setProyectoSeleccionado('');
        setAlmacenEnable(true);
        setAnalisisEnable(true);
        setEspecificacionesEnable(true);
        setUsuarioSeleccionado('');
        setAnalisisSeleccionado('');
        setEspecificacionesSeleccionado('');
        setTipoMuestraSeleccionado('');
        setIsSequence(false);
        setObsReques('');
        setObsRegister('');
        // carga todos los catalogos para la pantalla
        loadCatalog();
        setDateValueRequest('');
        setDateValueSample('');
        const fechaActual = new Date();
        setDateValueRequest(fechaActual);
        setDateValueSample(fechaActual);
        setSubmitted(false);
        setSolicitudDialog(true);
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
        async function getTipoMuestra() {
            const tipoMuestras = await CatalogoService.getTipoMuestra();
            const tipoM = [];
            tipoMuestras.map((e) => {
                tipoM.push({ "name": e.name, "code": e.id });
            });
            setTiposMuestras(tipoM);
        }
        getTipoMuestra();
        async function getProvincias() {
            const provincias = await CatalogoService.getProvincias();
            const pro = [];
            provincias.map((e) => {
                pro.push({ "name": e.name, "code": e.id });
            });
            setProvincias(pro);
        }
        getProvincias();
        async function getTaxonomia() {
            const taxonomias = await CatalogoService.getTaxonomia();
            const tax = [];
            taxonomias.map((e) => {
                tax.push({ "name": e.name, "code": e.id });
            });
            setTaxonomias(tax);
        }
        getTaxonomia();
        async function getGenero() {
            const generos = await CatalogoService.getGenero();
            const gen = [];
            generos.map((e) => {
                gen.push({ "name": e.name, "code": e.id });
            });
            setGeneros(gen);
        }
        getGenero();
    }



    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Requerimientos</h5>
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
            const reque = await ResultadoService.saveRequerimiento(request);
            setRequerimientos(reque);
        }
        if (products3.length > 0 && especificacionSeleccionado && submitted && usuarioSeleccionado && tipoMuestraSeleccionado) {
            setRequest(requestEmpty);
            request.id = requerimientoId;
            request.entryDate = dateValueRequest.getDate() + '-' + (dateValueRequest.getMonth() + 1) + '-' + dateValueRequest.getFullYear();
            request.areaProjectId = proyectoSeleccionado.code;
            request.analysisId = analisisSeleccionado.code;
            request.specificationId = especificacionSeleccionado.code;
            request.typeSampleId = tipoMuestraSeleccionado.code;
            request.isSequenced = isSequence;
            request.observationRequirement = obsReques;
            request.observationEntry = obsRegister;
            request.requerimentUserId = usuarioSeleccionado.code;
            const user = JSON.parse(localStorage.getItem('user'));
            request.receptionUserId = user.id;

            products3.map((e) => {
                setRequestDetail(requestDetailEmpty);
                requestDetail.id = e.id;
                requestDetail.placeCode = e.placeCode;
                requestDetail.collectionDate = e.collectionDate;
                requestDetail.taxonomicId = e.taxonomicId;
                requestDetail.provinceId = e.provinceId;
                requestDetail.cantonId = e.cantonId;
                requestDetail.parishId = e.parishId;
                requestDetail.latitude = e.latitude;
                requestDetail.longitude = e.longitude;
                requestDetail.genderId = e.genderId;
                requestDetail.isPreprocessed = e.isPreprocessed;
                requestDetail.isAccepted = e.isAccepted;
                requestDetail.reazonNoAccepted = e.reazonNoAccepted;
                requestDetail.storageId = e.storageId;
                requestDetail.numberBox = e.box;
                requestDetail.yearCode = e.year;
                requestDetail.observationSampleDetail = e.observations;
                request.details.push(requestDetail);
            });
            saveRequest(request);
            toast.current.show({ severity: 'success', summary: 'Exito', detail: 'Solicitud guardada exitosamente', life: 5000 });
            setSolicitudDialog(false);
            //setUsuario(emptyUsuraio);
        } else {
            toast.current.show({ severity: 'warn', summary: 'Aviso', detail: 'Ingrese toda la información', life: 5000 });
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
        setAnalisisSeleccionado('');
        setEspecificacionesSeleccionado('');
        async function getAnalisis() {
            const analisis = await CatalogoService.getAnalisis(proyecto.value.code);
            const ana = [];
            analisis.map((e) => {
                ana.push({ "name": e.name, "code": e.id });
            });
            setAnalisis(ana);
            setAnalisisEnable(false);
        }
        getAnalisis();
        async function getAlmacen() {
            const al = await CatalogoService.getAlmacen(proyecto.value.code);
            almacen.id = al.id;
            almacen.text1 = al.text01;
            almacen.text2 = al.text02;
            almacen.text3 = al.text03;
            almacen.text4 = al.text04;
            almacen.text5 = al.text05;
            setAlmacenEnable(false);
        }
        getAlmacen();
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

    const setGeneroSeleccionadoMetodo = (options, genero) => {
        setGeneroSeleccionado(genero.value);
        options.value[options.rowIndex][options.field] = genero.value.name;
        options.value[options.rowIndex]['genderId'] = genero.value.code;
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
            const req = await ResultadoService.getRequerimiento(request.id);
            setProyectoSeleccionado({ "name": req.areaProject, "code": req.areaProjectId });
            async function getAlmacen() {
                const al = await CatalogoService.getAlmacen(req.areaProjectId);
                almacen.id = al.id;
                almacen.text1 = al.text01;
                almacen.text2 = al.text02;
                almacen.text3 = al.text03;
                almacen.text4 = al.text04;
                almacen.text5 = al.text05;
                setAlmacenEnable(false);
            }
            getAlmacen();
            setAlmacenEnable(false);
            setRequerimientoId(request.id);
            setAnalisisEnable(false);
            setAnalisisSeleccionado({ "name": req.analysis, "code": req.analysisId });
            setEspecificacionesEnable(false);
            setEspecificacionesSeleccionado({ "name": req.specification, "code": req.specificationId });
            setTipoMuestraSeleccionado({ "name": req.typeSample, "code": req.typeSampleId });
            setUsuarioSeleccionado({ "name": req.requerimentUser, "code": req.requerimentUserId });
            setIsSequence(req.isSequenced);
            setObsReques(req.observationRequirement);
            setObsRegister(req.observationEntry);
            setNumSample(req.details.length);
            setDateValueRequest(new Date(req.entryDate));
            setDateValueSample('');
            setAlmacenEnable(false);
            setProducts2([]);
            req.details.map((e, index) => { 
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
                <Button icon="pi pi-upload" className="p-button-rounded p-button-success mr-1" onClick={() => loadDoc(rowData)} title="Subir documento" style={{ height: '2rem', width: '2rem' }}></Button>
                <Button icon="pi pi-eye" className="p-button-rounded p-button-info mr-1" onClick={() => viewDoc(rowData)} title="Ver documento" style={{ height: '2rem', width: '2rem' }}></Button>
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

    const changeSequence = (estado) => {
        setIsSequence(estado);
    }

    const onObsRequesChange = (e) => {
        const val = (e.target && e.target.value) || '';
        setObsReques(val);
    }

    const onObsRegisterChange = (e) => {
        const val = (e.target && e.target.value) || '';
        setObsRegister(val);
    }

    ////////////////////
    const [products2, setProducts2] = useState([]);
    const [products3, setProducts3] = useState([]);

    const setNewSamplesDetail = () => {
        emptySample.idNum = numSample + 1;
        products3.push(emptySample);
        setNumSample(numSample + 1);
    }

    const setLessSamplesDetail = () => {
        emptySample.idNum = numSample - 1;
        products3.pop(emptySample);
        setNumSample(numSample - 1);
    }

    const onIsAcceptedChange = (options, e) => {
        setAceptadoSeleccionado(e);
        options.value[options.rowIndex][options.field] = e.name;
    }

    const onIsPreprocessedChange = (options, e) => {
        setPreproSeleccionado(e);
        options.value[options.rowIndex][options.field] = e.name;
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

    const generoEditor = (options) => {
        return (
            <AutoComplete placeholder="Buscar" id="dd" dropdown value={generoSeleccionado} onChange={(e) => { setGeneroSeleccionadoMetodo(options, e); }}
                suggestions={generoFiltrado} completeMethod={searchGenero} field="name" />
        );
    }

    const almacenEditor = (options) => {
        if (almacen.text1.length > 0 && almacen.text2.length > 0 && almacen.text3 == null) {
            return (
                <div >{almacen.text1} <InputText disabled={almacenEnable} type="number" min={'1'} max={'999'} step={'1'} onChange={(e) => onInputTextChangeBox(options, e)} style={{ width: '4rem' }} />{almacen.text2} </div>
            );
        } else if (almacen.text1.length > 0 && almacen.text2.length > 0 && almacen.text3.length > 0) {
            return (
                <div >{almacen.text1} <InputText disabled={almacenEnable} type="number" min={'1'} max={'999'} step={'1'} onChange={(e) => onInputTextChangeBox(options, e)} style={{ width: '4rem' }} />{almacen.text2} <InputText disabled={almacenEnable} type="number" min={'2015'} max={'2050'} step={'1'} onChange={(e) => onInputTextChangeYear(options, e)} />{almacen.text3} </div>
            );
        }
    }

    const dateEditor = (options) => {
        return (
            <Calendar id="dateReques" showIcon showButtonBar value={dateValueSample} onChange={(e) => { setDateSeleccionadoMetodo(options, e); }}></Calendar>
        );
    }

    const isAcceptedEditor = (options) => {
        return (
            <Dropdown value={aceptadoSeleccionado} options={condiciones} onChange={(e) => { onIsAcceptedChange(options, e.target.value); }} optionLabel="name" />
        );
    }

    const isPreprocessedEditor = (options) => {
        return (
            <Dropdown value={preproSeleccionado} options={condiciones} onChange={(e) => onIsPreprocessedChange(options, e.target.value)} optionLabel="name" />
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
        { field: 'taxonomic', header: 'Taxonomía' },
        { field: 'gender', header: 'Genero' },
        { field: 'isPreprocessed', header: 'Pre-procesada' },
        { field: 'isAccepted', header: 'Calidad' },
        { field: 'razonNoAccepted', header: 'Razon no aceptada' },
        { field: 'storage', header: 'Almacenamiento' },
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
        else if (options.field === 'taxonomic')
            return taxonomiaEditor(options);
        else if (options.field === 'gender')
            return generoEditor(options);
        else if (options.field === 'storage')
            return almacenEditor(options);
        else if (options.field === 'isPreprocessed')
            return isPreprocessedEditor(options);
        else if (options.field === 'isAccepted')
            return isAcceptedEditor(options);
        else
            return textEditor(options);
    }

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
                            <Column field="number" header="Número" sortable body={numberBodyTemplate} style={{ width: '10rem' }}></Column>
                            <Column field="entryDate" header="Fecha Ingreso" sortable body={entryDateBodyTemplate} style={{ width: '6rem' }}></Column>
                            <Column field="project" header="Proyecto" sortable body={proyectoBodyTemplate} style={{ width: '15rem' }}></Column>
                            <Column field="analysis" header="Análisis" sortable body={analisisBodyTemplate} style={{ width: '7rem' }}></Column>
                            <Column field="typeSample" header="Tipo de Muestra" sortable body={typeSampleBodyTemplate} style={{ width: '7rem' }}></Column>
                            <Column field="numSamples" header="Nº Muestras" sortable body={numSmplesBodyTemplate} style={{ width: '6rem' }}></Column>
                            <Column field="reqUser" header="Usuario requerente" sortable body={reqUserBodyTemplate} style={{ width: '7rem' }}></Column>
                            <Column field="recepUser" header="Usuario recepción" sortable body={recepUserBodyTemplate} style={{ width: '7rem' }}></Column>
                            <Column field="sequence" header="Secuenciación" sortable body={sequenceBodyTemplate} style={{ width: '6rem' }}></Column>
                        </DataTable>

                        <Dialog visible={solicitudDialog} style={{ width: '98%' }} modal className="p-fluid" footer={requerimientoDialogFooter} onHide={hideDialog}>
                            <div>
                                <div className="flex">
                                    <div className="col-2 grid justify-content-center">
                                        <img src='/assets/demo/images/galeriaSistema/registro.jpg' width="175rem" height="280rem" />
                                    </div>
                                    <div className="col-10">
                                        <h3 className="m-0">Registro de ingreso de requerimiento del usuario</h3>
                                        <div className="formgroup-inline mt-2">
                                            <div className="col-3">
                                                <label htmlFor="dateReques">Fecha del requerimiento</label>
                                                <Calendar id="dateReques" showIcon showButtonBar value={dateValueRequest} onChange={(e) => { setDateValueRequest(e.target.value); }}></Calendar>
                                                {submitted && !dateValueRequest && <small className="p-invalid" >Fecha es requerido.</small>}
                                            </div>
                                            <div className="col-3">
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
                                                <label htmlFor="name">Usuario requiriente</label>
                                                <AutoComplete placeholder="Buscar" id="dd" dropdown value={usuarioSeleccionado} onChange={(e) => { setUsuarioSeleccionadoMetodo(e); }}
                                                    suggestions={usuarioFiltrado} completeMethod={searchUsuario} field="name" />
                                                {submitted && !usuarioSeleccionado && <small style={{ color: 'red' }}>Usuario es requerido.</small>}
                                            </div>
                                        </div>
                                        <div className="formgroup-inline">
                                            <div className="col-3">
                                                <label htmlFor="name">Proyecto de investigación</label>
                                                <AutoComplete placeholder="Buscar" id="dd" dropdown value={proyectoSeleccionado} onChange={(e) => { setProyectoSeleccionadoMetodo(e); }} suggestions={proyectoFiltrado} completeMethod={searchProyecto} field="name" />
                                                {submitted && !proyectoSeleccionado && <small style={{ color: 'red' }}>Proyecto es requerido.</small>}
                                            </div>
                                            <div className="col-2">
                                                <label htmlFor="name">Analisis requerido</label>
                                                <AutoComplete placeholder="Buscar" id="dd" dropdown value={analisisSeleccionado}
                                                    disabled={analisisEnable} onChange={(e) => { setAnalisisSeleccionadoMetodo(e); }} suggestions={analisisFiltrado} completeMethod={searchAnalisis} field="name" />
                                                {submitted && !analisisSeleccionado && <small style={{ color: 'red' }}>Analisis es requerido.</small>}
                                            </div>
                                            <div className="col-3">
                                                <label htmlFor="name">Especificación del analisis</label>
                                                <AutoComplete placeholder="Buscar" id="dd" dropdown value={especificacionSeleccionado}
                                                    disabled={especificacionesEnable} onChange={(e) => { setEspecificacionSeleccionadoMetodo(e); }} suggestions={especificacionFiltrado} completeMethod={searchEspecificacion} field="name" />
                                                {submitted && !especificacionSeleccionado && <small style={{ color: 'red' }}>Especificación es requerido.</small>}
                                            </div>
                                            <div className="col-2">
                                                <label htmlFor="name">Tipo de muestra</label>
                                                <AutoComplete placeholder="Buscar" id="dd" dropdown value={tipoMuestraSeleccionado} onChange={(e) => { setTipoMuestraSeleccionadoMetodo(e); }} suggestions={tipoMuestraFiltrado} completeMethod={searchTipoMuestra} field="name" />
                                                {submitted && !tipoMuestraSeleccionado && <small style={{ color: 'red' }}>Tipo de Muestra es requerido.</small>}
                                            </div>
                                            <div className="col-2">
                                                <label htmlFor="sequence">Secuenciación</label>
                                                <br />
                                                <div className="flex mt-2">
                                                    <InputSwitch className="mx-3" checked={isSequence} onChange={(e) => changeSequence(e.value)} />
                                                    {isSequence && <label className="mt-1">  Sí</label>}
                                                    {!isSequence && <label className="mt-1">  No</label>}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="formgroup-inline">
                                            <div className="col-6">
                                                <label htmlFor="obser">Observaciones del requerimiento</label>
                                                <small> (opcional)</small>
                                                <InputTextarea id="obser" value={obsReques} onChange={(e) => onObsRequesChange(e)} rows={1} cols={20} autoResize />
                                            </div>
                                            <div className="col-6">
                                                <label htmlFor="obser">Observaciones de ingreso de muestras</label>
                                                <small> (opcional)</small>
                                                <InputTextarea id="obser" value={obsRegister} onChange={(e) => onObsRegisterChange(e)} rows={1} cols={20} autoResize />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mx-5">
                                    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                                        <h5>Muestras</h5>
                                        <div className="flex">
                                            <Button icon="pi pi-plus" className="p-button-rounded p-button-success mr-2" onClick={() => setNewSamplesDetail()} />
                                            {products3.length > 0 && <Button icon="pi pi-minus" className="p-button-rounded p-button-danger" onClick={() => setLessSamplesDetail()} />}
                                            {submitted && products3.length === 0 && <small style={{ color: 'red' }}>Agregue al menos una muestra.</small>}
                                        </div>
                                    </div>
                                    <div className="p-fluid mt-2">
                                        <DataTable value={products3} editMode="cell" className="editable-cells-table" rowHover scrollable inline style={{ fontSize: '14px', textAlign: 'center' }}
                                            emptyMessage="Ninguna muestra agragada.">
                                            {
                                                columns.map(({ field, header }) => {
                                                    return <Column key={field} field={field} header={header}
                                                        style={{ width: (field === 'idNum') ? '2rem' : (field === 'placeCode') ? '8rem' : (field === 'gender') ? '7rem' : (field === 'isPreprocessed') ? '8rem' : (field === 'isAccepted') ? '6rem' : (field === 'razonNoAccepted') ? '10rem' : (field === 'collectionDate') ? '8rem' : (field === 'storage') ? '35rem' : (field === 'observations') ? '15rem' : '7rem' }}
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
