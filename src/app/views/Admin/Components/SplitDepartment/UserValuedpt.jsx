import { TextField } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import './split.css'

const UserValuedpt = (props) => {

    const [newInput, setNewInput] = useState();
    useEffect(() => {
        props.newRoleNames.map((item) => {
            props.tmpArr.push(item)
        });
        props.tmpArr[props.index] = newInput;
        props.setNewRoleNames([...props.tmpArr]);
    }, [newInput])


    return (

        <TextField
            name="newRole"
            required
            value={newInput}
            onChange={e => { setNewInput(e.target.value) }}
            id="outlined-basic"
            label=" NEW ROLE "
            variant="outlined"
            size='small'
            autoComplete='off'
            style={{ width: 400 }}
            className='user_text_filed_split'
        />
    )
}

export default UserValuedpt