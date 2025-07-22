import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../../../public/rating.css'; // Assuming you're linking it properly in public/index.html

export default function Rating({ obj, setEventData }) {
    const [rating, setRating] = useState('1');
    const [comment, setComment] = useState('');
    const [error, setError] = useState('');

    const handleRatingChange = (e) => setRating(e.target.value);
    const handleCommentChange = (e) => {
        setComment(e.target.value);
        if (e.target.value.length < 10 || e.target.value.length > 50) {
            setError('Comment must be between 10 to 50 characters.');
        } else {
            setError('');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const sendReview = async () => {

            if (comment.length < 10 || comment.length > 50) {
                setError('Comment must be between 10 to 50 characters.');
                return;
            }
            if (!rating) {
                setError('Please select a rating.');
                return;
            }

            let response = await axios.post(`https://schedulo-server-pfcu.onrender.com/events/${obj._id}/newReview`, { comment, rating })
            if (response.error) {
                toast.error('Error posting the review')
                setRating('1')
                setComment(' ')
            } else {
                toast.success('Review posted successfully')
                let event =await axios.get(`https://schedulo-server-pfcu.onrender.com/events/${obj._id}`)
                setEventData(event.data)
            }
            console.log('Review Submitted:', { rating, comment });
        }
        sendReview()
        // You can fire off a POST request here instead
    };

    return (
        <div  style={{ fontFamily: 'Montserrat,sans-serif' }}>
            <h1 className=" w-full 2xl:w-auto h-16 flex justify-center items-center text-4xl font-bold underline text-center">Add your Thoughts!!</h1>
            <div className="mt-5">
                <div className=" 2xl:w-auto flex flex-col justify-center items-center">
                    <hr />
                    <form onSubmit={handleSubmit} className=" w-[370px] md:w-[650px] lg:w-[850px] 2xl:w-full flex flex-col justify-center items-center">
                        <div className=" mb-3 w-full mt-3 2xl:w-[1000px] flex flex-col justify-center items-center gap-2 shadow-xl">
                            <h2 className="h-16 flex justify-center items-center text-3xl font-bold bg-[#FFB300] text-white w-full">Leave a Review</h2>

                            <h1 className="p-5 h-16 text-3xl font-bold">Give a rating</h1>
                            <fieldset className="starability-slot p-5 2xl:w-[500px] flex justify-center items-center" style={{
                                transform: 'scale(1.4)',        // ⬅️ Scale everything uniformly
                            }}
                            >
                                <input
                                    type="radio"
                                    id="first-rate1"
                                    name="rating"
                                    value="1"
                                    checked={rating === '1'}
                                    onChange={handleRatingChange}
                                />
                                <label htmlFor="first-rate1" title="Terrible">1 star</label>

                                <input
                                    type="radio"
                                    id="first-rate2"
                                    name="rating"
                                    value="2"
                                    checked={rating === '2'}
                                    onChange={handleRatingChange}
                                />
                                <label htmlFor="first-rate2" title="Not good">2 stars</label>

                                <input
                                    type="radio"
                                    id="first-rate3"
                                    name="rating"
                                    value="3"
                                    checked={rating === '3'}
                                    onChange={handleRatingChange}
                                />
                                <label htmlFor="first-rate3" title="Average">3 stars</label>

                                <input
                                    type="radio"
                                    id="first-rate4"
                                    name="rating"
                                    value="4"
                                    checked={rating === '4'}
                                    onChange={handleRatingChange}
                                />
                                <label htmlFor="first-rate4" title="Very good">4 stars</label>

                                <input
                                    type="radio"
                                    id="first-rate5"
                                    name="rating"
                                    value="5"
                                    checked={rating === '5'}
                                    onChange={handleRatingChange}
                                />
                                <label htmlFor="first-rate5" title="Amazing">5 stars</label>
                            </fieldset>

                            <div className="mb-3 2xl:text-3xl flex justify-center items-center 2xl:gap-5">
                                <label htmlFor="comment" className="p-2 md:w-[200px] lg:w-[300px] lg:text-2xl 2xl:w-[200px] font-semibold flex justify-center items-center">Comment</label>
                                <textarea
                                    name="comment"
                                    id="comment"
                                    value={comment}
                                    onChange={handleCommentChange}
                                    placeholder="Your thoughts on this place"
                                    className="w-60 ring-2 text-md md:w-96 lg:w-[500px] ring-gray-200 rounded-xl 2xl:h-32 2xl:w-[700px] 2xl:text-xl p-5"
                                    required
                                ></textarea>
                            </div>

                            {error && (
                                <div className="text-red-500 text-lg font-semibold mb-2">
                                    {error}
                                </div>
                            )}

                            <button type="submit" className="btn btn-wide text-base btn-success mb-5">Submit Review</button>
                        </div>
                    </form>
                    <hr />
                </div>
            </div>
        </div>
    );
}
