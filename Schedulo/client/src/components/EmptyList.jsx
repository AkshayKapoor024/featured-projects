import illustration from '../assets/MoneyverseHomeOffice.png'
export default function EmptyList(){
    return(<div className=' max-h-[70vh] flex justify-center items-center flex-col'>
        <img src={illustration} alt="No Image Available" className='h-[40vh] md:h-[50vh] 2xl:h-[50vh]'/>
        <div className=" h-20 w-full flex justify-center items-center text-4xl md:text-[40px] 2xl:text-[50px] font-bold text-indigo-600">Oops so Empty !!</div>
        <div className=" h-20 w-full flex justify-center items-center text-xl md:text-2xl font-semibold text-yellow-400 text-center">Your search results are empty ... Try searching something again</div>
    </div>
    )
}