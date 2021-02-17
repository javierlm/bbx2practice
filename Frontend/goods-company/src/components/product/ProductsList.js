
import ProductTable from './ProductTable';
import Cookie from "js-cookie";
import { Redirect } from 'react-router-dom';

const ProductsList = () => {
    if (!Cookie.get("token")) {
        return <Redirect to='/'/>;
     }
    <ProductTable />
    return ( 
        <div className="Home">
            <h1>Listado de Productos</h1>
            <ProductTable />
        </div>
    );
    
}

export default ProductsList;
