import axios from 'axios';
import * as React from 'react';
import { useState, useEffect } from 'react';

// Material
import {
    Avatar,
    Autocomplete,
    CardMedia,
    IconButton,
    InputAdornment,
    Link,
    MenuItem,
    Stack,
    TextField,
    Tooltip,
    Typography
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CasinoIcon from '@mui/icons-material/Casino';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AnimationIcon from '@mui/icons-material/Animation';
import VerifiedIcon from '@mui/icons-material/Verified';
import useMetaMask from "src/hooks/useMetaMask";
import { ethers } from "ethers";
import Web3 from "web3";
import token_abi from 'src/Contracts/token_abi.json'

// Loader
import useDebounce from 'src/hooks/useDebounce';

// Utils

const RenderOption = ({
    uuid,
    meta,
    dfile,
    option_type,
    NFTokenID,
    logoImage,
    logo,
    account,
    name,
    verified,
    items,
    type,
    slug
 }) => {

    const [hLink, setHLink] = useState('')
    const [isVideo, setIsVideo] = useState(false)

 
    return (
        <Link
            color="inherit"
            underline='none'
            href={hLink}
        >
            <MenuItem sx={{ pt: 1, pb: 1 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                    {
                        <Avatar
                            alt="X"
                            variant={logo?"":"square"}
                            sx={{
                                backgroundColor: '#00000000'
                            }}
                        >
                            <CardMedia
                                component={isVideo ? "video" : 'img'}
                                src={imgUrl}
                                alt='X'
                            />
                        </Avatar>
                    }
                    <Typography variant="s5">{name ?? ''}</Typography>
                    {
                        option_type === 'COLLECTIONS' && <>
                            {verified === 'yes' &&
                                <Tooltip title='Verified'>
                                    <VerifiedIcon fontSize="small" style={{color: "#4589ff"}} />
                                </Tooltip>
                            }
                            {type === "random" &&
                                <Tooltip title="Random Collection">
                                    <CasinoIcon color='info' fontSize="small" />
                                </Tooltip>
                            }
                            {type === "sequence" &&
                                <Tooltip title="Sequence Collection">
                                    <AnimationIcon color='info' fontSize="small" />
                                </Tooltip>
                            }
                            <Typography variant="s7">{items} items</Typography>
                        </>
                    }
                    {
                        option_type === 'ACCOUNTS' &&
                        <Typography variant="s7">{account}</Typography>
                    }
                </Stack>
            </MenuItem>
        </Link>
    )
}

const getOptionLabel = (option) => {
    if (option.option_type === "NFTS") {
        return option.meta?.name ?? '';
    } else if (option.option_type === "COLLECTIONS") {
        return option.name ?? '';
    } else if (option.option_type === "ACCOUNTS") {
        return (option.name || option.account) ?? '';
    } else return ''
}

export default function NavSearchBar({ id, placeholder, type, fullSearch, setFullSearch }) {

    const [open, setOpen] = useState(fullSearch);
    const [options, setOptions] = useState([]);

    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 1000)

    const [loading, setLoading] = useState(false);

    const getTokeninfo = async(token) => {
        const { ethereum } = window;
    try{
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const token_contract = new ethers.Contract(token, token_abi, signer);
        try{
            const symbol = await token_contract.symbol();
            const decimal = parseInt(await token_contract.decimals());
            return ([symbol,decimal]);
        } catch(e){
            console.log(e)
            return false;
        }
    } catch(e){
        console.log('Wallet is not connected', e)
    }
    }

    const getData = (search) => {

        setLoading(true);
        const body = {};
        body.search = search;
        body.type = type;

        if (/^0x[a-fA-F0-9]{40}$/g.test(search)) {
            console.log('Valid Ethereum address:', search);
            getTokeninfo(search.toString()).then((result)=>{
                if(result){
                    const symbol = result[0];
                    const decimal = result[1];
                    console.log(symbol, decimal)
                    window.ethereum.request({
                        method: 'wallet_watchAsset',
                        params: {
                        type: 'ERC20',
                        options: {
                            address: search.toString(),
                            symbol: symbol,
                            decimals: decimal,
                        },
                        },
                    });
                    setLoading(false)
                }
            })
          } 
        else {
        console.log('Invalid Ethereum address:', search);
        }
        // axios.post(`${BASE_URL}/search`, body).then(res => {
        //     try {
        //         if (res.status === 200 && res.data) {
        //             const ret = res.data;
        //             const newOptions = [];
        //             for (const nft of ret.nfts) {
        //                 nft.option_type = "NFTS";
        //                 newOptions.push(nft);
        //             }
        //             for (const collection of ret.collections) {
        //                 collection.option_type = "COLLECTIONS";
        //                 newOptions.push(collection);
        //             }
        //             for (const account of ret.accounts) {
        //                 account.option_type = "ACCOUNTS";
        //                 newOptions.push(account);
        //             }
        //             setOptions(newOptions);
        //         }
        //     } catch (error) {
        //         console.log(error);
        //     }
        // }).catch(err => {
        //     console.log("err->>", err);
        // }).then(function () {
        //     setLoading(false);
        // });
    }

    useEffect(() => {
        getData(debouncedSearch);
    }, [debouncedSearch]);

    const handleSearch = (e) => {
        setSearch(e.target.value);
    }

    const handleClear = (e) => {
        setSearch('');
    }

    const handleBack = (e) => {
        setFullSearch(false);
        setSearch('');
    }

    return (
        <Autocomplete
            freeSolo
            disableClearable
            selectOnFocus
            disablePortal
            id={id}
            sx={{
                width: '35%',
                '&.MuiAutocomplete-root .MuiOutlinedInput-root': {
                    paddingTop: 0.5,
                    paddingBottom: 0.5
                },
                '&.MuiTextField-root': {
                    marginTop: 1
                }
            }}
            open={open}
            onOpen={() => {
                setOpen(true);
            }}
            onClose={() => {
                setOpen(false);
            }}
            // isOptionEqualToValue={(option, value) => option.title === value.title}
            groupBy={(option) => option.option_type}
            getOptionLabel={(option) => getOptionLabel(option)}
            options={options}
            renderOption={(props, option) => <RenderOption {...option} />}
            loading={loading}
            renderInput={(params) => {
                return (
                    <TextField
                        {...params}
                        placeholder={placeholder}
                        autoComplete='new-password'
                        // margin='dense'
                        value={search}
                        onChange={handleSearch}
                        InputProps={{
                            ...params.InputProps,
                            autoComplete: 'off',
                            type: 'search',
                            startAdornment: (
                                <InputAdornment position="start" sx={{ mr: 0.7 }}>
                                    {fullSearch ?
                                        <IconButton
                                            aria-label='back'
                                            onClick={handleBack}
                                        >
                                            <ArrowBackIcon />
                                        </IconButton>
                                        :
                                        <SearchIcon />
                                    }
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end"
                                // onClick={handleClear}
                                >
                                    {params.InputProps.endAdornment}
                                    {/* {loading &&
                                        <ClipLoader color='#ff0000' size={15} />
                                    } */}
                                </InputAdornment>
                            ),
                        }}
                    />
                )
            }}
        />
    );
}
