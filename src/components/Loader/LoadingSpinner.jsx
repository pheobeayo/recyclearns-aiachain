import { Bars  } from 'react-loader-spinner';

const LoadingSpinner = () => (
  <div className='text-center grid place-content-center'>
    <Bars 
      height={80}
      width={80}
      color='#427142'
      wrapperStyle={{}}
      wrapperClass=''
      visible={true}
      ariaLabel='bars-loading'
      secondaryColor='#2B452B'
      strokeWidth={2}
      strokeWidthSecondary={2}
    />
  </div>
);

export default LoadingSpinner;