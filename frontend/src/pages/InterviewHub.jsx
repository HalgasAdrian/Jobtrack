import React, { useState, useEffect } from "react";
import CompanySearch from "../components/CompanySearch.jsx";
import QuestionList from "../components/QuestionList.jsx";
import AddExperienceModal from "../components/AddExperienceModal.jsx";
import "../css/InterviewHub.css";

export default function InterviewHub() {
    const [selectedCompany, setSelectedCompany] = useState("");
    const [defaultCompanies, setDefaultCompanies] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [hasResults, setHasResults] = useState(true);
    const isLoggedIn = !!localStorage.getItem("token");


    useEffect(() => {
        setDefaultCompanies([
            {
                name: "Google",
                logo: "https://static.cdnlogo.com/logos/g/35/google-icon.svg",
                resources: 18,
            },
            {
                name: "Spotify",
                logo: "https://cdn.worldvectorlogo.com/logos/spotify-2.svg",
                resources: 7,
            },
            {
                name: "Microsoft",
                logo: "https://static.cdnlogo.com/logos/m/70/microsoft.svg",
                resources: 20,
            },
            {
                name: "Adobe",
                logo: "https://cdn.worldvectorlogo.com/logos/adobe-1.svg",
                resources: 11,
            },
            {
                name: "Uber",
                logo: "https://cdn.worldvectorlogo.com/logos/uber-2.svg",
                resources: 9,
            },
            {
                name: "Netflix",
                logo: "https://cdn.worldvectorlogo.com/logos/netflix-3.svg",
                resources: 8,
            },
        ]);
    }, []);


    async function handleSubmit(formData) {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:3000/api/questions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err?.error || "Failed to submit experience");
            }
            alert("✅ Experience submitted successfully!");
            setShowModal(false);
        } catch (err) {
            alert(err.message);
        }
    }


    async function handleSearch(companyName) {
        const normalized = companyName.trim().toLowerCase();
        setSelectedCompany("");
        setHasResults(true);

        try {
            const res = await fetch(
                `http://localhost:3000/api/questions?company=${normalized}`
            );
            const data = await res.json();

            if (data.length === 0) {
                setHasResults(false);
            } else {
                setSelectedCompany(companyName);
            }
        } catch (err) {
            console.error("Search error:", err);
            setHasResults(false);
        }
    }

    return (
        <div className="interview-hub container py-5">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                <div>
                    <h1 className="fw-bold mb-1">Public Interview Hub</h1>
                    <p className="text-muted mb-0">
                        Explore real interview experiences shared by the community
                    </p>
                </div>

                {isLoggedIn && (
                    <button
                        className="btn btn-primary btn-lg"
                        onClick={() => setShowModal(true)}
                    >
                        + Add Experience
                    </button>
                )}
            </div>

            {/* Search Bar */}
            <CompanySearch onSearch={handleSearch} />

            {/* Default Companies Grid */}
            {!selectedCompany && hasResults && (
                <div className="row g-4 mt-4">
                    {defaultCompanies.map((c) => (
                        <div className="col-12 col-sm-6 col-lg-4 d-flex" key={c.name}>
                            <div className="card company-card text-center p-4 shadow-sm flex-fill">
                                <div className="d-flex justify-content-center mb-3">
                                    <img
                                        src={c.logo}
                                        alt={`${c.name} logo`}
                                        className="company-logo"
                                        style={{
                                            width: "60px",
                                            height: "60px",
                                            objectFit: "contain",
                                        }}
                                    />
                                </div>
                                <h5 className="fw-bold mb-1">{c.name}</h5>
                                <p className="text-muted small mb-3">
                                    {c.resources} interview resources
                                </p>
                                <button
                                    className="btn btn-outline-primary w-100"
                                    onClick={() => setSelectedCompany(c.name)}
                                >
                                    View Resources
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Show Question List when company selected */}
            {selectedCompany && <QuestionList company={selectedCompany} />}

            {/* No results found */}
            {!hasResults && (
                <div
                    className="text-center text-muted mt-5"
                    style={{
                        minHeight: "40vh",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontStyle: "italic",
                    }}
                >
                    No results found for your search.
                </div>
            )}

            {/* Modal */}
            <AddExperienceModal
                show={showModal}
                onClose={() => setShowModal(false)}
                onSubmit={handleSubmit}
            />
        </div>
    );
}
