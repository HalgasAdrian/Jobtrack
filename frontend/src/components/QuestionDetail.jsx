import React from "react";
import PropTypes from "prop-types";
import "../css/QuestionDetail.css";

export default function QuestionDetail({ question }) {
    // Nothing selected yet
    if (!question) {
        return (
            <div className="question-detail empty">
                <p>Select a question to view details.</p>
            </div>
        );
    }

    return (
        <div className="question-detail">
            <h3>Question Details</h3>

            <div className="question-card">
                <p>
                    <strong>Company:</strong> {question.company}
                </p>
                <p>
                    <strong>Role:</strong> {question.role}
                </p>
                <p>
                    <strong>Asked On:</strong> {question.date}
                </p>

                <div className="question-body">
                    <strong>Question:</strong>
                    <p>{question.question}</p>
                </div>

                {/* Placeholder for upcoming AI feature */}
                <button className="ai-btn" disabled>
                    💡 Generate AI Answer (Coming Soon)
                </button>

                {question.tags?.length > 0 && (
                    <div className="tag-list">
                        {question.tags.map((tag) => (
                            <span key={tag} className="tag">
                {tag}
              </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

QuestionDetail.propTypes = {
    question: PropTypes.shape({
        _id: PropTypes.string,
        company: PropTypes.string,
        role: PropTypes.string,
        date: PropTypes.string,
        question: PropTypes.string,
        tags: PropTypes.arrayOf(PropTypes.string),
    }),
};
