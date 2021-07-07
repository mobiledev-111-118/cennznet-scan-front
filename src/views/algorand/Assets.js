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
import ReactBSAlert from "react-bootstrap-sweetalert";
import NotificationAlert from "react-notification-alert";
import CardsHeader from "components/Headers/CardsHeader.js";
import { getAllTrans, getSetting, addSettings, deleteOneItem, addAsset, updateAsset } from "actions/AlgoAssetsAction";

import { getLatestBlockNumber, getAssetOne } from "actions/AlgorandAction";

class Assets extends React.Component {
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
            modalScript: false,
            alertscript: null,
            isOpen: false,
            limit: 500,
            loading: true,
            address: "",
            tkname: "",
            nickname: "",
            qty: 0,
            tkdecimal: 18,
            badd: false,
            curID: -1,
            invalid: false,
            getBNTimer: null
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
                    start: parseInt(res.result[0].start),
                    end: parseInt(res.result[0].end),
                })
            }
        })
        const user = await localStorage.getItem('user');
        this.setState({userid: parseInt(user)});
        
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

        let getBNTimer1 = setInterval(() => {
            getLatestBlockNumber().then((res) => {
                if( res ) {
                    this.setState({currentBlock: res.lastRound, end: res.lastRound});
                }
            })
        }, 1000);
        this.setState({getBNTimer : getBNTimer1});
    }

    componentWillUnmount(){
        clearInterval(this.state.getBNTimer);
    }
    
    saveBlockRange = e => {
        e.preventDefault();
        const { limit, start, end } = this.state;
        addSettings(limit, start, end).then((res) => {
            this.notify("success", "Success!", "All data is stored successfully!");
        }).catch((err) => {
            this.notify("danger", "Failed!", "Storing the data is failed!");
        })
    }

    detailTransaction = (e, item, idx) => {
        
        e.preventDefault();
        this.setState({
            modalScript:true,
            badd: item === null ? true: false,
            address: item === null ? "": item.address,
            tkname: item == null ? "" : item.tkname,
            nickname: item === null ? "" : item.nickname,
            qty: item === null ? 0: item.qty,
            tkdecimal: item === null ? 18: item.tkdecimal,
            curID: idx
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
                    title={`${deleteItem.nickname}`}
                    onConfirm={() => {
                        deleteOneItem(deleteItem.id).then((res) => {
                            if( res.success ){
                                let temp = this.state.originData;
                                temp.splice(parseInt(tempindex), 1);
                                this.setState({renderData: temp, alertscript: null});
                                this.notify("success", "Success", "Transaction was deleted successfully!");
                            } else {
                                this.notify("warning", "Failed!", res.msg);
                            }
                        })
                    }}
                    onCancel={() => this.setState({ alertscript: null })}
                    confirmBtnBsStyle="warning"
                    btnSize=""
                >
                    Are you really going to delete this Assets?
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
            const temp = this.state.originData.filter((item) => item.nickname.toLowerCase().includes(val.toLowerCase()));
            this.setState({renderData: temp})
        }
    }

    saveAsset = () => {
        const { userid, address, tkname, nickname, qty, tkdecimal, curID, renderData, invalid } = this.state;
        if( address === "" || nickname === "" || invalid ) {
            this.notify("warning", "Warning!", "Asset id and nick name is required!");
            return;
        }
        if( this.state.badd ) {
            addAsset(userid, address, tkname, nickname, qty, tkdecimal).then((res) => {
                if( res.success ) {
                    renderData.push(res.result);
                    this.setState({
                        badd: false,
                        modalScript: false,
                        address: "",
                        tkname: "",
                        nickname: "",
                        qty: 0,
                        tkdecimal: 18,
                        renderData: renderData
                    });
                    this.notify("success", "Success!", "Asset is stored successfully!");
                } else {
                    this.notify("danger", "Failed!", res.msg);
                }
            })
        } else {
            updateAsset(renderData[parseInt(curID)].id, address, tkname, nickname, qty, tkdecimal).then((res) => {
                if( res.success ){
                    const temp = renderData[parseInt(curID)];
                    renderData.splice(parseInt(curID), 1, {
                        ...temp,
                        address, tkname, nickname, qty, tkdecimal
                    });
                    this.setState({
                        badd: false,
                        modalScript: false,
                        address: "",
                        tkname: "",
                        nickname: "",
                        qty: 0,
                        tkdecimal: 18,
                        renderData: renderData
                    })
                    this.notify("success", "Success!", "Updating success!");
                } else {
                    this.notify("danger", "Failed!", res.msg);
                }
            })
        }
    }
    render() {
        const { renderData, end, start, invalid, modalScript, alertscript, address, tkname, qty, nickname, tkdecimal, badd } = this.state;
        return (
        <>  
            {modalScript && <Modal 
                    className="modal-dialog-centered"
                    isOpen={true}
                    toggle={() => this.setState({ modalScript: false })}
                >
                    <div className="modal-header">
                        <h1 >{badd? "Add New Asset Data" : "Modify the Asset Data"}</h1>
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
                        <h5 className="h3 mt-2 mb-0">Asset ID</h5>
                        <Input 
                            value={address}
                            placeholder="Input asset id" 
                            className="mr-2 bm-2" 
                            type="number"
                            onChange={(e) => {
                                const asset = e.target.value;
                                if( asset === "" ) {
                                    this.setState({
                                        address: asset,
                                        invalid: false,
                                    })
                                    return;
                                }
                                getAssetOne(asset).then((exist) => {
                                    if( !exist ) {
                                        this.setState({
                                            address: asset,
                                            tkname: "",
                                            tkdecimal: "",
                                            invalid: true,
                                        })
                                    } else if(exist !== null) {
                                        this.setState({
                                            address: asset,
                                            tkname: exist.unit,
                                            tkdecimal: exist.decimals,
                                            invalid: false,
                                        })
                                    }
                                })
                            }}
                        />
                        {invalid && <h6 style={{color: 'red'}}>This asset is invalid!</h6>}
                        <h5 className="h3 mb-0 mt-2 ">Symbol</h5>
                        <Input 
                            value={tkname}
                            placeholder="Input symbol" 
                            className="mr-2 bm-2" 
                            type="text"
                            readOnly
                            onChange={(e) => this.setState({tkname: e.target.value})}
                        />
                        <h5 className="h3 mt-2 mb-0">Nick Name</h5>
                        <Input 
                            value={nickname}
                            placeholder="Input nick name" 
                            className="mr-2 bm-2" 
                            type="text"
                            onChange={(e) => this.setState({nickname: e.target.value})}
                        />
                        <h5 className="h3 mt-2 mb-0">Qty Min Token</h5>
                        <Input 
                            value={qty}
                            placeholder="" 
                            className="mr-2 bm-2" 
                            type="number"
                            onChange={(e) => this.setState({qty: e.target.value})}
                        />
                        <h5 className="h3 mt-2 mb-0">Decimal</h5>
                        <Input 
                            value={tkdecimal}
                            placeholder="" 
                            className="mr-2 bm-2" 
                            type="number"
                            readOnly
                            onChange={(e) => this.setState({tkdecimal: e.target.value})}
                        />
                        <Row className="justify-content-right mt-4" style={{justifyContent: 'flex-end', paddingRight: 15}}>
                            <Button color="danger" size="md" type="button" onClick={() => this.setState({
                                modalScript: false,
                                address: "",
                                tkname: "",
                                nickname: "",
                                qty: 0,
                                tkdecimal: 18,
                            })}>
                                Cancel
                            </Button>
                            <Button color="primary" size="md" type="button" onClick={this.saveAsset}>
                                Save
                            </Button>
                        </Row>
                    </div>
                </Modal>}
            {alertscript}
            <div className="rna-wrapper">
                <NotificationAlert ref="notificationAlert" />
            </div>
            <CardsHeader name="Algorand Assets Scan" parentName="Algorand" onChange={this.handleChange}/>
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
                                            {/* <Col md="4">
                                                <div className="ml-2">Limited Qty</div>
                                                <Input 
                                                    value={limit}
                                                    placeholder="Input limit qty" 
                                                    className="ml-2 mt-2 mr-2 bm-2" 
                                                    type="number"
                                                    onChange={(e) => this.setState({limit: e.target.value})}
                                                />
                                            </Col> */}
                                            <Col md="6">
                                                <div className="ml-2">Start Block</div>
                                                <Input 
                                                    value={start}
                                                    placeholder="Input start block" 
                                                    className="ml-2 mt-2 mr-2 bm-2" 
                                                    type="number"
                                                    readOnly
                                                    onChange={(e) => this.setState({start: e.target.value})}
                                                />
                                            </Col>
                                            <Col md="6">
                                                <div className="ml-2">End Block</div>
                                                <Input
                                                    value={end}
                                                    placeholder="Input end block"
                                                    className="ml-2 mt-2 mr-2 bm-2"
                                                    type="number"
                                                    readOnly
                                                    onChange={(e) => this.setState({end: e.target.value})}
                                                />
                                            </Col>
                                            {/* <Col className="col-auto center mt-3">
                                                <Button color="primary" size="md" type="button" onClick={this.saveBlockRange}>
                                                    Save
                                                </Button>
                                            </Col> */}
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
                                        <h3 className="mb-0">Tracking Assets</h3>
                                    </div>
                                    <div className="col text-right">
                                        <Button
                                            color="primary"
                                            href="#pablo"
                                            onClick={e => this.detailTransaction(e, null, -1)}
                                            size="sm"
                                        >
                                            Add
                                        </Button>
                                    </div>
                                </Row>
                            </CardHeader>
                            <Table className="align-items-center table-flush" responsive>
                                <thead className="thead-light">
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">asset_id</th>
                                        <th scope="col">symbol</th>
                                        <th scope="col">nick</th>
                                        <th scope="col">qty min token</th>
                                        <th scope="col">decimal</th>
                                        <th scope="col">modify</th>
                                        <th scope="col">remove</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        renderData?.map((item, index) => {
                                            return (
                                                <tr key={item.id.toString()}>
                                                    <th scope="row">{index+1}</th>
                                                    <td>{item.address}</td>
                                                    <td>{item.tkname}</td>
                                                    <td>{item.nickname}</td>
                                                    <td>{item.qty}</td>
                                                    <td>{item.tkdecimal}</td>
                                                    <td>
                                                        <Button
                                                            color="default"
                                                            href="#pablo"
                                                            onClick={e => this.detailTransaction(e, item, index)}
                                                            size="sm"
                                                        >
                                                            Modify
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

export default Assets;
