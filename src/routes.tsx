import React from 'react';
import { Route , BrowserRouter} from 'react-router-dom';

import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import NewUser from './pages/NewUser';

const Routes = () => {

    return(
        <BrowserRouter>
            <Route component={Home} path="/" exact />
            <Route component={Dashboard} path="/dashboard" />
            <Route component={NewUser} path="/register" />

        </BrowserRouter>
    );


}

export default Routes;