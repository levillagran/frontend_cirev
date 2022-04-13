import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Chart } from 'primereact/chart';
import { Carousel } from 'primereact/carousel';
import { Dialog } from 'primereact/dialog';
import { OrganizationChart } from 'primereact/organizationchart';

import DashboardService from '../service/DashboardService';

export const DashboardMolecular = () => {

    
    return (
        <div className="grid">
            <div className="col-12 xl:col-12">
                <div className="carousel-demo">
                    <div className="card">
                        <h5>Molecular</h5>
                    </div>
                </div>
            </div>
        </div>
    );
}
