import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div>
      <button disabled={currentPage === 0} onClick={() => onPageChange(currentPage - 1)}>
        Previous
      </button>

      {[...Array(totalPages).keys()].map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          style={{
            fontWeight: page === currentPage ? "bold" : "normal",
            margin: "5px",
          }}
        >
          {page + 1}
        </button>
      ))}

      <button disabled={currentPage === totalPages - 1} onClick={() => onPageChange(currentPage + 1)}>
        Next
      </button>
    </div>
  );
};

export default Pagination;
    