
import Alternative from "views/cennznet/Transaction.js";
import Dashboard from "views/cennznet/Account.js";
import Login from "views/auth/Login.js";
import Register from "views/auth/Register.js";
import cennz from "assets/img/cennz.png";

const routes = [
  {
    collapse: true,
    name: "CENNZnet",
    icon: cennz,
    state: "dashboardsCollapse",
    views: [
      {
        path: "/account",
        name: "Address",
        miniName: "A",
        icon: "ni ni-archive-2 text-grey",
        component: Dashboard,
        layout: "/cennznet"
      },
      {
        path: "/transactions",
        name: "Transations",
        miniName: "T",
        icon: "ni ni-money-coins text-grey",
        component: Alternative,
        layout: "/cennznet"
      }
    ]
  }
];

export const authroute = [
  {
    path: "/login",
    name: "Login",
    miniName: "L",
    component: Login,
    layout: "/auth"
  },{
    path: "/register",
    name: "Register",
    miniName: "R",
    component: Register,
    layout: "/auth"
  },
]

export default routes;
