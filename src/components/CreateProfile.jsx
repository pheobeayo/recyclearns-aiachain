import  { useState, useEffect } from 'react'
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { getProvider }from '../constants/providers'
import { isSupportedChain } from '../connection/index'
import { getGreenEarnContract } from '../constants/contract';
import { ethers } from "ethers";
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
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

const CreateProfile = () => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [sellerName, setSellerName] = useState('')
    const [location, setLocation] = useState('')
    const [mail, setMail] = useState('')

    const { chainId } = useWeb3ModalAccount();
    const { walletProvider } = useWeb3ModalProvider()

    async function handleCreateProfile() {
        if (!isSupportedChain(chainId)) return console.error("Wrong network");
        const readWriteProvider = getProvider(walletProvider);
        const signer = await readWriteProvider.getSigner();
    
        const contract = getGreenEarnContract(signer);
    
        try {
          const transaction = await contract.createProfile(sellerName, location, mail);
          const receipt = await transaction.wait();
    
          if (receipt.status) {
            return toast.success("Profile creation successful!", {
              position: "top-center",
            });
          }
    
          toast.error("Profile creation failed", {
            position: "top-center",
          });
        } catch (error) {
          console.error(error);
          toast.error("Profile creation failed!", {
            position: "top-center",
          });
        } finally {
          setSellerName("")
          setLocation("")
          setMail("")
            
          setOpen(false)
        }
      };
  return (
    <div>
        <div>
        <button className="bg-white text-[#427142] py-2 px-4 rounded-lg lg:text-[20px] md:text-[20px] font-bold text-[16px] w-[100%] lg:w-[50%] md:w-[50%] my-2 hover:bg-bg-ash hover:text-darkGrey hover:font-bold" onClick={handleOpen}>Create Profile</button>
    <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
        <input type="text" placeholder="Seller's Name" className="rounded-lg w-[100%] text-white p-4 bg-[#ffffff23] border border-white/50 backdrop-blur-lg mb-4 outline-none" onChange={(e) => setSellerName(e.target.value)} />
          <input type="text" placeholder='Location' className="rounded-lg w-[100%] border text-white border-white/50 p-4 bg-[#ffffff23] backdrop-blur-lg mb-4 outline-none" onChange={(e) => setLocation(e.target.value)} />
          <input type="email" placeholder='Mail' onChange={(e) => setMail(e.target.value)}  className="text-white rounded-lg w-[100%] p-4 bg-[#ffffff23] border border-white/50 backdrop-blur-lg mb-4 outline-none" />
          <button className="bg-[#427142] text-[white] py-2 px-4 rounded-lg lg:text-[20px] md:text-[20px] font-bold text-[16px] w-[100%] my-4" onClick={handleCreateProfile}>Create &rarr;</button>
        </Box>
      </Modal>
        </div>
    </div>
  )
}

export default CreateProfile