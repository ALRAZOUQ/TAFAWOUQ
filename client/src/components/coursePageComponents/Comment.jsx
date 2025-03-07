import React from 'react'
import {  ThumbsUp, MessageCircle, Tag } from "lucide-react";
export default function Comment( { comment } ) {
    
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow space-y-3 mb-4">
    <div className="flex justify-between items-start">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <span className="text-blue-600 font-semibold">
            {comment.authorName.charAt(0)}
          </span>
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">{comment.authorName}</h3>
          <small className="text-gray-500 text-sm">
            {new Date(comment.creationDate).toLocaleDateString('ar-SA')}
          </small>
        </div>
      </div>
      <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
        {comment.tag}
      </span>
    </div>

    <p className="text-gray-700 py-2 text-right">{comment.content}</p>

    <div className="flex gap-6 pt-2 border-t border-gray-100">
      <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
        <ThumbsUp size={18} />
        <span className="text-sm">{comment.numOfLikes} إعجاب</span>
      </button>
      <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
        <MessageCircle size={18} />
        <span className="text-sm">{comment.numOfReplies} رد</span>
      </button>
      <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
        <Tag size={18} />
        <span className="text-sm">{comment.tag}</span>
      </button>
    </div>
  </div>

  );
}
