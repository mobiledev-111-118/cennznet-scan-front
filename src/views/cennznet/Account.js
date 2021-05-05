import React from "react";
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    Input,
    ListGroupItem,
    ListGroup,
    Table,
    Container,
    Row,
    Col,
} from "reactstrap";
import ReactBSAlert from "react-bootstrap-sweetalert";
import NotificationAlert from "react-notification-alert";
import CardsHeader from "components/Headers/CardsHeader.js";
import { getAllAddress, addAddress, updateAddress } from "actions/AddressAction";
import { deleteOneItem } from "actions/AddressAction";

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeNav: 1,
            addNew: false,
            nickName: '',
            addr: '',
            btnTxt: 'Add ',
            userid: null,
            renderData: [],
            originData: [],
            bless: true,
            curIdx: -1,
            alertscript: null,
        };
    }

    notify = (type, title, msg) => {
        let options = {
            place: "tc",
            message: (
                <div className="alert-text">
                <span className="alert-title" data-notify="title">
                    {" "}
                    {title}
                </span>
                <span data-notify="message">
                    {msg}
                </span>
                </div>
            ),
            type: type,
            icon: "ni ni-bell-55",
            autoDismiss: 7
        };
        this.refs.notificationAlert.notificationAlert(options);
    };

    componentDidMount = async(e) => {
        const user = await localStorage.getItem('user');
        this.setState({userid: user});
        if( user ) {
            getAllAddress(user).then((res) => {
                if( res.success ) {
                    this.setState({
                        renderData: res.result,
                        originData: res.result
                    })
                }
            }).catch((err) => {
                console.log(err);
            })
        }
    }

    showAddAddressCard = e => {
        e.preventDefault();
        this.setState({
            addNew: !this.state.addNew,
            btnTxt: "Add ",
        });
    }
    
    addAddress = e => {
        e.preventDefault();
        const { nickName, addr, userid, btnTxt, renderData, originData, curIdx } = this.state;
        if( addr === '' || !userid ) {
            this.notify("warning", "Invalid Address", "Address field is required!");
            return;
        }
        if( btnTxt === 'Add ') {
            addAddress(userid, nickName, addr).then((res) => {
                if( res.success ) {
                    originData.push(res.result);
                    this.setState({renderData: originData, addNew: false, addr: '', nickName: ""});
                    this.notify("success", "Success", "Address is added successfully!");
                } else {
                    this.notify("warning", "Fialed", res.msg);
                }
            })
        } else {
            const updateItem = renderData[curIdx];
            let tempIdx = curIdx;
            originData.map((item, index) => {
                if( item.id === updateItem.id) {
                    tempIdx = index;
                }
            })
            updateAddress(updateItem.id, nickName, addr).then((res) => {
                if( res.success ) {
                    originData.splice(parseInt(tempIdx), 1, {
                        ...updateItem,
                        nickname: nickName,
                        address: addr
                    });
                    this.setState({renderData: originData, addNew: false, addr: '', nickName: ""});
                    this.notify("success", "Success", "Address is updated successfully!");
                } else {
                    this.notify("warning", "Fialed", res.msg);
                }
            })
        }
    }

    modifyAddress = (e, index) => {
        e.preventDefault();
        const updateItem = this.state.renderData[index];
        this.setState({
            addNew: true,
            btnTxt: "Modify ",
            curIdx: index,
            nickName: updateItem.nickname,
            addr: updateItem.address
        });
    }

    removeAddress = (e, index) => {
        e.preventDefault();
        const deleteItem = this.state.renderData[index];
        this.setState({
            alertscript: (
                <ReactBSAlert
                    warning
                    style={{ display: "block"}}
                    title={`${deleteItem.nickname}\n${deleteItem.address}`}
                    onConfirm={() => {
                        deleteOneItem(deleteItem.id).then((res) => {
                            if( res.success ){
                                let temp = this.state.renderData;
                                temp.splice(parseInt(index), 1);
                                this.setState({renderData: temp, alertscript: null});
                                this.notify("success", "Success", "Address is deleted successfully!");
                            }
                        })
                    }}
                    onCancel={() => this.setState({ alertscript: null })}
                    confirmBtnBsStyle="warning"
                    btnSize=""
                >
                    Are you really going to delete this address?
                </ReactBSAlert>
            )
        })
        
    }

    handleChange = e => {
        e.preventDefault();
        const val = e.target.value;
        if( val === "" ) {
            this.setState({renderData: this.state.originData});
        } else if( val.length < 2 ) {
            return;
        } else {
            const temp = this.state.originData.filter((item) => item.nickname.includes(val));
            this.setState({renderData: temp})
        }
    }

    render() {
        const { renderData, bless, addNew, btnTxt, nickName, addr } = this.state;
        return (
        <>
            {this.state.alertscript}
            <div className="rna-wrapper">
                <NotificationAlert ref="notificationAlert" />
            </div>
            <CardsHeader name="CENNZnet Address Scan" parentName="CENNZnet" onChange={this.handleChange}/>
            <Container className="mt--6" fluid>
                {addNew && <Row>
                    <Col xl="12">
                        <Card>
                            <CardHeader>
                                <Row>
                                    <div className="col">
                                        <h5 className="h3 mb-0">Add Address</h5>
                                    </div>
                                    <div className="col text-right">
                                        <Button
                                            color="danger"
                                            href="#pablo"
                                            onClick={e => {
                                                this.setState({addNew: false, nickName: "", addr: ""})
                                            }}
                                            size="sm"
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </Row>
                            </CardHeader>
                            <CardBody>
                                <ListGroup className="list my--3" flush>
                                    <ListGroupItem className="px-0">
                                        <Row className="align-items-center">
                                            <div className="ml-2">Nick Name</div>
                                            <Input 
                                                value={nickName}
                                                placeholder="Input a nick name" 
                                                className="ml-2 mt-2 mr-2 bm-2" 
                                                type="text"
                                                onChange={(e) => this.setState({nickName: e.target.value})}
                                            />
                                            <div className="ml-2 mt-2">Address</div>
                                            <Input
                                                value={addr}
                                                placeholder="Input a address"
                                                className="ml-2 mt-2 mr-2 bm-2"
                                                type="text"
                                                onChange={(e) => this.setState({addr: e.target.value})}
                                            />
                                            <Col className="col-auto center mt-3">
                                                <Button color="primary" size="md" type="button" onClick={this.addAddress}>
                                                    {btnTxt} Address
                                                </Button>
                                            </Col>
                                        </Row>
                                    </ListGroupItem>
                                    
                                </ListGroup>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>}
                <Row>
                    <Col xl="12">
                        <Card>
                            <CardHeader className="border-0">
                                <Row className="align-items-center">
                                    <div className="col">
                                        <h3 className="mb-0">Address Lists</h3>
                                    </div>
                                    <div className="col text-right">
                                        {!addNew && <Button
                                            color="primary"
                                            href="#pablo"
                                            onClick={e => this.showAddAddressCard(e)}
                                            size="sm"
                                        >
                                            Add
                                        </Button>}
                                        <Button
                                            color="primary"
                                            href="#pablo"
                                            onClick={e => {
                                                e.preventDefault();
                                                this.setState({bless: !bless})
                                            }}
                                            size="sm"
                                        >
                                            {bless? `Show All`: `Show Less`}
                                        </Button>
                                    </div>
                                </Row>
                            </CardHeader>
                            <Table className="align-items-center table-flush" responsive>
                                <thead className="thead-light">
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">address</th>
                                        <th scope="col">nick</th>
                                        <th scope="col">Modify</th>
                                        <th scope="col">remove</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        renderData?.map((item, index) => {
                                            if( index > 9 && bless ) return null;
                                            return (
                                                <tr key={item.id}>
                                                    <th scope="row">{index+1}</th>
                                                    <td>{item.address}</td>
                                                    <td>{item.nickname}</td>
                                                    <td>
                                                        <Button
                                                            color="default"
                                                            href="#pablo"
                                                            onClick={e => this.modifyAddress(e, index)}
                                                            size="sm"
                                                        >
                                                            Modify
                                                        </Button>
                                                    </td>
                                                    <td>
                                                        <Button
                                                            color="danger"
                                                            href="#pablo"
                                                            onClick={e => this.removeAddress(e, index)}
                                                            size="sm"
                                                        >
                                                            Remove
                                                        </Button>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </Table>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
        );
    }
}

export default Dashboard;
