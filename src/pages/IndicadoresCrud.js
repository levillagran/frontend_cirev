import React, { useState, useEffect, useRef } from 'react';
import { TreeTable } from 'primereact/treetable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Calendar } from 'primereact/calendar';
import { locale, addLocale } from 'primereact/api';
import { Toast } from 'primereact/toast';

import IndicadorService from '../service/IndicadorService';

import '../css/Indicadores.css';

import { Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { Worker } from '@react-pdf-viewer/core';

export const IndicadoresCrud = () => {

    let emptyIndicador = {
        indicadorId: null,
        code: '',
        userId: null,
        cantonId: null,
        valueIndicadorId: null,
        value: '',
        date: null,
        dateRegister: null,
        font: '',
        obs: '',
        archivo: [],
    };

    const emptyOptions = [
        { name: '', code: '1' },
        { name: '', code: '2' },
        { name: '', code: '3' }
    ];

    let emptyIndiValue = {
        code: null,
        description: '',
        ejeId: null,
        indicadorId: null,
        name: '',
        obligatory: null,
        desnutrition: null,
        maternity: null,
        violence: null,
        option1: '',
        option2: '',
        option3: '',
        type: '',
        UserId: null,
        archivo: null,
        date: null,
        dateregister: null,
        valorIndiId: null,
        cuantitativo: null,
        limite1: null,
        limite2: null,
        limite3: null,
        limite4: null,
    };

    const [indicadores, setIndicadores] = useState([]);
    const [indicadorSave, setIndicadorSave] = useState(emptyIndicador);
    const [option, setOption] = useState(null);

    const [valor, setValor] = useState(null);
    const [font, setFont] = useState('');
    const [obs, setObs] = useState('');
    const [archivo, setArchivo] = useState(false);

    const [dataDialog, setDataDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [indiTittle, setIndiTittle] = useState('');
    const [indiDes, setIndiDes] = useState('');
    const [indiValue, setIndiValue] = useState(emptyIndiValue);
    const [calendarValue, setCalendarValue] = useState('');
    const [calendarValueReporte, setCalendarValueReporte] = useState('');
    const toast = useRef(null);

    const [dropdownOptions, setDropdownOptions] = useState(emptyOptions);

    const [globalFilter2, setGlobalFilter2] = useState(null);

    const [pdfDialog, setPdfDialog] = useState(false);
    const defaultLayoutPluginInstance = defaultLayoutPlugin();
    const [viewPdf, setViewPdf] = useState(null);

    useEffect(() => {
        async function getIndicadores() {
            const user = JSON.parse(localStorage.getItem('user'));
            const indica = await IndicadorService.getIndicadores(user.id);
            setIndicadores(indica);
        }
        getIndicadores();
    }, []);

    const onEditorValueDropChange = (valor) => {
        indicadorSave.code = indiValue.code;
        indicadorSave.indicadorId = indiValue.indicadorId;
        setValor(valor);
    }

    const setOpt = (option) => {
        setOption(option);
    }

    const rowClassName = (node) => {
        return {
            'row-eje ': (node.children && node.key.length < 2),
            'row-determinate ': (node.children && node.key.length > 1)
        };
    }

    const codigoTemplate = (node) => {
        let codigo = node.data.code;
        let fontWeight = 'bold';

        return <span style={{ fontWeight: fontWeight }}>{codigo}</span>;
    }

    const tittleTemplate = (node) => {
        let tittle = node.data.name;
        return <span>{tittle}</span>;
    }

    const dataAdd = (i) => {
        indicadorSave.archivo = "";
        indiValue.code = i.data.code;
        indiValue.description = i.data.description;
        indiValue.ejeId = i.data.ejeId;
        indiValue.indicadorId = i.data.indicadorId;
        indiValue.name = i.data.name;
        indiValue.obligatory = i.data.obligatory;
        indiValue.option1 = i.data.option1;
        indiValue.option2 = i.data.option2;
        indiValue.option3 = i.data.option3;
        indiValue.type = i.data.type;
        indiValue.desnutrition = i.data.desnutrition;
        indiValue.maternity = i.data.maternity;
        indiValue.violence = i.data.violence;
        indiValue.archivo = i.data.archivo;
        indiValue.cuantitativo = i.data.cuantitativo;
        indiValue.limite1 = i.data.limite1;
        indiValue.limite2 = i.data.limite2;
        indiValue.limite3 = i.data.limite3;
        indiValue.limite4 = i.data.limite4;
        setArchivo(i.data.archivo);
        indiValue.valorIndiId = i.data.valueIndicadorId;
        setValor(i.data.value);
        setFont(i.data.font);
        setObs(i.data.obs);
        setCalendarValue('');
        setCalendarValueReporte('');

        if (!i.data.date) {
            indiValue.date = null;
            setCalendarValue(indiValue.date);
        }
        else {
            indiValue.date = new Date(i.data.date);
            setCalendarValue(indiValue.date);
        }
        if (!i.data.dateRegister) {
            indiValue.dateRegister = null;
            setCalendarValueReporte(indiValue.dateRegister);
        }
        else {
            indiValue.dateRegister = new Date(i.data.dateRegister);
            setCalendarValueReporte(indiValue.dateRegister);
        }

        setIndiTittle(indiValue.name);
        setIndiDes(indiValue.description);
        dropdownOptions[0].name = indiValue.option1;
        dropdownOptions[1].name = indiValue.option2;
        dropdownOptions[2].name = indiValue.option3;
        if (i.data.value) {
            switch (i.data.value) {
                case '1.0':
                    setOption(dropdownOptions[0]);
                    break;
                case '2.0':
                    setOption(dropdownOptions[1]);
                    break;
                default:
                    setOption(dropdownOptions[2]);
                    break;
            }
        } else {
            setOption(null);
        }
        setDataDialog(true);
    }

    const valueTemplate = (rowData) => {
        if (rowData.data.code) {
            return (
                <div className="actions">
                    <Button icon="pi pi-external-link" className="p-button-rounded p-button-warning mr-2" title="Ingresar valores" onClick={() => dataAdd(rowData)} />
                </div>
            );
        }
    }

    const treeTableFuncMap = {
        'globalFilter2': setGlobalFilter2
    };

    const getHeader = (globalFilterKey) => {
        return (
            <div className="p-text-right">
                <div className="p-input-icon-left">
                    <i className="pi pi-search"></i>
                    <InputText type="search" onInput={(e) => treeTableFuncMap[`${globalFilterKey}`](e.target.value)} placeholder="Buscar" size="50" />
                </div>
            </div>
        );
    }

    let header = getHeader('globalFilter2');

    const hideDialog = () => {
        setSubmitted(false);
        setDataDialog(false);
    }

    const hideDialogPDF = () => {
        setSubmitted(false);
        setPdfDialog(false);
        setDataDialog(true);
    }

    const saveIndicador = () => {
        setSubmitted(true);
        async function getIndicadores() {
            const indica = await IndicadorService.postIndicadores(indicadorSave);
            setIndicadores(indica);
        }
        if (valor && font && (archivo || indicadorSave.archivo.length > 0)) {
            const user = JSON.parse(localStorage.getItem('user'));
            indicadorSave.userId = user.id;
            indicadorSave.cantonId = user.cantonId;
            indicadorSave.code = indiValue.code;
            indicadorSave.indicadorId = indiValue.indicadorId;
            indicadorSave.date = calendarValue;
            indicadorSave.dateRegister = calendarValueReporte;
            indicadorSave.font = font;
            indicadorSave.obs = obs;
            indicadorSave.value = valor;
            indicadorSave.valueIndicadorId = indiValue.valorIndiId;
            setIndicadorSave(indicadorSave);
            getIndicadores();
            toast.current.show({ severity: 'success', summary: 'Exito', detail: 'Valores ingresados sadisfactoriamente', life: 5000 });
            setDataDialog(false);
            setIndiValue(emptyIndiValue);
            setIndicadorSave(emptyIndicador);
            setFont('');
            setObs('');
            setValor('');
        }
        else {
            toast.current.show({ severity: 'warn', summary: 'Aviso', detail: 'Ingrese toda la información', life: 5000 });
        }
    }

    const dataDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            {valor <= 100 && valor !== null && <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveIndicador} />}
            {(valor > 100 || valor == null) && <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveIndicador} disabled/>}
        </>
    );

    const setfechaAdd = (fecha) => {
        setCalendarValue(fecha);
    }

    const setfechaReporteAdd = (fecha) => {
        setCalendarValueReporte(fecha);
    }

    const onInputChange = (e) => {
        const val = (e.target && e.target.value) || '';
        setFont(val);
    }

    const onTextAreaChange = (e) => {
        const val = (e.target && e.target.value) || '';
        setObs(val);
    }

    const onInputValueChange = (e) => {
        const val = (e.target && e.target.value) || '';
        setValor(val);
    }

    const onFileChange = (e) => {
        const file = e.target.files[0]
        const reader = new FileReader();
        let baseURL = "";
        reader.readAsDataURL(file);
        reader.onload = () => {
            baseURL = reader.result;
            indicadorSave.archivo = baseURL;
        };
    }

    const cargaArchivo = () => {
        setArchivo(false);
    }

    const viewDoc = () => {
        async function getComprobanteApi() {
            const evidencia = await IndicadorService.getComprobante(indiValue.valorIndiId);
            if (evidencia !== null) {
                setViewPdf(evidencia);
            }
            else {
                setViewPdf(null);
            }
            setDataDialog(false);
            setPdfDialog(true);
        }
        getComprobanteApi();
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
        <div className="crud-demo">
            <div className="card">
                <Toast ref={toast} />
                <h5>Indicadores del Municipio</h5>
                <TreeTable value={indicadores} selectionMode="single" rowClassName={rowClassName} scrollable scrollHeight="420px"
                    globalFilter={globalFilter2} header={header} filterMode="strict" showGridlines>
                    <Column field="value" header="Ingreso de datos" style={{ textAlign: 'center', width: '10%' }} body={valueTemplate}></Column>
                    <Column field="code" header="Código" body={codigoTemplate} style={{ width: '8%', textAlign: 'center' }}></Column>
                    <Column field="name" header="Indicador" expander body={tittleTemplate} ></Column>
                </TreeTable>
                <Dialog visible={dataDialog} style={{ width: '70%' }} modal className="p-fluid" footer={dataDialogFooter} onHide={hideDialog}>
                    <div className="grid align-items-center justify-content-center">
                        <div className="col-3">
                            <img src='/assets/layout/images/Bnr.jpg' width="100%" />
                        </div>
                        <div className="col-9">
                            <h3 className="ml-3" >Indicador: {indiTittle}</h3>
                            <h6 className="mt-1 ml-3 text-500" >Descripción: {indiDes}</h6>
                            {(indiValue.desnutrition || indiValue.maternity || indiValue.violence) && <span className="mt-1 ml-3" > Guardian contra: </span>}
                            {indiValue.desnutrition && <span className="mt-1 ml-3" style={{ color: 'blue' }}>Desnutrición infantil</span>}
                            {indiValue.maternity && <span className="mt-1 ml-3" style={{ color: 'purple' }}>Mortalidad materna</span>}
                            {indiValue.violence && <span className="mt-1 ml-3" style={{ color: 'green' }}>Violencia de género</span>}
                            <dir></dir>
                            {indiValue.obligatory && <span className="mt-1 ml-3" style={{ color: 'red' }}>Obligatorio</span>}
                            <div className="flex mt-3" >
                                <div className="col-7 align-items-left justify-content-left">
                                    {!indiValue.cuantitativo
                                        && <div className=" col-12 ">
                                            <label htmlFor="drop">Categoría</label>
                                            <div className="p-inputgroup">
                                                <Dropdown id="value" value={option} onChange={(e) => { setOpt(e.target.value); onEditorValueDropChange(e.target.value.code); }} options={dropdownOptions} optionLabel="name" placeholder="Seleccionar" style={{ textAlign: 'center' }}></Dropdown>
                                                {option && option.code === "3" && <div> <Button className="p-button-success" /></div>}
                                                {option && option.code === "2" && <div> <Button className="p-button-warning" /></div>}
                                                {option && option.code === "1" && <div> <Button className="p-button-danger" /></div>}
                                            </div>
                                        </div>}
                                    {indiValue.cuantitativo
                                        && <div className=" col-12 ">
                                            <label htmlFor="value">Valor ({indiValue.type})</label>
                                            <div className="p-inputgroup">
                                                <InputText type="number" min={'0.00'} max={'100.00'} step={'0.01'} value={valor} style={{ textAlign: 'center' }} onChange={(e) => onInputValueChange(e)}/>
                                                {indiValue.limite1 < indiValue.limite4 && valor >= indiValue.limite1 && valor <= indiValue.limite2 && <div> <Button className="p-button-danger" /></div>}
                                                {indiValue.limite1 < indiValue.limite4 && valor > indiValue.limite2 && valor <= indiValue.limite3 && <div> <Button className="p-button-warning" /></div>}
                                                {indiValue.limite1 < indiValue.limite4 && valor > indiValue.limite3 && valor <= indiValue.limite4 && <div> <Button className="p-button-success" /></div>}
                                                {indiValue.limite1 > indiValue.limite4 && valor <= indiValue.limite1 && valor >= indiValue.limite2 && <div> <Button className="p-button-danger" /></div>}
                                                {indiValue.limite1 > indiValue.limite4 && valor < indiValue.limite2 && valor >= indiValue.limite3 && <div> <Button className="p-button-warning" /></div>}
                                                {indiValue.limite1 > indiValue.limite4 && valor < indiValue.limite3 && valor >= indiValue.limite4 && <div> <Button className="p-button-success" /></div>}
                                            </div>
                                            {valor > 100 && <span style={{ color: 'red' }}>valor entre 0 - 100.</span>}
                                        </div>}
                                    <div className="flex">
                                        <div className=" col-6 ">
                                            <label htmlFor="value">Fecha de medición del dato</label>
                                            <Calendar showIcon showButtonBar value={calendarValue} onChange={(e) => setfechaAdd(e.value)}></Calendar>
                                        </div>
                                        <div className=" col-6 ">
                                            <label htmlFor="value">Fecha de reporte del dato</label>
                                            <Calendar showIcon showButtonBar value={calendarValueReporte} onChange={(e) => setfechaReporteAdd(e.value)}></Calendar>
                                        </div>
                                    </div>
                                    <div className=" col-12 ">
                                        <label htmlFor="value">Fuente</label>
                                        <InputText type="text" value={font} onChange={(e) => onInputChange(e)} />
                                        {submitted && !font && <small style={{ color: 'red' }} className="p-invalid">Ingrese fuente.</small>}
                                    </div>
                                    <div className=" col-12 ">
                                        <label htmlFor="name">Observaciones</label>
                                        <small> (opcional)</small>
                                        <InputTextarea id="estado" value={obs} onChange={(e) => onTextAreaChange(e)} rows={3} cols={20} autoResize />
                                    </div>
                                    {!archivo &&
                                        <div className=" col-12 ">
                                            <label>Comprobante</label>
                                            <br />
                                            <input type="file" name="archivo" accept="application/pdf" onChange={(e) => onFileChange(e)}></input>
                                            <br />
                                            <small> (extencion .pdf, tamaño máximo 2Mb)</small>
                                            {submitted && indicadorSave.archivo.length === 0 && <small style={{ color: 'red' }} className="p-invalid">Debe escoger el archivo habilitante.</small>}
                                        </div>
                                    }
                                    {archivo &&
                                        <div className=" col-12 ">
                                            <label>Ya existe evidencia</label>
                                            <div className="flex">
                                                <Button icon="pi pi-eye" className="p-button-sucess" title='Ver evidencia' style={{ width: '30%' }} onClick={() => viewDoc()} />
                                                <Button label="Actualizar evidencia" icon="pi pi-undo" iconPos="right" className="p-button-warning ml-3" style={{ width: '70%' }} onClick={cargaArchivo} />
                                            </div>
                                        </div>
                                    }
                                </div>
                                <div className="col-5 align-items-center justify-content-center">
                                    <h6 className="mt-1 ml-3 text-700" >Cálculo de valor</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </Dialog>
                <Dialog visible={pdfDialog} style={{ width: '700px' }} header="Vista de evidencia" modal className="p-fluid" onHide={hideDialogPDF}>
                    <div className='pdf-container'>
                        {viewPdf && <><Worker workerUrl="https://unpkg.com/pdfjs-dist@2.6.347/build/pdf.worker.min.js">
                            <Viewer fileUrl={viewPdf}
                                plugins={[defaultLayoutPluginInstance]} />
                        </Worker></>}
                        {!viewPdf && <>Archivo pdf no seleccionado</>}
                    </div>
                </Dialog>
            </div>
        </div>
    );
}