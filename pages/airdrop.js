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
    Select,
    Typography,
    MenuItem,
    Stack,
    TextField,
    Input,
    Grid
} from '@mui/material';

import Confetti from 'react-confetti';
import useWindowSize from 'react-use/lib/useWindowSize';


// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

// Components
import Header from 'src/components/Header';
import ScrollToTop from 'src/components/ScrollToTop';
import { useState,useEffect } from 'react';
import token_abi from 'src/Contracts/token_abi.json'
import { ethers } from "ethers";
import Web3 from "web3";



// overflow: scroll;
// overflow: auto;
// overflow: hidden;

const ContainerWrapper = styled(Container) (
    ({ theme }) => `
    width: 100%;
    margin-left: auto;
    box-sizing: border-box;
    margin-right: auto;
    display: block;
    padding-left: 16px;
    padding-right: 16px;
    height: 70%;

    @media (max-width: 600px) {
        padding-left: 0px;
        padding-right: 0px;
    }
  `
);

const OverviewWrapper = styled(Box)(
    ({ theme }) => `
        overflow: hidden;
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

const AirdropWrapper = styled(Box) (
    ({ theme }) => `
        align-items: center;
        justify-content: center;
        -webkit-box-pack: center;
        display: flex;
        flex: 1;
        overflow-x: hidden;
        height: 100%;
  `
);

export default function Pool({}) {
    const { darkMode, openSnackbar } = useContext(AppContext);

    return (
        <OverviewWrapper>
            <Toolbar id="back-to-top-anchor" />

            <BackgroundWrapper
                style={{
                    backgroundImage: `url(/static/airdrop.png)`,
                    opacity: `${darkMode?0.2:0.3}`
                }}
            />

            <Header />

            <ContainerWrapper maxWidth="sm">
                <AirdropWrapper>
                    <Airdrop />
                </AirdropWrapper>
            </ContainerWrapper>

            <ScrollToTop />

        </OverviewWrapper>
    );
}

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// revalidation is enabled and a new request comes in
export function Airdrop(){

    const { width, height } = useWindowSize();
    const [congrats, setCongrats] = useState(true);
    const veblox = '0x89cD5cf20Be7ae54897edAF19658dEe2144b7476';

    const [display, setDisplay] = useState(0);
    
    useEffect(() => {
        if (display === 2) {
            setCongrats(true);
            setTimeout(() => {
                setCongrats(false);
            }, 3000)
        }
    }, [display])

    const checkBalance = async () => {
        const { ethereum } = window;
        try{
            const accounts = await ethereum.request({ method: "eth_accounts" });
            const account = accounts[0];
            const provider = new ethers.providers.Web3Provider(ethereum);
            const { chainId } = await provider.getNetwork();
            if (chainId != 42161) {
                const switchNetwork = await window.ethereum.request({
                    method: "wallet_switchEthereumChain",
                    params: [{ chainId: Web3.utils.toHex(42161) }],
                });
            }
            else{
                const signer = provider.getSigner();
                const token_contract = new ethers.Contract(veblox, token_abi, signer);
                try{
                    let amount = (await token_contract.balanceOf(account)).toString();
                    amount = Web3.utils.fromWei(amount)
                    return amount;
                } catch(e){
                    console.log(e)
                    return 0;
                }
            }   
        } catch(e){
            console.log('Wallet is not connected', e)
            return 0;
        }
    }

    const eligibillity = () => {    
        return(
            <Stack alignItems='center' spacing={3} display='flex' justifyContent='center' sx={{padding:{xs:'5px 0px', md:'15px 15px'}}}>
                <Confetti
                    width={width}
                    height={height}
                    // confettiSource={{x:0, y: 300}}
                    initialVelocityX={4}
                    initialVelocityY={100}
                    run={true}
                    recycle={congrats}
                    gravity={0.2}
                    numberOfPieces={width / 3}
                    tweenDuration={100}
                />
                <Stack>
                    <Typography variant='h2'>Congratulations!</Typography>
                    <br/><br/>
                    <Typography variant='h5' sx={{ml:1}}>
                        We are going to supply some tokens to our customers as gift.
                        <br/>
                        <br/>
                        You are one of them who can get reward!
                        <br/>
                        <br/>
                        Reward token is 10K USDC.
                        <br/>
                        <br/>
                        Get reward your token!
                    </Typography>
                </Stack>
                <Box display='flex' alignItems='center' sx={{width:'60%'}}>
                    <Button fullWidth sx={{color: "black", background:"#F8D20F", mt:3}} 
                    onClick={()=>{}}>Get Reward
                    </Button>
                </Box>
            </Stack>
        )
    }

    const noneligibillity = () => {    
        return(
            <Stack alignItems='center' spacing={3} display='flex' sx={{padding:{xs:'5px 0px', md:'15px 15px'}}}>
                <Stack>
                    <Typography variant='h2'>We are sorry!</Typography>
                    <br/><br/>
                    <Typography variant='h5' sx={{ml:1}}>
                        You can't get reward because you don't have Veblox token.
                        <br/>
                        <br/>
                        We can supply gift to only Veblox token holders.
                        <br/>
                        <br/>
                        Please get Veblox token and take part in Airdrop.
                    </Typography>
                </Stack>
                <Box display='flex' alignItems='center' sx={{width:'60%'}}>
                    <Button fullWidth sx={{color: "black", background:"#F8D20F", mt:3}} 
                    onClick={()=>{window.location.href='/lock'}}>Get Veblox
                    </Button>
                </Box>
            </Stack>
        )
    }

    const handleClickEligibility = (e) => {
        // const amount = 1;
        // if (amount === 0) {
        //     setDisplay(1); // Show Sorry page
        // } else if (amount > 0) {
        //     setDisplay(2); // Show Congrats page 
        // }
        checkBalance().then(amount => {
            if (amount == 0) {
                setDisplay(1); // Show Sorry page
            } else if (amount > 0) {
                setDisplay(2); // Show Congrats page 
            }
        })
    }

    return (
        <Box>
            {display > 0 &&
                <Stack>
                    <Button onClick={()=>{setDisplay(0)}} sx={{mt:1, width:'20px'}}>Back</Button>
                </Stack>
            }
            <Stack justifyContent='center' alignItems='center' display='flex'>
                <Box justifyContent='center' alignItems='center' sx={{ borderRadius:'10px', border: '2px solid rgb(255, 255, 255)', padding:'20px 30px'}}>
                    {display === 1 && 
                        <Box>
                            {noneligibillity()}
                        </Box>
                    }

                    {display === 2 && 
                        <Box>
                            {eligibillity()}
                        </Box>
                    }

                    {display === 0 &&
                        <Stack alignItems='center' justifyContent='center' spacing={3} display='flex' sx={{padding:{xs:'5px 0px', md:'15px 15px'}}}>
                            <Typography variant='h2'>Take part in Airdrop</Typography>
                            <br/>
                            <Typography variant='h4'>
                                We are going to supply some tokens to our customers as gift.
                                <br/>
                                <br/>
                                This is gold chance to get reward!
                                <br/>
                                <br/>
                                Take part in Airdrop with Veblox token.
                                <br/>
                                You will get reward and gift!
                                <br/>
                                <br/>
                                Enjoy your life!!!
                            </Typography>
                            <Box display='flex' alignItems='center' sx={{width:'60%'}}>
                                <Button fullWidth sx={{color: "black", background:"#F8D20F", mt:3}} 
                                onClick={handleClickEligibility}>Check Eligibility</Button>
                            </Box>
                        </Stack>
                    }
                </Box>
            </Stack>
        </Box>
    );

}
