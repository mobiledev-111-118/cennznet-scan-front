import React from "react";
import { NavLink as NavLinkRRD, Link } from "react-router-dom";
import classnames from "classnames";
import { PropTypes } from "prop-types";
import PerfectScrollbar from "react-perfect-scrollbar";

import {
    Collapse,
    NavbarBrand,
    Navbar,
    NavItem,
    NavLink,
    Nav
} from "reactstrap";

class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapseOpen: false,
            ...this.getCollapseStates(props.routes)
        };
    }
    activeRoute = routeName => {
        return this.props.location.pathname.indexOf(routeName) > -1 ? "active" : "";
    };

    onMouseEnterSidenav = () => {
        if (!document.body.classList.contains("g-sidenav-pinned")) {
            document.body.classList.add("g-sidenav-show");
        }
    };

    onMouseLeaveSidenav = () => {
        if (!document.body.classList.contains("g-sidenav-pinned")) {
            document.body.classList.remove("g-sidenav-show");
        }
    };

    toggleCollapse = () => {
        this.setState({
            collapseOpen: !this.state.collapseOpen
        });
    };

    closeCollapse = () => {
        this.setState({
            collapseOpen: false
        });
    };

    getCollapseStates = routes => {
        let initialState = {};
        routes.map((prop, key) => {
        if (prop.collapse) {
            initialState = {
                [prop.state]: this.getCollapseInitialState(prop.views),
                ...this.getCollapseStates(prop.views),
                ...initialState
            };
        }
        return null;
        });
        return initialState;
    };

    getCollapseInitialState(routes) {
        for (let i = 0; i < routes.length; i++) {
        if (routes[i].collapse && this.getCollapseInitialState(routes[i].views)) {
            return true;
        } else if (window.location.href.indexOf(routes[i].path) !== -1) {
            return true;
        }
        }
        return false;
    }

    closeSidenav = () => {
        if (window.innerWidth < 1200) {
            this.props.toggleSidenav();
        }
    };

    createLinks = routes => {
        return routes.map((prop, key) => {
        if (prop.redirect) {
            return null;
        }
        if (prop.collapse) {
            var st = {};
            st[prop["state"]] = !this.state[prop.state];
            return (
            <NavItem key={key}>
                <NavLink
                    href="#pablo"
                    data-toggle="collapse"
                    aria-expanded={this.state[prop.state]}
                    className={classnames({
                        active: this.getCollapseInitialState(prop.views)
                    })}
                    onClick={e => {
                        e.preventDefault();
                        this.setState(st);
                    }}
                >
                    {prop.icon ? (
                        <>
                            <img src={prop.icon} className="mr-2" alt="..."/>
                            <span className="nav-link-text">{prop.name}</span>
                        </>
                    ) : prop.miniName ? (
                        <>
                            <span className="sidenav-mini-icon"> {prop.miniName} </span>
                            <span className="sidenav-normal"> {prop.name} </span>
                        </>
                    ) : null}
                </NavLink>
                <Collapse isOpen={this.state[prop.state]}>
                    <Nav className="nav-sm flex-column">
                        {this.createLinks(prop.views)}
                    </Nav>
                </Collapse>
            </NavItem>
            );
        }
        return (
            <NavItem
                className={this.activeRoute(prop.layout + prop.path)}
                key={key}
            >
                <NavLink
                    to={prop.layout + prop.path}
                    activeClassName=""
                    onClick={this.closeSidenav}
                    tag={NavLinkRRD}
                >
                    {prop.icon !== undefined ? (
                        <div className={this.props.sidenavOpen? "ml-4": "ml-3"}>
                            <i className={prop.icon} />
                            <span className="nav-link-text ml-2">{prop.name}</span>
                        </div>
                    ) : prop.miniName !== undefined ? (
                        <>
                            <span className="sidenav-mini-icon"> {prop.miniName} </span>
                            <span className="sidenav-normal"> {prop.name} </span>
                        </>
                    ) : (
                        prop.name
                    )}
                </NavLink>
            </NavItem>
        );
        });
    };

    render() {
        const { routes, logo } = this.props;
        let navbarBrandProps;
        if (logo && logo.innerLink) {
            navbarBrandProps = {
                to: logo.innerLink,
                tag: Link
            };
        } else if (logo && logo.outterLink) {
            navbarBrandProps = {
                href: logo.outterLink,
                target: "_blank"
            };
        }

        const scrollBarInner = (
            <div className="scrollbar-inner">
                <div className="sidenav-header d-flex align-items-center">
                    {logo ? (
                        <NavbarBrand {...navbarBrandProps}>
                            <img
                                alt={logo.imgAlt}
                                className="navbar-brand-img"
                                src={logo.imgSrc}
                            />
                        </NavbarBrand>
                    ) : null}
                    <div className="ml-auto">
                        <div
                            className={classnames("sidenav-toggler d-none d-xl-block", {
                                active: this.props.sidenavOpen
                            })}
                            onClick={this.props.toggleSidenav}
                        >
                            <div className="sidenav-toggler-inner">
                                <i className="sidenav-toggler-line" />
                                <i className="sidenav-toggler-line" />
                                <i className="sidenav-toggler-line" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="navbar-inner">
                    <Collapse navbar isOpen={true}>
                        <Nav navbar>{this.createLinks(routes)}</Nav>
                    </Collapse>
                </div>
            </div>
        );
        return (
            <>
                <Navbar
                    className={
                        "sidenav navbar-vertical navbar-expand-xs navbar-light bg-white " +
                        (this.props.rtlActive ? "" : "fixed-left")
                    }
                    onMouseEnter={this.onMouseEnterSidenav}
                    onMouseLeave={this.onMouseLeaveSidenav}
                >
                    {navigator.platform.indexOf("Win") > -1 ? (
                        <PerfectScrollbar>{scrollBarInner}</PerfectScrollbar>
                    ) : (
                        scrollBarInner
                    )}
                </Navbar>
                
            </>
        );
    }
}

Sidebar.defaultProps = {
    routes: [{}],
    toggleSidenav: () => {},
    sidenavOpen: false,
    rtlActive: false
};

Sidebar.propTypes = {
    toggleSidenav: PropTypes.func,
    sidenavOpen: PropTypes.bool,
    routes: PropTypes.arrayOf(PropTypes.object),
    logo: PropTypes.shape({
        innerLink: PropTypes.string,
        outterLink: PropTypes.string,
        imgSrc: PropTypes.string.isRequired,
        imgAlt: PropTypes.string.isRequired
    }),
    rtlActive: PropTypes.bool
};

export default Sidebar;
