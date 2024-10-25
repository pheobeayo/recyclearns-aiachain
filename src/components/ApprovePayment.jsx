import  { useState, useEffect } from 'react'
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { getProvider }from '../constants/providers'
import { isSupportedChain } from '../connection/index'
import { getGreenEarnContract, getGreenTokenContract } from '../constants/contract';
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { ethers } from 'ethers';
import { TiWarning } from "react-icons/ti";
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    color: 'white',
    transform: 'translate(-50%, -50%)',
    width: 400,
    borderRadius: 10,
    boxShadow: 24,
    border: '1px solid #42714262',
    backgroundColor: '#1E1D34',
    p: 4,
  };

const ApprovePayment = ({id, index}) => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const { chainId, address } = useWeb3ModalAccount();
    const { walletProvider } = useWeb3ModalProvider()
 
    async function handleApproval() {
      if (!isSupportedChain(chainId)) return console.error("Wrong network");
      const readWriteProvider = getProvider(walletProvider);
      const signer = await readWriteProvider.getSigner();

      const contract = getGreenEarnContract(signer);
 
      try {  
        const transaction = await contract.approvePayment(id);
        const receipt = await transaction.wait();
  
        if (receipt.status) {
          return toast.success("Payment approval successful!", {
            position: "top-center",
          });
        }
  
        toast.error("Payment approval failed", {
          position: "top-center",
        });
      } catch (error) {
        toast.error("Payment approval failed!", {
          position: "top-center",
        });
      } finally { 
        setOpen(false)
      }
    };
  

  return (
    <div>
    <div>
      <button className="bg-white text-[#427142] border border-[#427142] py-2 px-4 rounded-lg lg:text-[20px] md:text-[20px] font-bold text-[16px] w-[100%] my-2 hover:bg-bg-ash hover:text-darkGrey hover:font-bold" onClick={handleOpen}>Approve Payment</button>
    <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
        <input type="text" placeholder='Product ID' value={id}  className="text-white rounded-lg w-[100%] p-4 bg-[#ffffff23] border border-white/50 backdrop-blur-lg mb-4 outline-none hidden" readonly/>
        <div className='flex flex-col justify-center items-center'>
               <TiWarning className='text-4xl'/>
            <p className='my-4 text-center'>Have you gotten your goods? If yes approve else cancel the transaction. </p>
            </div>
          <button className="bg-[#427142] text-[white] py-2 px-4 rounded-lg lg:text-[20px] md:text-[20px] font-bold text-[16px] w-[100%] my-4" onClick={handleApproval}>Approve &rarr;</button>
        </Box>
      </Modal>
      
    </div>
  </div>
  )
}

export default ApprovePayment