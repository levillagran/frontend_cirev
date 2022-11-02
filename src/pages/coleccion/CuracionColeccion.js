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

import CuracionService from '../../service/coleccion/CuracionService';
import EstadoService from '../../service/EstadoService';
import CatalogoService from '../../service/coleccion/CatalogoService';

import { locale, addLocale } from 'primereact/api';

import { Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { Worker } from '@react-pdf-viewer/core';

import '../../css/Montaje.css';

export const CuracionColeccion = () => {

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

    let emptyRegMontar =
    {
        id: null,
        reqDetailId: null,
        identificadorId: null,
        digitadorId: null,
        especieId: 0,
        habitatId: 0,
        metColAdulId: null,
        metColInmId: null,
        voucherId: null,
        metIdenId: null,
        sexoId: null,
        fechaIdentificacion: null,
        fechaEclosion: null,
        tipoCriadero: null,
        metodoCriadero: null,
        observaciones: null,
        armario: null,
        gaveta: null,
    };

    let emptyRegMontado =
    {
        idNum: null,
        filoName: null,
        filoId: null,
        claseName: null,
        claseId: null,
        ordenName: null,
        ordenId: null,
        familiaName: null,
        familiaId: null,
        subfamiliaName: null,
        subfamiliaId: null,
        generoName: null,
        generoId: null,
        subgeneroName: null,
        subgeneroId: null,
        especieName: null,
        especieId: null,
        sexoName: null,
        sexoId: null,
        identificador: null,
        identificadorId: null,
        fechaActual: null,
        metodoName: null,
        metodoId: null,
        voucherName: null,
        voucherId: null,
        digitador: null,
        digitadorId: null,
        fechaEclosion: null,
        metColInmaName: null,
        metColInmaId: null,
        tipCria: null,
        matCria: null,
        habitatName: null,
        habitatId: null,
        metColAdulName: null,
        metColAdulId: null,
        armario: null,
        gaveta: null,
        obsMount: null,
    };

    let emptyRegAlmacenado =
    {
        idNum: null,
        filoName: null,
        filoId: null,
        claseName: null,
        claseId: null,
        ordenName: null,
        ordenId: null,
        familiaName: null,
        familiaId: null,
        subfamiliaName: null,
        subfamiliaId: null,
        generoName: null,
        generoId: null,
        subgeneroName: null,
        subgeneroId: null,
        especieName: null,
        especieId: null,
        sexoName: null,
        sexoId: null,
        identificador: null,
        identificadorId: null,
        fechaActual: null,
        metodoName: null,
        metodoId: null,
        voucherName: null,
        voucherId: null,
        digitador: null,
        digitadorId: null,
        immatures: null,
        females: null,
        males: null,
        armario: null,
        gaveta: null,
        obsMount: null,
    };

    let emptyRegAlmacenar =
    {
        id: null,
        reqDetailId: null,
        kindId: null,
        identificadorId: null,
        digitadorId: null,
        identificationDate: null,
        voucherId: null,
        metIdenId: null,
        immatures: 0,
        females: 0,
        males: 0,
        storageBox: null,
        obsStored: null,
    };

    const toast = useRef(null);
    const dt = useRef(null);
    const [globalFilter, setGlobalFilter] = useState(null);

    const [viewPdf, setViewPdf] = useState(null);
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    const [dateValueRequest, setDateValueRequest] = useState(null);
    const [dateActualRequest, setDateActualRequest] = useState(null);
    const [dateActualEclosionRequest, setDateActualEclosionRequest] = useState(null);
    const [dateValueSample, setDateValueSample] = useState(null);
    const [processingUsersId, setProcessingUsersId] = useState("");
    const [numSample, setNumSample] = useState(0);

    const [regAlmacenar, setRegAlmacenar] = useState(emptyRegAlmacenar);
    const [regAlmacenado, setRegAlmacenado] = useState(emptyRegAlmacenado);
    const [regMontar, setRegMontar] = useState(emptyRegMontar);
    const [regMontado, setRegMontado] = useState(emptyRegMontado);

    const [idReg, setIdReg] = useState(null);
    const [kindId, setKindId] = useState(null);
    const [identifationDate, setIdentifationDate] = useState(null);
    const [immatures, setImmatures] = useState(0);
    const [females, setFemales] = useState(0);
    const [males, setMales] = useState(0);
    const [obsStored, setObStored] = useState(null);

    const [tipCria, setTipCria] = useState(null);
    const [matCria, setMatCria] = useState(null);
    const [gaveta, setGaveta] = useState(null);
    const [armario, setArmario] = useState(null);
    const [obsMount, setObsMount] = useState(null);

    const [submitted, setSubmitted] = useState(false);
    const [procesamientoDialog, setProcesamientoDialog] = useState(false);
    const [almacenarDialog, setAlmacenarDialog] = useState(false);
    const [montajeDialog, setMontajeDialog] = useState(false);
    const [pdfDialog, setPdfDialog] = useState(false);

    const [requerimientos, setRequerimientos] = useState(null);
    const [requerimientoId, setRequerimientoId] = useState(null);

    const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);
    const [muestraSeleccionado, setMuestraSeleccionado] = useState(null);
    const [muestraSeleccionadoId, setMuestraSeleccionadoId] = useState(null);

    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

    const [analisisSeleccionado, setAnalisisSeleccionado] = useState(null);

    const [especificacionSeleccionado, setEspecificacionesSeleccionado] = useState(null);

    const [tipoMuestraSeleccionado, setTipoMuestraSeleccionado] = useState(null);

    const [tecnicas, setTecnicas] = useState(null);

    const [filoEnable, setEspecificacionesEnable] = useState(true);
    const [filos, setFilos] = useState(null);
    const [filoFiltrado, setFiloFiltrado] = useState([]);
    const [filoSeleccionado, setFiloSeleccionado] = useState(null);

    const [claseEnable, setClaseEnable] = useState(true);
    const [clases, setClases] = useState(null);
    const [claseFiltrado, setClaseFiltrado] = useState([]);
    const [claseSeleccionado, setClaseSeleccionado] = useState(null);

    const [ordenEnable, setOrdenEnable] = useState(true);
    const [ordenes, setOrdenes] = useState(null);
    const [ordenFiltrado, setOrdenFiltrado] = useState([]);
    const [ordenSeleccionado, setOrdenSeleccionado] = useState(null);

    const [familiaEnable, setFamiliasEnable] = useState(true);
    const [familias, setFamilias] = useState(null);
    const [familiaFiltrado, setFamiliaFiltrado] = useState([]);
    const [familiaSeleccionado, setFamiliaSeleccionado] = useState(null);

    const [subfamiliaEnable, setSubfamiliasEnable] = useState(true);
    const [subfamilias, setSubfamilias] = useState(null);
    const [subfamiliaFiltrado, setSubfamiliaFiltrado] = useState([]);
    const [subfamiliaSeleccionado, setSubfamiliaSeleccionado] = useState(null);

    const [generosEnable, setGenerosEnable] = useState(true);
    const [generos, setGeneros] = useState(null);
    const [generoFiltrado, setGeneroFiltrado] = useState([]);
    const [generoSeleccionado, setGeneroSeleccionado] = useState(null);

    const [subgenerosEnable, setSubgenerosEnable] = useState(true);
    const [subgeneros, setSubgeneros] = useState(null);
    const [subgeneroFiltrado, setSubgeneroFiltrado] = useState([]);
    const [subgeneroSeleccionado, setSubgeneroSeleccionado] = useState(null);

    const [especiesEnable, setEspeciesEnable] = useState(true);
    const [especies, setEspecies] = useState(null);
    const [especiesFiltrado, setEspeciesFiltrado] = useState([]);
    const [especieSeleccionado, setEspecieSeleccionado] = useState(null);

    const [sexos, setSexos] = useState(null);
    const [sexoFiltrado, setSexoFiltrado] = useState([]);
    const [sexoSeleccionado, setSexoSeleccionado] = useState(null);

    const [metodos, setMetodos] = useState(null);
    const [metodosFiltrado, setMetodosFiltrado] = useState([]);
    const [metodoSeleccionado, setMetodoSeleccionado] = useState(null);

    const [vouchers, setVouchers] = useState(null);
    const [voucherFiltrado, setVoucherFiltrado] = useState([]);
    const [voucherSeleccionado, setVoucherSeleccionado] = useState(null);

    const [metColAdul, setMetColAdul] = useState(null);
    const [metColAdulFiltrado, setMetColAdulFiltrado] = useState([]);
    const [metColAdulSeleccionado, setMetColAdulSeleccionado] = useState(null);

    const [metColInma, setMetColInma] = useState(null);
    const [metColInmaFiltrado, setMetColInmaFiltrado] = useState([]);
    const [metColInmaSeleccionado, setMetColInmaSeleccionado] = useState(null);

    const [habitats, setHabitats] = useState(null);
    const [habitatFiltrado, setHabitatFiltrado] = useState([]);
    const [habitatSeleccionado, setHabitatSeleccionado] = useState(null);

    const [identificadores, setIdentificadores] = useState(null);
    const [identificadorFiltrado, setIdentificadorFiltrado] = useState([]);
    const [identificadorSeleccionado, setIdentificadorSeleccionado] = useState(null);

    const [digitadores, setDigitadores] = useState(null);
    const [digitadorFiltrado, setDigitadorFiltrado] = useState([]);
    const [digitadorSeleccionado, setDigitadorSeleccionado] = useState(null);

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
            const reque = await CuracionService.getCuraciones();
            reque.sort((a, b) => {
                let y = a.id;
                let x = b.id;
                return (x < y) ? -1 : (x > y) ? 1 : 0;
            });
            setRequerimientos(reque);
        }
        getRequerimientos();
        const fechaActual = new Date();
        setDateActualRequest(fechaActual);
        setDateActualEclosionRequest(fechaActual);
    }, []);

    const hideDialog = () => {
        setSubmitted(false);
        setProcesamientoDialog(false);
    }

    const hideAlmacenDialog = () => {
        setSubmitted(false);
        setAlmacenarDialog(false);
        setMontajeDialog(false);
        setProcesamientoDialog(true);
    }

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Registros de curación de CNVA</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    const saveSolicitud = () => {
        setSubmitted(true);
        async function saveRequest(request) {
            const reque = await CuracionService.saveProcesamiento(request);
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
            if (tecnica02Seleccionado.code) request.technique02Id = tecnica02Seleccionado.code;
            if (reactivo02Seleccionado.code) request.kitReagent02Id = reactivo02Seleccionado.code;
            if (tecnica03Seleccionado.code) request.technique03Id = tecnica03Seleccionado.code;
            if (reactivo03Seleccionado.code) request.kitReagent03Id = reactivo03Seleccionado.code;
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

    const saveStored = () => {
        setSubmitted(true);
        async function saveRequest(almacenarArr) {
            const reque = await CuracionService.saveStored(almacenarArr);
            setProducts2([]);
            reque.details.sort((a, b) => {
                let x = a.id;
                let y = b.id;
                return (x < y) ? -1 : (x > y) ? 1 : 0;
            });
            reque.details.map((e, index) => {
                products2.push({ "idNum": index + 1, ...e });
            });
            setProducts3(products2);
            setSubmitted(false);
        }
        if (almacenadosT.length > 0) {
            almacenadosT.map(e => {
                let alma =
                {
                    id: null,
                    reqDetailId: muestraSeleccionadoId,
                    kindId: e.especieId,
                    identificadorId: e.identificadorId,
                    digitadorId: e.digitadorId,
                    identificationDate: e.fechaActual,
                    voucherId: e.voucherId,
                    metIdenId: e.metodoId,
                    immatures: e.immatures,
                    females: e.females,
                    males: e.males,
                    storageBox: e.gaveta,
                    obsStored: e.obsStored,
                };
                almacenarArr.push(alma);
            });
            //console.log(almacenarArr);
            saveRequest(almacenarArr);
            setAlmacenarArr([]);
            setAlmacenarDialog(false);
            setProcesamientoDialog(true);
            toast.current.show({ severity: 'success', summary: 'Exito', detail: 'Almacenamiento exitoso', life: 5000 });
        } else {
            toast.current.show({ severity: 'warn', summary: 'Aviso', detail: 'Almacene almenos un individuo', life: 5000 });
        }
    }

    const saveMount = () => {
        setSubmitted(true);
        async function saveRequest(montarArr) {
            const reque = await CuracionService.saveMount(montarArr);
            setProducts2([]);
            reque.details.sort((a, b) => {
                let x = a.id;
                let y = b.id;
                return (x < y) ? -1 : (x > y) ? 1 : 0;
            });
            reque.details.map((e, index) => {
                products2.push({ "idNum": index + 1, ...e });
            });
            setProducts3(products2);
            setSubmitted(false);
        }
        if (montados.length > 0) {
            montados.map(e => {
                setRegMontar(emptyRegMontar);
                //regAlmacenar.id = muestraSeleccionadoId;
                regMontar.reqDetailId = muestraSeleccionadoId;
                regMontar.identificadorId = e.identificadorId;
                regMontar.digitadorId = e.digitadorId;
                regMontar.especieId = e.especieId;
                regMontar.habitatId = e.habitatId;
                regMontar.metColAdulId = e.metColAdulId;
                regMontar.metColInmId = e.metColInmaId;
                regMontar.voucherId = e.voucherId;
                regMontar.metIdenId = e.metodoId;
                regMontar.sexoId = e.sexoId;
                regMontar.fechaIdentificacion = e.fechaActual;
                regMontar.fechaEclosion = e.fechaEclosion;
                regMontar.tipoCriadero = e.tipCria;
                regMontar.metodoCriadero = e.matCria;
                regMontar.observaciones = e.obsMount;
                regMontar.armario = e.armario;
                regMontar.gaveta = e.gaveta;
                montarArr.push(regMontar);
            });
            //console.log(montarArr);
            saveRequest(montarArr);
            setMontarArr([]);
            setMontajeDialog(false);
            setProcesamientoDialog(true);
            toast.current.show({ severity: 'success', summary: 'Exito', detail: 'Montaje exitoso', life: 5000 });
            //setUsuario(emptyUsuraio);
        } else {
            toast.current.show({ severity: 'warn', summary: 'Aviso', detail: 'Monte almenos un individuo', life: 5000 });
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

    const enterProcess = (request) => {
        async function getRequerimiento() {
            const req = await CuracionService.getCuracion(request.id);
            setProyectoSeleccionado({ "name": req.areaProject, "code": req.areaProjectId });
            setRequerimientoId(request.id);
            setProcessingUsersId(req.processingUsersId);
            setAnalisisSeleccionado({ "name": req.analysis, "code": req.analysisId });
            setEspecificacionesSeleccionado({ "name": req.specification, "code": req.specificationId });
            //console.log(req)

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

    const almacenar = (muestra) => {
        setProcesamientoDialog(false);
        async function getAlmacenados() {
            const alma = await CuracionService.getAlmacenados(muestra.id);
            console.log(alma);
            setAlmacenadosT(alma);
            setMuestraSeleccionado(muestra.code);
            setMuestraSeleccionadoId(muestra.id);
            loadCatalog();
            setSubmitted(false);
            setAlmacenarDialog(true);
        }
        getAlmacenados();
    }

    const montar = (muestra) => {
        setProcesamientoDialog(false);
        //console.log(muestra);
        setMuestraSeleccionado(muestra.code);
        setMuestraSeleccionadoId(muestra.id);
        loadCatalog();
        setSubmitted(false);
        setMontajeDialog(true);

    }

    const loadCatalog = () => {
        async function getFilos() {
            const req = await CatalogoService.getFilos();
            const fils = [];
            req.map((e) => {
                fils.push({ "name": e.name, "code": e.id });
            });
            setFilos(fils);
        }
        getFilos();
        async function getSexos() {
            const sexs = await CatalogoService.getSexos();
            const sex = [];
            sexs.map((e) => {
                sex.push({ "name": e.name, "code": e.id });
            });
            setSexos(sex);
        }
        getSexos();
        async function getMetodos() {
            const metods = await CatalogoService.getMetodos();
            const mets = [];
            metods.map((e) => {
                mets.push({ "name": e.name, "code": e.id });
            });
            setMetodos(mets);
        }
        getMetodos();
        async function getVouchers() {
            const voucs = await CatalogoService.getVouchers();
            const vous = [];
            voucs.map((e) => {
                vous.push({ "name": e.name, "code": e.id });
            });
            setVouchers(vous);
        }
        getVouchers();
        async function getMetodColectaAdul() {
            const adults = await CatalogoService.getMetodColectaAdul();
            const ads = [];
            adults.map((e) => {
                ads.push({ "name": e.name, "code": e.id });
            });
            setMetColAdul(ads);
        }
        getMetodColectaAdul();
        async function getMetodColectaInma() {
            const inmads = await CatalogoService.getMetodColectaInma();
            const inms = [];
            inmads.map((e) => {
                inms.push({ "name": e.name, "code": e.id });
            });
            setMetColInma(inms);
        }
        getMetodColectaInma();
        async function getHabitats() {
            const habitats = await CatalogoService.getHabitats();
            const habs = [];
            habitats.map((e) => {
                habs.push({ "name": e.name, "code": e.id });
            });
            setHabitats(habs);
        }
        getHabitats();
        async function getIdentificadores() {
            const idents = await CatalogoService.getIdentificadores();
            const idens = [];
            idents.map((e) => {
                idens.push({ "name": e.name + " " + e.lastname, "code": e.id });
            });
            setIdentificadores(idens);
        }
        getIdentificadores();
        async function getDigitadores() {
            const digis = await CatalogoService.getDigitadores();
            const digs = [];
            digis.map((e) => {
                digs.push({ "name": e.name + " " + e.lastname, "code": e.id });
            });
            setDigitadores(digs);
        }
        getDigitadores();
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

    const almacenajeBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-amazon" className="p-button-rounded p-button-success mr-2" onClick={() => almacenar(rowData)} title="Almacenar" label='Almacenar' />
            </div>)
    }

    const montajeBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-tag" className="p-button-rounded p-button-info mr-2" onClick={() => montar(rowData)} title="Montar" label='Montar' />
            </div>)
    }

    ////////////////////
    const [products2, setProducts2] = useState([]);
    const [products3, setProducts3] = useState([]);
    const [montados, setMontados] = useState([]);
    const [montarArr, setMontarArr] = useState([]);
    const [almacenadosT, setAlmacenadosT] = useState([]);
    const [almacenarArr, setAlmacenarArr] = useState([]);

    const setNewMountDetail = () => {
        setRegMontado(emptyRegMontado);
        regMontado.idNum = numSample + 1;
        regMontado.filoName = filoSeleccionado.name;
        regMontado.filoId = filoSeleccionado.code;
        regMontado.claseName = claseSeleccionado.name;
        regMontado.claseId = claseSeleccionado.code;
        regMontado.ordenName = ordenSeleccionado.name;
        regMontado.ordenId = ordenSeleccionado.code;
        regMontado.familiaName = familiaSeleccionado.name;
        regMontado.familiaId = familiaSeleccionado.code;
        regMontado.subfamiliaName = subfamiliaSeleccionado.name;
        regMontado.subfamiliaId = subfamiliaSeleccionado.code;
        regMontado.generoName = generoSeleccionado.name;
        regMontado.generoId = generoSeleccionado.code;
        regMontado.subgeneroName = subgeneroSeleccionado.name;
        regMontado.subgeneroId = subgeneroSeleccionado.code;
        regMontado.especieName = especieSeleccionado.name;
        regMontado.especieId = especieSeleccionado.code;
        regMontado.sexoName = sexoSeleccionado.name;
        regMontado.sexoId = sexoSeleccionado.code;
        regMontado.identificador = identificadorSeleccionado.name;
        regMontado.identificadorId = identificadorSeleccionado.code;
        regMontado.fechaActual = dateActualRequest.getFullYear() + '-' + (dateActualRequest.getMonth() + 1) + '-' + dateActualRequest.getDate();
        regMontado.metodoName = metodoSeleccionado.name;
        regMontado.metodoId = metodoSeleccionado.code;
        if (voucherSeleccionado) {
            regAlmacenado.voucherName = voucherSeleccionado.name;
            regAlmacenado.voucherId = voucherSeleccionado.code;
        }
        regMontado.digitador = digitadorSeleccionado.name;
        regMontado.digitadorId = digitadorSeleccionado.code;
        regMontado.fechaEclosion = dateActualEclosionRequest.getFullYear() + '-' + (dateActualEclosionRequest.getMonth() + 1) + '-' + dateActualEclosionRequest.getDate();
        if (metColInmaSeleccionado) {
            regMontado.metColInmaName = metColInmaSeleccionado.name;
            regMontado.metColInmaId = metColInmaSeleccionado.code;
        }
        regMontado.tipCria = tipCria;
        regMontado.matCria = matCria;
        if (habitatSeleccionado) {
            regMontado.habitatName = habitatSeleccionado.name;
            regMontado.habitatId = habitatSeleccionado.code;
        }
        if (metColAdulSeleccionado) {
            regMontado.metColAdulName = metColAdulSeleccionado.name;
            regMontado.metColAdulId = metColAdulSeleccionado.code;
        }
        regMontado.armario = armario;
        regMontado.gaveta = gaveta;
        regMontado.obsMount = obsMount;
        montados.push(regMontado);

        montados.sort((a, b) => {
            let y = a.idNum;
            let x = b.idNum;
            return (x < y) ? -1 : (x > y) ? 1 : 0;
        });

        setNumSample(numSample + 1);
    }

    const setLessMountDetail = () => {
        montados.sort((a, b) => {
            let x = a.idNum;
            let y = b.idNum;
            return (x < y) ? -1 : (x > y) ? 1 : 0;
        });
        setRegMontado(emptyRegMontado);
        regMontado.idNum = numSample - 1;
        montados.pop(regMontado);
        setNumSample(numSample - 1);
        montados.sort((a, b) => {
            let y = a.idNum;
            let x = b.idNum;
            return (x < y) ? -1 : (x > y) ? 1 : 0;
        });
    }

    const setNewStoredDetail = () => {
        setRegAlmacenado(emptyRegAlmacenado);
        regAlmacenado.idNum = numSample + 1;
        regAlmacenado.filoName = filoSeleccionado.name;
        regAlmacenado.filoId = filoSeleccionado.code;
        regAlmacenado.claseName = claseSeleccionado.name;
        regAlmacenado.claseId = claseSeleccionado.code;
        regAlmacenado.ordenName = ordenSeleccionado.name;
        regAlmacenado.ordenId = ordenSeleccionado.code;
        regAlmacenado.familiaName = familiaSeleccionado.name;
        regAlmacenado.familiaId = familiaSeleccionado.code;
        regAlmacenado.subfamiliaName = subfamiliaSeleccionado.name;
        regAlmacenado.subfamiliaId = subfamiliaSeleccionado.code;
        regAlmacenado.generoName = generoSeleccionado.name;
        regAlmacenado.generoId = generoSeleccionado.code;
        regAlmacenado.subgeneroName = subgeneroSeleccionado.name;
        regAlmacenado.subgeneroId = subgeneroSeleccionado.code;
        regAlmacenado.especieName = especieSeleccionado.name;
        regAlmacenado.especieId = especieSeleccionado.code;
        regAlmacenado.identificador = identificadorSeleccionado.name;
        regAlmacenado.identificadorId = identificadorSeleccionado.code;
        regAlmacenado.fechaActual = dateActualRequest.getFullYear() + '-' + (dateActualRequest.getMonth() + 1) + '-' + dateActualRequest.getDate();
        regAlmacenado.metodoName = metodoSeleccionado.name;
        regAlmacenado.metodoId = metodoSeleccionado.code;
        if (voucherSeleccionado) {
            regAlmacenado.voucherName = voucherSeleccionado.name;
            regAlmacenado.voucherId = voucherSeleccionado.code;
        }
        regAlmacenado.digitador = digitadorSeleccionado.name;
        regAlmacenado.digitadorId = digitadorSeleccionado.code;
        regAlmacenado.immatures = immatures;
        regAlmacenado.females = females;
        regAlmacenado.males = males;
        regAlmacenado.gaveta = gaveta;
        regAlmacenado.obsStored = obsStored;
        almacenadosT.push(regAlmacenado);

        almacenadosT.sort((a, b) => {
            let y = a.idNum;
            let x = b.idNum;
            return (x < y) ? -1 : (x > y) ? 1 : 0;
        });

        setNumSample(numSample + 1);
    }

    const setLessStoredDetail = () => {
        almacenadosT.sort((a, b) => {
            let x = a.idNum;
            let y = b.idNum;
            return (x < y) ? -1 : (x > y) ? 1 : 0;
        });
        setRegAlmacenado(emptyRegAlmacenado);
        regAlmacenado.idNum = numSample - 1;
        almacenadosT.pop(regAlmacenado);
        setNumSample(numSample - 1);
        almacenadosT.sort((a, b) => {
            let y = a.idNum;
            let x = b.idNum;
            return (x < y) ? -1 : (x > y) ? 1 : 0;
        });
    }

    const onFiloChange = (e) => {
        setFiloSeleccionado(e.target.value);
        async function getClases() {
            const cantons = await CatalogoService.getClases(e.target.value.code);
            const cant = [];
            cantons.map((e) => {
                cant.push({ "name": e.name, "code": e.id });
            });
            setClases(cant);
            setClaseEnable(false);
        }
        getClases();
    }

    const onClaseChange = (e) => {
        setClaseSeleccionado(e.target.value);
        async function getOrdenes() {
            const cantons = await CatalogoService.getOrdenes(e.target.value.code);
            const cant = [];
            cantons.map((e) => {
                cant.push({ "name": e.name, "code": e.id });
            });
            setOrdenes(cant);
            setOrdenEnable(false);
        }
        getOrdenes();
    }

    const onOrdenChange = (e) => {
        setOrdenSeleccionado(e.target.value);
        async function getFamilias() {
            const cantons = await CatalogoService.getFamilias(e.target.value.code);
            const cant = [];
            cantons.map((e) => {
                cant.push({ "name": e.name, "code": e.id });
            });
            setFamilias(cant);
            setFamiliasEnable(false);
        }
        getFamilias();
    }

    const onFamiliaChange = (e) => {
        setFamiliaSeleccionado(e.target.value);
        async function getSubfamilias() {
            const cantons = await CatalogoService.getSubfamilias(e.target.value.code);
            const cant = [];
            cantons.map((e) => {
                cant.push({ "name": e.name, "code": e.id });
            });
            setSubfamilias(cant);
            setSubfamiliasEnable(false);
        }
        getSubfamilias();
    }

    const onSubfamiliaChange = (e) => {
        setSubfamiliaSeleccionado(e.target.value);
        async function getGeneros() {
            const cantons = await CatalogoService.getGeneros(e.target.value.code);
            const cant = [];
            cantons.map((e) => {
                cant.push({ "name": e.name, "code": e.id });
            });
            setGeneros(cant);
            setGenerosEnable(false);
        }
        getGeneros();
    }

    const onGeneroChange = (e) => {
        setGeneroSeleccionado(e.target.value);
        async function getSubgeneros() {
            const cantons = await CatalogoService.getSubgeneros(e.target.value.code);
            const cant = [];
            cantons.map((e) => {
                cant.push({ "name": e.name, "code": e.id });
            });
            setSubgeneros(cant);
            setSubgenerosEnable(false);
        }
        getSubgeneros();
    }

    const onSubgeneroChange = (e) => {
        setSubgeneroSeleccionado(e.target.value);
        async function getEspecies() {
            const cantons = await CatalogoService.getEspecies(e.target.value.code);
            const cant = [];
            cantons.map((e) => {
                cant.push({ "name": e.name, "code": e.id });
            });
            setEspecies(cant);
            setEspeciesEnable(false);
        }
        getEspecies();
    }

    const onEspecieChange = (e) => {
        setEspecieSeleccionado(e.target.value);
        setKindId(e.target.value.code);
    }

    const onSexoChange = (e) => {
        setSexoSeleccionado(e.target.value);
    }

    const onMetodoChange = (e) => {
        setMetodoSeleccionado(e.target.value);
    }

    const onIdentificadorChange = (e) => {
        setIdentificadorSeleccionado(e.target.value);
    }

    const onDigitadorChange = (e) => {
        setDigitadorSeleccionado(e.target.value);
    }

    const onVoucherhange = (e) => {
        setVoucherSeleccionado(e.target.value);
    }

    const onMetColInmaChange = (e) => {
        setMetColInmaSeleccionado(e.target.value);
    }

    const onMetColAdultChange = (e) => {
        setMetColAdulSeleccionado(e.target.value);
    }

    const onHabitatChange = (e) => {
        setHabitatSeleccionado(e.target.value);
    }

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

    const columns = [
        { field: 'idNum', header: 'Nº' },
        { field: 'code', header: 'Id Muestra' },
        { field: 'numberContainersTubes', header: 'Nº Contenedores/ tubos/ placas' },
        { field: 'numIndividuals', header: 'Nº Individuos' },
        { field: 'numStored', header: 'Nº Almacenados' },
        { field: 'numMount', header: 'Nº Montaje' },
    ];

    const columnsMounts = [
        { field: 'idNum', header: 'Nº' },
        { field: 'filoName', header: 'Filo' },
        { field: 'claseName', header: 'Clase' },
        { field: 'ordenName', header: 'Orden' },
        { field: 'familiaName', header: 'Familia' },
        { field: 'subfamiliaName', header: 'Subfamilia' },
        { field: 'generoName', header: 'Genero' },
        { field: 'subgeneroName', header: 'Subgenero' },
        { field: 'especieName', header: 'Especie' },
        { field: 'sexoName', header: 'Sexo' },
        { field: 'identificador', header: 'Identificador' },
        { field: 'fechaActual', header: 'Fecha identificación' },
        { field: 'metodoName', header: 'Método identificación' },
        { field: 'voucherName', header: 'Voucher molecular' },
        { field: 'digitador', header: 'Digitador' },
        { field: 'fechaEclosion', header: 'Fecha eclosión' },
        { field: 'metColInmaName', header: 'Metodo colecta inmaduros' },
        { field: 'tipCria', header: 'Tipo criadero' },
        { field: 'matCria', header: 'Material criadero' },
        { field: 'habitatName', header: 'Habitat' },
        { field: 'metColAdulName', header: 'Metodo colecta adultos' },
        { field: 'armario', header: 'Armario' },
        { field: 'gaveta', header: 'Caja' },
        { field: 'obsMount', header: 'Observaciones' },
    ];

    const columnsStored = [
        { field: 'idNum', header: 'Nº' },
        { field: 'filoName', header: 'Filo' },
        { field: 'claseName', header: 'Clase' },
        { field: 'ordenName', header: 'Orden' },
        { field: 'familiaName', header: 'Familia' },
        { field: 'subfamiliaName', header: 'Subfamilia' },
        { field: 'generoName', header: 'Genero' },
        { field: 'subgeneroName', header: 'Subgenero' },
        { field: 'especieName', header: 'Especie' },
        { field: 'identificador', header: 'Identificador' },
        { field: 'fechaActual', header: 'Fecha identificación' },
        { field: 'metodoName', header: 'Método identificación' },
        { field: 'voucherName', header: 'Voucher molecular' },
        { field: 'digitador', header: 'Digitador' },
        { field: 'immature', header: 'Inmaduros' },
        { field: 'females', header: 'Hembras' },
        { field: 'males', header: 'Machos' },
        { field: 'gaveta', header: 'Caja' },
        { field: 'obsStored', header: 'Observaciones' },
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
            {/* <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveSolicitud} />
            <Button label="Guardar y eviar para validación" icon="pi pi-check" className="p-button-text" onClick={saveSendSolicitud} /> */}
            <Button label="Regresar" icon="pi pi-chevron-up" className="p-button-text" onClick={hideDialog} />
        </>
    );

    const almacenamientoDialogFooter = (
        <>
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveStored} />
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideAlmacenDialog} />
        </>
    );

    const montajeDialogFooter = (
        <>
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveMount} />
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideAlmacenDialog} />
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
                            <Column field="numSamples" header="Nº Muestras" sortable body={numSmplesBodyTemplate} style={{ width: '6rem' }}></Column>
                            <Column field="reqUser" header="Usuario requerente" sortable body={reqUserBodyTemplate} style={{ width: '7rem' }}></Column>
                            <Column field="recepUser" header="Usuario recepción" sortable body={recepUserBodyTemplate} style={{ width: '7rem' }}></Column>
                        </DataTable>

                        <Dialog visible={procesamientoDialog} style={{ width: '80%' }} modal className="p-fluid" footer={requerimientoDialogFooter} onHide={hideDialog}>
                            <div>
                                <div className="flex">
                                    <div className="col-3 grid justify-content-center">
                                        <img src='/assets/demo/images/galeriaColeccion/curacionCol.jpg' height="110rem" />
                                    </div>
                                    <div className="col-10">
                                        <h3 className="m-0">Registro de actividades de curación de CNVA</h3>
                                        <div className="formgroup-inline">
                                            <div className="col-3">
                                                <label >Fecha requerimiento</label>
                                                <br />
                                                <label className="text-500">{Moment(dateValueRequest).format('DD-MM-YYYY')}</label>
                                            </div>
                                            <div className="col-4">
                                                <label >Proyecto de investigación</label>
                                                <br />
                                                {proyectoSeleccionado && <label className="text-500">{proyectoSeleccionado.name}</label>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mx-5">
                                    <div className="p-fluid mt-2">
                                        <DataTable value={products3} editMode="cell" className="editable-cells-table" rowHover scrollable inline style={{ fontSize: '14px', textAlign: 'center' }}
                                            emptyMessage="Ninguna muestra agragada." header={"Muestras"} >
                                            {
                                                columns.map(({ field, header }) => {
                                                    return <Column key={field} field={field} header={header}
                                                        style={{ width: field === 'idNum' ? '1rem' : field === 'code' ? '4rem' : '5rem', textAlign: "center" }}
                                                        editor={(options) => cellEditor(options)} />
                                                })
                                            }
                                            <Column header="Almacenado" body={almacenajeBodyTemplate} style={{ width: '5rem', textAlign: "center" }}></Column>
                                            <Column header="Montaje" body={montajeBodyTemplate} style={{ width: '5rem', textAlign: "center" }}></Column>
                                        </DataTable>
                                    </div>
                                </div>
                            </div>
                        </Dialog>

                        <Dialog visible={almacenarDialog} style={{ width: '98%' }} modal className="p-fluid" footer={almacenamientoDialogFooter} onHide={hideAlmacenDialog}>
                            <div>
                                <div className="flex mx-6">
                                    <div className="col-3 grid justify-content-center">
                                        <img src='/assets/demo/images/galeriaColeccion/almacenCol.jpg' height="90rem" />
                                    </div>
                                    <div className="col-9">
                                        <h3 className="m-0">Registro muestras almacenadas de CNVA</h3>
                                        <div className="formgroup-inline">
                                            <div className="col-4">
                                                <label >Fecha requerimiento</label>
                                                <br />
                                                <label className="text-500">{Moment(dateValueRequest).format('DD-MM-YYYY')}</label>
                                            </div>
                                            <div className="col-5">
                                                <label >Proyecto de investigación</label>
                                                <br />
                                                {proyectoSeleccionado && <label className="text-500">{proyectoSeleccionado.name}</label>}
                                            </div>
                                            <div className="col-3">
                                                <label >Código de campo</label>
                                                <br />
                                                <label className="text-500">{muestraSeleccionado}</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex mx-2">
                                    <div className="fondo-tipo col-2 justify-content-center">
                                        <h6>Curación</h6>
                                        <div className="field  mt-4">
                                            <span className="p-float-label">
                                                <Dropdown id="Filo" name="Filo" value={filoSeleccionado} onChange={(e) => { onFiloChange(e); }} options={filos} optionLabel="name" />
                                                <label htmlFor="Filo">* Filo</label>
                                            </span>
                                        </div>
                                        <div className="field mt-4">
                                            <span className="p-float-label">
                                                <Dropdown id="Clase" name="Clase" value={claseSeleccionado} onChange={(e) => { onClaseChange(e); }} options={clases} optionLabel="name" disabled={claseEnable} />
                                                <label htmlFor="Clase">* Clase</label>
                                            </span>
                                        </div>
                                        <div className="field mt-4">
                                            <span className="p-float-label">
                                                <Dropdown id="Orden" name="Orden" value={ordenSeleccionado} onChange={(e) => { onOrdenChange(e); }} options={ordenes} optionLabel="name" disabled={ordenEnable} />
                                                <label htmlFor="Orden">* Orden</label>
                                            </span>
                                        </div>
                                        <div className="field mt-4">
                                            <span className="p-float-label">
                                                <Dropdown id="Familia" name="Familia" value={familiaSeleccionado} onChange={(e) => { onFamiliaChange(e); }} options={familias} optionLabel="name" disabled={familiaEnable} />
                                                <label htmlFor="Familia">* Familia</label>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="fondo-tipo col-2 justify-content-center">
                                        <div className="field mt-4">
                                            <span className="p-float-label">
                                                <Dropdown id="Subfamilia" name="Subfamilia" value={subfamiliaSeleccionado} onChange={(e) => { onSubfamiliaChange(e); }} options={subfamilias} optionLabel="name" disabled={subfamiliaEnable} />
                                                <label htmlFor="Subfamilia">* Subfamilia</label>
                                            </span>
                                        </div>
                                        <div className="field mt-4">
                                            <span className="p-float-label">
                                                <Dropdown id="Gerero" name="Gerero" value={generoSeleccionado} onChange={(e) => { onGeneroChange(e); }} options={generos} optionLabel="name" disabled={generosEnable} />
                                                <label htmlFor="Gerero">* Gerero</label>
                                            </span>
                                        </div>
                                        <div className="field mt-4">
                                            <span className="p-float-label">
                                                <Dropdown id="Subgenero" name="Subgenero" value={subgeneroSeleccionado} onChange={(e) => { onSubgeneroChange(e); }} options={subgeneros} optionLabel="name" disabled={subgenerosEnable} />
                                                <label htmlFor="Subgenero">* Subgenero</label>
                                            </span>
                                        </div>
                                        <div className="field mt-4">
                                            <span className="p-float-label">
                                                <Dropdown id="Especie" name="Especie" value={especieSeleccionado} onChange={(e) => { onEspecieChange(e); }} options={especies} optionLabel="name" disabled={especiesEnable} />
                                                <label htmlFor="Especie">* Especie</label>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="fondo-persona col-2 justify-content-center">
                                        <h6>Datos personal</h6>
                                        <div className="field mt-4">
                                            <span className="p-float-label">
                                                <Dropdown id="Gerero" name="Gerero" value={identificadorSeleccionado} onChange={(e) => { onIdentificadorChange(e); }} options={identificadores} optionLabel="name" />
                                                <label htmlFor="Gerero">* Identificador</label>
                                            </span>
                                        </div>
                                        <div className="field mt-4">
                                            <span className="p-float-label">
                                                <Dropdown id="Especie" name="Especie" value={digitadorSeleccionado} onChange={(e) => { onDigitadorChange(e); }} options={digitadores} optionLabel="name" />
                                                <label htmlFor="Especie">* Digitador</label>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="fondo-inmaduros col-2 justify-content-center">
                                        <h6>Datos identificación</h6>
                                        <div className="field mt-4">
                                            <span className="p-float-label">
                                                <Calendar id="dateReques" showIcon showButtonBar value={dateActualRequest} onChange={(e) => { setDateActualRequest(e.target.value); }}></Calendar>
                                                <label htmlFor="dateReques">* Fecha de identificación</label>
                                            </span>
                                        </div>
                                        <div className="field mt-4">
                                            <span className="p-float-label">
                                                <Dropdown id="metodo" name="metodo" value={metodoSeleccionado} onChange={(e) => { onMetodoChange(e); }} options={metodos} optionLabel="name" />
                                                <label htmlFor="metodo">* Método de identificación</label>
                                            </span>
                                        </div>
                                        <div className="field mt-4">
                                            <span className="p-float-label">
                                                <Dropdown id="voucher" name="voucher" value={voucherSeleccionado} onChange={(e) => { onVoucherhange(e); }} options={vouchers} optionLabel="name" />
                                                <label htmlFor="voucher">Voucher molecular</label>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="fondo-adultos col-2 justify-content-center">
                                        <h6>Inmaduros</h6>
                                        <div className="field mt-4">
                                            <span className="p-float-label">
                                                <InputText id="hembras" type="number" min={'0'} max={'999'} step={'1'} value={immatures} onChange={(e) => { setImmatures(e.target.value); }} />
                                                <label htmlFor="hembras">Nº Inmaduros</label>
                                            </span>
                                        </div>
                                        <h6>Adultos</h6>
                                        <div className="field mt-4">
                                            <span className="p-float-label">
                                                <InputText id="hembras" type="number" min={'0'} max={'999'} step={'1'} value={females} onChange={(e) => { setFemales(e.target.value); }} />
                                                <label htmlFor="hembras">Nº Hembras</label>
                                            </span>
                                        </div>
                                        <div className="field mt-4">
                                            <span className="p-float-label">
                                                <InputText id="machos" type="number" min={'0'} max={'999'} step={'1'} value={males} onChange={(e) => { setMales(e.target.value) }} />
                                                <label htmlFor="machos">Nº Machos</label>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-2 justify-content-center">
                                        <h6>Almacenamiento</h6>
                                        <div className="field mt-4">
                                            <span className="p-float-label">
                                                <InputText id="hembras" type="text" value={gaveta} onChange={(e) => { setGaveta(e.target.value); }} />
                                                <label htmlFor="hembras">* Caja de almacenamiento</label>
                                            </span>
                                        </div>
                                        <div className="field mt-4">
                                            <br />
                                            <br />
                                        </div>
                                        <div className="field mt-4">
                                            <span className="p-float-label">
                                                <InputTextarea id="obser" value={obsMount} onChange={(e) => { setObsMount(e.target.value); }} rows={1} cols={20} autoResize />
                                                <label htmlFor="obser">Observaciones</label>
                                            </span>
                                        </div>
                                        <div className="flex align-items-center justify-content-center mt-4">
                                            {especieSeleccionado && metodoSeleccionado && gaveta && <Button icon="pi pi-plus" className="p-button-rounded p-button-success mr-2" onClick={() => setNewStoredDetail()} />}
                                            {(!especieSeleccionado || !metodoSeleccionado || !gaveta) && <Button icon="pi pi-plus" className="p-button-rounded p-button-success mr-2" onClick={() => setNewStoredDetail()} disabled />}
                                            {almacenadosT.length > 0 && <Button icon="pi pi-minus" className="p-button-rounded p-button-danger" onClick={() => setLessStoredDetail()} />}
                                            {submitted && montados.length === 0 && <small style={{ color: 'red' }}>Agregue al menos un montaje.</small>}
                                        </div>
                                    </div>
                                </div>
                                <div className="mx-4">
                                    <div className="p-fluid mt-2">
                                        <DataTable value={almacenadosT} className="editable-cells-table" rowHover scrollable inline style={{ fontSize: '14px', textAlign: 'center' }}
                                            emptyMessage="Ninguno almacenado." header={"Almacenados"} size="small">
                                            {
                                                columnsStored.map(({ field, header }) => {
                                                    return <Column key={field} field={field} header={header}
                                                        style={{ width: field === 'idNum' ? '2rem' : '8rem' }}
                                                    />
                                                })
                                            }
                                        </DataTable>
                                    </div>
                                </div>
                            </div>
                        </Dialog>

                        <Dialog visible={montajeDialog} style={{ width: '98%' }} modal className="p-fluid" footer={montajeDialogFooter} onHide={hideAlmacenDialog}>
                            <div>
                                <div className="flex">
                                    <div className="col-12">
                                        <div className="flex">
                                            <div className="col-2 grid justify-content-center">
                                                <img src='/assets/demo/images/galeriaColeccion/montarCol.jpg' height="110rem" />
                                            </div>
                                            <div className="col-10">
                                                <h3>Registro de montaje</h3>
                                                <div className="formgroup-inline">
                                                    <div className="col-2">
                                                        <label >Fecha requerimiento</label>
                                                        <br />
                                                        <label className="text-500">{Moment(dateValueRequest).format('DD-MM-YYYY')}</label>
                                                    </div>
                                                    <div className="col-2">
                                                        <label >Proyecto de investigación</label>
                                                        <br />
                                                        {proyectoSeleccionado && <label className="text-500">{proyectoSeleccionado.name}</label>}
                                                    </div>
                                                    <div className="col-2">
                                                        <label >Código de campo del tubo</label>
                                                        <br />
                                                        <label className="text-500">{muestraSeleccionado}</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex mx-2">
                                            <div className="fondo-tipo col-2 justify-content-center">
                                                <h6>Curación</h6>
                                                <div className="field  mt-4">
                                                    <span className="p-float-label">
                                                        <Dropdown id="Filo" name="Filo" value={filoSeleccionado} onChange={(e) => { onFiloChange(e); }} options={filos} optionLabel="name" />
                                                        <label htmlFor="Filo">* Filo</label>
                                                    </span>
                                                </div>
                                                <div className="field mt-4">
                                                    <span className="p-float-label">
                                                        <Dropdown id="Clase" name="Clase" value={claseSeleccionado} onChange={(e) => { onClaseChange(e); }} options={clases} optionLabel="name" disabled={claseEnable} />
                                                        <label htmlFor="Clase">* Clase</label>
                                                    </span>
                                                </div>
                                                <div className="field mt-4">
                                                    <span className="p-float-label">
                                                        <Dropdown id="Orden" name="Orden" value={ordenSeleccionado} onChange={(e) => { onOrdenChange(e); }} options={ordenes} optionLabel="name" disabled={ordenEnable} />
                                                        <label htmlFor="Orden">* Orden</label>
                                                    </span>
                                                </div>
                                                <div className="field mt-4">
                                                    <span className="p-float-label">
                                                        <Dropdown id="Familia" name="Familia" value={familiaSeleccionado} onChange={(e) => { onFamiliaChange(e); }} options={familias} optionLabel="name" disabled={familiaEnable} />
                                                        <label htmlFor="Familia">* Familia</label>
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="fondo-tipo col-2 justify-content-center">
                                                <div className="field mt-4">
                                                    <span className="p-float-label">
                                                        <Dropdown id="Subfamilia" name="Subfamilia" value={subfamiliaSeleccionado} onChange={(e) => { onSubfamiliaChange(e); }} options={subfamilias} optionLabel="name" disabled={subfamiliaEnable} />
                                                        <label htmlFor="Subfamilia">* Subfamilia</label>
                                                    </span>
                                                </div>
                                                <div className="field mt-4">
                                                    <span className="p-float-label">
                                                        <Dropdown id="Gerero" name="Gerero" value={generoSeleccionado} onChange={(e) => { onGeneroChange(e); }} options={generos} optionLabel="name" disabled={generosEnable} />
                                                        <label htmlFor="Gerero">* Gerero</label>
                                                    </span>
                                                </div>
                                                <div className="field mt-4">
                                                    <span className="p-float-label">
                                                        <Dropdown id="Subgenero" name="Subgenero" value={subgeneroSeleccionado} onChange={(e) => { onSubgeneroChange(e); }} options={subgeneros} optionLabel="name" disabled={subgenerosEnable} />
                                                        <label htmlFor="Subgenero">* Subgenero</label>
                                                    </span>
                                                </div>
                                                <div className="field mt-4">
                                                    <span className="p-float-label">
                                                        <Dropdown id="Especie" name="Especie" value={especieSeleccionado} onChange={(e) => { onEspecieChange(e); }} options={especies} optionLabel="name" disabled={especiesEnable} />
                                                        <label htmlFor="Especie">* Especie</label>
                                                    </span>
                                                </div>
                                                <div className="field mt-4">
                                                    <span className="p-float-label">
                                                        <Dropdown id="sex" name="sex" value={sexoSeleccionado} onChange={(e) => { onSexoChange(e); }} options={sexos} optionLabel="name" />
                                                        <label htmlFor="sex">* Sexo</label>
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="fondo-persona col-2 justify-content-center">
                                                <h6>Datos personal</h6>
                                                <div className="field mt-4">
                                                    <span className="p-float-label">
                                                        <Dropdown id="indicador" name="indicador" value={identificadorSeleccionado} onChange={(e) => { onIdentificadorChange(e); }} options={identificadores} optionLabel="name" />
                                                        <label htmlFor="indicador">* Identificador</label>
                                                    </span>
                                                </div>
                                                <div className="field mt-4">
                                                    <span className="p-float-label">
                                                        <Calendar id="dateReques" showIcon showButtonBar value={dateActualRequest} onChange={(e) => { setDateActualRequest(e.target.value); }}></Calendar>
                                                        <label htmlFor="dateReques">* Fecha de identificación</label>
                                                    </span>
                                                </div>
                                                <div className="field mt-4">
                                                    <span className="p-float-label">
                                                        <Dropdown id="metodo" name="metodo" value={metodoSeleccionado} onChange={(e) => { onMetodoChange(e); }} options={metodos} optionLabel="name" />
                                                        <label htmlFor="metodo">* Método de identificación</label>
                                                    </span>
                                                </div>
                                                <div className="field mt-4">
                                                    <span className="p-float-label">
                                                        <Dropdown id="voucher" name="voucher" value={voucherSeleccionado} onChange={(e) => { onVoucherhange(e); }} options={vouchers} optionLabel="name" />
                                                        <label htmlFor="voucher">Voucher molecular</label>
                                                    </span>
                                                </div>
                                                <div className="field mt-4">
                                                    <span className="p-float-label">
                                                        <Dropdown id="digitador" name="digitador" value={digitadorSeleccionado} onChange={(e) => { onDigitadorChange(e); }} options={digitadores} optionLabel="name" />
                                                        <label htmlFor="digitador">* Digitador</label>
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="fondo-inmaduros col-2 justify-content-center">
                                                <h6>Inmaduros</h6>
                                                <div className="field mt-4">
                                                    <span className="p-float-label">
                                                        <Calendar id="dateReques" showIcon showButtonBar value={dateActualEclosionRequest} onChange={(e) => { setDateActualEclosionRequest(e.target.value); }}></Calendar>
                                                        <label htmlFor="dateReques">Fecha de eclosión</label>
                                                    </span>
                                                </div>
                                                <div className="field mt-4">
                                                    <span className="p-float-label">
                                                        <Dropdown id="metColInma" name="metColInma" value={metColInmaSeleccionado} onChange={(e) => { onMetColInmaChange(e); }} options={metColInma} optionLabel="name" />
                                                        <label htmlFor="metColInma">Método de colecta</label>
                                                    </span>
                                                </div>
                                                <div className="field mt-4">
                                                    <span className="p-float-label">
                                                        <InputText id="machos" type="text" value={tipCria} onChange={(e) => { setTipCria(e.target.value); }} />
                                                        <label htmlFor="machos">Tipo de criadero</label>
                                                    </span>
                                                </div>
                                                <div className="field mt-4">
                                                    <span className="p-float-label">
                                                        <InputText id="machos" type="text" value={matCria} onChange={(e) => { setMatCria(e.target.value); }} />
                                                        <label htmlFor="individuos">Material de criadero</label>
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="fondo-adultos col-2 justify-content-center">
                                                <h6>Adultos</h6>
                                                <div className="field mt-4">
                                                    <span className="p-float-label">
                                                        <Dropdown id="habitat" name="habitat" value={habitatSeleccionado} onChange={(e) => { onHabitatChange(e); }} options={habitats} optionLabel="name" />
                                                        <label htmlFor="habitat">Hábitat</label>
                                                    </span>
                                                </div>
                                                <div className="field mt-4">
                                                    <span className="p-float-label">
                                                        <Dropdown id="metColAdul" name="metColAdul" value={metColAdulSeleccionado} onChange={(e) => { onMetColAdultChange(e); }} options={metColAdul} optionLabel="name" />
                                                        <label htmlFor="metColAdul">Método de colecta</label>
                                                    </span>
                                                </div>

                                            </div>
                                            <div className="col-2 justify-content-center">
                                                <h6>Almacenamiento</h6>
                                                <div className="field mt-4">
                                                    <span className="p-float-label">
                                                        <InputText id="hembras" type="text" value={armario} onChange={(e) => { setArmario(e.target.value); }} />
                                                        <label htmlFor="hembras">* Armario / estante</label>
                                                    </span>
                                                </div>
                                                <div className="field mt-4">
                                                    <span className="p-float-label">
                                                        <InputText id="hembras" type="text" value={gaveta} onChange={(e) => { setGaveta(e.target.value); }} />
                                                        <label htmlFor="hembras">* Caja entomología / Gaveta</label>
                                                    </span>
                                                </div>
                                                <div className="field mt-4">
                                                    <br />
                                                    <br />
                                                </div>
                                                <div className="field mt-4">
                                                    <span className="p-float-label">
                                                        <InputTextarea id="obser" value={obsMount} onChange={(e) => { setObsMount(e.target.value); }} rows={1} cols={20} autoResize />
                                                        <label htmlFor="obser">Observaciones</label>
                                                    </span>
                                                </div>
                                                <div className="flex align-items-center justify-content-center mt-4">
                                                    {sexoSeleccionado && especieSeleccionado && metodoSeleccionado && armario && gaveta && <Button icon="pi pi-plus" className="p-button-rounded p-button-success mr-2" onClick={() => setNewMountDetail()} />}
                                                    {(!sexoSeleccionado || !especieSeleccionado || !metodoSeleccionado || !armario || !gaveta) && <Button icon="pi pi-plus" className="p-button-rounded p-button-success mr-2" onClick={() => setNewMountDetail()} disabled />}
                                                    {montados.length > 0 && <Button icon="pi pi-minus" className="p-button-rounded p-button-danger" onClick={() => setLessMountDetail()} />}
                                                    {submitted && montados.length === 0 && <small style={{ color: 'red' }}>Agregue al menos un montaje.</small>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mx-4">
                                    <div className="p-fluid mt-2">
                                        <DataTable value={montados} className="editable-cells-table" rowHover scrollable inline style={{ fontSize: '14px', textAlign: 'center' }}
                                            emptyMessage="Ninguno montado." header={"Montados"} size="small">
                                            {
                                                columnsMounts.map(({ field, header }) => {
                                                    return <Column key={field} field={field} header={header}
                                                        style={{ width: field === 'idNum' ? '2rem' : '8rem' }}
                                                    />
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
