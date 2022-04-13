import React from 'react';

export const AppFooter = (props) => {

    return (
        <div className="layout-footer" >
            <a href="http://www.investigacionsalud.gob.ec/webs/cirev/" target='_blank'>
                <img src={props.layoutColorMode === 'light' ? '/assets/layout/images/lgc_link.png' : '/assets/layout/images/lgc_link.png'}
                    alt="Logo" height="45" className="mr-3" title='CIREV' />
            </a>
            {props.layoutColorMode === 'light' && <div className="mr-3 text-white">
                by
            </div>}
            {props.layoutColorMode !== 'light' && <div className="mr-3 text-darck">
                by
            </div>}
            <a href="https://www.investigacionsalud.gob.ec/" target='_blank'>
                <img
                    src={props.layoutColorMode === 'light' ? '/assets/layout/images/lgo_inspi.png' : '/assets/layout/images/lgo_inspi_color.png'}
                    alt="Logo" height="30" className="mr-2" title='INSPI' />
            </a>
            <a href="https://www.investigacionsalud.gob.ec/webs/episig/" target='_blank'>
                <img
                    src={props.layoutColorMode === 'light' ? '/assets/layout/images/lgo_episig.png' : '/assets/layout/images/lgo_episig_color.png'}
                    alt="Logo" height="30" className="mr-2" title='EPISIG' />
            </a>
            <a href="https://www.salud.gob.ec/" target='_blank'>
                <img
                    src={props.layoutColorMode === 'light' ? '/assets/layout/images/lgo_msp.png' : '/assets/layout/images/lgo_msp_color.png'}
                    alt="Logo" height="30" className="mr-2" title='MSP' />
            </a>
        </div>
    );
}
