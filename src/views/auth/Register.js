import React from "react";
import classnames from "classnames";
import {
  Button,
  Card,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Row,
  Col
} from "reactstrap";
import { signup } from "actions/AuthAction";
// import history from "utils/history";

class Register extends React.Component {
  state = {
    email: '',
    psd: '',
  };

  createAccount = (e) => {
    if( this.state.email === '' || this.state.psd === '') {
      alert("All fields is required");
    }
    const { history } = this.props;
    signup(this.state.email, this.state.psd).then((res) => {
      if(res) {
        history.push('/auth/login')
      }
    })
  }
  render() {
    return (
      <>
        <Container className="mt-9 pb-5">
          <Row className="justify-content-center">
            <Col lg="6" md="8">
              <Card className="bg-secondary border-0">
                <CardBody className="px-lg-5 py-lg-5">
                  <Form role="form">
                    <FormGroup
                      className={classnames({
                        focused: this.state.focusedEmail
                      })}
                    >
                      <InputGroup className="input-group-merge input-group-alternative mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="ni ni-email-83" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          placeholder="Email"
                          type="email"
                          onFocus={() => this.setState({ focusedEmail: true })}
                          onBlur={() => this.setState({ focusedEmail: false })}
                          onChange={(e) => this.setState({email: e.target.value})}
                        />
                      </InputGroup>
                    </FormGroup>
                    <FormGroup
                      className={classnames({
                        focused: this.state.focusedPassword
                      })}
                    >
                      <InputGroup className="input-group-merge input-group-alternative">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="ni ni-lock-circle-open" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          placeholder="Password"
                          type="password"
                          onFocus={() =>
                            this.setState({ focusedPassword: true })
                          }
                          onBlur={() =>
                            this.setState({ focusedPassword: false })
                          }
                          onChange={(e) => this.setState({psd: e.target.value})}
                        />
                      </InputGroup>
                    </FormGroup>
                    
                    <div className="text-center">
                      <Button className="mt-4" color="default" type="button" onClick={(e) => this.createAccount(e)}>
                        Create account
                      </Button>
                    </div>
                  </Form>
                </CardBody>
              </Card>
              <Row className="mt-3">
                <Col xs="6">
                  <a
                    className="text-light"
                    href="#pablo"
                  >
                    <small>Already have an account?</small>
                  </a>
                </Col>
                <Col className="text-right" xs="6">
                  <a
                    className="text-light"
                    href="/auth/login"
                  >
                    <small>Login</small>
                  </a>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default Register;
