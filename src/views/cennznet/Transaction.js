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
    Modal
} from "reactstrap";
import { Api } from '@cennznet/api';
import ReactBSAlert from "react-bootstrap-sweetalert";
import NotificationAlert from "react-notification-alert";
import CardsHeader from "components/Headers/CardsHeader.js";
import { endpoint } from "constants/config";
import { getAllTrans, getSetting, addSettings } from "actions/TransactionAction";
import { deleteOneItem } from "actions/TransactionAction";

class Transactions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeNav: 1,
            start: '6121123',
            end: '',
            currentBlock: '0000000',
            userid: -1,
            renderData: [],
            originData: [],
            modalScript: null,
            alertscript: null,
            isOpen: false,
            limit: 500,
            loading: true,
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

    componentDidMount = async (e) => {
        getSetting().then((res) => {
            if( res.success && res.result.length > 0 ) {
                this.setState({
                    limit: parseInt(res.result[0].limit),
                    start: parseInt(res.result[0].start),
                    end: parseInt(res.result[0].end),
                })
            }
        })
        const user = await localStorage.getItem('user');
        this.setState({userid: user});
        
        if( user ) {
            try {
                getAllTrans(user).then((res) => {
                    if( res.success ) {
                        this.setState({
                            renderData: res.result,
                            originData: res.result,
                        })
                    }
                })
            } catch(e){
                console.log(e);
            }
        }

        try{
            const api = await Api.create({
                provider: endpoint
            });
            this.unsubscribe = await api.rpc.chain.subscribeNewHeads((header) => {
                this.setState({currentBlock: parseInt(header.number).toString(), end: parseInt(header.number) });
            });
        } catch (e) {
            console.log(e);
        }
    }

    componentWillUnmount(){
        if( this.api ) {
            this.unsubscribe();
            process.exit(0);
        }
    }
    
    saveBlockRange = e => {
        e.preventDefault();
        const { limit, start, end } = this.state;
        addSettings(limit, start, end).then((res) => {
            this.notify("success", "Success", "All data is stored successfully!");
        }).catch((err) => {
            this.notify("danger", "Failed", "Storing the data is failed!");
        })
    }

    detailTransaction = (e, item) => {
        e.preventDefault();
        this.setState({
            modalScript: (
                <Modal 
                    className="modal-dialog-centered"
                    isOpen={true}
                    toggle={() => this.setState({ modalScript: null })}
                >
                    <div className="modal-header">
                        <h1 >{item.nickname}</h1>
                        <button
                            aria-label="Close"
                            className="close"
                            data-dismiss="modal"
                            type="button"
                            onClick={() => this.setState({ modalScript: null })}
                        >
                            <span aria-hidden={true}>×</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <h5 className="h3 mb-0">Token Name:</h5>
                        <p>{item.tkname}</p>
                        <h5 className="h3 mb-0">From: </h5>
                        <p>{item.from}</p>
                        <h5 className="h3 mb-0">To: </h5>
                        <p>{item.to}</p>
                        <h5 className="h3 mb-0">Quantity: </h5>
                        <p>{(parseInt(item.qty)/10000).toFixed(4)}</p>
                        <h5 className="h3 mb-0">Decimal: </h5>
                        <p>{item.decimal}</p>
                        <h5 className="h3 mb-0">Date: </h5>
                        <p>{item.createdAt}</p>
                    </div>
                </Modal>
            )
        })
    }

    removeTransaction = (e, index) => {
        e.preventDefault();
        const deleteItem = this.state.renderData[index];
        let tempindex = index;
        this.state.originData.map((_i, idx) => {
            if( _i.id === deleteItem.id ) {
                tempindex = idx;
            }
        })
        this.setState({
            alertscript: (
                <ReactBSAlert
                    warning
                    style={{ display: "block"}}
                    title={`${deleteItem.nickname}\n${deleteItem.address}`}
                    onConfirm={() => {
                        deleteOneItem(deleteItem.id).then((res) => {
                            if( res.success ){
                                let temp = this.state.originData;
                                temp.splice(parseInt(tempindex), 1);
                                this.setState({renderData: temp, alertscript: null});
                                this.notify("success", "Success", "Transaction was deleted successfully!");
                            }
                        })
                    }}
                    onCancel={() => this.setState({ alertscript: null })}
                    confirmBtnBsStyle="warning"
                    btnSize=""
                >
                    Are you really going to delete this transaction?
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
        const { renderData, end, start, limit, modalScript, alertscript } = this.state;
        return (
        <>
            {modalScript}
            {alertscript}
            <div className="rna-wrapper">
                <NotificationAlert ref="notificationAlert" />
            </div>
            <CardsHeader name="CENNZnet Transactions Scan" parentName="CENNZnet" onChange={this.handleChange}/>
            <Container className="mt--6" fluid>
                <Row>
                    <Col xl="12">
                        <Card>
                            <CardHeader>
                                <Row>
                                    <div className="col">
                                        <h5 className="h3 mb-0">Block Range</h5>
                                    </div>
                                    <div className="col text-right">
                                        Current Block: #{this.state.currentBlock}
                                    </div>
                                </Row>
                            </CardHeader>
                            <CardBody>
                                <ListGroup className="list my--3" flush>
                                    <ListGroupItem className="px-0">
                                        <Row className="align-items-center">
                                            <Col md="4">
                                                <div className="ml-2">Limited Qty</div>
                                                <Input 
                                                    value={limit}
                                                    placeholder="Input limit qty" 
                                                    className="ml-2 mt-2 mr-2 bm-2" 
                                                    type="number"
                                                    onChange={(e) => this.setState({limit: e.target.value})}
                                                />
                                            </Col>
                                            <Col md="4">
                                                <div className="ml-2">Start Block</div>
                                                <Input 
                                                    value={start}
                                                    placeholder="Input start block" 
                                                    className="ml-2 mt-2 mr-2 bm-2" 
                                                    type="number"
                                                    onChange={(e) => this.setState({start: e.target.value})}
                                                />
                                            </Col>
                                            <Col md="4">
                                                <div className="ml-2">End Block</div>
                                                <Input
                                                    value={end}
                                                    placeholder="Input end block"
                                                    className="ml-2 mt-2 mr-2 bm-2"
                                                    type="number"
                                                    onChange={(e) => this.setState({end: e.target.value})}
                                                />
                                            </Col>
                                            <Col className="col-auto center mt-3">
                                                <Button color="primary" size="md" type="button" onClick={this.saveBlockRange}>
                                                    Save
                                                </Button>
                                            </Col>
                                        </Row>
                                    </ListGroupItem>
                                    
                                </ListGroup>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col xl="12">
                        <Card>
                            <CardHeader className="border-0">
                                <Row className="align-items-center">
                                    <div className="col">
                                        <h3 className="mb-0">Transaction Lists</h3>
                                    </div>
                                    <div className="col text-right">
                                        <Button
                                            color="primary"
                                            href="#pablo"
                                            onClick={e => e.preventDefault()}
                                            size="sm"
                                        >
                                            See all
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
                                        <th scope="col">qty min token</th>
                                        <th scope="col">decimal</th>
                                        <th scope="col">detail</th>
                                        <th scope="col">remove</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        renderData?.map((item, index) => {
                                            const amt = (parseInt(item.qty)/10000).toFixed(4);
                                            return (
                                                <tr key={item.id.toString()}>
                                                    <th scope="row">{index+1}</th>
                                                    <td>{item.address}</td>
                                                    <td>{item.nickname}</td>
                                                    <td>{amt}</td>
                                                    <td>{item.decimal}</td>
                                                    <td>
                                                        <Button
                                                            color="default"
                                                            href="#pablo"
                                                            onClick={e => this.detailTransaction(e, item)}
                                                            size="sm"
                                                        >
                                                            Detail
                                                        </Button>
                                                    </td>
                                                    <td>
                                                        <Button
                                                            color="danger"
                                                            href="#pablo"
                                                            onClick={e => this.removeTransaction(e, index)}
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

export default Transactions;
