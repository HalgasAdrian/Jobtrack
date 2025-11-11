// src/components/QuestionList.jsx
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "../css/QuestionList.css";
import AddExperienceModal from "./AddExperienceModal";

export default function QuestionList({ company }) {
    const [questions, setQuestions] = useState([]);
    const [selected, setSelected] = useState(null);
    const [activeTab, setActiveTab] = useState("question");
    const [showEditModal, setShowEditModal] = useState(false);
    const token = localStorage.getItem("token") || "";

    useEffect(() => {
        async function fetchQuestions() {
            try {
                const res = await fetch(
                    `http://localhost:3000/api/questions?company=${encodeURIComponent(company)}`
                );
                const data = await res.json();
                setQuestions(data || []);
            } catch (err) {
                console.error("Failed to fetch questions:", err);
            }
        }
        if (company) {
            fetchQuestions();
            setSelected(null);
        }
    }, [company]);

    async function handleDelete(id) {
        if (!window.confirm("Are you sure you want to delete this experience?")) return;
        try {
            const res = await fetch(`http://localhost:3000/api/questions/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (res.status === 403) {
                alert("You are not authorized to delete this item.");
                return;
            }
            if (!res.ok) throw new Error("Failed to delete question");

            setQuestions((prev) => prev.filter((q) => q._id !== id));
            setSelected(null);
            alert("Experience deleted successfully!");
        } catch (err) {
            console.error("Delete failed:", err);
            alert("Failed to delete experience. Try again later.");
        }
    }

    function handleEdit() {
        setShowEditModal(true);
    }

    async function handleEditSubmit(updatedForm) {
        try {
            const res = await fetch(`http://localhost:3000/api/questions/${selected._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(updatedForm),
            });

            if (res.status === 403) {
                alert("You are not authorized to edit this item.");
                return;
            }
            if (!res.ok) throw new Error("Failed to update experience");

            const updated = { ...selected, ...updatedForm };

            setQuestions((prev) => prev.map((q) => (q._id === updated._id ? updated : q)));
            setSelected(updated);
            setShowEditModal(false);
            alert("Experience updated successfully!");
        } catch (err) {
            console.error("Update failed:", err);
            alert("Failed to update experience. Try again later.");
        }
    }

    if (!questions.length) {
        return (
            <div className="text-center mt-5">
                <p className="text-muted">No questions found for {company} yet.</p>
            </div>
        );
    }

    return (
        <>
            <div className="interview-layout">
                {/* LEFT COLUMN */}
                <div className="interview-list">
                    <h3 className="fw-bold mb-3">Questions for {company}</h3>
                    {questions.map((q) => (
                        <div
                            key={q._id}
                            className={`interview-item ${selected?._id === q._id ? "active" : ""}`}
                            onClick={() => setSelected(q)}
                        >
                            <div className="question-title fw-semibold">
                                {q.questionTitle || "Untitled Question"}
                            </div>
                            <div className="role-label text-muted small">
                                {q.role || "Unknown Role"}
                            </div>
                        </div>
                    ))}
                </div>

                {/* RIGHT COLUMN */}
                <div className="interview-detail">
                    {selected ? (
                        <>
                            {/* top-right small action buttons */}
                            {selected.userEmail === localStorage.getItem("userEmail") && (
                                <div className="top-action-buttons">
                                    <button className="action-btn edit-btn" onClick={handleEdit}>
                                        ✏️
                                    </button>
                                    <button className="action-btn delete-btn" onClick={() => handleDelete(selected._id)}>
                                        🗑️
                                    </button>
                                </div>
                            )}

                            <div className="tab-header">
                                <button className={`tab-btn ${activeTab === "question" ? "active" : ""}`} onClick={() => setActiveTab("question")}>
                                    Question
                                </button>
                                <button className={`tab-btn ${activeTab === "tips" ? "active" : ""}`} onClick={() => setActiveTab("tips")}>
                                    Tips
                                </button>
                            </div>

                            <div className="tab-content">
                                {activeTab === "question" ? (
                                    <>
                                        <h2 className="question-heading mb-3">{selected.questionTitle}</h2>
                                        <p className="text-muted mb-2"><strong>Difficulty:</strong> {selected.difficulty || "Not specified"}</p>
                                        <p className="text-muted mb-3"><strong>Role:</strong> {selected.role}</p>
                                        <p className="question-desc lh-base">{selected.questionDescription || "No detailed description provided."}</p>
                                    </>
                                ) : (
                                    <>
                                        <h4 className="fw-bold mb-2">Advice / Preparation</h4>
                                        <p>{selected.tips || "No tips shared."}</p>
                                    </>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="placeholder text-center text-muted">
                            <p>📝 Select a question to view details.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Modal */}
            {selected && (
                <AddExperienceModal
                    show={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    onSubmit={handleEditSubmit}
                    initialData={selected}
                />
            )}
        </>
    );
}

QuestionList.propTypes = {
    company: PropTypes.string.isRequired,
};
