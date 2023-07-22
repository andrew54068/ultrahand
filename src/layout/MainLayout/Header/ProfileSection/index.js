import { useState, useRef, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  ClickAwayListener,
  Divider,
  Grid,
  InputAdornment,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  OutlinedInput,
  Paper,
  Popper,
  Stack,
  Switch,
  Typography
} from '@mui/material';

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';
import UpgradePlanCard from './UpgradePlanCard';
import User1 from 'assets/images/users/user-round.svg';

// assets
import {IconLogout, IconSearch, IconSettings, IconUser, IconWallet} from '@tabler/icons';
import {UltrahandWallet} from "../../../../ultrahand/core/ultrahandWallet";
import {BloctoWallet} from "../../../../ultrahand/4337wallets/bloctoWallet";
import {SafeWallet} from "../../../../ultrahand/4337wallets/safeWallet";
import BloctoIcon from 'assets/images/icons/blocto.svg';

// ==============================|| PROFILE MENU ||============================== //

const ProfileSection = () => {
  const theme = useTheme();
  const customization = useSelector((state) => state.customization);
  const navigate = useNavigate();

  const [sdm, setSdm] = useState(true);
  const [value, setValue] = useState('');
  const [notification, setNotification] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [open, setOpen] = useState(false);
  /**
   * anchorRef is used on different componets and specifying one type leads to other components throwing an error
   * */
  const anchorRef = useRef(null);
  const handleLogout = async () => {
    console.log('Logout');
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleListItemClick = (event, index, route = '') => {
    setSelectedIndex(index);
    handleClose(event);

    if (route && route !== '') {
      navigate(route);
    }
  };

  const handleBlocto = async (event, index, route = '') => {
    setSelectedIndex(index);
    handleClose(event);

    if (route && route !== '') {
      navigate(route);
    }

    UltrahandWallet.setCurrentWallet(new BloctoWallet())
    await UltrahandWallet.currentWallet.connect()
  };

  const handleSafe = async (event, index, route = '') => {
    setSelectedIndex(index);
    handleClose(event);

    if (route && route !== '') {
      navigate(route);
    }

    UltrahandWallet.setCurrentWallet(new SafeWallet())
    await UltrahandWallet.currentWallet.connect()
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <>
      <Chip
        sx={{
          height: '48px',
          alignItems: 'center',
          borderRadius: '27px',
          transition: 'all .2s ease-in-out',
          borderColor: theme.palette.primary.light,
          backgroundColor: theme.palette.primary.light,
          '&[aria-controls="menu-list-grow"], &:hover': {
            borderColor: theme.palette.primary.main,
            background: `${theme.palette.primary.main}!important`,
            color: theme.palette.primary.light,
            '& svg': {
              stroke: theme.palette.primary.light
            }
          },
          '& .MuiChip-label': {
            lineHeight: 0
          }
        }}
        icon={<Avatar src={User1} alt="User 1" />}
        label={<IconWallet stroke={1.5} size="1.5rem" color={theme.palette.primary.main} />}
        variant="outlined"
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        color="primary"
      />
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 14]
              }
            }
          ]
        }}
      >
        {({ TransitionProps }) => (
          <Transitions in={open} {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                  <PerfectScrollbar style={{ height: '100%', maxHeight: 'calc(100vh - 250px)', overflowX: 'hidden' }}>
                    <Box sx={{ p: 2 }}>
                      <List
                        component="nav"
                        sx={{
                          width: '100%',
                          maxWidth: 350,
                          minWidth: 300,
                          backgroundColor: theme.palette.background.paper,
                          borderRadius: '10px',
                          [theme.breakpoints.down('md')]: {
                            minWidth: '100%'
                          },
                          '& .MuiListItemButton-root': {
                            mt: 0.5
                          }
                        }}
                      >
                        <ListItemButton
                          sx={{ borderRadius: `${customization.borderRadius}px` }}
                          height={50}
                          // selected={selectedIndex === 0}
                          onClick={handleBlocto}
                        >
                          <ListItemIcon>
                            <svg data-bbox="0 0 16 16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" data-type="color">
                              <g>
                                <path fill="#ffffff" d="M16 0v16H0V0h16z" data-color="1"/>
                                <path d="M8.33 5.26c-1.06 0-2.09.41-2.86 1.13-.85.79-1.38 1.96-1.69 3.06-.2.72-.3 1.47-.3 2.22 0 .23 0 .45.03.67.02.27.28.46.55.39.23-.06.47-.09.71-.09a2.732 2.732 0 0 1 1.42.4c.66.4 1.45.61 2.28.58 2.18-.07 3.95-1.84 4.03-4.02a4.184 4.184 0 0 0-4.18-4.34Zm0 6.09a1.91 1.91 0 1 1 0-3.82 1.91 1.91 0 0 1 0 3.82Z" fill="#14aaff" data-color="2"/>
                                <path d="M6.62 3.95c0 .55-.29 1.06-.76 1.34-.3.18-.58.38-.83.62-.56.53-.98 1.17-1.29 1.81-.06.13-.25.08-.25-.06V3.95c0-.86.7-1.56 1.56-1.56.86 0 1.56.7 1.56 1.56Z" fill="#0077ff" data-color="3"/>
                              </g>
                            </svg>

                          </ListItemIcon>
                          <ListItemText primary={<Typography variant="body2">Blocto Wallet</Typography>} />
                        </ListItemButton>
                        <ListItemButton
                          sx={{ borderRadius: `${customization.borderRadius}px` }}
                          // selected={selectedIndex === 4}
                          height={50}
                          onClick={handleSafe}
                        >
                          <ListItemIcon>
                            <Avatar
                                variant="rounded"
                                sx={{
                                  ...theme.typography.commonAvatar,
                                  ...theme.typography.largeAvatar,
                                  mt: 1
                                }}
                                src={'https://storage.googleapis.com/ethglobal-api-production/organizations%2Fweaax%2Flogo%2F1667857487267_vRyTLmek_400x400.jpeg'}>
                            </Avatar>
                          </ListItemIcon>
                          <ListItemText primary={<Typography variant="body2">Safe Wallet</Typography>} />
                        </ListItemButton>
                      </List>
                    </Box>
                  </PerfectScrollbar>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </>
  );
};

export default ProfileSection;
