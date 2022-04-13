import React from 'react';
import { BrowserRouter, Switch, Route} from 'react-router-dom';
import { Modulos } from '../pages/Modulos';
import SignIn from '../pages/SignIn';
import App from '../App';

function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Modulos} />
                <Route path="/signin" exact component={SignIn} />
                <Route path="/app" component={App} />
                <Route path="/app/*" exact component={App} />
            </Switch>
        </BrowserRouter>

    );
}

export default Routes;