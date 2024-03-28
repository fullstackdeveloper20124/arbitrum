
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
    Input,
    Icon
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
import token_abi from 'src/Contracts/token_abi.json'
import farm_abi from 'src/Contracts/farm_abi.json'

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
                <Locking/>
            </Container>

            <ScrollToTop />

        </OverviewWrapper>
    );
}

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// revalidation is enabled and a new request comes in

function Locking(){
    const { darkMode, openSnackbar } = useContext(AppContext);
    const farm_address = "0x89cD5cf20Be7ae54897edAF19658dEe2144b7476";
    const BLO = "0x46d84F7A78D3E5017fd33b990a327F8e2E28f30B";
    const USDC = "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8";
    const [amountin,setAmountin] = useState(0)
    const [token_bal,setToken_bal] = useState(0)
    const [stake_bal,setStake_bal] = useState(0)
    const [allowance, setAllowance] = useState(0)
    const [currentAccount, setCurrentAccount] = useState(null);
    const [reward_bal, setReward_bal] = useState(0);
    const [lock_status, setLock_status] =  useState(true);
    const [success_status, setSuccess_status] = useState(true);

    useEffect(() => {
        checkBalance(BLO).then((amount) => {
            setToken_bal(amount)
        });
        checkBalance(farm_address).then((amount) => {
            setStake_bal(amount);
        });
        checkReward(farm_address).then((amount) => {
            setReward_bal(amount)
        });
        checkAllowance().then((amount) => {
            setAllowance(amount)
        });
        setAmountin(0);
    },[lock_status, success_status])

    const checkBalance = async (token) => {
        const { ethereum } = window;
        try {
            const accounts = await ethereum.request({ method: "eth_accounts" });
            const account = accounts[0];
            setCurrentAccount(account);
            const provider = new ethers.providers.Web3Provider(ethereum);
            const { chainId } = await provider.getNetwork();
            if (chainId != 42161) {
            const switchNetwork = await window.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: Web3.utils.toHex(42161) }],
            });
            }
            //   if(token === WETH){
            //       let amountETH = await provider.getBalance(account)
            //       amountETH =  ethers.utils.formatEther(amountETH)
            //       return amountETH;
            //   }
            const signer = provider.getSigner();
            const token_contract = new ethers.Contract(token, token_abi, signer);
            try{
                let amount = (await token_contract.balanceOf(account)).toString();
                return(Web3.utils.fromWei(amount))
            } catch(e){
                console.log(e)
            }
        } catch(e){
            console.log('Wallet is not connected', e)
        }
        return 0;
    }

    const approveHandler = async() =>{
        try{
            const { ethereum } = window;
        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const token_contract = new ethers.Contract(
            BLO,
            token_abi,
            signer
            );
            let approve = await token_contract.approve(farm_address, '0xffffffffffffffffffffffffffffffffffffff');
            const approve_receipt = await approve.wait();
            if (approve_receipt && approve_receipt.blockNumber && approve_receipt.status === 1){
                openSnackbar('Token Approoval transaction successful', 'success')
                const allow = await checkAllowance(token)
                setAllowance(allow)
            }
        } else {
            console.log("Object does not exist");
        }
        }catch(e){
            console.log(e)
            openSnackbar('Approval transaction failed', 'error')
        }
      }

    const checkAllowance = async () => {
        const { ethereum } = window; 
        try {
            const accounts = await ethereum.request({ method: "eth_accounts" });
            if (accounts.length !== 0) {
                const account = accounts[0];
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const token_contract = new ethers.Contract(BLO, token_abi, signer);
                try{
                    const amount = (await token_contract.allowance(account, farm_address)).toString();
                    return amount;
                } catch(e){
                    console.log(e)
                }
            } else {
                console.log("No aurhorized account found");
            }
        }catch(e){
                console.log('wallet is not connected', e)
            }
        return 0;
    };

    const checkReward = async (farm) => {
        const { ethereum } = window;
        try{
            const accounts = await ethereum.request({ method: "eth_accounts" });
            const account = accounts[0];
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const farm_contract = new ethers.Contract(farm, farm_abi, signer);
            let amount = (await farm_contract.earned(account)).toString();
            amount = Web3.utils.fromWei(amount);
            return amount;
        } catch(e){
            console.log(e)
            return 0;
        }
    }

    const stakeHandler = async(farm, amount) => {
        try{
            const { ethereum } = window;
        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const farm_contract = new ethers.Contract(
                farm,
                farm_abi,
                signer
            );
            const stake_amount = Web3.utils.toWei(amount.toString(), 'ether')
            console.log(amount)
            try{
                let stake = await farm_contract.stake(stake_amount,{
                    value: '0',
                    gasPrice: Web3.utils.toWei('0.1', 'Gwei'),
                    gasLimit: '1200000'
                });
                console.log(stake)
                openSnackbar('Staking transaction successful', 'success')
                setAmountin(0)
                setSuccess_status(!success_status);
            }catch(e){
                console.log(e)
                openSnackbar('Staking transaction failed', 'error')
            }
        } else {
            console.log("Object does not exist");
        }
        }catch(e){
            console.log(e)
        }
    }

    const claimHandler = async(farm) => {
        try{
            const { ethereum } = window;
        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const farm_contract = new ethers.Contract(
                farm,
                farm_abi,
                signer
            );
            let harvest = await farm_contract.getReward({
                value: '0',
                gasPrice: Web3.utils.toWei('0.1', 'Gwei'),
                gasLimit: '1200000'
            });
            console.log(harvest)
            openSnackbar('Harvest transaction successful', 'success')
            setSuccess_status(!success_status);
        } else {
            console.log("Object does not exist");
        }
        }catch(e){
            console.log(e)
            openSnackbar('Harvest transaction failed', 'error')
        }
    }

    const unstakeHandler = async(farm, amount) => {
        try{
            const { ethereum } = window;
        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const farm_contract = new ethers.Contract(
                farm,
                farm_abi,
                signer
            );
            const unstake_amount = Web3.utils.toWei(amount, 'ether')
            let unstake = await farm_contract.withdraw(unstake_amount,{
                value: '0',
                gasPrice: Web3.utils.toWei('0.1', 'Gwei'),
                gasLimit: '1200000'
            });
            console.log(unstake)
            openSnackbar('Unstaking transaction succesful', 'success')
            setSuccess_status(!success_status);
        } else {
            console.log("Object does not exist");
        }
        }catch(e){
            openSnackbar('Unstaking transaction failed', 'error')
            console.log(e)
        }
    }

    const lockBox = () => {
        return(
            <Box>
                <Stack>
                    <Box display='flex' justifyContent='space-between' textAlign='center' m={1}>
                        <Typography variant='h4'>Select amount</Typography>
                        <Typography>balance: {Math.round(token_bal * 10000000000)/10000000000}</Typography>
                    </Box>
                    <Box
                        sx={{
                            background:'#beb494',
                            maxWidth: '100%',
                            borderRadius: '10px',
                            marginBottom:'15px',
                            display:'flex',
                            justifyContent:'space-between',
                            alignItems:'center'
                        }}
                    >
                        <img src='logo/logo.png' style={{height:'30px',marginLeft:'3px'}}></img>
                        <Input 
                            fullWidth 
                            placeholder='0.0' 
                            id="amount" 
                            value={amountin} 
                            onChange={(e) =>{setAmountin(e.target.value)}}
                            disableUnderline
                            sx={{
                                width: '100%',
                                input: {
                                    padding: '15px 15px',
                                    border: 'none',
                                    fontSize: '18px',
                                    textAlign: 'start',
                                    appearance: 'none',
                                    color:'black',
                                    fontWeight: 700,
                                }
                                }}
                        />
                        <Button 
                            variant='outlined' 
                            sx={{maxHeight:"25px",color:'black', border: '1px solid rgb(0, 0, 0)', borderRadius: '10px', mr:1}} 
                            onClick={()=>{setAmountin(token_bal)}}
                        >
                            max
                        </Button>
                    </Box>

                </Stack>
                <br/>
                <Box display='flex' justifyContent='space-between' mt={1} mb={1}>
                    <Typography variant='h4'>Pending rewards</Typography>
                    <Typography>{reward_bal}</Typography>
                </Box>
                <Box display='flex' mb={1} justifyContent='space-between'>
                    <Typography variant='h4'>Locked</Typography>
                    <Typography>{stake_bal}</Typography>
                </Box>
                <Box display='flex' mb={1} justifyContent='space-between'>
                    <Typography variant='h4'>Lock time minimum</Typography>
                    <Typography>1 day</Typography>
                </Box>
                <Box display='flex' mb={1} justifyContent='space-between'>
                    <Typography variant='h4'>Lock time maximium</Typography>
                    <Typography>none</Typography>
                </Box>
                <Box display='flex' mb={1} justifyContent='space-between'>
                    <Typography variant='h4'>APY</Typography>
                    <Typography>299%</Typography>
                </Box>
                <Box display='flex' mb={1} justifyContent='space-between'>
                    <Typography variant='h4'>Liquidity</Typography>
                    <Typography>746,540.33</Typography>
                </Box>
                {
                    allowance >0 ?
                        <Box display='flex' justifyContent='space-around' >
                            <Button 
                                variant='outlined' 
                                onClick={() => {stakeHandler(farm_address, amountin)}} 
                                sx={{width:'40%', background:'rgb(165, 168, 190)'}}>
                                <h3>Lock</h3>
                            </Button>
                            <Button 
                                disabled={reward_bal>0 ? false : true} 
                                variant='outlined' 
                                onClick={() => {claimHandler(farm_address)}} 
                                sx={{width:'40%', background:'rgb(165, 168, 190)'}}>
                                <h3>Claim</h3>
                            </Button>
                        </Box>
                    :
                        <Button fullWidth variant='outlined' onClick={() => {approveHandler()}} sx={{background:'rgb(165, 168, 190)'}}>
                            <h3>Enable</h3>
                        </Button>
                }
            </Box>
        )
    }

    const unlockBox = () => {
        return(
            <Box>
                <Stack>
                    <Box display='flex' justifyContent='space-between' textAlign='center' m={1}>
                        <Typography variant='h4'>Select amount</Typography>
                        <Typography>balance: {Math.round(stake_bal * 10000000000)/10000000000}</Typography>
                    </Box>
                    <Box
                        sx={{
                            background:'#beb494',
                            maxWidth: '100%',
                            borderRadius: '10px',
                            marginBottom:'15px',
                            display:'flex',
                            justifyContent:'space-between',
                            alignItems:'center'
                        }}
                    >
                        <img src='logo/logo.png' style={{height:'30px',marginLeft:'3px'}}></img>
                        <Input 
                            fullWidth 
                            placeholder='0.0' 
                            id="amount" 
                            value={amountin} 
                            onChange={(e) =>{setAmountin(e.target.value)}}
                            disableUnderline
                            sx={{
                                width: '100%',
                                input: {
                                    padding: '15px 15px',
                                    border: 'none',
                                    fontSize: '18px',
                                    textAlign: 'start',
                                    appearance: 'none',
                                    color:'black',
                                    fontWeight: 700,
                                }
                                }}
                        />
                        <Button 
                            variant='outlined' 
                            sx={{maxHeight:"25px",color:'black', border: '1px solid rgb(0, 0, 0)', borderRadius: '10px', mr:1}} 
                            onClick={()=>{setAmountin(stake_bal)}}
                        >
                            max
                        </Button>
                    </Box>
                </Stack>
                <br/>
                <Box display='flex' justifyContent='space-between' mt={1} mb={1}>
                    <Typography variant='h4'>Pending rewards</Typography>
                    <Typography>{reward_bal}</Typography>
                </Box>
                <Box display='flex' mb={1} justifyContent='space-between'>
                    <Typography variant='h4'>Locked</Typography>
                    <Typography>{stake_bal}</Typography>
                </Box>
                <Box display='flex' mb={1} justifyContent='space-between'>
                    <Typography variant='h4'>Lock time minimum</Typography>
                    <Typography>1 day</Typography>
                </Box>
                <Box display='flex' mb={1} justifyContent='space-between'>
                    <Typography variant='h4'>Lock time maximium</Typography>
                    <Typography>none</Typography>
                </Box>
                <Box display='flex' mb={1} justifyContent='space-between'>
                    <Typography variant='h4'>APY</Typography>
                    <Typography>299%</Typography>
                </Box>
                <Box display='flex' mb={1} justifyContent='space-between'>
                    <Typography variant='h4'>Liquidity</Typography>
                    <Typography>746,540.33</Typography>
                </Box>
                <Button 
                    fullWidth 
                    variant='outlined' 
                    onClick={() => {unstakeHandler(farm_address, amountin)}} 
                    sx={{background:'rgb(165, 168, 190)'}}>
                    <h3>Unlock</h3>
                </Button>
            </Box>
        )
    }

    return(
    <Box>
        <Stack alignItems='center' justifyContent='center' minHeight='90vh'>
            <Box minWidth='45vw' sx={{ borderRadius:'10px', padding:'15px 35px', mt:1}}>
                <Typography variant='h3'>Lock Farm</Typography>
                <br/>
                <Typography>Lock your $BLOX to receive 100% of the DEX fees.</Typography>
                <br/>
                <Button onClick={()=>{setLock_status(true)}}>Lock</Button>
                <Button disabled={stake_bal == 0 ? true : false } onClick={()=>{setLock_status(false)}}>UnLock</Button>
                <Stack sx={{ borderRadius:'10px', border: '1px solid rgb(255, 255, 255)', padding:'20px 20px'}}>
                    {
                        lock_status === true ? lockBox() : unlockBox()
                    }
                </Stack>
                
                {/* <Box>
                    {

                    }
                </Box> */}
            </Box>
        </Stack>
    </Box>
    )
}