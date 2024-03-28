// import axios from 'axios'
// import { performance } from 'perf_hooks';
// import dynamic from 'next/dynamic';

// Material
import {
    Box,
    Container,
    styled,
    Toolbar,
    Button,
    TextField,
    Stack,
    Typography,
    Grid,
    Link,
    Input
} from '@mui/material';

// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';
import { useState,useEffect } from 'react';
import token_abi from 'src/Contracts/token_abi.json'
import farm_abi from 'src/Contracts/farm_abi.json'
import { ethers } from "ethers";
import Web3 from "web3";
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

// Components
import Header from 'src/components/Header';
import ScrollToTop from 'src/components/ScrollToTop';
// import { Grid } from 'react-loader-spinner';

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

export default function Farm() {
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
                <Farming />
            </Container>

            <ScrollToTop />

        </OverviewWrapper>
    );
}

export function Farming() {
    const { darkMode, openSnackbar } = useContext(AppContext);
    const LP_token1 = "0x787Ec456d93dc5046167626184a3FD8161ce944A"
    const USDC = "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8"
    const ETH = "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1";
    const farm1_address = '0xf435bd39fccf4dce102833b71e1894f12089f1cd';
    const farm2_address = '0x44c1813846058d6e4866e4435a757844486e60b8';
    const farm3_address = '0x3988dD77bAbdE1f55BD79181cF9Aa17140933E73';
    const LP_token2 = '0x5327cc11527c29a9b90754E3D5eF9dd76027ca3D' 
    
    const [usdc_status1, setUsdc_status1] = useState(false);
    const [eth_status1, setEth_status1] = useState(false);
    const [blo_status, setBlo_status] = useState(false);

    const [usdc_bal, setUsdc_bal] = useState(0);
    const [eth_bal, setEth_bal] = useState(0);
    const [blo_bal, setBlo_bal] = useState(0);

    const [stake_bal1, setStake_bal1] = useState(0);
    const [stake_bal2, setStake_bal2] = useState(0);
    const [stake_bal3, setStake_bal3] = useState(0);

    const [reward_usdc, setReward_usdc] = useState(0);
    const [reward_eth, setReward_eth] = useState(0);
    const [reward_blo, setReward_blo] = useState(0);

    const [allow_usdc, setAllow_usdc] = useState(0);
    const [allow_eth, setAllow_eth] = useState(0);
    const [allow_blo, setAllow_blo] = useState(0);

    const [amount_usdc, setAmount_usdc] = useState(0);
    const [amount_eth, setAmount_eth] = useState(0);
    const [amount_blo, setAmount_blo] = useState(0);


    useEffect(() => {
        checkBalance(LP_token1).then((amount) => {
            setEth_bal(amount)
        });
        checkBalance(farm1_address).then((amount) => {
            setStake_bal1(amount);
        });
        checkReward(farm1_address).then((amount) => {
            setReward_eth(amount)
        });
        checkAllowance(LP_token1, farm1_address).then((amount) => {
            setAllow_eth(amount)
        });
        setAmount_eth(0);
    },[eth_status1])

    useEffect(() => {
        checkBalance(LP_token1).then((amount) => {
            setUsdc_bal(amount)
        });
        checkBalance(farm2_address).then((amount) => {
            setStake_bal2(amount);
        });
        checkReward(farm2_address).then((amount) => {
            setReward_usdc(amount)
        });
        checkAllowance(LP_token1, farm2_address).then((amount) => {
            setAllow_usdc(amount)
        });
        setAmount_usdc(0);
    },[usdc_status1])

    useEffect(() => {
        checkBalance(LP_token2).then((amount) => {
            setBlo_bal(amount)
        });
        checkBalance(farm3_address).then((amount) => {
            setStake_bal3(amount);
        });
        checkReward(farm3_address).then((amount) => {
            setReward_blo(amount)
        });
        checkAllowance(LP_token2, farm3_address).then((amount) => {
            setAllow_blo(amount)
        });
        setAmount_blo(0);
    },[blo_status])

    const checkBalance = async (token) => {
        const { ethereum } = window;
        try{
            const accounts = await ethereum.request({ method: "eth_accounts" });
            const account = accounts[0];
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const token_contract = new ethers.Contract(token, token_abi, signer);
            let amount = (await token_contract.balanceOf(account)).toString();
            amount =  Web3.utils.fromWei(amount);
            return amount.toString();
        } catch(e){
            console.log(e)
            return 0;
        }
    }

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

    const checkAllowance = async (token, farm) => {
        const { ethereum } = window; 
        const accounts = await ethereum.request({ method: "eth_accounts" });
        if (accounts.length !== 0) {
            const account = accounts[0];
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const token_contract = new ethers.Contract(token, token_abi, signer);
            let amount = 0;
            try{
                amount = await token_contract.allowance(account, farm);
            }catch(e){
                console.log(e)
                return 0;
            }
            return amount.toString();
        } else {
            console.log("No aurhorized account found");
            return 0;
        }
    };

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
            const stake_amount = Web3.utils.toWei(amount, 'ether')
            console.log(amount)
            try{
                let stake = await farm_contract.stake(stake_amount,{
                    value: '0',
                    gasPrice: Web3.utils.toWei('0.1', 'Gwei'),
                    gasLimit: '1200000'
                });
                console.log(stake)
                openSnackbar('Staking transaction successful', 'success')
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

    const harvestHandler = async(farm) => {
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
        } else {
            console.log("Object does not exist");
        }
        }catch(e){
            openSnackbar('Unstaking transaction failed', 'error')
            console.log(e)
        }
    }

    const approveHandler = async(token, farm) =>{
        try{
            const { ethereum } = window;
        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const token_contract = new ethers.Contract(
                token,
                token_abi,
                signer
            );
            let approve = await token_contract.approve(farm, '0xffffffffffffffffffffffffffffffffffffff');
            const approve_receipt = await approve.wait();
            if (approve_receipt && approve_receipt.blockNumber && approve_receipt.status === 1){
                openSnackbar('Approval transaction successful', 'success')
                const allowance = await checkAllowance(token, farm)
                if(farm === farm1_address){
                    setAllow_eth(allowance)
                }
                else{
                    setAllow_usdc(allowance);
                }
            }
        } else {
            console.log("Object does not exist");
        }
        }catch(e){
            console.log(e)
            openSnackbar('Approval transaction failed', 'error')
        }
    }
        
    return (
            <Stack justifyContent='center' display='flex' minHeight='80vh'>
                <Stack justifyContent='center' display='flex'>
                    <Typography variant='h3'>Farm Pool List</Typography>
                    <br/>
                    <Stack sx={{border:'1px solid rgb(175, 175, 175)'}}>
                        <Grid 
                        container 
                        display='flex' 
                        alignItems='center' 
                        sx={{padding: '20px 20px', borderBottom:'1px solid rgb(175, 175, 175)'}} 
                        onClick={()=>{setEth_status1(!eth_status1)}}>
                            <Grid item xs={12} md={3}>
                                <Stack direction="row" alignItems='center' justifyContent='center' display='flex'>
                                    <Box 
                                    display='flex'
                                    alignItems='center'
                                    textAlign='center'
                                    sx={{mr:1}}>
                                        <img style={{ height: 30}} src="https://upload.wikimedia.org/wikipedia/commons/0/05/Ethereum_logo_2014.svg" />
                                        <img style={{ height: 30}} src="static/usdc.png" />
                                    </Box>
                                    <h3>WETH-USDC</h3>
                                </Stack>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Stack direction="row" alignItems='center' display='flex' justifyContent='space-around'>
                                    <Box >
                                        <p>Earned</p>
                                        <p>{Math.round(reward_eth*100000)/100000} ETH</p>
                                    </Box>
                                    <Box >
                                        <p>Staking</p>
                                        <p>{Math.round(stake_bal1*10000000000)/10000000000}</p>
                                    </Box>
                                </Stack>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Stack direction="row" alignItems='center' display='flex' justifyContent='space-around'>
                                    <div>
                                        <p>APR</p>
                                        <p>750 %</p>
                                    </div>
                                    <div>
                                        <p>Liquidity</p>
                                        <p>$262,391</p>
                                    </div>
                                </Stack>
                            </Grid>
                        </Grid>
                        {eth_status1 &&
                            <Grid 
                            container 
                            alignItems='center' 
                            display='flex' 
                            justifyContent='center' 
                            sx={{background:'#4b412533',borderBottom:'1px solid rgb(175, 175, 175)',padding: '20px 20px'}}>
                                <Grid item xs={12} md={4}>
                                    <Box alignItems='center' justifyContent='center' ml={2}>
                                        <Link href="/pool">
                                            <h3> 
                                                Get WETH-USDC LP
                                                <svg viewBox="0 0 24 24" width="20px" xmlns="http://www.w3.org/2000/svg" ><path d="M18 19H6C5.45 19 5 18.55 5 18V6C5 5.45 5.45 5 6 5H11C11.55 5 12 4.55 12 4C12 3.45 11.55 3 11 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V13C21 12.45 20.55 12 20 12C19.45 12 19 12.45 19 13V18C19 18.55 18.55 19 18 19ZM14 4C14 4.55 14.45 5 15 5H17.59L8.46 14.13C8.07 14.52 8.07 15.15 8.46 15.54C8.85 15.93 9.48 15.93 9.87 15.54L19 6.41V9C19 9.55 19.45 10 20 10C20.55 10 21 9.55 21 9V4C21 3.45 20.55 3 20 3H15C14.45 3 14 3.45 14 4Z"></path></svg>
                                            </h3>
                                        </Link>
                                        <br/>
                                        <Link target='blank' href={`https://arbiscan.io/address/${farm1_address}`}>
                                            <h3>
                                                View Contract 
                                                <svg viewBox="0 0 24 24" color="primary" width="20px" xmlns="http://www.w3.org/2000/svg" ><path d="M18 19H6C5.45 19 5 18.55 5 18V6C5 5.45 5.45 5 6 5H11C11.55 5 12 4.55 12 4C12 3.45 11.55 3 11 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V13C21 12.45 20.55 12 20 12C19.45 12 19 12.45 19 13V18C19 18.55 18.55 19 18 19ZM14 4C14 4.55 14.45 5 15 5H17.59L8.46 14.13C8.07 14.52 8.07 15.15 8.46 15.54C8.85 15.93 9.48 15.93 9.87 15.54L19 6.41V9C19 9.55 19.45 10 20 10C20.55 10 21 9.55 21 9V4C21 3.45 20.55 3 20 3H15C14.45 3 14 3.45 14 4Z"></path></svg>
                                                <VerifiedUserIcon sx={{ml:2, mr:2}} />
                                                <Button variant='outlined'>Audit</Button>
                                            </h3>
                                        </Link>
                                    </Box>    
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Box
                                        justifyContent='center'
                                        display='flex' 
                                        mr={{xs:0, md:5}} 
                                        sx={{alignItems:'center', border:'2px solid rgb(196, 196, 151)', borderRadius: '10px'}}
                                    >
                                        <Box style={{width:'85%', marginBottom:'10px'}}>
                                            <h3>WETH EARNED</h3>
                                            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'25px'}}>
                                                <p>{Math.round(reward_eth*100000)/100000} ETH</p>
                                                <Button 
                                                    disabled={reward_eth>0 ? false:true} 
                                                    sx={{width:'50%',borderRadius: '15px',
                                                    background:'rgb(165, 168, 190)',
                                                    "&.Mui-disabled": {
                                                        "background": "#beb494",
                                                        "borderColor": "rgb(60, 55, 66)",
                                                        "cursor": "not-allowed"
                                                      }
                                                    }}
                                                    variant='outlined' 
                                                    onClick={()=>{harvestHandler(farm1_address)}}>
                                                    <h3>Harvest</h3>
                                                </Button>
                                            </div>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Box mt={{xs:2, md:0}} sx={{justifyContent:'center', alignItems:'center',display:'flex', border:'2px solid rgb(196, 196, 151)', borderRadius: '10px'}}>
                                        { allow_eth == 0 && stake_bal1 == 0 ? 
                                            <Box sx={{width:'85%', marginBottom:'10px'}}>
                                                <h3>ENABLE FARM</h3>
                                                <div style={{marginTop:'25px'}}>
                                                    <Button fullWidth variant='outlined' sx={{background:'rgb(165, 168, 190)', borderRadius: '15px'}} onClick={() => {approveHandler(LP_token1, farm1_address)}}><h3>Enable</h3></Button>
                                                </div>
                                            </Box>
                                        :
                                            <Box sx={{width:'85%', marginBottom:'10px'}}>
                                                <h3>START FARMING</h3>
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
                                                    <Input 
                                                        fullWidth 
                                                        placeholder='0.0' 
                                                        id="amount" 
                                                        value={amount_eth} 
                                                        onChange={(e) =>{setAmount_eth(e.target.value)}}
                                                        disableUnderline
                                                        sx={{
                                                            width: '100%',
                                                            input: {
                                                                autoComplete: 'off',
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
                                                    {eth_bal >0 && 
                                                    <Button 
                                                        variant='outlined' 
                                                        sx={{maxHeight:"25px",color:'black', border: '1px solid rgb(0, 0, 0)', borderRadius: '10px', mr:1}} 
                                                        onClick={()=>{setAmount_eth(eth_bal)}}
                                                    >
                                                        max
                                                    </Button>}
                                                </Box>
                                                <Box display='flex' justifyContent='space-between' alignItems='center'>
                                                    <Button 
                                                        sx={{width:'45%',background:'rgb(165, 168, 190)'}} 
                                                        variant='outlined'
                                                        onClick ={() =>{stakeHandler(farm1_address, amount_eth)}}>
                                                        <h3>Stake</h3>
                                                    </Button>
                                                    <Button 
                                                        disabled={stake_bal1>0?false:true}
                                                        variant='outlined' 
                                                        sx={{width:'45%', background:'rgb(165, 168, 190)',
                                                        "&.Mui-disabled": {
                                                            "background": "#beb494",
                                                            "borderColor": "rgb(60, 55, 66)",
                                                            "cursor": "not-allowed"
                                                          }}} 
                                                        onClick={()=>{unstakeHandler(farm1_address, amount_eth)}}>
                                                        <h3>Unstake</h3>
                                                    </Button>
                                                </Box>
                                            </Box>
                                        }
                                    </Box>
                                </Grid>
                            </Grid>
                        }

                        <Grid container display='flex' alignItems='center' sx={{padding: '20px 20px', borderBottom:'1px solid rgb(175, 175, 175)'}} onClick={()=>{setUsdc_status1(!usdc_status1)}}>
                            <Grid item xs={12} md={3}>
                                <Stack direction="row" alignItems='center' justifyContent='center' display='flex'>
                                    <Box 
                                    display='flex'
                                    alignItems='center'
                                    textAlign='center'
                                    sx={{mr:1}}>
                                        <img style={{ height: 30}} src="https://upload.wikimedia.org/wikipedia/commons/0/05/Ethereum_logo_2014.svg" />
                                        <img style={{ height: 30}} src="static/usdc.png" />
                                    </Box>
                                    <h3>WETH-USDC</h3>
                                </Stack>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Stack direction="row" alignItems='center' display='flex' justifyContent='space-around'>
                                    <div>
                                        <p>Earned</p>
                                        <p>{Math.round(reward_usdc*100000)/100000} USDC</p>
                                    </div>
                                    <div>
                                        <p>Staking</p>
                                        <p>{Math.round(stake_bal2*10000000000)/10000000000}</p>
                                    </div>
                                </Stack>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Stack direction="row" alignItems='center' display='flex' justifyContent='space-around'>
                                    <div>
                                        <p>APR</p>
                                        <p>440 %</p>
                                    </div>
                                    <div>
                                        <p>Liquidity</p>
                                        <p>$262,391</p>
                                    </div>
                                </Stack>
                            </Grid>
                        </Grid>
                        {usdc_status1 &&
                            <Grid container alignItems='center' display='flex' justifyContent='center' sx={{background:'#4b412533', padding: '20px 20px', borderBottom:'1px solid rgb(175, 175, 175)',  borderBottomLeftRadius:'20px', borderBottomRightRadius:'20px'}}>
                                <Grid item xs={12} md={4}>
                                    <Box alignItems='center' justifyContent='center' ml={2}>
                                        <Link href="/pool">
                                            <h3> 
                                                Get WETH-USDC LP
                                                <svg viewBox="0 0 24 24" width="20px" xmlns="http://www.w3.org/2000/svg" ><path d="M18 19H6C5.45 19 5 18.55 5 18V6C5 5.45 5.45 5 6 5H11C11.55 5 12 4.55 12 4C12 3.45 11.55 3 11 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V13C21 12.45 20.55 12 20 12C19.45 12 19 12.45 19 13V18C19 18.55 18.55 19 18 19ZM14 4C14 4.55 14.45 5 15 5H17.59L8.46 14.13C8.07 14.52 8.07 15.15 8.46 15.54C8.85 15.93 9.48 15.93 9.87 15.54L19 6.41V9C19 9.55 19.45 10 20 10C20.55 10 21 9.55 21 9V4C21 3.45 20.55 3 20 3H15C14.45 3 14 3.45 14 4Z"></path></svg>
                                            </h3>
                                        </Link>
                                        <br/>
                                        <Link target='blank' href={`https://arbiscan.io/address/${farm2_address}`}>
                                            <h3>
                                                View Contract 
                                                <svg viewBox="0 0 24 24" color="primary" width="20px" xmlns="http://www.w3.org/2000/svg" ><path d="M18 19H6C5.45 19 5 18.55 5 18V6C5 5.45 5.45 5 6 5H11C11.55 5 12 4.55 12 4C12 3.45 11.55 3 11 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V13C21 12.45 20.55 12 20 12C19.45 12 19 12.45 19 13V18C19 18.55 18.55 19 18 19ZM14 4C14 4.55 14.45 5 15 5H17.59L8.46 14.13C8.07 14.52 8.07 15.15 8.46 15.54C8.85 15.93 9.48 15.93 9.87 15.54L19 6.41V9C19 9.55 19.45 10 20 10C20.55 10 21 9.55 21 9V4C21 3.45 20.55 3 20 3H15C14.45 3 14 3.45 14 4Z"></path></svg>
                                                <VerifiedUserIcon sx={{ml:2, mr:2}} />
                                                <Button variant='outlined'>Audit</Button>
                                            </h3>
                                        </Link>
                                    </Box>   
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Box mr={{xs:0, md:5}} sx={{alignItems:'center', justifyContent:'center',display:'flex', border:'2px solid rgb(196, 196, 151)', borderRadius: '10px'}}>
                                        <Box sx={{width:'85%', marginBottom:'10px'}}>
                                            <h3>USDC EARNED</h3>
                                            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'25px'}}>
                                                <p>{Math.round(reward_usdc*100000)/100000} USDC</p>
                                                <Button 
                                                disabled={reward_usdc>0 ? false:true} 
                                                sx={{width:'50%',
                                                background:'rgb(165, 168, 190)',
                                                "&.Mui-disabled": {
                                                    "background": "#beb494",
                                                    "borderColor": "rgb(60, 55, 66)",
                                                    "cursor": "not-allowed"
                                                  }}} 
                                                variant='outlined'
                                                onClick={()=>{harvestHandler(farm2_address)}}>
                                                    <h3>Harvest</h3>
                                                </Button>
                                            </div>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Box mt={{xs:2, md:0}} sx={{justifyContent:'center', alignItems:'center',display:'flex', border:'2px solid rgb(196, 196, 151)', borderRadius: '10px'}}>
                                        { allow_usdc == 0 && stake_bal2 == 0 ? 
                                            <Box sx={{width:'85%', marginBottom:'10px'}}>
                                                <h3>ENABLE FARM</h3>
                                                <div style={{marginTop:'25px'}}>
                                                    <Button 
                                                    fullWidth
                                                    variant='outlined' 
                                                    sx={{background:'rgb(165, 168, 190)', borderRadius: '15px'}} 
                                                    onClick={() => {approveHandler(LP_token1, farm2_address)}}>
                                                        <h3>Enable</h3>
                                                    </Button>
                                                </div>
                                            </Box>
                                        :
                                            <Box sx={{width:'85%', marginBottom:'10px'}}>
                                                <h3>START FARMING</h3>
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
                                                    <Input 
                                                        fullWidth 
                                                        placeholder='0.0' 
                                                        id="amount" 
                                                        value={amount_usdc} 
                                                        onChange={(e) =>{setAmount_usdc(e.target.value)}}
                                                        disableUnderline
                                                        sx={{
                                                            width: '100%',
                                                            input: {
                                                                autoComplete: 'off',
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
                                                    {usdc_bal >0 && 
                                                    <Button 
                                                        variant='outlined' 
                                                        sx={{maxHeight:"25px",color:'black', border: '1px solid rgb(0, 0, 0)', borderRadius: '10px', mr:1}} 
                                                        onClick={()=>{setAmount_usdc(usdc_bal)}}
                                                    >
                                                        max
                                                    </Button>}
                                                </Box>
                                                <Box display='flex' justifyContent='space-between' alignItems='center'>
                                                    <Button 
                                                        variant='outlined'
                                                        sx={{background:'rgb(165, 168, 190)', width:'45%'}} 
                                                        onClick ={() =>{stakeHandler(farm2_address, amount_usdc)}}>
                                                        <h3>Stake</h3>
                                                    </Button>
                                                    <Button 
                                                        disabled={stake_bal2>0?false:true} 
                                                        sx={{width:'45%',
                                                        background:'rgb(165, 168, 190)',
                                                        "&.Mui-disabled": {
                                                            "background": "#beb494",
                                                            "borderColor": "rgb(60, 55, 66)",
                                                            "cursor": "not-allowed"
                                                          }}}
                                                        variant='outlined' 
                                                        onClick={()=>{unstakeHandler(farm2_address, amount_usdc)}}>
                                                        <h3>Unstake</h3>
                                                    </Button>
                                                </Box>
                                            </Box>
                                        }

                                    </Box>
                                </Grid>
                            </Grid>
                        }

                        <Grid container display='flex' alignItems='center' sx={{padding: '20px 20px'}} onClick={()=>{setBlo_status(!blo_status)}}>
                            <Grid item xs={12} md={3}>
                                <Stack direction="row" alignItems='center' justifyContent='center' display='flex'>
                                    <Box 
                                    display='flex'
                                    alignItems='center'
                                    textAlign='center'
                                    sx={{mr:1}}>
                                        <img style={{ height: 30}} src="https://upload.wikimedia.org/wikipedia/commons/0/05/Ethereum_logo_2014.svg" />
                                        <img style={{ height: 30}} src="logo/logo.png" />
                                    </Box>
                                    <h3>WETH-BLOX</h3>
                                </Stack>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Stack direction="row" alignItems='center' display='flex' justifyContent='space-around'>
                                    <div>
                                        <p>Earned</p>
                                        <p>{Math.round(reward_blo*100000)/100000} USDC</p>
                                    </div>
                                    <div>
                                        <p>Staking</p>
                                        <p>{Math.round(stake_bal3*10000000000)/10000000000}</p>
                                    </div>
                                </Stack>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Stack direction="row" alignItems='center' display='flex' justifyContent='space-around'>
                                    <div>
                                        <p>APR</p>
                                        <p>120 %</p>
                                    </div>
                                    <div>
                                        <p>Liquidity</p>
                                        <p>$262,391</p>
                                    </div>
                                </Stack>
                            </Grid>
                        </Grid>
                        {blo_status &&
                            <Grid container alignItems='center' display='flex' justifyContent='center' sx={{background:'#4b412533', padding: '20px 20px', borderTop:'1px solid rgb(175, 175, 175)',  borderBottomLeftRadius:'20px', borderBottomRightRadius:'20px'}}>
                                <Grid item xs={12} md={4}>
                                    <Box alignItems='center' justifyContent='center' ml={2}>
                                        <Link href="/pool">
                                            <h3> 
                                                Get WETH-USDC LP
                                                <svg viewBox="0 0 24 24" width="20px" xmlns="http://www.w3.org/2000/svg" ><path d="M18 19H6C5.45 19 5 18.55 5 18V6C5 5.45 5.45 5 6 5H11C11.55 5 12 4.55 12 4C12 3.45 11.55 3 11 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V13C21 12.45 20.55 12 20 12C19.45 12 19 12.45 19 13V18C19 18.55 18.55 19 18 19ZM14 4C14 4.55 14.45 5 15 5H17.59L8.46 14.13C8.07 14.52 8.07 15.15 8.46 15.54C8.85 15.93 9.48 15.93 9.87 15.54L19 6.41V9C19 9.55 19.45 10 20 10C20.55 10 21 9.55 21 9V4C21 3.45 20.55 3 20 3H15C14.45 3 14 3.45 14 4Z"></path></svg>
                                            </h3>
                                        </Link>
                                        <br/>
                                        <Link target='blank' href={`https://arbiscan.io/address/${farm3_address}`}>
                                            <h3>
                                                View Contract 
                                                <svg viewBox="0 0 24 24" color="primary" width="20px" xmlns="http://www.w3.org/2000/svg" ><path d="M18 19H6C5.45 19 5 18.55 5 18V6C5 5.45 5.45 5 6 5H11C11.55 5 12 4.55 12 4C12 3.45 11.55 3 11 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V13C21 12.45 20.55 12 20 12C19.45 12 19 12.45 19 13V18C19 18.55 18.55 19 18 19ZM14 4C14 4.55 14.45 5 15 5H17.59L8.46 14.13C8.07 14.52 8.07 15.15 8.46 15.54C8.85 15.93 9.48 15.93 9.87 15.54L19 6.41V9C19 9.55 19.45 10 20 10C20.55 10 21 9.55 21 9V4C21 3.45 20.55 3 20 3H15C14.45 3 14 3.45 14 4Z"></path></svg>
                                                <VerifiedUserIcon sx={{ml:2, mr:2}} />
                                                <Button variant='outlined'>Audit</Button>
                                            </h3>
                                        </Link>
                                    </Box>   
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Box mr={{xs:0, md:5}} sx={{alignItems:'center', justifyContent:'center',display:'flex', border:'2px solid rgb(196, 196, 151)', borderRadius: '10px'}}>
                                        <Box sx={{width:'85%', marginBottom:'10px'}}>
                                            <h3>USDC EARNED</h3>
                                            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'25px'}}>
                                                <p>{Math.round(reward_blo*100000)/100000} USDC</p>
                                                <Button 
                                                disabled={reward_blo>0 ? false:true} 
                                                sx={{width:'50%',
                                                background:'rgb(165, 168, 190)',
                                                "&.Mui-disabled": {
                                                    "background": "#beb494",
                                                    "borderColor": "rgb(60, 55, 66)",
                                                    "cursor": "not-allowed"
                                                  }}} 
                                                variant='outlined'
                                                onClick={()=>{harvestHandler(farm3_address)}}>
                                                    <h3>Harvest</h3>
                                                </Button>
                                            </div>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Box mt={{xs:2, md:0}} sx={{justifyContent:'center', alignItems:'center',display:'flex', border:'2px solid rgb(196, 196, 151)', borderRadius: '10px'}}>
                                        { allow_blo == 0 && stake_bal3 ==0 ? 
                                            <Box sx={{width:'85%', marginBottom:'10px'}}>
                                                <h3>ENABLE FARM</h3>
                                                <div style={{marginTop:'25px'}}>
                                                    <Button 
                                                    fullWidth
                                                    variant='outlined' 
                                                    sx={{background:'rgb(165, 168, 190)', borderRadius: '15px'}} 
                                                    onClick={() => {approveHandler(LP_token2, farm3_address)}}>
                                                        <h3>Enable</h3>
                                                    </Button>
                                                </div>
                                            </Box>
                                        :
                                            <Box sx={{width:'85%', marginBottom:'10px'}}>
                                                <h3>START FARMING</h3>
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
                                                    <Input 
                                                        fullWidth 
                                                        placeholder='0.0' 
                                                        id="amount" 
                                                        value={amount_blo} 
                                                        onChange={(e) =>{setAmount_blo(e.target.value)}}
                                                        disableUnderline
                                                        sx={{
                                                            width: '100%',
                                                            input: {
                                                                autoComplete: 'off',
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
                                                    {blo_bal >0 && 
                                                    <Button 
                                                        variant='outlined' 
                                                        sx={{maxHeight:"25px",color:'black', border: '1px solid rgb(0, 0, 0)', borderRadius: '10px', mr:1}} 
                                                        onClick={()=>{setAmount_blo(blo_bal)}}
                                                    >
                                                        max
                                                    </Button>}
                                                </Box>
                                                <Box display='flex' justifyContent='space-between' alignItems='center'>
                                                    <Button 
                                                        variant='outlined'
                                                        sx={{background:'rgb(165, 168, 190)', width:'45%'}} 
                                                        onClick ={() =>{stakeHandler(farm3_address, amount_blo)}}>
                                                        <h3>Stake</h3>
                                                    </Button>
                                                    <Button 
                                                        disabled={stake_bal3>0?false:true} 
                                                        sx={{width:'45%',
                                                        background:'rgb(165, 168, 190)',
                                                        "&.Mui-disabled": {
                                                            "background": "#beb494",
                                                            "borderColor": "rgb(60, 55, 66)",
                                                            "cursor": "not-allowed"
                                                          }}}
                                                        variant='outlined' 
                                                        onClick={()=>{unstakeHandler(farm3_address, amount_blo)}}>
                                                        <h3>Unstake</h3>
                                                    </Button>
                                                </Box>
                                            </Box>
                                        }

                                    </Box>
                                </Grid>
                            </Grid>
                        }
                    </Stack>
                </Stack>
            </Stack>
    );
}
// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// revalidation is enabled and a new request comes in
