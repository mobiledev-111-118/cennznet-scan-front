
import Alternative from "views/cennznet/Transaction.js";
import Dashboard from "views/cennznet/Account.js";
import CennzHolders from "views/cennznet/Holder.js";

import AlgoAddr from "views/algorand/Account.js";
import AlgoAssets from "views/algorand/Assets.js";
import AlgoHolders from "views/algorand/Holder.js";

import Login from "views/auth/Login.js";
import Register from "views/auth/Register.js";
import cennz from "assets/img/cennz.png";
import algo from "assets/img/algorand.png";

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
        path: "/assets",
        name: "Assets",
        miniName: "T",
        icon: "ni ni-money-coins text-grey",
        component: Alternative,
        layout: "/cennznet"
      },
      {
        path: "/holder",
        name: "Holders",
        miniName: "H",
        icon: "ni ni-diamond text-grey",
        component: CennzHolders,
        layout: "/cennznet"
      }
    ]
  },
  {
    collapse: true,
    name: "Algorand",
    icon: algo,
    state: "algorandCollapse",
    views: [
      {
        path: "/account",
        name: "Address",
        miniName: "A",
        icon: "ni ni-archive-2 text-grey",
        component: AlgoAddr,
        layout: "/algorand"
      },
      {
        path: "/assets",
        name: "Assets",
        miniName: "T",
        icon: "ni ni-money-coins text-grey",
        component: AlgoAssets,
        layout: "/algorand"
      },
      {
        path: "/holder",
        name: "Holders",
        miniName: "H",
        icon: "ni ni-diamond text-grey",
        component: AlgoHolders,
        layout: "/algorand"
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
