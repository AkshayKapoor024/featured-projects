import illustration from '../../assets/CoolKidsDiscussion.png'
import { Link } from 'react-router-dom'
export default function EmptyPane() {
    return (<>
        <div className='bg-red-100 h-[600px] md:h-[650px] lg:h-[750px] flex justify-center items-center rounded-t-2xl'>
            <img src={illustration} alt="No Image Available" className='object-contain' />
        </div>
        <div className=' flex flex-col text-3xl font-bold text-gray-600 items-center justify-center gap-5 p-5'>
            <div>
                Oops ! Looks like you have'nt posted yet !!
            </div>
            <Link to='/' className='text-base text-blue-600 2xl:text-xl font-normal hover:underline'>Explore our website to find exciting events?</Link>
        </div>
    </>
    )
}