/*stiil need to work on it*/
import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import CourseCard from "../components/coursePageComponents/CourseCard";
import Comment from "../components/coursePageComponents/Comment";
import FilterControls from "../components/coursePageComponents/FilterControls";
import Pagination from "../components/Pagination";

const CommentList = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [comments, setComments] = useState([]);
  const [filterTag, setFilterTag] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const commentsPerPage = 8;

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`auth/course/${courseId}`);
        if (response.status === 200) {
          setCourse(response.data.course[0]);
        }
      } catch (error) {
        console.error("Error fetching course:", error);
        setCourse(null);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await axios.get(`auth/comments/${courseId}`);
        if (response.status === 200) {
          setComments(response.data.comments);
        }
      } catch (error) {
        if (error.response?.status === 404) {
          toast.error("لا توجد تعليقات على هذا المقرر بعد");
          setComments([]);
        }
        console.error("Error fetching comments:", error);
      }
    };

    fetchCourse();
    fetchComments();
  }, [courseId]);

  //  handle page reset when number of comments changes
  useEffect(() => {
    const totalPages = Math.ceil(
      filteredAndSortedComments.length / commentsPerPage
    );
    if (currentPage > totalPages) {
      setCurrentPage(Math.max(1, totalPages));
    }
  }, [filterTag, sortBy, searchQuery, comments]);

  const filteredAndSortedComments = comments
    .filter((comment) =>
      comment.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((comment) => (filterTag ? comment.tag === filterTag : true))
    .sort((a, b) => {
      if (sortBy === "recent")
        return new Date(b.creationDate) - new Date(a.creationDate);
      if (sortBy === "mostLikes") return b.numOfLikes - a.numOfLikes;
      if (sortBy === "mostReplies") return b.numOfReplies - a.numOfReplies;
      return 0;
    });

  const currentComments = filteredAndSortedComments.slice(
    (currentPage - 1) * commentsPerPage,
    currentPage * commentsPerPage
  );

  const totalPages = Math.ceil(
    filteredAndSortedComments.length / commentsPerPage
  );

  return (
    <div className="bg-gradient-to-b from-TAF-200 via-white to-TAF-200">
      <div className=" w-auto mx-auto container p-4">
        <CourseCard course={course} />

        <FilterControls
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterTag={filterTag}
          setFilterTag={setFilterTag}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        <div className="space-y-4">
          {currentComments.map((comment) => (
            <Comment key={comment.id} comment={comment} />
          ))}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default CommentList;
