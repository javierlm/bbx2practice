import { Can } from "../../permissions/Can";
import UsersTable from "./UsersTable";
import Cookie from "js-cookie";
import { Redirect } from "react-router-dom";

const UsersList = () => {
  if (!Cookie.get("token")) {
    return <Redirect to='/'/>;
 }

  return (
    <Can I="USER_MANAGEMENT" on="users" passThrough>
      {(allowed) =>
        allowed ? (
          <div className="SuppliersList">
            <h1>Gestión de usuarios</h1>
            <UsersTable />
          </div>
        ) : (
          <h2>Sólo los administradores tienen acceso a este apartado</h2>
        )
      }
    </Can>
  );
};

export default UsersList;
