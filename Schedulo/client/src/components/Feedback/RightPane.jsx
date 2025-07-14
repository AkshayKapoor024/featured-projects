import illustration from '../../assets/SittingUnderTree.png'
export default function RightPane() {
    return (
        <div>
            <div className="bg-[#FFB300] rounded-t-2xl md:h-[500px] lg:h-[700px] 2xl:h-[500px] flex justify-center items-center">
                <img src={illustration}  alt="No Image Available" />
            </div>
            <h1 className='bg-[#c99212] text-xl  lg:text-2xl  text-center h-16 p-2 2xl:text-3xl font-semibold flex justify-center items-center'>See what you interacted with!!</h1>
            <div className='flex justify-center md:text-lg items-center text-gray-600 font-semibold 2xl:text-xl 2xl:h-45 p-2 text-center'>Browse through the feedback you've shared across events — relive the moments, or dive deeper with a single click🤗 .
                Keep track of your impressions and revisit what mattered most to you, anytime 🥳.
            </div>
        </div>
    )
}