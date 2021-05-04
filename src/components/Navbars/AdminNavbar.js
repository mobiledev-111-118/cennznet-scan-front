import React from "react";
import classnames from "classnames";
import PropTypes from "prop-types";
import {
    Collapse,
    Navbar,
    NavItem,
    NavLink,
    Nav,
    Container,
} from "reactstrap";
import Button from "reactstrap/lib/Button";

class AdminNavbar extends React.Component {

    openSearch = () => {
        document.body.classList.add("g-navbar-search-showing");
        setTimeout(function() {
            document.body.classList.remove("g-navbar-search-showing");
            document.body.classList.add("g-navbar-search-show");
        }, 150);
        setTimeout(function() {
            document.body.classList.add("g-navbar-search-shown");
        }, 300);
    };
    
    closeSearch = () => {
        document.body.classList.remove("g-navbar-search-shown");
        setTimeout(function() {
            document.body.classList.remove("g-navbar-search-show");
            document.body.classList.add("g-navbar-search-hiding");
        }, 150);
        setTimeout(function() {
            document.body.classList.remove("g-navbar-search-hiding");
            document.body.classList.add("g-navbar-search-hidden");
        }, 300);
        setTimeout(function() {
            document.body.classList.remove("g-navbar-search-hidden");
        }, 500);
    };
    
    logout = e => {
        localStorage.removeItem('user');
        const { history } = this.props;
        history.push('/auth/login')
    }

    render() {
        return (
            <>
                <Navbar
                    className={classnames(
                        "navbar-top navbar-expand border-bottom",
                        { "navbar-dark bg-info": this.props.theme === "dark" },
                        { "navbar-dark bg-info": this.props.theme === "light" }
                    )}
                >
                     <Container fluid>
                        <Collapse navbar isOpen={true}>
                            <Nav className="align-items-center ml-md-auto" navbar>
                                <NavItem className="d-xl-none">
                                    <div
                                        className={classnames(
                                        "pr-3 sidenav-toggler",
                                        { active: this.props.sidenavOpen },
                                        { "sidenav-toggler-dark": this.props.theme === "dark" }
                                        )}
                                        onClick={this.props.toggleSidenav}
                                    >
                                        <div className="sidenav-toggler-inner">
                                            <i className="sidenav-toggler-line" />
                                            <i className="sidenav-toggler-line" />
                                            <i className="sidenav-toggler-line" />
                                        </div>
                                    </div>
                                </NavItem>
                                <NavItem className="d-sm-none">
                                    <NavLink onClick={this.openSearch}>
                                        <i className="ni ni-zoom-split-in" />
                                    </NavLink>
                                </NavItem>
                            </Nav>
                            <Nav className="align-items-center ml-auto ml-md-0" navbar>
                                <Button className="my-4" color="default" type="button" onClick={(e) => this.logout(e)}>
                                    Logout
                                </Button>
                            </Nav>
                        </Collapse>
                    </Container>
                    </Navbar>
            </>
        );
    }
}
AdminNavbar.defaultProps = {
    toggleSidenav: () => {},
    sidenavOpen: false,
    theme: "dark"
};
AdminNavbar.propTypes = {
    toggleSidenav: PropTypes.func,
    sidenavOpen: PropTypes.bool,
    theme: PropTypes.oneOf(["dark", "light"])
};

export default AdminNavbar;
