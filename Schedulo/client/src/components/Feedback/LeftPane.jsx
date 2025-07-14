import { useNavigate } from 'react-router-dom';

export default function LeftPane({ reviews }) {
    const navigate = useNavigate();
    console.log(reviews)
    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        return date.toLocaleString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
            timeZone: 'Asia/Kolkata'
        });
    };

    return (
        <>
            <h1 className="bg-indigo-600 rounded-t-2xl text-center text-xl 2xl:text-left h-20 2xl:text-4xl flex items-center p-5 font-bold text-white">
                Your Past Reviews 😉
            </h1>

            <div className="2xl:min-h-[700px]  p-3  2xl:p-5 ">
                <div className=" overflow-y-auto max-h-screen">
                    {reviews.length === 0 ? (
                        <div className="text-center text-xl mt-10 font-semibold text-gray-600">
                            No reviews yet. Time to share your thoughts!
                        </div>
                    ) : (
                        reviews.map((review, index) => (
                            <div key={index} className="rounded-xl my-5 shadow-xl 2xl:p-0 bg-white">
                                <h1 className="h-16 flex items-center text-2xl font-semibold bg-[#FFB300] px-5 rounded-t-xl">
                                    Posted for: {review.event?.title || 'Unknown Event'}
                                </h1>

                                <div className="h-auto p-5">
                                    <div className="flex flex-col 2xl:flex-row justify-between items-center text-xl font-semibold mb-3">
                                        <p className="starability-result" data-rating={review.rating}>
                                            Rated: {review.rating} {review.rating === '1' ? 'star' : 'stars'}
                                        </p>
                                        <div className="text-gray-600">Posted At: {formatDate(review.createdAt)}</div>
                                    </div>
                                    <div className="flex flex-col 2xl:flex-row justify-between items-center 2xl:items-start">
                                        <div className="flex flex-col text-center 2xl:text-left gap-3 text-lg font-medium mb-4">
                                            <div className="text-gray-800">{review.comment}</div>
                                        </div>
                                        <button
                                            className="btn btn-wide bg-[#FFB300] text-white hover:bg-[#e19c00]"
                                            onClick={() => navigate(`/events/${review.event._id}`)}
                                        >
                                            View this Event
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
}