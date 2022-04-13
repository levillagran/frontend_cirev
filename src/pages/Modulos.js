import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { AppFooter } from '../AppFooter';

import background from '../bg1.jpg';

import ModuloService from '../service/ModuloService';

import '../css/DataViewDemo.css';

export const Modulos = () => {


  const [screemH, setScreemH] = useState(null);
  const [screemW, setScreemW] = useState(null);
  const [modulos, setModulos] = useState([]);

  useEffect(() => {
    async function getModulos() {
      const modules = await ModuloService.getModulos();
      setModulos(modules);
  }
  getModulos();
    setScreemH(window.screen.height - 80);
    setScreemW(window.screen.width - 40);

  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const goIn = (modulo) => {
    localStorage.setItem("modulo", modulo);
    window.location.href = "/signin"
}

  const Modulos = () => (
    <div className=" xl:flex col-12 align-items-center xl:justify-content-center" style={{ height: `${screemH - 210}px`}}>
      {modulos.map(item => (
        <Card className="mt-8 md:mx-1 lg:mx-3 xl:mx-3" style={{ width: '20em', height: '30em'}} key={item.id}>
          <div style={{ height: '24em'}}>
          <img alt={item.name} src={`/assets/demo/images/galeriaModulos/${item.image}`} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} style={{ width: '100%', height: '200px' }} />
          <h3 className="ml-3" >{item.name}</h3>
          <h6 className="mt-1 ml-3 text-500" >{item.department}</h6>
          <p className="ml-3" style={{ lineHeight: '1.5' }}>{item.description}</p>
          </div>
          <Button label="Entrar" icon="pi pi-sign-in" style={{ width: '100%' }} onClick={() => goIn(item.code)}></Button>
        </Card>
      ))}
    </div>
  );

  return (
    <div>
      <Modulos />
      <AppFooter layoutColorMode={'darck'} />
    </div>
  );
}