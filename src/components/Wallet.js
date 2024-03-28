import axios from 'axios';
import { useRef, useState, useEffect } from 'react';
import {CopyToClipboard} from 'react-copy-to-clipboard';

// Material
import {
    alpha,
    Avatar,
    Badge,
    Button,
    Divider,
    IconButton,
    Link,
    MenuItem,
    Popover,
    Stack,
    Typography
} from '@mui/material';
import GridOnIcon from '@mui/icons-material/GridOn';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SettingsIcon from '@mui/icons-material/Settings';
import useMetaMask from "src/hooks/useMetaMask";
import { ethers } from "ethers";
import Web3 from "web3";

// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

// Iconify
import { Icon } from '@iconify/react';
import userLock from '@iconify/icons-fa-solid/user-lock';

// Utils

// Components

export default function Wallet() {
    const anchorRef = useRef(null);

    const [open, setOpen] = useState(false);
    const { connect } = useMetaMask();
    const [currentAccount, setCurrentAccount] = useState(null);

    const checkWalletIsConnected = async () => {
        const { ethereum } = window;
    
        if (!ethereum) {
          console.log("Make sure you have Metamask installed.");
          return;
        } else {
          console.log("Wallet exists!,We're ready to go!");
        }
        const provider = new ethers.providers.Web3Provider(ethereum);
        const { chainId } = await provider.getNetwork();
        if (chainId != 42161) {
            const switchNetwork = await window.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: Web3.utils.toHex(42161) }],
            });
        }
        const accounts = await ethereum.request({ method: "eth_accounts" });
        if (accounts.length !== 0) {
          const account = accounts[0];
          console.log("Found an arthorized account:", account);
          setCurrentAccount(account);
        } else {
          console.log("No aurhorized account found");
          setCurrentAccount(null);
        }
      };

    let logoImageUrl = null;

    useEffect(() => {
        checkWalletIsConnected();
      }, [connect, currentAccount]);

    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const handleLogout = () => {
        setOpen(false);
        onLogoutXumm();
    }

    return (
        <>

            <IconButton
                ref={anchorRef}
                onClick={handleOpen}
                // onMouseOver={handleOpen}
            >
                <Badge color="primary">
                    {logoImageUrl?(
                        <Avatar
                            variant={accountLogo?"":"square"}
                            alt="user" src={logoImageUrl}
                            sx={{ width: 32, height: 32 }}
                        />
                    ):(
                        <Icon icon={userLock}/>
                    )}
                </Badge>
            </IconButton>

            <Popover
                open={open}
                onClose={handleClose}
                anchorEl={anchorRef.current}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                PaperProps={{
                    sx: {
                        mt: 1.5,
                        ml: 0.5,
                        overflow: 'inherit',
                        border: (theme) => `solid 1px ${alpha('#919EAB', 0.08)}`,
                        width: 220,
                    }
                }}
            >
                {currentAccount ? (
                        <>
                            <Link
                                underline="none"
                                color="inherit"
                                // target="_blank"
                                href={`/`}
                                rel="noreferrer noopener nofollow"
                            >
                                <MenuItem
                                    key="account_profile"
                                    sx={{ typography: 'body2', py: 2, px: 2.5 }}
                                    onClick={()=>setOpen(false)}
                                >
                                    <Stack direction='row' spacing={1} sx={{mr: 2}} alignItems='center'>
                                        <Badge color="primary">
                                            <ShoppingCartIcon />
                                        </Badge>
                                        <Typography variant='s3' style={{marginLeft: '10px'}}>Buy Crypto</Typography>
                                    </Stack>
                                </MenuItem>
                            </Link>
                            <Link
                                underline="none"
                                color="inherit"
                                // target="_blank"
                                href="/farm"
                                rel="noreferrer noopener nofollow"
                            >
                                <MenuItem
                                    key="collection"
                                    sx={{ typography: 'body2', py: 2, px: 2.5 }}
                                    onClick={()=>setOpen(false)}
                                >
                                    <Stack direction='row' spacing={1} sx={{mr: 2}} alignItems='center'>
                                        <GridOnIcon />
                                        <Typography variant='s3' style={{marginLeft: '10px'}}>My Farm</Typography>
                                    </Stack>
                                </MenuItem>
                            </Link>
                            <Link
                                underline="none"
                                color="inherit"
                                // target="_blank"
                                href="/pool"
                                rel="noreferrer noopener nofollow"
                            >
                                <MenuItem
                                    key="create-nft"
                                    sx={{ typography: 'body2', py: 2, px: 2.5 }}
                                    onClick={()=>setOpen(false)}
                                >
                                    <Stack direction='row' spacing={1} sx={{mr: 2}} alignItems='center'>
                                        <AccountBalanceIcon />
                                        <Typography variant='s3' style={{marginLeft: '10px'}}>Create Liquidity</Typography>
                                    </Stack>
                                </MenuItem>
                            </Link>
                            <Link
                                underline="none"
                                color="inherit"
                                href={`/setting`}
                                rel="noreferrer noopener nofollow"
                            >
                                <MenuItem
                                    key="settings"
                                    sx={{ typography: 'body2', py: 2, px: 2.5 }}
                                    onClick={()=>setOpen(false)}
                                >
                                    <Stack direction='row' spacing={1} sx={{mr: 2}} alignItems='center'>
                                        <SettingsIcon />
                                        <Typography variant='s3' style={{marginLeft: '10px'}}>Settings</Typography>
                                    </Stack>
                                </MenuItem>
                            </Link>
                            <Divider />
                            <Stack spacing={1} alignItems='center' sx={{pt: 1, pb: 2}}>
                                <Link
                                    color="inherit"
                                    target="_blank"
                                    href={`https://arbiscan.io/address/${currentAccount}`}
                                    rel="noreferrer noopener nofollow"
                                >
                                    <Typography align="center" style={{ wordWrap: "break-word" }} variant="body2" sx={{ width: 180, color: 'text.secondary' }} >
                                        {currentAccount}
                                    </Typography>
                                </Link>
                                <Stack direction="row" spacing={1}>
                                    <Button variant="contained" onClick={handleLogout} size="small">
                                        Logout
                                    </Button>
                                    <CopyToClipboard text={currentAccount} onCopy={()=>{}}>
                                        <Button variant="outlined" size="small">
                                            Copy
                                        </Button>
                                    </CopyToClipboard>
                                </Stack>
                            </Stack>
                        </>
                    ) : (
                        <MenuItem
                            key="xumm"
                            onClick={connect}
                            sx={{ typography: 'body2', py: 2, px: 2.5 }}
                        >
                            <Stack direction='row' spacing={1} sx={{mr: 2}} alignItems='center'>
                                <Avatar alt="xumm" src="/static/meta.png" sx={{ mr:1, width: 24, height: 24 }}/>
                                <Typography variant='s3' style={{marginLeft: '10px'}}>Wallet Connect</Typography>
                            </Stack>
                        </MenuItem>
                )}
            </Popover>
        </>
    );
}
