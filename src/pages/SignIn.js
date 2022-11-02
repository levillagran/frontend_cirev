import React, { Component } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { PhotoService } from '../service/PhotoService';
import { Galleria } from 'primereact/galleria';
import { Card } from 'primereact/card';
import { Toast } from 'primereact/toast';

import '../css/SignIn.css';

import AuthService from '../service/auth.service';

class SignIn extends Component {

  state = {
    form: {
      username: '',
      password: '',
      images: null,
      module: '',
    }
  }

  handleChange = async e => {
    await this.setState({
      form: {
        ...this.state.form,
        module: localStorage.getItem('modulo'),
        [e.target.name]: e.target.value
      }
    }
    );
  }

  iniciarSesion() {
    AuthService.login(this.state.form)
      .then(response => {
        return response;
      })
      .then(response => {
        if (response.token.length > 0 && response.token !== 'false') {
          window.location.href = "/app";
        } else if (response.token === 'false') {
          localStorage.removeItem("user");
          this.toast.show({ severity: 'error', summary: 'Error de permisos', detail: 'Usuario no tiene acceso a este modulo', life: 3000 });
        }
      })
      .catch(error => {
        localStorage.removeItem("user");
        this.toast.show({ severity: 'error', summary: 'Error de autenticación', detail: 'Usuario o clave incorrectos o a sido desactivado', life: 3000 });
      })
  }

  goBack() {
    window.location.href = "/";

  }

  componentDidMount() {
    this.galleriaService.getImages().then(data => this.setState({ images: data }));
    if (localStorage.getItem('user')) {
      window.location.href = "/app";
    }
    this.setScreemW = (window.screen.width);
  }

  constructor(props) {
    super(props);

    this.galleriaService = new PhotoService();
    this.itemTemplate = this.itemTemplate.bind(this);

  }

  itemTemplate(item) {
    return <img src={item.itemImageSrc} alt={item.alt} style={{ width: '100%', display: 'block' }} />;
  }

  validateForm() {
    return this.state.form.username.length > 0 && this.state.form.password.length > 0;
  }

  render() {
    return (
      <div>
        <Toast ref={(el) => this.toast = el} />
        <div className="grid">
          <div className="xs:col-1 sm:col-2 md:col-5 lg:col-7 xl:col-9">
            <Galleria value={this.state.images} style={{ maxWidth: `${this.setScreemW}px` }}
              item={this.itemTemplate} circular autoPlay transitionInterval={3000} />
          </div>
          <Card className="xs:col-11 sm:col-10 md:col-7 lg:col-5 xl:col-3">
            <div className="text-center m-3 " style={{ height: '8rem' }}></div>
            <div className="text-center m-3 ">
              <img src="/assets/layout/images/lgo_inspi_color.png" alt="hyper" height={80} className="mb-3" />
              <div className="text-900 text-3xl font-medium mb-3">Plataforma de planificación de recursos CIREV | INSPI</div>
            </div>
            <div className="mx-8">
              <label htmlFor="username" className="block text-900 font-medium mb-2">Usuario</label>
              <InputText id="user" type="text" name="username" className="w-full mb-3" value={this.state.form.username} onChange={this.handleChange} />
              <label htmlFor="password" className="block text-900 font-medium mb-2">Contraseña</label>
              <InputText id="password" type="password" name="password" className="w-full mb-3" value={this.state.form.password} onChange={this.handleChange} />
              <Button label="Ingresar" icon="pi pi-sign-in" className="w-full" onClick={() => this.iniciarSesion()} disabled={!this.validateForm()} />
              <Button label="Modulos" icon="pi pi-sign-out" className="w-full mt-3" onClick={() => this.goBack()} />
            </div>
          </Card>
        </div >
      </div>
    );
  }

}

export default SignIn;
