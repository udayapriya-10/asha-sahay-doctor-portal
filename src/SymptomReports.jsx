
import { useState } from "react";
import {
  Search,
  ClipboardList,
  Eye,
  X,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

export default function SymptomReports({
  reports = [],
  onMarkReviewed,
}) {
  const [search, setSearch] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);

  // Support the field names used by App.jsx
  const getPatientName = (report) =>
    report.patientName || report.patient || "Unknown patient";

  const getReportDate = (report) =>
    report.submittedAt || report.date || "Not provided";

  const filteredReports = reports.filter((report) => {
    const value = search.toLowerCase();

    return (
      getPatientName(report).toLowerCase().includes(value) ||
      (report.patientId || "").toLowerCase().includes(value) ||
      (report.id || "").toLowerCase().includes(value) ||
      (report.village || "").toLowerCase().includes(value) ||
      (report.symptoms || []).join(" ").toLowerCase().includes(value)
    );
  });

  const pendingCount = reports.filter(
    (report) => report.status === "Pending"
  ).length;

  const reviewedCount = reports.filter(
    (report) => report.status === "Reviewed"
  ).length;

  function handleMarkReviewed(reportId) {
    if (onMarkReviewed) {
      onMarkReviewed(reportId);
    }

    setSelectedReport(null);
  }

  return (
    <div className="page-content">
      <div className="page-heading">
        <div>
          <p className="eyebrow">PATIENT CARE</p>
          <h1>Symptom Reports</h1>
          <p className="page-description">
            Review symptom reports submitted by community health workers.
          </p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <ClipboardList size={20} />
          </div>
          <p>Total Reports</p>
          <h2>{reports.length}</h2>
        </div>

        <div className="stat-card">
          <div className="stat-icon pending-icon">
            <Clock size={20} />
          </div>
          <p>Pending Review</p>
          <h2>{pendingCount}</h2>
        </div>

        <div className="stat-card">
          <div className="stat-icon reviewed-icon">
            <CheckCircle size={20} />
          </div>
          <p>Reviewed</p>
          <h2>{reviewedCount}</h2>
        </div>
      </div>

      <div className="content-card">
        <div className="section-header">
          <div>
            <h2>Submitted Reports</h2>
            <p>Fictional demo records for portal preview</p>
          </div>

          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search patient or report..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Report ID</th>
                <th>Patient</th>
                <th>Village</th>
                <th>Symptoms</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredReports.map((report) => (
                <tr key={report.id}>
                  <td>{report.id}</td>

                  <td>
                    <div className="patient-name">
                      {getPatientName(report)}
                    </div>
                    <div className="patient-id">
                      {report.patientId || "Not provided"}
                    </div>
                  </td>

                  <td>{report.village || "Not provided"}</td>

                  <td>
                    <div className="symptom-tags">
                      {(report.symptoms || []).map((symptom) => (
                        <span className="symptom-tag" key={symptom}>
                          {symptom}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td>{getReportDate(report)}</td>

                  <td>
                    <span
                      className={`status-badge ${
                        report.status === "Reviewed"
                          ? "status-reviewed"
                          : "status-pending"
                      }`}
                    >
                      {report.status || "Pending"}
                    </span>
                  </td>

                  <td>
                    <button
                      className="icon-button"
                      onClick={() => setSelectedReport(report)}
                      title="View report"
                      aria-label={`View ${report.id}`}
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredReports.length === 0 && (
                <tr>
                  <td colSpan="7" className="empty-state">
                    {reports.length === 0
                      ? "No symptom reports are available."
                      : "No reports found for your search."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedReport && (
        <div
          className="modal-backdrop"
          onClick={() => setSelectedReport(null)}
        >
          <div
            className="report-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <p className="eyebrow">REPORT DETAILS</p>
                <h2>{selectedReport.id}</h2>
              </div>

              <button
                className="icon-button"
                onClick={() => setSelectedReport(null)}
                title="Close"
                aria-label="Close report details"
              >
                <X size={20} />
              </button>
            </div>

            <div className="report-detail">
              <p>
                <strong>Patient:</strong> {getPatientName(selectedReport)}
              </p>

              <p>
                <strong>Patient ID:</strong>{" "}
                {selectedReport.patientId || "Not provided"}
              </p>

              <p>
                <strong>Village:</strong>{" "}
                {selectedReport.village || "Not provided"}
              </p>

              <p>
                <strong>Reported on:</strong> {getReportDate(selectedReport)}
              </p>

              <p>
                <strong>Duration:</strong>{" "}
                {selectedReport.duration || "Not provided"}
              </p>

              <div>
                <strong>Reported symptoms:</strong>
                <div className="symptom-tags modal-tags">
                  {(selectedReport.symptoms || []).map((symptom) => (
                    <span className="symptom-tag" key={symptom}>
                      {symptom}
                    </span>
                  ))}
                </div>
              </div>

              <p>
                <strong>Notes:</strong>{" "}
                {selectedReport.notes || "No additional notes provided."}
              </p>

              <div className="demo-notice">
                <AlertCircle size={18} />
                <span>
                  Demo only. This report is not a diagnosis. A qualified
                  healthcare professional must make clinical decisions.
                </span>
              </div>
            </div>

            {selectedReport.status === "Pending" && (
              <button
                className="primary-button"
                onClick={() => handleMarkReviewed(selectedReport.id)}
              >
                <CheckCircle size={18} />
                Mark as Reviewed
              </button>
            )}

            {selectedReport.status === "Reviewed" && (
              <div className="demo-notice">
                <CheckCircle size={18} />
                <span>
                  This report has been marked as reviewed in the demo.
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
