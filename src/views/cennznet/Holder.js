
import React from "react";
import {
  Card,
  CardHeader,
  Container,
  Row,
} from "reactstrap";
import SimpleHeader from "components/Headers/SimpleHeader.js";
import { getAllAddress, getTopHolders } from "actions/AddressAction";
import TableCustom from "components/TableCustom";

class Holder extends React.Component {
  state = {
    alert: null,
    userid: null,
    renderData: [],
	total: 0,
	curPage: 1,
  };
    componentDidMount = async(e) => {
        const user = await localStorage.getItem('user');
        this.setState({userid: user});
        if( user ) {
			this.fetchData(1);
        }
    }

	fetchData = async (page) => {
		const user = await localStorage.getItem('user');
		getTopHolders(page-1).then((accounts) => {
			getAllAddress(user).then((res) => {
				if( res.success ) {
					const temp = [];
					accounts.list.forEach((element, idx) => {
						const existItem = this.isExist(element.address, res.result);
						if( existItem.length > 0 ) {
							temp.push({
								rank: idx + 1,
								address: element.address,
								amount: (parseInt(element.balance)/10000),
								nickname: existItem[0].nickname
							})
						} else {
							temp.push({
								rank: idx + 1,
								address: element.address,
								amount: (parseInt(element.balance)/10000),
								nickname: ""
							})
						}
						if( idx === accounts.list.length - 1 ) {
							this.setState({
								renderData: temp,
								total: parseInt(accounts.count),
								curPage: parseInt(page)
							})
						}
					});
					
				}
			}).catch((err) => {
				console.log(err);
			})
		})
	}
    isExist = (addr, arr) => {
        const temp = arr.filter((item) => item.address === addr)
        return temp; 
    }

	componentWillUnmount() {
		if( this.api ) {
            this.unsubscribe();
            process.exit(0);
        }
	}
	render() {
		return (
			<>
				{this.state.alert}
				<SimpleHeader name="Holder List" parentName="Algorand" />
				<Container className="mt--6" fluid>
					<Row>
						<div className="col">
							<Card>
								<CardHeader>
									<h3 className="mb-0">Holder's List</h3>
								</CardHeader>
								
								<TableCustom 
									items={this.state.renderData}
									total={this.state.total}
									curPage={this.state.curPage}
									onChange={pageNumber => this.fetchData(pageNumber)}
									columns={[
										{
											dataField: 'rank',
											text: 'Rank',
											sort: true,
										},
										{
											dataField: 'address',
											text: 'Address',
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
										}
									]}
								/>
							</Card>
						</div>
					</Row>
				</Container>
			</>
		);
  }
}

export default Holder;
