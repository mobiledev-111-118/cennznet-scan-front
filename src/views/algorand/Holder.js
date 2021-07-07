
import React from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import {
  Card,
  CardHeader,
  Container,
  Row,
  Input,
  Modal,r
} from "reactstrap";
import SimpleHeader from "components/Headers/SimpleHeader.js";
import { getAllAddress } from "actions/AlgoAddressAction";
import { getTopHolders } from "actions/AlgorandAction";
import { getAssetOne } from "actions/AlgorandAction";
import Button from "reactstrap/lib/Button";

import "./style.css";
import { addHoldersName } from "actions/AlgoHolderAction";
import { getHoldersName } from "actions/AlgoHolderAction";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import CardBody from "reactstrap/lib/CardBody";

const pagination = paginationFactory({
	page: 1,
	alwaysShowAllBtns: true,
	showTotal: true,
	withFirstAndLast: false,
	sizePerPage : 100,
	sizePerPageRenderer: ({ options, currSizePerPage, onSizePerPageChange }) => (
		<div className="dataTables_length" id="datatable-basic_length">
			<label>
				Show{' '}
				{
					<select
						name="datatable-basic_length"
						aria-controls="datatable-basic"
						className="form-control form-control-sm"
						onChange={(e) => onSizePerPageChange(e.target.value)}
					>
						<option value="100">100</option>
						<option value="50">50</option>
						<option value="25">25</option>
						<option value="10">10</option>
					</select>
				}{' '}
				entries.
			</label>
		</div>
	),
});

const { SearchBar } = Search;

class Holder extends React.Component {
	state = {
		alert: null,
		userid: null,
		renderData: [],
		curAsset: {
			id: 27165954,
			decimals: 6,
			symbol: 'Planets',
		},
		invalid: false,
		modalScript: false,
		editRow: null,
		account: [],
		loading: true,
		greater: 1
	};
	componentDidMount = async (e) => {
		const user = await localStorage.getItem('user');
		this.setState({ userid: user });
		if (user) {
			this.fetchData(this.state.curAsset);
		}
	};

	getAllAccounts = (asset, next) => {
		const devide = Math.pow(10, parseInt(asset.decimals));	
		const reqLimitAmt = parseInt(devide * parseFloat(this.state.greater));
		getTopHolders(10, asset.id, next, reqLimitAmt).then(async (res) => {
			this.state.account = this.state.account.concat(res.accounts);
			if( res.accounts.length === 1000 ) {
				this.getAllAccounts(asset, res[`next-token`]);
			} else {
				const user = await localStorage.getItem('user');
				const holders = await getHoldersName();
				getAllAddress(user)
				.then((res) => {
					if (res.success) {
						const temp = [];
						this.state.account.forEach((element, idx) => {
							const existItem = this.isExist(element.address, res.result);
							const existItem2 = this.isExist(element.address, holders.result);
							const amt = element.assets? this.getAmount(element.assets, asset.id) / devide : 0;
							if (existItem.length > 0) {
								temp.push({
									address: element.address,
									amount: amt,
									algo: parseInt(element.amount) / 1000000,
									nickname: existItem[0].nickname,
								});
							} else if (existItem2.length > 0) {
								temp.push({
									address: element.address,
									amount: amt,
									algo: parseInt(element.amount) / 1000000,
									nickname: existItem2[0].nickname,
								});
							} else {
								temp.push({
									address: element.address,
									amount: amt,
									algo: parseInt(element.amount) / 1000000,
									nickname: '',
								});
							}
							if (idx === this.state.account.length - 1) {
								const temp2 = temp.sort((a, b) => b.amount - a.amount);
								const temp3 = [];
								temp2.map((item, idx) => {
									temp3.push({
										rank: idx + 1,
										...item,
									});
								});
								this.setState({
									renderData: temp3,
									modalScript: null,
									loading: false
								});
							}
						});
					}
				})
				.catch((err) => {
					console.log(err);
				});
			}
		})
	}
	fetchData = async (asset) => {
		this.setState({loading: true, account: []});
		this.getAllAccounts(asset, "")
	};

	isExist = (addr, arr) => {
		const temp = arr.filter((item) => item.address === addr);
		return temp;
	};

	getAmount = (arr, assetId) => {
		const temp = arr.filter((_item) => parseInt(_item[`asset-id`]) === parseInt(assetId));
		return temp.length? parseInt(temp[0].amount) : 0;
	}

	onChangeAssetId = (value) => {
		if (value === '') {
			this.setState({
				curAsset: {
					id: value,
					decimals: 6,
					symbol: '',
				},
				invalid: false,
				renderData: [],
			});
			return;
		}
		getAssetOne(value).then((exist) => {
			if (!exist) {
				this.setState({
					curAsset: {
						id: value,
						decimals: 6,
						symbol: '',
					},
					renderData: [],
					invalid: true,
				});
			} else if (exist !== null) {
				this.setState({
					curAsset: {
						id: value,
						decimals: exist.decimals,
						symbol: exist.unit,
					},
					invalid: false,
				});
				
			}
		});
	};

	actionLabel = (item) => {
		this.setState({
			editRow: item,
			modalScript: true,
		});
	};

	saveLabel = () => {
		addHoldersName(this.state.editRow.address, this.state.editRow.nickname).then((res) => {
			if (res.success) {
				this.fetchData(this.state.curAsset);
			}
		});
	};

	onSearch = ()=> {
		this.fetchData(this.state.curAsset);
	}

	render() {
		const { modalScript, editRow, loading, curAsset } = this.state;
		// const deci = Math.pow(10, parseInt(curAsset.decimals));
		return (
			<>
				{modalScript && (
					<Modal
						className="modal-dialog-centered"
						isOpen={true}
						toggle={() => this.setState({ modalScript: false })}
					>
						<div className="modal-header">
							<h1>{editRow.nickname ? 'Update Label' : 'Add Label'}</h1>
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
							<h5 className="h3 mb-0 mt-2 ">Address</h5>
							<Input
								value={editRow.address}
								placeholder="Input address"
								className="mr-2 bm-2"
								type="text"
								readOnly
							/>
							<h5 className="h3 mt-2 mb-0">Label</h5>
							<Input
								value={editRow.nickname}
								placeholder="Input label"
								className="mr-2 bm-2"
								type="text"
								onChange={(e) => {
									this.setState({
										editRow: {
											...editRow,
											nickname: e.target.value,
										},
									});
								}}
							/>
							<Row
								className="justify-content-right mt-4"
								style={{ justifyContent: 'flex-end', paddingRight: 15 }}
							>
								<Button
									color="danger"
									size="md"
									type="button"
									onClick={() =>
										this.setState({
											modalScript: null,
											editRow: null,
										})
									}
								>
									Cancel
								</Button>
								<Button color="primary" size="md" type="button" onClick={this.saveLabel}>
									Save
								</Button>
							</Row>
						</div>
					</Modal>
				)}
				{this.state.alert}
				<SimpleHeader name="Holder List" parentName="Algorand" />
				<Container className="mt--6" fluid>
					<Row>
						<div className="col">
							<Card>
								<CardHeader>
									<Row>
										<div style={{ marginTop: 8, marginLeft: 20, minWidth: 200}}>
											<h3 className="mb-0">Holder's List</h3>
										</div>
										<div className="col text-right">
											<Row style={{ alignItems: 'center' }}>
												<h4 className="col" style={{marginTop: 5, minWidth: 350}}>{`GreaterThan(with decimals):`} </h4>
												<Input
													value={this.state.greater}
													placeholder="Input hloder's amt"
													className="col"
													type="number"
													onChange={(e) => this.setState({greater: e.target.value})}
												/>
												<h4 className="col" style={{marginTop: 5, minWidth: 170}}>{`Asset ID (${this.state.curAsset.symbol}):`} </h4>
												<Input
													value={this.state.curAsset.id}
													placeholder="Input asset ID"
													className="col"
													type="number"
													onChange={(e) => this.onChangeAssetId(e.target.value)}
												/>
												<Button
													color="success"
													type="button"
													onClick={() => this.onSearch()}
													style={{marginLeft: 20}}
												>
													{`Request`}
												</Button>
											</Row>
											{this.state.invalid && (
												<h6 style={{ color: 'red' }}>This asset is invalid!</h6>
											)}
										</div>
									</Row>
								</CardHeader>
								<CardBody>
								{loading?
									<div style={{display: "flex", justifyContent: "center"}}>
										<Loader
											type="Circles"
											color="grey"
											height={100}
											width={100}
											timeout={0} //3 secs
										/>
									</div>:
									<ToolkitProvider
										data={this.state.renderData}
										keyField="address"
										columns={[
											{
												dataField: 'rank',
												text: 'rank',
												sort: true,
											},
											{
												dataField: 'address',
												text: 'Address',
												sort: true,
											},
											{
												dataField: 'algo',
												text: 'algo_qty',
												sort: true,
											},
											{
												dataField: 'amount',
												text: 'Quantity',
												sort: true,
											},
											{
												dataField: 'nickname',
												text: 'Label',
												sort: true,
											},
											{
												dataField: '',
												text: 'Action',
												formatter: (rowContent, row) => {
													return (
														<Button
															className="fleet-table-button"
															color="success"
															type="button"
															onClick={() => this.actionLabel(row)}
														>
															{row.nickname ? `Update` : `Add`}
														</Button>
													);
												},
											},
										]}
										search
									>
										{(props) => (
											<div className="py-4 table-responsive">
												<div id="datatable-basic_filter" className="dataTables_filter px-4 pb-1">
													<label>
														Search:
														<SearchBar
															className="form-control-sm"
															placeholder=""
															{...props.searchProps}
														/>
													</label>
												</div>
												<BootstrapTable
													{...props.baseProps}
													bootstrap4={true}
													pagination={pagination}
													bordered={false}
												/>
											</div>
										)}
									</ToolkitProvider>
								}
								</CardBody>
							</Card>
						</div>
					</Row>
				</Container>
			</>
		);
	}
}

export default Holder;
