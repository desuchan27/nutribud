import React, { useState } from 'react';
import { FaComment, FaHeart } from 'react-icons/fa';

const comments = [
    { username: '@happyVegetarian', comment: 'This is life-changing!' },
    { username: 'foodFitness_daily', comment: 'Thank you for the recipe!' },
    { username: 'romeo_take_me', comment: 'Nice Recipe!' },
];

interface CommentContainerProps {
    username: string;
    comment: string;
}

function CommentContainer({ username, comment }: CommentContainerProps) {
    return (
        <div className="w-full flex flex-row gap-4">
            <p className="font-semibold text-base">{username}</p>
            <p className="text-base">{comment}</p>
        </div>
    );
}

export function CommentSection() {
    return (
        <div className="w-full flex flex-col gap-2">
            {comments.map((comment, index) => (
                <CommentContainer
                    key={index}
                    username={comment.username}
                    comment={comment.comment}
                />
            ))}
            <span className="w-full px-4 py-2 gap-2 bg-gray-100/75 rounded-xl text-zinc-700 mt-4">

                <input
                    type="text"
                    placeholder="Write your comment here..."
                    className="w-full outline-none bg-transparent text-sm"
                />
            </span>
        </div>
    );
}

export function ReactionSection() {
    const [liked, setLiked] = useState(false);

    return (
        <div className="w-full flex flex-col gap-10">
            <div className="flex flex-row gap-5 justify-end px-8">
                <span className="flex flex-row gap-2 items-end text-zinc-700">
                    <FaHeart
                        className={`w-6 h-6 cursor-pointer ${liked ? 'text-primary' : 'text-zinc-600'}`}
                        onClick={() => setLiked(!liked)}
                    />
                    <p className="text-sm">100 likes</p>
                </span>

                <span className="flex flex-row gap-2 items-end text-zinc-700">
                    <FaComment className="text-zinc-600 w-6 h-6 cursor-pointer" />
                    <p className="text-sm">2 comments</p>
                </span>

            </div>
        </div>
    );
}