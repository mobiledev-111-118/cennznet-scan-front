import React from "react";
import PropTypes from "prop-types";
import {
    Breadcrumb,
    BreadcrumbItem,
    Container,
    Row,
    Col,
    Input,
    FormGroup,
    Form,
    InputGroupAddon,
    InputGroupText,
    InputGroup,
} from "reactstrap";
import classnames from "classnames";

class CardsHeader extends React.Component {
    render() {
        return (
            <>
                <div className="header bg-info pb-6">
                    <Container fluid>
                        <div className="header-body">
                            <Row className="align-items-center py-4">
                                <Col lg="6">
                                    <h6 className="h2 text-white d-inline-block mb-0">
                                        {this.props.name}
                                    </h6>{" "}
                                    <Breadcrumb
                                        className="d-none d-md-inline-block ml-md-4"
                                        listClassName="breadcrumb-links breadcrumb-dark"
                                    >
                                        <BreadcrumbItem>
                                            <a href="/" onClick={e => e.preventDefault()}>
                                                <i className="fas fa-home" />
                                            </a>
                                        </BreadcrumbItem>
                                        <BreadcrumbItem>
                                            <a href="/" onClick={e => e.preventDefault()}>
                                                {this.props.parentName}
                                            </a>
                                        </BreadcrumbItem>
                                        <BreadcrumbItem aria-current="page" className="active">
                                            {this.props.name}
                                        </BreadcrumbItem>
                                    </Breadcrumb>
                                    
                                </Col>
                                <Col lg="4">
                                    <Form
                                        className={classnames(
                                            "navbar-search form-inline mr-sm-3 mr-0",
                                            { "navbar-search-light": this.props.theme === "dark" },
                                            { "navbar-search-light": this.props.theme === "light" }
                                        )}
                                        
                                    >
                                        <FormGroup className="mb-0">
                                            <InputGroup className="input-group-alternative input-group-merge" style={{backgroundColor: "#FFF"}}>
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText>
                                                        <i className="fas fa-search" />
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                                <Input placeholder="Search by nick" type="text" onChange={(e)=>this.props.onChange(e)}/>
                                            </InputGroup>
                                        </FormGroup>
                                    </Form></Col>
                            </Row>
                        </div>
                    </Container>
                </div>
            </>
        );
    }
}

CardsHeader.propTypes = {
    name: PropTypes.string,
    parentName: PropTypes.string
};

export default CardsHeader;
