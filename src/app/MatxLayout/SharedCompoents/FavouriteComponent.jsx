import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, MenuItem, Paper, TextField, Tooltip } from '@material-ui/core'
import { Add, Cancel, CheckOutlined, Delete } from '@material-ui/icons'
import { Autocomplete } from '@material-ui/lab'
import React, { useCallback, useEffect, useState } from 'react'
import { getInternalServiceNumber, getGroupList, getFav, setFav, deleteFav } from 'app/camunda_redux/redux/action'
import { useTranslation } from 'react-i18next'
import { connect, useDispatch, useSelector } from 'react-redux'
import { debounce } from 'utils'
import { isNullOrUndefined } from '@syncfusion/ej2-base'
import { Loading } from "../../views/inbox/therme-source/material-ui/loading"
import { setSnackbar } from 'app/camunda_redux/redux/ducks/snackbar'
import { setMyFav } from "app/redux/actions/FavActions"
import Draggables from "react-draggable";

const PaperComponent = (props) => {
    return (
        <Draggables handle="#draggable-dialog-title" cancel={".cancel-drag"}>
            <Paper {...props} />
        </Draggables>
    );
};

const FavComponent = (props) => {

    const { t } = useTranslation()
    const dispatch = useDispatch()

    const favObj = useSelector((state) => state.fav)

    const [loading, setLoading] = useState(false)

    const [isInt, setIsInt] = useState(false)
    const [isExt, setIsExt] = useState(false)

    const [groupList, setGroupList] = useState([])
    const [group, setGroup] = useState("")
    const [groupText, setGroupText] = useState("")
    const [intServiceList, setIntServiceList] = useState([])
    const [sectionList, setSectionList] = useState([])
    const [disableUpdateBtn,setDisableUpdateBtn] = useState(true)

    const [section, setSection] = useState([])
    const [intService, setIntService] = useState([])

    // const [favId, setFavId] = useState("")

    const [openDelete, setOpenDelete] = useState(false)
    const [createGroup, setCreateGroup] = useState(false)

    const handleDelete = () => {
        props.deleteFav(group?.id).then((res) => {
            try {
                if (res.error) {
                    callMessageOut(res.error);
                    setLoading(true)
                }
                else {
                    dispatch(
                        setSnackbar(true, "success", t("deleted_from_favourite_list_successfully"))
                    );
                    setOpenDelete(false)
                    setLoading(false)
                    fetchFavourate()
                    setDisableUpdateBtn(true)
                }
            } catch (error) {
                setLoading(false)
                setDisableUpdateBtn(true)
            }
        })
    }

    const callMessageOut = (msg) => {
        setLoading(false);
        dispatch(setSnackbar(true, "error", msg));
    };

    useEffect(() => {
        handleInputValueChangeInternalService()
        // fetchFavourate()
    }, [])

    // useEffect(() => {
    //     console.log(props.favObj)
    //     if (props.favObj) {
    //         setIntService(props.favObj?.roles)
    //         setSection(props.favObj?.department)
    //         setFavId(props.favObj?.id)
    //     }
    // }, [props.favObj])
    let initialGroup = { department : [],favoriteAt  : "",  favouriteStatus: "",id :null,label:"please select group",roleName:[],username:""

    }
    useEffect(() => {
        if (favObj?.favList) {
            const fav = initialGroup
            setIntService(fav?.roles)
            setSection(fav?.department)
            setGroupList([initialGroup,...favObj?.favList])
            setGroup(fav)
            setGroupText(fav?.label)
        }
    }, [favObj])

    console.log({
        groupList,
        group,
        intService,
        section,
        groupText
    })

    const fetchFavourate = async () => {
        setLoading(false)
        props.getFav().then((res) => {
            try {
                if (res.error) {
                    callMessageOut(res.error);
                    setLoading(true)
                }
                else {
                    props.setMyFav(res)
                    setLoading(false)
                }
            } catch (error) {
                setLoading(false)
            }
        })
    }

    const setFavourate = async (create) => {
        setLoading(true)
        let body;
        if (create) {
            console.log(2)
            body = {
                id: "",
                label: groupText,
                username: localStorage.getItem("username"),
                roleName: sessionStorage.getItem("role"),
                department: [],
                roles: [],
                favouriteStatus: "true"
            }
        }
        else {
            console.log(3)
            body = {
                id: group?.id,
                label: groupText,
                username: localStorage.getItem("username"),
                roleName: sessionStorage.getItem("role"),
                department: section,
                roles: intService.map((item) => {
                    if (typeof item.deptRole == "object") {
                        return {
                            ...item?.deptRole[0],
                            deptDisplayUsername: item?.deptDisplayUsername,
                            deptUsername: item?.deptUsername
                        }
                    }


                    return item


                }),
                favouriteStatus: "true"
            }
        }
        props.setFav(body).then((res) => {
            try {
                if (res.error) {
                    callMessageOut(res.error);
                    setLoading(false)
                }
                else {
                    console.log(4)
                    dispatch(
                        setSnackbar(true, "success", t("added_to_favourite_successfully"))
                    );
                    setLoading(false)
                    // props.setMyFav(body)  // Save fav in redux
                    console.log("res is",res)
                    setCreateGroup(false)
                    setGroupText("")
                    fetchFavourate()
                    setDisableUpdateBtn(true)
                }
            } catch (error) {
                setLoading(false)
                setDisableUpdateBtn(true)
            }
        })
    }

    const handleInputValueChange = async (newValue) => {

        if (newValue && newValue.length >= 2) {
            let formData = new FormData();
            formData.append("sau", newValue);
            setIsExt(true);
            await props
                .getGroupList(formData)
                .then((resp) => {
                    try {
                        if (resp.error) {
                            callMessageOut(resp.error);
                            setIsExt(false);
                        } else {
                            let tmpArray = [];

                            setSectionList(resp.data || []);
                            setIsExt(false);

                        }
                    } catch (error) {
                        callMessageOut(error.message);
                        setIsExt(false);
                    }
                })
                .catch((err) => {
                    callMessageOut(err.message);
                    setIsExt(false);
                });

        }
    };

    const optimizedSectionList = useCallback(
        debounce(handleInputValueChange),
        []
    );

    const handleInputValueChangeInternalService = async (newValue) => {
        const dept = sessionStorage.getItem("department");
        setIsInt(true);
        await props
            .getInternalServiceNumber("", dept)
            .then((resp) => {
                try {
                    if (resp.error) {
                        callMessageOut(resp.error);
                        setIsInt(false);
                    } else {
                        let tmpArray = [];
                        setIntServiceList(resp.data || []);
                        setIsInt(false);
                    }
                } catch (err) {
                    callMessageOut(err.message);
                    setIsInt(false);
                }
            })
            .catch((err) => {
                callMessageOut(err.message);
                setIsInt(false);
            });

    };

    const handleOnChange = (val) => {
        if (val.length == 0) {
            setSection(val);
        } else {
            const newVal = val[val.length - 1];
            if (newVal && typeof newVal === "object" && "id" in newVal) {
                if (!isNullOrUndefined(val)) {

                    setSection(val);


                } else {

                    setSection([]);

                }
            }
        }
    };

    const handleOnChangeInternalService = async (val) => {
        if (val.length == 0) {
            setIntService(val);
        } else {
            const newVal = val[val.length - 1];
            if (
                newVal &&
                typeof newVal === "object" &&
                ("id" in newVal || "displayRoleName" in newVal)
            ) {
                if (!isNullOrUndefined(val)) {

                    setIntService(val);


                } else {

                    setIntService([]);

                }
            }
        }
    };

    const handleChangeGroup = (val) => {
        console.log(val)
        if (val && typeof val === "object" && "id" in val) {
            setGroup(val)
            setGroupText(val?.label)
            setIntService(val?.roles)
            setSection(val?.department)
           
        }
        else {
            setGroup({})
            setGroupText("")
            setIntService([])
            setSection([])
            
        }
        if(val.id==null){
            setDisableUpdateBtn(true)
        }else{
            setDisableUpdateBtn(false)
        }
    }

    return (
        <>
            {loading && <Loading />}
            <DialogContent dividers>

                <Grid container justifyContent='center' alignItems='center' spacing={2}>
                    <Grid item xs={12} style={{
                        display: disableUpdateBtn ? "grid" : "",
                        gridTemplateColumns: disableUpdateBtn ? "1.2fr 3rem " : "",
                        width: disableUpdateBtn ? "100%" : "",
                    }}>

                        <TextField
                            fullWidth
                            size='small'
                            id="outlined-select-currency"
                            select
                            label={"group"}
                            required
                            value={group}
                            onChange={(e) => handleChangeGroup(e.target.value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            placeholder="Select Dak Type"
                            variant="outlined"
                            className={` corr-form-select ${props.theme ? "darkTextField" : ""
                                }`}
                        // error={formik.touched.type && Boolean(formik.errors.type)}
                        // helperText={formik.touched.type && formik.errors.type}
                        >
                            {groupList.map((option, i) => (
                                <MenuItem key={i} value={option}>
                                    {option?.label}
                                </MenuItem>
                            ))}
                            
                        </TextField>
                      { disableUpdateBtn &&  <Tooltip title={t("add_group")} style={{marginTop:"-5px"}}>
                            <span>
                                <IconButton onClick={() => setCreateGroup(true)}>
                                    <Add color="primary" />
                                </IconButton>
                            </span>
                        </Tooltip>}
                        
                    </Grid>
                    <Grid item xs={12} style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 3rem 3rem",
                        width: "100%",
                    }}>
                        { !disableUpdateBtn &&  <TextField
                            fullWidth
                            size='small'
                            variant="outlined"
                            multiline
                            minRows={3}
                            name="subject"
                            required
                            label={t("group")}
                            className={props.theme ? "darkTextField" : ""}
                            value={groupText}
                            onChange={(e) => setGroupText(e.target.value)}
                            inputProps={{ maxLength: 250 }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            placeholder="Enter Subject"
                            // error={
                            //     formik.touched.subject && Boolean(formik.errors.subject)
                            // }
                            // helperText={formik.touched.subject && formik.errors.subject}
                            autoFocus
                            disabled={!Boolean(group)}
                        /> }
                       {!disableUpdateBtn && <Tooltip title={t("add_group")}>
                            <span>
                                <IconButton onClick={() => setCreateGroup(true)}>
                                    <Add color="primary" />
                                </IconButton>
                            </span>
                        </Tooltip>}
                       { !disableUpdateBtn && <Tooltip title={t("delete_group")}>
                            <span>
                                <IconButton disabled={!Boolean(group)} onClick={() => setOpenDelete(true)}>
                                    <Delete color="error" />
                                </IconButton>
                            </span>
                        </Tooltip>}
                    </Grid> 
                    { !disableUpdateBtn &&  <Grid item xs={12}>
                        <Autocomplete
                            freeSolo
                            multiple
                            disableCloseOnSelect
                            options={intServiceList}
                            getOptionLabel={(option) => {
                                if (typeof option === "object") {
                                    if (typeof option?.deptRole == "object") {
                                        return `${option?.deptUsername} | ${option?.deptDisplayUsername} | ${option?.deptRole[0]?.displayRoleName}`;
                                    } else {
                                        return `${option?.deptUsername} | ${option?.deptDisplayUsername} | ${option?.displayRoleName}`;
                                    }
                                } else {
                                    return "";
                                }
                            }}
                            id="tags-outlined"
                            value={intService || []}
                            onChange={(event, newValue) => {
                                handleOnChangeInternalService(newValue);
                            }}
                            filterSelectedOptions
                            getOptionDisabled={(option) => {
                                return intService?.some((item) => {
                                    if (item?.displayRoleName) {
                                        return (
                                            item.displayRoleName ==
                                            option?.deptRole[0]?.displayRoleName
                                        );
                                    } else {
                                        return (
                                            item?.deptRole[0]?.displayRoleName ==
                                            option?.deptRole[0]?.displayRoleName
                                        );
                                    }
                                });
                            }}
                            disabled={!Boolean(group)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    style={{ width: "100%" }}
                                    variant="outlined"
                                    label={t("search_by_service_number")}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    placeholder={t("enter_service_number")}
                                    className={props.theme ? "darkTextField" : ""}

                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                            <>
                                                {isInt ? (
                                                    <CircularProgress color="inherit" size={20} />
                                                ) : null}
                                                {params.InputProps.endAdornment}
                                            </>
                                        ),
                                    }}
                                />
                            )}
                        />
                    </Grid>  }
                    {/* <Grid item xs={12}>
                        <Autocomplete
                            freeSolo
                            multiple
                            disableCloseOnSelect

                            options={sectionList}

                            getOptionLabel={(option) => {
                                return typeof option === "object"
                                    ? option.deptDisplayName
                                    : "";
                            }}
                            value={section || []}
                            id="tags-outlined"
                            onChange={(event, newValue) => {
                                handleOnChange(newValue);
                            }}
                            onInputChange={(event, newInputValue) => {
                                !newInputValue.includes("|") &&
                                    optimizedSectionList(newInputValue);
                            }}
                            filterSelectedOptions
                            getOptionSelected={(option, value) => option.id == value.id}
                            disabled={!Boolean(group)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    style={{ width: "100%" }}
                                    variant="outlined"
                                    label={t("search_by_directorate")}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    placeholder={t("enter_directorate")}
                                    className={props.theme ? "darkTextField" : ""}
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                            <>
                                                {isExt ? (
                                                    <CircularProgress color="inherit" size={20} />
                                                ) : null}
                                                {params.InputProps.endAdornment}
                                            </>
                                        ),
                                    }}
                                />
                            )}
                        />
                    </Grid> */}
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button
                    id="PAinfo_update_btn"
                    variant="contained"
                    color="secondary"
                    type="submit"
                    onClick={() => setFavourate(false)}
                    endIcon={<CheckOutlined />}
                    disabled={!Boolean(group) || !Boolean(groupText) ||disableUpdateBtn}
                >
                    {t("update").toUpperCase()}
                </Button>
            </DialogActions>

            <Dialog
                open={openDelete}
                PaperComponent={PaperComponent}
                aria-labelledby="draggable-dialog-title"
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle
                    style={{ cursor: "move" }}
                    id="draggable-dialog-title"
                    className="dialog_title"
                >
                    {t("delete_series")}
                    <IconButton
                        id="enclosure_subject_close_button"
                        aria-label="close"
                        onClick={() => setOpenDelete(false)}
                        color="primary"
                        className="cancel-drag"
                    >
                        <Cancel style={{ color: props.theme ? "#fff" : "#484747" }} />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <h6>Are you sure you want to delete this group?</h6>
                </DialogContent>

                <DialogActions>
                    <Button
                        id="enclosure_done_skip_button"
                        variant="contained"
                        color="secondary"
                        onClick={handleDelete}
                    >
                        {t("delete")}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={createGroup}
                PaperComponent={PaperComponent}
                aria-labelledby="draggable-dialog-title"
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle
                    style={{ cursor: "move" }}
                    id="draggable-dialog-title"
                    className="dialog_title"
                >
                    {"Create A New Favourite Group"}
                    <IconButton
                        id="enclosure_subject_close_button"
                        aria-label="close"
                        onClick={() => setCreateGroup(false)}
                        color="primary"
                        className="cancel-drag"
                    >
                        <Cancel style={{ color: props.theme ? "#fff" : "#484747" }} />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>

                    <TextField
                        fullWidth
                        size='small'
                        variant="outlined"
                        multiline
                        minRows={3}
                        name="subject"
                        required
                        label={t("subject")}
                        className={props.theme ? "darkTextField" : ""}
                        value={groupText}
                        onChange={(e) => setGroupText(e.target.value)}
                        inputProps={{ maxLength: 250 }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        placeholder="Enter Subject"
                        // error={
                        //     formik.touched.subject && Boolean(formik.errors.subject)
                        // }
                        // helperText={formik.touched.subject && formik.errors.subject}
                        autoFocus
                    />
                </DialogContent>

                <DialogActions>
                    <Button
                        id="enclosure_done_skip_button"
                        variant="contained"
                        color="secondary"

                        onClick={() => setFavourate(true)}
                    >
                        {t("create")}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )

}

function mapStateToProps(state) {
    return {
        props: state.props,
        theme: state.theme,
        subscribe: state.subscribeApi,
    };
}

export default connect(mapStateToProps, {
    getInternalServiceNumber,
    getGroupList, getFav, setFav, setMyFav, deleteFav
})(FavComponent)