
import { useState } from "react";
import {
  Search,
  ClipboardList,
  X,
  CheckCircle,
} from "lucide-react";

const demoReferrals = [
  {
    id: "REF-1001",
    patientId: "patient-1001",
    patientName: "Asha Nandini",
    village: "Huligi",
    referredBy: "ASHA worker",
    reason: "Routine antenatal check-up",
    date: "2026-11-01",
    priority: "Routine",
    status: "Pending",
  },
  {
    id: "REF-1002",
    patientId: "patient-1002",
    patientName: "Kavitha Rao",
    village: "Kinnal",
    referredBy: "ASHA worker",
    reason: "Follow-up consultation requested",
    date: "2026-11-01",
    priority: "Needs attention",
    status: "Pending",
  },
  {
    id: "REF-1003",
    patientId: "patient-1003",
    patientName: "Meena Gowda",
    village: "Bevoor",
    referredBy: "ASHA worker",
    reason: "Scheduled doctor review",
    date: "2026-10-31",
    priority: "Routine",
    status: "Reviewed",
  },
];

export default function Referrals({
  referrals = demoReferrals,
  onUpdateReferral,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReferral, setSelectedReferral] = useState(null);

  const referralList = Array.isArray(referrals)
    ? referrals
    : demoReferrals;

  const filteredReferrals = referralList.filter((referral) => {
    const search = searchTerm.toLowerCase();

    return (
      (referral.patientName || "").toLowerCase().includes(search) ||
      (referral.id || "").toLowerCase().includes(search) ||
      (referral.village || "").toLowerCase().includes(search) ||
      (referral.reason || "").toLowerCase().includes(search)
    );
  });

  const pendingCount = referralList.filter(
    (item) => item.status === "Pending"
  ).length;

  const reviewedCount = referralList.filter(
    (item) => item.status === "Reviewed"
  ).length;

  const handleMarkReviewed = (referralId) => {
    if (onUpdateReferral) {
      onUpdateReferral(referralId, "Reviewed");
    }

    setSelectedReferral(null);
  };

  return (
    <div className="page-content referrals-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">PATIENT CARE</p>
          <h1>Referrals</h1>
          <p className="page-description">
            Review and manage patient referrals from community health workers.
          </p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <ClipboardList size={20} />
          </div>
          <div>
            <p>Total Referrals</p>
            <h2>{referralList.length}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon pending-icon">
            <ClipboardList size={20} />
          </div>
          <div>
            <p>Pending Review</p>
            <h2>{pendingCount}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon reviewed-icon">
            <CheckCircle size={20} />
          </div>
          <div>
            <p>Reviewed</p>
            <h2>{reviewedCount}</h2>
          </div>
        </div>
      </div>

      <div className="table-card">
        <div className="table-header">
          <div>
            <h2>Referral Records</h2>
            <p>Fictional demo records for portal testing</p>
          </div>

          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search patient, village, or referral..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Referral ID</th>
                <th>Patient</th>
                <th>Village</th>
                <th>Reason</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredReferrals.map((referral) => (
                <tr key={referral.id}>
                  <td>{referral.id}</td>

                  <td>
                    <strong>{referral.patientName || "Unknown patient"}</strong>
                    <div className="table-subtext">
                      {referral.patientId || "Not provided"}
                    </div>
                  </td>

                  <td>{referral.village || "Not provided"}</td>
                  <td>{referral.reason || "Not provided"}</td>

                  <td>
                    <span className="status-badge">
                      {referral.priority || "Routine"}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`status-badge ${
                        referral.status === "Reviewed"
                          ? "status-reviewed"
                          : "status-pending"
                      }`}
                    >
                      {referral.status || "Pending"}
                    </span>
                  </td>

                  <td>
                    <button
                      className="secondary-button"
                      onClick={() => setSelectedReferral(referral)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}

              {filteredReferrals.length === 0 && (
                <tr>
                  <td colSpan="7" className="empty-state">
                    No referrals found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedReferral && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedReferral(null)}
        >
          <div
            className="modal-card"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <h2>Referral Details</h2>
                <p>{selectedReferral.id}</p>
              </div>

              <button
                className="icon-button"
                onClick={() => setSelectedReferral(null)}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <p>
                <strong>Patient:</strong>{" "}
                {selectedReferral.patientName || "Unknown patient"}
              </p>
              <p>
                <strong>Patient ID:</strong>{" "}
                {selectedReferral.patientId || "Not provided"}
              </p>
              <p>
                <strong>Village:</strong>{" "}
                {selectedReferral.village || "Not provided"}
              </p>
              <p>
                <strong>Referred by:</strong>{" "}
                {selectedReferral.referredBy || "Not provided"}
              </p>
              <p>
                <strong>Reason:</strong>{" "}
                {selectedReferral.reason || "Not provided"}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {selectedReferral.date || "Not provided"}
              </p>
              <p>
                <strong>Priority:</strong>{" "}
                {selectedReferral.priority || "Routine"}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {selectedReferral.status || "Pending"}
              </p>
            </div>

            <div className="modal-footer">
              {selectedReferral.status === "Pending" ? (
                <button
                  className="primary-button"
                  onClick={() =>
                    handleMarkReviewed(selectedReferral.id)
                  }
                >
                  <CheckCircle size={16} />
                  Mark as Reviewed
                </button>
              ) : (
                <span className="reviewed-message">
                  <CheckCircle size={16} />
                  This referral has been reviewed.
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
