import PropTypes from 'prop-types';
import {useState} from 'react';

// material-ui
import {styled, useTheme} from '@mui/material/styles';
import {
    Avatar,
    Box, Button,
    Dialog, DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    Menu,
    MenuItem, TextField,
    Typography
} from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';

// assets
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import GetAppTwoToneIcon from '@mui/icons-material/GetAppOutlined';

const CardWrapper = styled(MainCard)(({theme}) => ({
    backgroundColor: theme.palette.secondary.dark,
    color: '#fff',
    overflow: 'hidden',
    position: 'relative',
    '&:after': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: theme.palette.secondary[800],
        borderRadius: '50%',
        top: -85,
        right: -95,
        [theme.breakpoints.down('sm')]: {
            top: -105,
            right: -140
        }
    },
    '&:before': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: theme.palette.secondary[800],
        borderRadius: '50%',
        top: -125,
        right: -15,
        opacity: 0.5,
        [theme.breakpoints.down('sm')]: {
            top: -155,
            right: -70
        }
    }
}));

// ===========================|| DASHBOARD DEFAULT - EARNING CARD ||=========================== //

const EarningCard = ({component, isLoading, returnInputConfig, returnOutput, prevOutput}) => {

    let componentIns = new component()

    const theme = useTheme();

    const [anchorEl, setAnchorEl] = useState(null);
    const [inputConfig, setInputConfig] = useState([]);
    const [output, setOutput] = useState([]);
    const [inputOpen, setInputOpen] = useState(false);
    const [currentOptionIndex, setCurrentOptionIndex] = useState(null);
    const [inputValue, setInputValue] = useState(null);

    const handleInputClickOpen = (index) => {
        setInputOpen(true);
        setCurrentOptionIndex(index)
    };

    const handleInputClose = () => {
        setInputOpen(false);
        setCurrentOptionIndex(null)
        setInputValue(null)
    };

    const handleInputConfirm = () => {
        if (inputValue) {
            inputConfig.push({
                type: "custom",
                value: inputValue,
                optionIndex: currentOptionIndex,
            })
            setInputConfig(inputConfig)
            returnInputConfig(inputConfig)
            simulate(inputConfig)()
        }

        handleInputClose()
    }

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const addCustomInput = (index) => {
        return () => {
            if (inputConfig.length > 0) {
                alert("Only support one input for now.")
                setAnchorEl(null);
                return
            }

            handleInputClickOpen(index)
            setAnchorEl(null);
        }
    }

    const addPrevOutput = (index) => {
        return () => {
            if (inputConfig.length > 0) {
                alert("Only support one input for now.")
                setAnchorEl(null);
                return
            }

            if (!prevOutput || prevOutput.length === 0) {
                alert("No previous output.")
                setAnchorEl(null);
                return
            }

            setAnchorEl(null);
            inputConfig.push({
                type: "link",
                value: prevOutput[0].value,
                optionIndex: index,
            })
            setInputConfig(inputConfig)
            returnInputConfig(inputConfig)
            simulate(inputConfig)()
        }
    }

    const clearAllInput = () => {
        setAnchorEl(null);
        setInputConfig([])
        setOutput([])
        returnOutput([])
        returnInputConfig([])
    }

    const simulate = (newInputConfig) => {
        return async () => {
            if (inputConfig.length === 0) {
                alert("No input.")
                setAnchorEl(null);
                return
            }

            let config = inputConfig
            if (newInputConfig) {
                config = newInputConfig
            }

            console.log(config)
            await componentIns.run(config)
            setOutput(componentIns.output)
            returnOutput(componentIns.output)
            setAnchorEl(null);
        }
    }

    if (inputConfig && inputConfig.length > 0) {
        if (inputConfig[0].type === "link") {
            if (prevOutput && prevOutput.length > 0 && prevOutput[0].value !== inputConfig[0].value) {
                let newInputConfig = [{
                    type: "link",
                    value: prevOutput[0].value,
                    optionIndex: inputConfig[0].optionIndex,
                }]
                setInputConfig(newInputConfig)
                simulate(newInputConfig)()
            }
        }
    }

    const menuItems = () => {
        let items = []
        componentIns.inputOptions().map((option, index) => {
            items.push(<MenuItem onClick={addCustomInput(index)}>
                <GetAppTwoToneIcon sx={{mr: 1.75}}/> Add Input {option.name}
            </MenuItem>)
            items.push(<MenuItem onClick={addPrevOutput(index)}>
                <GetAppTwoToneIcon sx={{mr: 1.75}}/> Use Prev Output {option.name}
            </MenuItem>)
        })

        items.push(
            <MenuItem onClick={clearAllInput}>
                <GetAppTwoToneIcon sx={{mr: 1.75}}/> Clear All Input
            </MenuItem>
        )

        items.push(
            <MenuItem onClick={simulate()}>
                <GetAppTwoToneIcon sx={{mr: 1.75}}/> Simulate
            </MenuItem>
        )

        return items
    }

    return (
        <>
            {isLoading ? (
                <SkeletonEarningCard/>
            ) : (
                <CardWrapper border={false} content={false}>
                    <Box sx={{p: 2.25}}>
                        <Grid container direction="column">
                            <Grid item>
                                <Grid container justifyContent="space-between">
                                    <Grid item>
                                        <Avatar
                                            variant="rounded"
                                            sx={{
                                                ...theme.typography.commonAvatar,
                                                ...theme.typography.largeAvatar,
                                                backgroundColor: theme.palette.secondary[800],
                                                mt: 1
                                            }}
                                            src={component.icon()}
                                        >
                                        </Avatar>
                                    </Grid>
                                    <Grid item>
                                        <Avatar
                                            variant="rounded"
                                            sx={{
                                                ...theme.typography.commonAvatar,
                                                ...theme.typography.mediumAvatar,
                                                backgroundColor: theme.palette.secondary.dark,
                                                color: theme.palette.secondary[200],
                                                zIndex: 1
                                            }}
                                            aria-controls="menu-earning-card"
                                            aria-haspopup="true"
                                            onClick={handleClick}
                                        >
                                            <MoreHorizIcon fontSize="inherit"/>
                                        </Avatar>
                                        <Menu
                                            id="menu-earning-card"
                                            anchorEl={anchorEl}
                                            keepMounted
                                            open={Boolean(anchorEl)}
                                            onClose={handleClose}
                                            variant="selectedMenu"
                                            anchorOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'right'
                                            }}
                                            transformOrigin={{
                                                vertical: 'top',
                                                horizontal: 'right'
                                            }}
                                        >
                                            {menuItems()}
                                            {<Dialog open={inputOpen} onClose={handleInputClose}>
                                                <DialogContent>
                                                    <DialogContentText>
                                                        Enter the value for the input.
                                                    </DialogContentText>
                                                    <TextField
                                                        autoFocus
                                                        margin="dense"
                                                        id="name"
                                                        label="Value"
                                                        fullWidth
                                                        variant="standard"
                                                        onChange={(newValue) => setInputValue(newValue.target.value)}
                                                    />
                                                </DialogContent>
                                                <DialogActions>
                                                    <Button onClick={handleInputConfirm}>Confirm</Button>
                                                </DialogActions>
                                            </Dialog>}
                                        </Menu>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item>
                                <Grid container alignItems="center">
                                    <Grid item>
                                        <Typography sx={{
                                            fontSize: '2.125rem',
                                            fontWeight: 500,
                                            mr: 1,
                                            mt: 1.75,
                                            mb: 0.75
                                        }}>
                                            Input: {inputConfig.length > 0 ? inputConfig[0].value : 'empty'}
                                            <Typography sx={{
                                                fontSize: '1.125rem',
                                                fontWeight: 500,
                                                mr: 1,
                                                mt: 1.75,
                                                mb: 0.75
                                            }}>
                                                (option: {inputConfig.length > 0 ? `${componentIns.inputOptions()[inputConfig[0].optionIndex].name}` : 'empty'})
                                            </Typography>
                                            <Typography sx={{
                                                fontSize: '1.125rem',
                                                fontWeight: 500,
                                                mr: 1,
                                                mt: 1.75,
                                                mb: 0.75
                                            }}>
                                                (type: {inputConfig.length > 0 ? `${inputConfig[0].type}` : 'empty'})
                                            </Typography>
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid container alignItems="center">
                                    <Grid item>
                                        <Typography sx={{
                                            fontSize: '2.125rem',
                                            fontWeight: 500,
                                            mr: 1,
                                            mt: 1.75,
                                            mb: 0.75
                                        }}>
                                            {output.length > 0 ?  `Output: ${output[0].value}` : null}
                                            <Typography sx={{
                                                fontSize: '1.125rem',
                                                fontWeight: 500,
                                                mr: 1,
                                                mt: 1.75,
                                                mb: 0.75
                                            }}>
                                                {output.length > 0 ? `(option: ${output[0].name})` : null}
                                            </Typography>

                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                </CardWrapper>
            )}
        </>
    );
};

EarningCard.propTypes = {
    isLoading: PropTypes.bool
};

export default EarningCard;
