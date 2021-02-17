
import Cookie from 'js-cookie';
import { Redirect } from 'react-router-dom';
import SuppliersTable from './SuppliersTable';


const SuppliersList = () => {
    if (!Cookie.get("token")) {
        return <Redirect to='/'/>;
     }
     
    return ( 
        <div className="SuppliersList">
            <h1>Listado de Proveedores</h1>
            <SuppliersTable />
        </div>
    );
    
}

export default SuppliersList;