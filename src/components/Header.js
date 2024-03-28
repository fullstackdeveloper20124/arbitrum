import { useState } from 'react';
import { FacebookShareButton, TwitterShareButton } from "react-share";
import { FacebookIcon, TwitterIcon } from "react-share";

// Material
import {
    alpha, styled, useMediaQuery, useTheme,
    AppBar,
    Box,
    Button,
    Container,
    Divider,
    Grid,
    IconButton,
    Link,
    Menu,
    MenuItem,
    Stack,
    Toolbar,
    Typography
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';

import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import RepartitionIcon from '@mui/icons-material/Repartition';
import LockClockIcon from '@mui/icons-material/LockClock';
import SavingsIcon from '@mui/icons-material/Savings';

// Iconify Icons
import { Icon } from '@iconify/react';
import baselineBrightnessHigh from '@iconify/icons-ic/baseline-brightness-high';
import baselineBrightness4 from '@iconify/icons-ic/baseline-brightness-4';

// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

// Components
import Logo from './Logo';
import Wallet from './Wallet';
import NavSearchBar from './NavSearchBar';

const HeaderWrapper = styled(AppBar)(({ theme }) => `
    width: 100%;
    background-color: ${theme.colors.nav.background};
    margin-bottom: ${theme.spacing(0)};
    border: none;
    border-radius: 0px;
    border-bottom: 0px solid ${alpha('#CBCCD2', 0.2)};
    // position: -webkit-sticky;
    // position: sticky;
    // top: 0;
    // z-index: 1300;
`
);

export default function Header() {
    /*
    xs: 0,
    mobile: 450,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1840
    */
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const { toggleTheme, darkMode } = useContext(AppContext);

    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);

    const shareUrl = `https://bloxfi-dex.onrender.com/`;
    const shareTitle = 'BLOXFI is the Best DEX on Arbitrum network';
    const shareDesc = 'BLOXFI is a zero-fee dex platform for trading on Arbitrum network, providing token swapping and farming service.';

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const [fullSearch, setFullSearch] = useState(false);

    const handleFullSearch = (e) => {
        setFullSearch(true);
    }
    return (
        <HeaderWrapper position="sticky" enableColorOnDark={true} sx={{ py: 1 }}>
            <Container maxWidth="xxl">
                <Toolbar disableGutters>
                    {/* <Box id='logo-container-laptop'
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', sm: 'flex' },
                        }}
                    >
                        <Logo />
                    </Box> */}


                    {fullSearch &&
                        <NavSearchBar
                            id='id_search_items_collections_accounts'
                            placeholder='Search Token and Add Metamask'
                            type='SEARCH_ITEM_COLLECTION_ACCOUNT'
                            fullSearch={fullSearch}
                            setFullSearch={setFullSearch}
                        />
                    }

                    {!fullSearch &&
                        <Box id='logo-container-mobile'
                            sx={{
                                mr: 2,
                                // display: { xs: 'flex', sm: 'none' },
                            }}
                        >
                            <Logo />
                        </Box>
                    }
                    {!fullSearch && !isMobile &&
                        <NavSearchBar
                            id='id_search_items_collections_accounts'
                            placeholder='Search Token and Add Metamask'
                            type='SEARCH_ITEM_COLLECTION_ACCOUNT'
                            fullSearch={fullSearch}
                            setFullSearch={setFullSearch}
                        />
                    }

                    <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                        {!isMobile &&
                            <>
                                <Link
                                    underline="none"
                                    color="inherit"
                                    href={`/`}
                                    rel="noreferrer noopener nofollow"
                                >
                                    <Button variant="text">Swap</Button>
                                </Link>
                                <Link
                                    underline="none"
                                    color="inherit"
                                    href={`/pool`}
                                    rel="noreferrer noopener nofollow"
                                >
                                    <Button variant="text">Pool</Button>
                                </Link>
                                <Link
                                    underline="none"
                                    color="inherit"
                                    href={`/farm`}
                                    rel="noreferrer noopener nofollow"
                                >
                                    <Button variant="text">Farm</Button>
                                </Link>
                                <Link
                                    underline="none"
                                    color="inherit"
                                    href={`/lock`}
                                    rel="noreferrer noopener nofollow"
                                >
                                    <Button variant="text">Lock</Button>
                                </Link>
                                <Link
                                    underline="none"
                                    color="inherit"
                                    href={`/airdrop`}
                                    rel="noreferrer noopener nofollow"
                                >
                                    <Button variant="text">Airdrop</Button>
                                </Link>
                            </>
                        }

                        {!fullSearch && isMobile &&
                            <IconButton
                                aria-label='search'
                                onClick={handleFullSearch}
                            >
                                <SearchIcon />
                            </IconButton>
                        }
                        {!fullSearch &&
                            <Wallet />
                        }
                        {!isMobile &&
                            <IconButton onClick={() => { toggleTheme() }} >
                                {darkMode ? (
                                    <Icon icon={baselineBrightness4} />
                                ) : (
                                    <Icon icon={baselineBrightnessHigh} />
                                )}
                            </IconButton>
                        }
                    </Box>

                    {!fullSearch &&
                        <Box id='nav-menu-mobile'
                            sx={{ flexGrow: 0, display: { sm: 'flex', md: 'none' } }}
                        >
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenNavMenu}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorElNav}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                open={Boolean(anchorElNav)}
                                onClose={handleCloseNavMenu}
                                sx={{
                                    display: { xs: 'block', md: 'none' },
                                }}
                            >

                                <MenuItem onClick={handleCloseNavMenu}>
                                    <Link
                                        underline="none"
                                        color="inherit"
                                        href={`/`}
                                        rel="noreferrer noopener nofollow"
                                    >
                                        <Stack direction='row' spacing={1} sx={{mr: 2}} alignItems='center'>
                                            <CurrencyExchangeIcon />
                                            <Typography variant='s3' style={{marginLeft: '10px'}}>Swap</Typography>
                                        </Stack>
                                    </Link>
                                </MenuItem>
                                <MenuItem onClick={handleCloseNavMenu}>
                                    <Link
                                        underline="none"
                                        color="inherit"
                                        href={`/pool`}
                                        rel="noreferrer noopener nofollow"
                                    >
                                        <Stack direction='row' spacing={1} sx={{mr: 2}} alignItems='center'>
                                            <AccountBalanceIcon />
                                            <Typography variant='s3' style={{marginLeft: '10px'}}>Pool</Typography>
                                        </Stack>
                                    </Link>
                                </MenuItem>
                                <MenuItem onClick={handleCloseNavMenu}>
                                    <Link
                                        underline="none"
                                        color="inherit"
                                        href={`/farm`}
                                        rel="noreferrer noopener nofollow"
                                    >
                                        <Stack direction='row' spacing={1} sx={{mr: 2}} alignItems='center'>
                                            <RepartitionIcon />
                                            <Typography variant='s3' style={{marginLeft: '10px'}}>Farm</Typography>
                                        </Stack>
                                    </Link>
                                </MenuItem>
                                <MenuItem onClick={handleCloseNavMenu}>
                                    <Link
                                        underline="none"
                                        color="inherit"
                                        href={`/lock`}
                                        rel="noreferrer noopener nofollow"
                                    >
                                        <Stack direction='row' spacing={1} sx={{mr: 2}} alignItems='center'>
                                            <LockClockIcon />
                                            <Typography variant='s3' style={{marginLeft: '10px'}}>Lock</Typography>
                                        </Stack>
                                    </Link>
                                </MenuItem>
                                <MenuItem onClick={handleCloseNavMenu}>
                                    <Link
                                        underline="none"
                                        color="inherit"
                                        href={`/airdrop`}
                                        rel="noreferrer noopener nofollow"
                                    >
                                        <Stack direction='row' spacing={1} sx={{mr: 2}} alignItems='center'>
                                            <SavingsIcon />
                                            <Typography variant='s3' style={{marginLeft: '10px'}}>Airdrop</Typography>
                                        </Stack>
                                    </Link>
                                </MenuItem>
                                <Divider />
                                <MenuItem onClick={()=> {toggleTheme();}}>
                                    <Stack direction='row' spacing={1} sx={{mr: 2}} alignItems='center'>
                                        {darkMode ? (
                                            <Icon icon={baselineBrightness4} width={24} height={24} />
                                        ) : (
                                            <Icon icon={baselineBrightnessHigh} width={24} height={24} />
                                        )}
                                        <Typography variant='s3' style={{marginLeft: '10px'}}>{darkMode ? 'Dark Theme':'Light Theme'}</Typography>
                                    </Stack>
                                </MenuItem>

                                <Stack alignItems="center" sx={{mt: 2}} >
                                    <Stack direction="row" spacing={3}>
                                        <FacebookShareButton
                                            url={shareUrl}
                                            quote={shareTitle}
                                            hashtag={"#"}
                                            description={shareDesc}
                                        >
                                            <FacebookIcon size={32} round />
                                        </FacebookShareButton>
                                        <TwitterShareButton
                                            title={shareTitle}
                                            url={shareUrl}
                                            hashtag={"#"}
                                        >
                                            <TwitterIcon size={32} round />
                                        </TwitterShareButton>
                                    </Stack>
                                </Stack>
                            </Menu>
                        </Box>
                    }
                </Toolbar>
            </Container>
        </HeaderWrapper >
    );
}
