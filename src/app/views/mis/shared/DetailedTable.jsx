import React, { useEffect, useState } from "react";
// import { Grid as DevTable, PagingPanel, Table, TableHeaderRow, TableFilterRow } from "@devexpress/dx-react-grid-material-ui";
import { Divider, alpha, Grid, IconButton, Paper, Typography, withStyles } from "@material-ui/core";
// import { IntegratedPaging, PagingState, FilteringState, SortingState, IntegratedFiltering, IntegratedSorting } from "@devexpress/dx-react-grid";
import CloseIcon from '@material-ui/icons/Close';
import { connect, useDispatch } from "react-redux";
import { getMISDetailTableList } from '../../../camunda_redux/redux/action';
import { Loading } from "../therme-source/material-ui/loading";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";


const styles = theme => ({
    tableStriped: {
        '& tbody tr:nth-of-type(odd)': {
            backgroundColor: alpha(theme.palette.secondary.main, 0.10),
        },
        customRow: {
            '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.50),
            }
        },
    },
});
const TableComponentBase = ({ classes, ...restProps }) => (
    <h4>hello</h4>
);

export const TableComponent = withStyles(styles, { name: 'TableComponent' })(TableComponentBase);

const HeaderCellComponent = props => (
    <h4>hello</h4>
);

const DetailedTable = (props) => {
    const { selectionMode, headerText, columnWidth } = props;
    const dispatch = useDispatch();
    const columns = [
        { name: 'departmentName', title: 'Name of Department' },
        { name: 'fileNumber', title: 'File #' },
        { name: 'subject', title: 'Subject' },
        { name: 'initiatedBy', title: 'Initiated By' },
        { name: 'pendingWith', title: 'Pending With' },
        { name: 'pendingSince', title: 'Pending Since' },
        { name: 'pendingdays', title: 'No of Days Pending' },
    ];

    const [tableColumnExtensions] = useState([
        // { columnName: 'sno', align: 'center' },
        { columnName: 'department', align: 'center' },
        { columnName: 'fileNumber', align: 'center' },
        { columnName: 'subject', align: 'center', wordWrapEnabled: true },
        { columnName: 'initiatedBy', align: 'center', wordWrapEnabled: true },
        { columnName: 'pendingWith', align: 'center', wordWrapEnabled: true },
        { columnName: 'pendingSince', align: 'center', wordWrapEnabled: true },
        { columnName: 'noOfDaysPending', align: 'center', wordWrapEnabled: true },
        // { columnName: 'status', align: 'center', wordWrapEnabled: true },
    ]);

    const getRowId = row => row.sno;
    const [blnHidden, setBlnHidden] = useState(true);
    

    const handleCloseClick = () => {
        setBlnHidden(true);
    };
    const TableRow = ({ row, ...restProps }) => (
        <h4>hello</h4>
    );
    const [rowData, setRowData] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (selectionMode === false) {
            setLoading(true);
            let formData = new FormData();
            formData.append('sau', headerText.SAU);
            formData.append('column', headerText.ColumnName);
            formData.append('num', headerText.Value);
            props.getMISDetailTableList(formData).then((resp) => {
                let tmpArr = [];
                try {
                    if (resp.Data !== undefined && resp.Data !== null) {
                        tmpArr = resp.Data;
                        setRowData(tmpArr);
                        setBlnHidden(selectionMode);
                        setLoading(false);
                    }
                    else {
                        setLoading(false);
                        const errorMessage = "Data is null"
                        callMessageOut(errorMessage);
                    }
                }
                catch (e) {
                    setLoading(false);
                    callMessageOut(e.message);
                }
            }).catch(error => {
                console.log(error);
                setLoading(false);
            });
        }

    }, [selectionMode]);

    const callMessageOut = (message) => {
        dispatch(setSnackbar(true, "error", message));
    }


    return (
        <div hidden={blnHidden}>
            
        </div>
    );
};

function mapStateToProps(state) {

    return { props: state.props };
}

export default connect(mapStateToProps, { getMISDetailTableList })(DetailedTable);
