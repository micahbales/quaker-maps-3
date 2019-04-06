import * as React from 'react';
import Spinner from '../components/Spinner/Spinner';

export const loadingPage = () => <Spinner />;

export const pageNotFound = () => (
    <div>
        <h1>Looks like that page doesn't exist!</h1>
        <p>
            If you think this is an error, please <a href='mailto:admin@quakermaps.com'> 
            contact a site administrator</a>.
        </p>
    </div>
);
