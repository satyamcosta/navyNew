import React from 'react';
import Paper from '@material-ui/core/Paper';
// import { Grid, Table, TableHeaderRow } from '@devexpress/dx-react-grid-material-ui';
import { withStyles } from '@material-ui/core/styles';
  
 const styles = theme => ({
  tableStriped: {
    '& tbody tr:nth-of-type(odd)': {
      backgroundColor:'white'
    },
    '& tbody tr:nth-of-type(even)': {
      backgroundColor: 'white'
    },
  },
 
});
const TableComponentBase = ({ classes, ...restProps }) => (
  <h4>hello</h4>
);
export const TableComponent = withStyles(styles, { name: 'TableComponent' })(TableComponentBase);
class Table4 extends React.Component{
 state={
   columns : [
    { name: 'file', title: 'FLAG' }
   
  ],
   rows : [{file:"Sample1.docx" },
  {file:"Sample2.docx" },
  {file:"Sample3.docx" },
  ],
 };
 TableRow = ({ row, ...restProps }) => {
  return (
    // <Table.Row
    //   {...restProps}
    //   onClick={() => {
    //     this.props.setSelectedRow(row);
      
    //   }}
     
    // />
    <h4>hello</h4>
  );
};
  
render(){
  const { rows, columns } = this.state;
 
  return(
   
  <Paper>
    
    <h4>hello</h4>
  </Paper>
);
}
}
export default Table4;
  
  
  
  
  
  
  
  
  
  
  
  
