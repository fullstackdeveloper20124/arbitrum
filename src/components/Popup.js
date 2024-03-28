import {Box, Stack} from '@mui/material';

function Popup(){
return(
    <Stack sx={{display:'flex',alignItems:'center', justifyContent:'center', textAlign:'center', position:'absolute', zIndex:'1', border:'2px solid rgb(255, 255, 255)',borderRadius: '15px', background:'white', color:'black', maxHeight:"900px"}}>
        <Box>
            <img src='static/superr.gif' style={{borderRadius: '15px'}}></img>
            <div style={{padding:'20px 10px', textAlign:'center', color:'black'}}>
               <strong>WE ARE JUST GETTING STARTED❤️
                </strong>
            </div>
        </Box>
    </Stack>
)
}
export default Popup;