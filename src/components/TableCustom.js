import React from 'react';
import Pagination from 'react-js-pagination';

import {
  Row,
  Col
} from 'reactstrap';

export default function TableCustom({ items = [], columns = [], total, curPage, onChange}) {
  return (
    <React.Fragment>
      <div className="py-4 table-responsive">
          <div className="react-bootstrap-table">
            <table className="table">
              <thead>
                <tr>
                  {
                    columns && columns.length > 0 &&
                    columns.map((column, index) => {
                      return <th tabIndex="0" key={index} style={column.headerStyle ? column.headerStyle : {}}>{column.text}</th>
                    })
                  }
                </tr>
              </thead>
              <tbody>
                {
                  items && items.length > 0 &&
                  items.map((item, index) => {
                    return <tr key={index}>
                      {
                        columns && columns.length > 0 &&
                        columns.map((column, index2) => {
                          return <td key={index2} style={column.style ? column.style : {}}>
                            {column.formatter ? column.formatter('', item) : item[column.dataField]}
                          </td>
                        })
                      }
                    </tr>
                  })
                }
              </tbody>
            </table>
          </div>
      </div>
      {items.length > 0 && 
      <Row className="react-bootstrap-table-pagination">
        <Col lg={6}>
          <p className="text-sm text-black" style={{paddingLeft: 10}}>
            {`Showing rows ${(curPage - 1) * 100 + 1} to ${100 * curPage > total ? total : 100 * curPage} of ${total}`}
          </p>
        </Col>
        <Col lg={6} className="react-bootstrap-table-pagination-list">
          <Pagination
            activePage={curPage}
            totalItemsCount={total}
            itemsCountPerPage={100}
            onChange={onChange}
            itemClass="page-item"
            linkClass="page-link"
            innerClass="pagination react-bootstrap-table-page-btns-ul"
          />
        </Col>
      </Row>}
    </React.Fragment>
  )
}