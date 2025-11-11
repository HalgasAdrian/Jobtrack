import React, { useState } from "react";
import PropTypes from "prop-types";

export default function CompanySearch({ onSearch }) {
    const [query, setQuery] = useState("");

    function handleSubmit(e) {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query.trim()); // ✅ stays in InterviewHub, no redirect
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="d-flex justify-content-center align-items-center mt-3 mb-4 gap-2"
        >
            <input
                type="text"
                className="form-control w-50"
                placeholder="🔍 Search for a company..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">
                Search
            </button>
        </form>
    );
}

CompanySearch.propTypes = {
    onSearch: PropTypes.func.isRequired,
};
