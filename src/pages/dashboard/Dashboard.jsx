import bannerImg from '../../assets/dashboard.svg'
import{ useNavigate}from 'react-router-dom'
import UserSellerProfile from '../../components/UserSellerProfile';

const Dashboard = () => {
  const navigate = useNavigate();
  return (
    <main className="bg-white">
       <div className='flex flex-col lg:flex-row md:flex-row bg-[#427142] rounded-[20px] w-[100%] text-white'>
        <div className='lg:w-[60%] md:w-[60%] w-[100%] p-8'>
            <h2 className='lg:text-[24px] md:text-[24px] text-[18px] font-bold mb-4'>Recyclearns - Where environmental consciousness meets blockchain innovation</h2>
            <p>To get started listing your eco friendly product, create a seller's profile.</p>
            <div className='mt-6'>
            <button onClick={() => navigate('/dashboard/createprofile')}  className="bg-white text-[#427142] py-2 px-4 rounded-lg lg:text-[20px] md:text-[20px] font-bold text-[16px] lg:w-[50%] md:w-[50%] w-[100%] my-2 hover:bg-green-300 hover:font-bold">Create Profile</button>
            </div>
        </div>
        <div className='lg:w-[40%] md:w-[40%] w-[100%] bg-[#DBECDB] lg:rounded-tl-[50%] md:rounded-tl-[50%] lg:rounded-bl-[50%] rounded-tl-[50%] rounded-tr-[50%] text-right lg:rounded-tr-[20px] rounded-bl-[20px] rounded-br-[20px] p-6 flex justify-center'>
            <img src={bannerImg} alt="dashboard" />
        </div>
    </div>
    <div className='my-6 w-[100%]'>
      <UserSellerProfile />
    </div>
      </main> 
    
  );
};

export default Dashboard;