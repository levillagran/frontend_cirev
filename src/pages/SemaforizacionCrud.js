import React, { useState, useEffect } from 'react';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';

import IndicadorService from '../service/IndicadorService';

import '../css/Indicadores.css';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

export const SemaforizacionCrud = () => {

    const [indicadores, setIndicadores] = useState([]);


    useEffect(() => {
        async function getIndicadores() {
            const user = JSON.parse(localStorage.getItem('user'));
            const indica = await IndicadorService.getSemaforizacion(user.id);
            setIndicadores(indica);
        }
        getIndicadores();
    }, []);

    const codigoBodyTemplate = (rowData) => {
        let fontWeight = 'bold';
        let fontSize = 14;
        return (
            <>
                <span className="p-column-title">Código</span>
                <span style={{ fontWeight: fontWeight, fontSize: fontSize}}>{rowData.codigo}</span>
            </>
        )
    }
    
    const ejeBodyTemplate = (rowData) => {
        let fontWeight = 'bold';
        let fontSize = 16;
        return (
            <>
                <span className="p-column-title">Componente</span>
                <span  style={{ fontWeight: fontWeight, fontSize: fontSize}}>{rowData.eje}</span>
            </>
        )
    }

    const determinanteBodyTemplate = (rowData) => {
        let fontWeight = 'bold';
        let fontSize = 14;
        return (
            <>
                <span className="p-column-title">Eje</span>
                <span  style={{ fontWeight: fontWeight, fontSize: fontSize}}>{rowData.determinante}</span>
            </>
        )
    }

    const indicadorBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Indicador</span>
                {rowData.indicador}
            </>
        )
    }

    const valorBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Valor</span>
                {rowData.valor}
            </>
        )
    }

    const tipoBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Valor</span>
                {rowData.tipo}
            </>
        )
    }

    const semaforoBodyTemplate = (rowData) => {
        if (rowData.indicador) {
            switch (rowData.semaforizacion) {
                case 'red':
                    return (
                        <>
                            <span className="p-column-title">Semáforo</span>
                            <Tag severity="danger" rounded style={{ height:'20px' , width: '20px' }}></Tag>
                        </>
                    );
                case 'yellow':
                    return (
                        <>
                            <span className="p-column-title">Semáforo</span>
                            <Tag severity="warning"rounded style={{ height:'20px' , width: '20px' }}></Tag>
                        </>
                    );
                case 'green':
                    return (
                        <>
                            <span className="p-column-title">Semáforo</span>
                            <Tag severity="success" rounded style={{ height:'20px' , width: '20px' }}></Tag>
                        </>
                    );
                default:
                    return (
                        <div>{'S/P'}</div>
                    );
            }
        }
    }

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Semaforización de valores de indicadores</h5>
        </div>
    );

    const rowClass = (data) => {
        return {
            'row-eje': (data.eje),
            'row-determinate' : (data.determinante)
        }
    }

    return (
        <div className="crud-demo">
            <div className="col-12">
                <div className="card">
                    <DataTable value={indicadores} rowClassName={rowClass} rowHover scrollable scrollHeight="420px"
                        dataKey="id" className="datatable-responsive" emptyMessage="No hay datos de indicadores." header={header} showGridlines responsiveLayout="scroll">
                        <Column field="eje" header="Componente" body={ejeBodyTemplate} style={{ width: '15%' }}></Column>
                        <Column field="determinante" header="Eje" body={determinanteBodyTemplate}  style={{ width: '20%' }}></Column>
                        <Column field="codigo" header="Código" body={codigoBodyTemplate} style={{ width: '7%' }}></Column>
                        <Column field="indicador" header="Indicador" body={indicadorBodyTemplate}></Column>
                        <Column field="valor" header="Valor" body={valorBodyTemplate} style={{ textAlign: 'center', width: '15%' }}></Column>
                        <Column field="tipo" header="Tipo" body={tipoBodyTemplate} style={{textAlign: 'center', width: '7%' }}></Column>
                        <Column field="semaforizacion" header="Semáforo" body={semaforoBodyTemplate} style={{ textAlign: 'center', width: '8%' }}></Column>
                    </DataTable>
                </div>
            </div >
        </div >
    );
}
