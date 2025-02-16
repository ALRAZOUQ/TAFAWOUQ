/*this page to view the course and its comment but for now it just view the commets in bad style (i copied from my code)*/

import React, { useState, useEffect } from "react";
import axios from "../api/axios"
import { useParams } from 'react-router-dom';
const CommentList = () => {
    const { courseId } = useParams();
  const [comments, setComments] = useState([]);
  const [filterTag, setFilterTag] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const commentsPerPage = 2;

  

  // Fetch comments from JSON file
  useEffect(() => {
    const fetchComments = async () => {
      try {
        
        const response = await axios.get(`auth/comments/${courseId ||2}`);

        if (response.status === 200) {
          console.log(response.data);
          setComments(response.data.comments); // ✅ Update state properly
        }
      } catch (error) {
        if (error.response) {
          if (error.response.status === 404) {
            console.log("No comments found");
            //we did handel the case of no courses found
          } else {
            console.error(error.response.data.message);
          }
        } else {
          console.error("An error occurred while sending the request");
        }
      }
    };

    fetchComments();
  }, []);
  // Search, filter, sort, and paginate logic
  const searchedComments = comments.filter((comment) =>
    comment.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredComments = searchedComments.filter((comment) =>
    filterTag ? comment.tag === filterTag : true
  );

  const sortedComments = [...filteredComments].sort((a, b) => {
    if (sortBy === "recent") {
      return new Date(b.creationDate) - new Date(a.creationDate);
    } else if (sortBy === "mostLikes") {
      return b.numOfLikes - a.numOfLikes;
    } else if (sortBy === "mostReplies") {
      return b.numOfReplies - a.numOfReplies;
    }
    return 0;
  });

  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = sortedComments.slice(
    indexOfFirstComment,
    indexOfLastComment
  );

  const totalPages = Math.ceil(sortedComments.length / commentsPerPage);

  return (
    <div>
      {/* Controls */}
      <div style={{ marginBottom: "20px" }}>
        <label>
          Search Content:
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for comments..."
            style={{ marginLeft: "10px" }}
          />
        </label>
        <br />
        <label>
          Filter by Tag:
          <input
            type="text"
            value={filterTag}
            onChange={(e) => setFilterTag(e.target.value)}
            placeholder="Enter tag..."
            style={{ marginLeft: "10px" }}
          />
        </label>
        <br />
        <label>
          Sort by:
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ marginLeft: "10px" }}
          >
            <option value="recent">Most Recent</option>
            <option value="mostLikes">Most Likes</option>
            <option value="mostReplies">Most Replies</option>
          </select>
        </label>
      </div>

      {/* Render Comments */}
      <div>
        {currentComments.map((comment) => (
          <div
            key={comment.id}
            style={{
              border: "1px solid #ccc",
              margin: "10px",
              padding: "10px",
              borderRadius: "5px",
            }}
          >
            <h3>{comment.authorName}</h3>
            <p>{comment.content}</p>
            <small>{comment.creationDate}</small>
            <div>
              <span>Likes: {comment.numOfLikes}</span> | 
              <span> Replies: {comment.numOfReplies}</span> | 
              <span> Tag: {comment.tag}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            style={{
              margin: "5px",
              padding: "5px",
              backgroundColor: currentPage === index + 1 ? "#007BFF" : "#f1f1f1",
              color: currentPage === index + 1 ? "white" : "black",
              border: "none",
              borderRadius: "3px",
            }}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CommentList;