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

const EditProfile = ({id}) => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [sellerName, setSellerName] = useState('')
    const [location, setLocation] = useState('')
    const [mail, setMail] = useState('')

    const { chainId } = useWeb3ModalAccount();
    const { walletProvider } = useWeb3ModalProvider()

    async function handleEditProfile() {
        if (!isSupportedChain(chainId)) return console.error("Wrong network");
        const readWriteProvider = getProvider(walletProvider);
        const signer = await readWriteProvider.getSigner();
    
        const contract = getGreenEarnContract(signer);
    
        try {
          const transaction = await contract.updateProfile(location, mail);
          const receipt = await transaction.wait();
    
          if (receipt.status) {
            return toast.success("Profile edit successful!", {
              position: "top-center",
            });
          }
    
          toast.error("Profile edit failed", {
            position: "top-center",
          });
        } catch (error) {
          console.error(error);
          toast.error("Profile edit failed!", {
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
        <button className="bg-[#427142] text-white py-2 px-4 rounded-lg lg:text-[20px] md:text-[20px] font-bold text-[16px] w-[100%] my-2  hover:font-bold" onClick={handleOpen}>Edit Profile</button>
    <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <input type="text" placeholder='Location' className="rounded-lg w-[100%] border text-white border-white/50 p-4 bg-[#ffffff23] backdrop-blur-lg mb-4 outline-none" onChange={(e) => setLocation(e.target.value)} />
          <input type="email" placeholder='Mail' onChange={(e) => setMail(e.target.value)}  className="text-white rounded-lg w-[100%] p-4 bg-[#ffffff23] border border-white/50 backdrop-blur-lg mb-4 outline-none" />
          <button className="bg-[#427142] text-[white] py-2 px-4 rounded-lg lg:text-[20px] md:text-[20px] font-bold text-[16px] w-[100%] my-4" onClick={handleEditProfile}>Edit &rarr;</button>
        </Box>
      </Modal>
        </div>
    </div>
  )
}

export default EditProfile