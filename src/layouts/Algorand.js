
import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import routes from "routes.js";

class Admin extends React.Component {
    state = {
        sidenavOpen: true
    };

    componentDidMount(e) {
        const user = localStorage.getItem('user');
        const { history } = this.props;
        if( !user ) {
            history.push('/auth/login');
        }
    }
    
    componentDidUpdate(e) {
        if (e.history.pathname !== e.location.pathname) {
            document.documentElement.scrollTop = 0;
            document.scrollingElement.scrollTop = 0;
            this.refs.mainContent.scrollTop = 0;
        }
    }
    getRoutes = routes => {
        return routes.map((prop, key) => {
            if (prop.collapse) {
                return this.getRoutes(prop.views);
            }
            if (prop.layout === "/algorand") {
                return (
                    <Route
                        path={prop.layout + prop.path}
                        component={prop.component}
                        key={key}
                    />
                );
            } else {
                return null;
            }
        });
    };
    getBrandText = path => {
        for (let i = 0; i < routes.length; i++) {
            if (
                path.indexOf(
                routes[i].layout + routes[i].path
                ) !== -1
            ) {
                return routes[i].name;
            }
        }
        return "Brand";
    };
    
    toggleSidenav = e => {
        if (document.body.classList.contains("g-sidenav-pinned")) {
            document.body.classList.remove("g-sidenav-pinned");
            document.body.classList.add("g-sidenav-hidden");
        } else {
            document.body.classList.add("g-sidenav-pinned");
            document.body.classList.remove("g-sidenav-hidden");
        }
        this.setState({
            sidenavOpen: !this.state.sidenavOpen
        });
    };

    closeSidenav = e => {
        if (  window.innerWidth > 460 ){
            return;
        }
        if( !this.state.sidenavOpen ){
            document.body.classList.remove("g-sidenav-pinned");
            document.body.classList.add("g-sidenav-hidden");
        }
       
        this.setState({
            sidenavOpen: !this.state.sidenavOpen
        });
    }
    getNavbarTheme = () => {
        return this.props.location.pathname.indexOf("algorand/assets") === -1 ? "dark": "light";
    };

    render() {
        return (
            <>
                <Sidebar
                    {...this.props}
                    routes={routes}
                    toggleSidenav={this.toggleSidenav}
                    sidenavOpen={this.state.sidenavOpen}
                    logo={{
                        innerLink: "/",
                        imgSrc: require("assets/img/logo.png"),
                        imgAlt: "..."
                    }}
                />
                <div
                    className="main-content"
                    ref="mainContent"
                    onClick={this.closeSidenav}
                >
                    <AdminNavbar
                        {...this.props}
                        theme={this.getNavbarTheme()}
                        toggleSidenav={this.toggleSidenav}
                        sidenavOpen={this.state.sidenavOpen}
                        brandText={this.getBrandText(this.props.location.pathname)}
                    />
                    <Switch>
                        {this.getRoutes(routes)}
                        <Redirect from="*" to="/algorand/account" />
                    </Switch>
                </div>
            </>
        );
    }
}

export default Admin;
