import chat from "../../assets/chat.svg";


const Chat = () => {
  return (
    <main className="bg-white">
      <div className='grid max-sm:grid-cols-1 gap-2 gap-y-4 sm:grid-cols-1 md:grid-cols-2 '>
        <div className="bg-[#DBECDB] h-[100vh]">
          <h1 className="text-[#015C28] mt-10 px-10 font-bold font-serif">Your Messages</h1>
        </div>
        <div className="bg-white h-[100vh]">
          <div className="p-40">
            <img src={chat} alt='chat' className="mx-4" />
            <h1 className="text-[#0F160F] mx-6 font-bold font-serif">Your Chat</h1>
            <p className="text-[#0F160F] font-serif font-medium">If you wish to purchase anything,
              you can start by messaging the seller.</p>
          </div>
        </div>

      </div>

    </main>
  );
};

export default Chat;