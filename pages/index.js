import Decimal from 'decimal.js';

// Material
import {
    Box,
    Container,
    styled,
    Toolbar,
    Select,
    MenuItem,
    Stack,
    TextField,
    Tooltip,
    Card,
    Typography,
    Button,
    Input
} from '@mui/material';

// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

// Components
import Header from 'src/components/Header';
import ScrollToTop from 'src/components/ScrollToTop';
import { useState,useEffect } from 'react';
import useMetaMask from "src/hooks/useMetaMask";
import { ethers } from "ethers";
import Web3 from "web3";
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import router_abi from 'src/Contracts/router_abi.json'
import token_abi from 'src/Contracts/token_abi.json'

import SwapVerticalCircleIcon from '@mui/icons-material/SwapVerticalCircle';

import Popup from 'src/components/Popup'

// overflow: scroll;
// overflow: auto;
// overflow: hidden;

const OverviewWrapper = styled(Box)(
    ({ theme }) => `
        // overflow: hidden;
        flex: 1;
`
);

const BackgroundWrapper = styled(Box)(
    ({ theme }) => `
        width: 100%;
        height: 90%;
        position: absolute;
        background-size: cover;
        background-color: rgb(32, 34, 37);
        background-position: center center;
        opacity: 0.99;
        z-index: -1;
        filter: blur(8px);
        -webkit-mask: linear-gradient(rgb(255, 255, 255), transparent);
`
);

export default function Swap({}) {
    const { darkMode, openSnackbar } = useContext(AppContext);
    
    return (
        <OverviewWrapper>
            <Toolbar id="back-to-top-anchor" />

            <BackgroundWrapper
                style={{
                    backgroundImage: `url(/static/background.png)`,
                    opacity: `${darkMode?0.2:0.3}`
                }}
            />

            <Header />

            <Container maxWidth="lg">
                <Swapping/>
            </Container>

            <ScrollToTop />

        </OverviewWrapper>
    );
}

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// revalidation is enabled and a new request comes in

const DEFAULT_TOKENS = [
    {
        id: 0,
        symbol: 'ETH',
        address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
        decimal: 18,
        logo: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Ethereum_logo_2014.svg'
    },
    {
        id: 1,
        symbol: 'BLO',
        address: '0x46d84F7A78D3E5017fd33b990a327F8e2E28f30B',
        decimal: 18,
        logo: 'logo/logo.png'
    },
    {
        id: 2,
        symbol: 'USDC',
        address: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
        decimal: 6,
        logo: 'static/usdc.png'
    },
    {
        id: 3,
        symbol: 'USDT',
        address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
        decimal: 6,
        logo: 'https://cryptologos.cc/logos/tether-usdt-logo.png?v=024'
    },

];

function Swapping(){
    const { darkMode, openSnackbar } = useContext(AppContext);
    const router_address = "0x28a1676bcC9b479B49E3c0C6b56e280563D8E47f";
    
    const [slippage, setSlippage] = useState(10)
    
    const {connect} = useMetaMask();
    const [currentAccount, setCurrentAccount] = useState(null);
    const [message, setMessage] = useState(true);

    const ADDR_WETH = '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1';

    const [tokens, setTokens] = useState(DEFAULT_TOKENS);
    const [select1, setSelect1] = useState(0); // ETH by default
    const [select2, setSelect2] = useState(2); // USDC by default

    const [amount1, setAmount1] = useState(0)
    const [amount2, setAmount2] = useState(0)
    
    const [bal1, setBal1] = useState(0)
    const [bal2, setBal2] = useState(0)

    const [allowance, setAllowance] = useState(0)

    const checkAllowance = async (address) => {
        const { ethereum } = window; 
        try{
            const accounts = await ethereum.request({ method: "eth_accounts" });
            if (accounts.length !== 0) {
                const account = accounts[0];
                setCurrentAccount(account);

                if (address === ADDR_WETH) {
                    return 1;
                }

                const provider = new ethers.providers.Web3Provider(ethereum);
                const { chainId } = await provider.getNetwork();
                if (chainId != 42161) {
                    const switchNetwork = await window.ethereum.request({
                        method: "wallet_switchEthereumChain",
                        params: [{ chainId: Web3.utils.toHex(42161) }],
                    });
                }
                const signer = provider.getSigner();
                const token_contract = new ethers.Contract(address, token_abi, signer);
                try {
                    const amount = await token_contract.allowance(account, router_address);
                    return amount.toString();
                } catch(e) {
                    console.log(e)
                }
            } else {
                console.log("No aurhorized account found");
                setCurrentAccount(null);
            }
        }catch(e){
            console.log('wallet is not connected', e)
        }
        return 0;
    };
    const checkBalance = async (address) => {
        const { ethereum } = window;
        try{
            const accounts = await ethereum.request({ method: "eth_accounts" });
            const account = accounts[0];
            const provider = new ethers.providers.Web3Provider(ethereum);
            if (address === ADDR_WETH) {
                let amount = await provider.getBalance(account)
                amount =  ethers.utils.formatEther(amount)
                return amount;
            } else {
                const signer = provider.getSigner();
                const token_contract = new ethers.Contract(address, token_abi, signer);
                try{
                    let amount = (await token_contract.balanceOf(account)).toString();
                    const decimal = await token_contract.decimals();
                    amount = amount/10**decimal;
                    return amount;
                } catch(e){
                    console.log(e)
                    return 0;
                }
            }   
        } catch(e) {
            console.log('Wallet is not connected', e)
        }
        return 0;
    }

    const checkPrice = async (amount) => {
        const value = new Decimal(amount || 0).toNumber();
        const token1 = tokens[select1];
        const token2 = tokens[select2];
        const addr1 = token1.address;
        const addr2 = token2.address;
        const decimal1 = token1.decimal;
        const decimal2 = token2.decimal;

        if (value === 0) {
            setAmount2(0);
            return 0;
        }

        try {
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const accounts = await ethereum.request({ method: "eth_accounts" });
                const account = accounts[0];
                const router_contract = new ethers.Contract(
                    router_address,
                    router_abi,
                    signer
                );
                const amount_in = (value * 10**decimal1).toString()
                let amount_out = "";
                try{
                    amount_out = await router_contract.getAmountsOut(amount_in, [addr1, addr2], {'from':account})
                } catch(e) {
                    console.log(e)
                    openSnackbar('Liquidity balance is not enough!', 'error');
                    setAmount2(0);
                }
                if (amount_out[1]) {
                    setAmount2(Math.round((amount_out[1].toString() / 10 ** decimal2) * 1000000) / 1000000);
                } else if (amount_out[1] == 0){
                    openSnackbar('This liquidity pair does not exist', 'error');
                }
            } else {
                openSnackbar('Wallet is not connected', 'error')
            }
        } catch(e){
            console.log(e)
        }
        return 0
    }

    useEffect(() => {
        const token = tokens[select1];
        const address = token.address;

        checkAllowance(address).then(amount => {
            setAllowance(amount);
        });

        checkBalance(address).then(amount => {
            setBal1(amount)
        })
    }, [select1, connect]);

    useEffect(() => {
        const token = tokens[select2];
        const address = token.address;

        checkBalance(address).then(amount => {
            setBal2(amount)
        })
    }, [select2])

    useEffect(() => {
        checkPrice(amount1)
    }, [amount1, select1, select2])

    const reverse_swap = () => {
        setSelect1(select2);
        setSelect2(select1);
        setAmount1(amount2);
        setAmount2(amount1);
    }

    // const change_handler = async(e) => {
    //     const value = e.target.value;
    //     setAmount1(value);
    //     await checkPrice(value);
    // }

    const swapHandler = async() => {
        // const value = new Decimal(amount || 0).toNumber();
        const token1 = tokens[select1];
        const token2 = tokens[select2];
        const addr1 = token1.address;
        const addr2 = token2.address;
        const decimal1 = token1.decimal;
        const decimal2 = token2.decimal;
        try {
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const accounts = await ethereum.request({ method: "eth_accounts" });
                const account = accounts[0];
                const router_contract = new ethers.Contract(
                    router_address,
                    router_abi,
                    signer
                );
                const amount_in = (amount1 * 10**decimal1).toString();
                let amount_out = await router_contract.getAmountsOut(amount_in, [addr1, addr2], {
                    'from':account
                })
                amount_out = amount_out[1].toString()
                amount_out = Math.round((amount_out * (100 - slippage)/100)).toString();

                console.log(amount_out)

                if (addr1 === ADDR_WETH) {
                    let swap = await router_contract.swapExactETHForTokens(amount_out, [addr1, addr2], account, (Date.now() + 10 * 60),
                    {
                        'value': Web3.utils.toWei(amount1.toString(), 'ether'),
                    });
                    openSnackbar('Swapping transaction successful', 'success')
                } else if (addr2 === ADDR_WETH) {
                    let swap = await router_contract.swapExactTokensForETH(amount_in, amount_out, [addr1, addr2], account, (Date.now() + 10 * 60));
                    openSnackbar('Swapping transaction successful', 'success')
                } else {
                    let swap = await router_contract.swapExactTokensForTokens(amount1, amount_out, [addr1, addr2], account, (Date.now() + 10 * 60));
                    openSnackbar('Swapping transaction successful', 'success')
                }
            } else {
                console.log("Object does not exist");
            }
        } catch(e) {
            if (e.reason === 'insufficient funds for intrinsic transaction cost'){
                openSnackbar('Insufficient funds for intrinsic transaction cost!', 'error')
            } else if (e.reason === 'invalid BigNumber string'){
                openSnackbar('Transaction will be failed, Please increase Slippage', 'error')
            } else if (e.reason === 'missing revert data in call exception'){
                openSnackbar('Token is not approved yet, Please approve token', 'error')
            } else {
                console.log(e);
            }
        }
    }

    const approveHandler = async () =>{
        const token1 = tokens[select1];
        const addr1 = token1.address;

        try {
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const token_contract = new ethers.Contract(
                    addr1,
                    token_abi,
                    signer
                );

                let approve = await token_contract.approve(router_address, '0xffffffffffffffffffffffffffffffffffffff');
                const approve_receipt = await approve.wait();

                if (approve_receipt && approve_receipt.blockNumber && approve_receipt.status === 1){
                    openSnackbar('Approval transaction successful', 'success')
                    const allow = await checkAllowance();
                    setAllowance(allow);
                }
            } else {
                console.log("Object does not exist");
            }
        }catch(e){
            console.log(e)
            openSnackbar('Approval transaction failed.', 'error')
        }
    }

    const ConnectButton = () =>{
        return(
            <Button onClick={connect} sx={{minWidth: 200, background:'#f1e6db55', borderRadius: '10px', margin:'20px'}}>
            <h3>Connect Wallet</h3>
            </Button>
        )
    }

    const swapButton = () => {
        return(
            <Box display='flex' justifyContent='space-around'>
                {
                    allowance == 0 &&
                        <Button onClick={approveHandler} variant='outlined' sx={{minWidth: 200, borderRadius: '10px', margin:'20px'}}>
                            <h3>Approve</h3>
                        </Button>
                }
                <Button onClick={swapHandler} variant='outlined' sx={{minWidth: 200, margin:'20px', borderRadius: '10px'}}>
                    <h3>Exchange</h3>
                </Button>
            </Box>
        )
    }

    const handleSelect1 = (e) => {
        const value = e.target.value;
        if (value !== select2) {
            setSelect1(value);
        }
    }

    const handleSelect2 = (e) => {
        const value = e.target.value;
        if (value !== select1) {
            setSelect2(value);
        }
    }

    return(
    <Box>
        <Stack onClick={()=>{setMessage(null)}} alignItems='center' justifyContent='center' minHeight='90vh'>
            {/* {message &&
            <Popup/>} */}
            <Box minWidth='38vw' sx={{ borderRadius:'10px', border: '2px solid rgb(255, 255, 255)', padding:'15px 35px', mt:1}}>
                <Typography variant='h3'>Swap</Typography>
                <br />
                <Box>
                    <Box display='flex' alignItems='center' justifyContent='space-between' sx={{background:'#614F1555', borderRadius:'10px', padding:'20px 20px'}}>
                        <Stack>
                            <Select
                                id="token1"
                                value={select1}
                                onChange={handleSelect1}
                                sx={{minWidth: 120 }}
                            >
                                {tokens.map((row, idx) => (
                                    <MenuItem
                                        key={row.id}
                                        value={row.id}
                                    >
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <img style={{ height: 15 }} src={row.logo} />
                                            <Typography variant="s4">{row.symbol}</Typography>
                                        </Stack>
                                    </MenuItem>
                                ))}
                            </Select>
                            <Box display='flex' justifyContent='space-between' alignItems='center' sx={{mt:1}}>
                                <Typography>Balance: {Math.round(bal1 * 100000)/100000}</Typography>
                                {bal1 >0 && 
                                <Button variant='outlined' sx={{maxHeight:"25px",color:'black', border: '1px solid rgb(0, 0, 0)', borderRadius: '10px'}} onClick={()=>{setAmount1(bal1)}}>
                                    max
                                </Button>}
                            </Box>
                        </Stack>
                        <Input 
                            display='flex' 
                            onChange={(e) => {setAmount1(e.target.value)}} 
                            value={amount1} 
                            placeholder='0.0'
                            disableUnderline
                            sx={{
                                width: '100%',
                                input: {
                                    autoComplete: 'off',
                                    padding: '10px 0px',
                                    border: 'none',
                                    fontSize: '18px',
                                    textAlign: 'end',
                                    appearance: 'none',
                                    fontWeight: 700,
                                }
                                }}
                        />
                    </Box>
                    <Box textAlign='center' alignItems='center' sx={{padding:'5px 5px'}}>
                        <SwapVerticalCircleIcon onClick={()=>{reverse_swap()}} sx={{height:'35px', width:'35px', cursor:'pointer'}} />
                    </Box>
                    <Box display='flex' alignItems='center' justifyContent='space-between' sx={{background:'#614F1555', borderRadius:'10px', padding:'20px 20px'}}>
                        <Stack>
                            <Select
                                id="token2"
                                value={select2}
                                onChange={handleSelect2}
                                sx={{minWidth: 120 }}
                            >
                                {tokens.map((row, idx) => (
                                    <MenuItem
                                        key={row.id}
                                        value={row.id}
                                    >
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <img style={{ height: 15 }} src={row.logo} />
                                            <Typography variant="s4">{row.symbol}</Typography>
                                        </Stack>
                                    </MenuItem>
                                ))}
                            </Select>
                            <Box display='flex' justifyContent='space-between' alignItems='center' sx={{mt:1}}>
                                <Typography>Balance: {Math.round(bal2 * 100000)/100000}</Typography>
                                {/* {bal2 >0 && 
                                <Button variant='outlined' sx={{maxHeight:"25px",color:'black', border: '1px solid rgb(0, 0, 0)', borderRadius: '10px'}} onClick={()=>{setAmount2(bal2)}}>
                                    max
                                </Button>} */}
                            </Box>
                        </Stack>
                        <Input 
                            display='flex' 
                            onChange={(e)=>{setAmount2(e.target.value)}} 
                            value={amount2} 
                            placeholder='0.0'
                            disableUnderline
                            sx={{
                                width: '100%',
                                input: {
                                    autoComplete: 'off',
                                    padding: '10px 0px',
                                    border: 'none',
                                    fontSize: '18px',
                                    textAlign: 'end',
                                    appearance: 'none',
                                    fontWeight: 700,
                                }
                                }}
                        />
    
                    </Box>
                    <br/>
                    <Box display='flex' justifyContent='space-around' alignItems='center' textAlign="center" sx={{mt:1}}>
                        {currentAccount ? swapButton() : ConnectButton()}
                      </Box>
                </Box>
            </Box>
        </Stack>
    </Box>
    )
}