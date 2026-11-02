import { useState } from "react";
import {
  Plus,
  Search,
  HeartPulse,
  CalendarDays,
  X,
  Send,
  CheckCircle,
} from "lucide-react";

const initialUpdates = [
  {
    id: 1,
    title: "Importance of Regular Antenatal Check-ups",
    category: "Pregnancy Care",
    message:
      "Regular antenatal check-ups help monitor the health of the mother and baby. Please attend scheduled visits and consult a healthcare professional if you have concerns.",
    date: "2026-11-02",
    status: "Published",
  },
  {
    id: 2,
    title: "Nutrition During Pregnancy",
    category: "Nutrition",
    message:
      "Eat a balanced diet with a variety of fruits, vegetables, pulses, and other nutritious foods. Follow advice from your healthcare professional about supplements.",
    date: "2026-11-02",
    status: "Published",
  },
];

function HealthUpdates() {
  const [updates, setUpdates] = useState(initialUpdates);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newUpdate, setNewUpdate] = useState({
    title: "",
    category: "Pregnancy Care",
    message: "",
  });

  const filteredUpdates = updates.filter((update) =>
    `${update.title} ${update.category} ${update.message}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const handlePublish = (event) => {
    event.preventDefault();

    if (!newUpdate.title.trim() || !newUpdate.message.trim()) {
      return;
    }

    const update = {
      id: Date.now(),
      ...newUpdate,
      date: new Date().toISOString().split("T")[0],
      status: "Published",
    };

    setUpdates((previous) => [update, ...previous]);
    setNewUpdate({
      title: "",
      category: "Pregnancy Care",
      message: "",
    });
    setShowForm(false);
  };

  return (
    <div className="page-content health-updates-page">
      <div className="page-heading">
        <div>
          <h1>Health Updates</h1>
          <p>Publish verified health information for community healthcare workers.</p>
        </div>

        <button
          className="primary-button"
          onClick={() => setShowForm(true)}
        >
          <Plus size={18} />
          Create Update
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <HeartPulse size={22} />
          </div>
          <div>
            <p>Total Updates</p>
            <h2>{updates.length}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <CheckCircle size={22} />
          </div>
          <div>
            <p>Published</p>
            <h2>{updates.filter((item) => item.status === "Published").length}</h2>
          </div>
        </div>
      </div>

      <div className="content-card">
        <div className="section-header">
          <div>
            <h2>Published Information</h2>
            <p>Health information shared with the community</p>
          </div>

          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search updates..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </div>

        <div className="health-update-list">
          {filteredUpdates.length === 0 ? (
            <div className="empty-state">
              <p>No health updates found.</p>
            </div>
          ) : (
            filteredUpdates.map((update) => (
              <div className="health-update-card" key={update.id}>
                <div className="health-update-top">
                  <span className="health-category">{update.category}</span>
                  <span className="status-badge status-reviewed">
                    {update.status}
                  </span>
                </div>

                <h3>{update.title}</h3>
                <p className="health-update-message">{update.message}</p>

                <div className="health-update-date">
                  <CalendarDays size={15} />
                  <span>{update.date}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showForm && (
        <div className="modal-backdrop">
          <div className="report-modal health-update-modal">
            <div className="modal-header">
              <div>
                <h2>Create Health Update</h2>
                <p>Share verified information with the community.</p>
              </div>

              <button
                className="icon-button"
                onClick={() => setShowForm(false)}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handlePublish}>
              <div className="form-group">
                <label>Update Title</label>
                <input
                  type="text"
                  placeholder="Enter a clear title"
                  value={newUpdate.title}
                  onChange={(event) =>
                    setNewUpdate({
                      ...newUpdate,
                      title: event.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select
                  value={newUpdate.category}
                  onChange={(event) =>
                    setNewUpdate({
                      ...newUpdate,
                      category: event.target.value,
                    })
                  }
                >
                  <option>Pregnancy Care</option>
                  <option>Nutrition</option>
                  <option>Maternal Health</option>
                  <option>Newborn Care</option>
                  <option>General Health</option>
                </select>
              </div>

              <div className="form-group">
                <label>Information</label>
                <textarea
                  rows="5"
                  placeholder="Enter verified health information..."
                  value={newUpdate.message}
                  onChange={(event) =>
                    setNewUpdate({
                      ...newUpdate,
                      message: event.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="primary-button">
                  <Send size={16} />
                  Publish Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default HealthUpdates;
