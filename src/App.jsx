import { useState } from "react";
import {
  AlertCircle,
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  FileText,
  HeartPulse,
  Home,
  Menu,
  Search,
  Stethoscope,
  Users,
  X,
  Plus,
  Pencil,
  Trash2,
  Save,
  Megaphone,
  LogOut,
  Eye,
  EyeOff,
} from "lucide-react";
import "./App.css";

/* =========================
   DEMO LOGIN CREDENTIALS
========================= */

const demoAccounts = {
  "doctor@sahay.com": {
    password: "doctor123",
    role: "doctor",
    name: "Doctor",
  },
  "asha@sahay.com": {
    password: "asha123",
    role: "asha",
    name: "ASHA Worker",
  },
};

/* =========================
   PATIENT RECORDS
========================= */

const initialPatients = [
  { name: "Asha Nandini", id: "patient-1001", village: "Huligi" },
  { name: "Kavitha Rao", id: "patient-1002", village: "Kinnal" },
  { name: "Meena Gowda", id: "patient-1003", village: "Bevoor" },
  { name: "Rekha Somshekar", id: "patient-1004", village: "Koppal" },
  { name: "Nirmala Bhat", id: "patient-1005", village: "Alwandi" },
  { name: "Farida Begum", id: "patient-1006", village: "Ginigera" },
  { name: "Suma Hegde", id: "patient-1007", village: "Yelburga" },
  { name: "Latha Mallapa", id: "patient-1008", village: "Hirebaganal" },
  {
    name: "Sindhu",
    id: "3425249e-b314-46f6-abbe-33518fb7cd4a",
    village: "Purigali",
  },
];

/* =========================
   SYMPTOM REPORTS
========================= */

const initialReports = [
  {
    id: "SR-1001",
    patient: "Asha Nandini",
    patientId: "patient-1001",
    village: "Huligi",
    symptoms: "Headache/Dizziness",
    date: "2026-11-02",
    status: "Pending",
  },
  {
    id: "SR-1002",
    patient: "Kavitha Rao",
    patientId: "patient-1002",
    village: "Kinnal",
    symptoms: "Swelling in feet",
    date: "2026-11-02",
    status: "Pending",
  },
  {
    id: "SR-1003",
    patient: "Meena Gowda",
    patientId: "patient-1003",
    village: "Bevoor",
    symptoms: "Nausea/Vomiting",
    date: "2026-11-01",
    status: "Pending",
  },
];

/* =========================
   REFERRAL RECORDS
========================= */

const initialReferrals = [
  {
    id: "REF-1001",
    patient: "Asha Nandini",
    patientId: "patient-1001",
    village: "Huligi",
    reason: "Routine antenatal check-up",
    date: "2026-11-02",
    status: "Pending",
  },
  {
    id: "REF-1002",
    patient: "Kavitha Rao",
    patientId: "patient-1002",
    village: "Kinnal",
    reason: "Follow-up consultation",
    date: "2026-11-02",
    status: "Pending",
  },
  {
    id: "REF-1003",
    patient: "Meena Gowda",
    patientId: "patient-1003",
    village: "Bevoor",
    reason: "Scheduled doctor review",
    date: "2026-11-01",
    status: "Pending",
  },
];

/* =========================
   NAVIGATION
========================= */

const navigation = [
  { name: "Dashboard", icon: Home },
  { name: "Patients", icon: Users },
  { name: "Symptom Reports", icon: ClipboardList },
  { name: "Referrals", icon: FileText },
  { name: "Health Updates", icon: HeartPulse },
];

/* =========================
   HELPER FUNCTIONS
========================= */

function getDisplayName(username) {
  if (!username) return "";

  const cleanedUsername = username.trim();

  const nameFromEmail = cleanedUsername.includes("@")
    ? cleanedUsername.split("@")[0]
    : cleanedUsername;

  return nameFromEmail
    .replace(/[._-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function getUserInitials(username) {
  const displayName = getDisplayName(username);

  if (!displayName) return "U";

  const words = displayName.split(" ");

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
}

/* =========================
   MAIN APP
========================= */

function App() {
  /* LOGIN STATE */

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedRole, setSelectedRole] = useState("doctor");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  /*
    The portal role is taken from the authenticated user.
    This prevents the wrong portal from appearing after login.
  */

  const activeRole = currentUser?.role || selectedRole;

  /* PORTAL STATE */

  const [activePage, setActivePage] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [patients] = useState(initialPatients);
  const [reports, setReports] = useState(initialReports);
  const [referrals, setReferrals] = useState(initialReferrals);

  /* COMMUNITY HEALTH UPDATES */

  const [healthUpdates, setHealthUpdates] = useState(() => {
    try {
      const savedUpdates = localStorage.getItem(
        "asha-sahay-health-updates"
      );

      return savedUpdates ? JSON.parse(savedUpdates) : [];
    } catch {
      return [];
    }
  });

  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [editingUpdateId, setEditingUpdateId] = useState(null);

  const [updateForm, setUpdateForm] = useState({
    title: "",
    category: "Health Awareness",
    description: "",
    date: new Date().toISOString().slice(0, 10),
    village: "All Villages",
  });

  const [selectedReport, setSelectedReport] = useState(null);

  const pendingReports = reports.filter(
    (report) => report.status === "Pending"
  ).length;

  const pendingReferrals = referrals.filter(
    (referral) => referral.status === "Pending"
  ).length;

  /* =========================
     ROLE AND USER INFORMATION
  ========================= */

  const roleTitle =
    activeRole === "doctor" ? "Doctor" : "ASHA Worker";

  const roleDescription =
    activeRole === "doctor"
      ? "Healthcare professional"
      : "Community health worker";

  const dashboardDescription =
    activeRole === "doctor"
      ? "Here is an overview of patient activity and care coordination."
      : "Here is an overview of community health activity, patient reports, and care coordination.";

  const dashboardEyebrow =
    activeRole === "doctor"
      ? "ASHA SAHAY DOCTOR PORTAL"
      : "ASHA SAHAY COMMUNITY HEALTH PORTAL";

  /* =========================
     LOGIN FUNCTIONS
  ========================= */

  function handleLogin(event) {
    event.preventDefault();

    const enteredUsername = loginEmail.trim().toLowerCase();
    const enteredPassword = loginPassword.trim();

    if (!enteredUsername || !enteredPassword) {
      alert("Please enter your email/username and password.");
      return;
    }

    /*
      DEMO LOGIN

      Doctor:
      doctor@sahay.com
      doctor123

      ASHA Worker:
      asha@sahay.com
      asha123

      The account credentials determine the portal role.
    */

    const account = demoAccounts[enteredUsername];

    if (!account || account.password !== enteredPassword) {
      alert(
        "Invalid email or password. Please check the demo credentials and try again."
      );
      return;
    }

    const loggedInUser = {
      username: enteredUsername,
      name: account.name,
      role: account.role,
    };

    setCurrentUser(loggedInUser);
    setSelectedRole(account.role);
    setIsLoggedIn(true);

    setActivePage("Dashboard");
    setSearchTerm("");
    setSidebarOpen(false);
  }

  function handleLogout() {
    setIsLoggedIn(false);
    setCurrentUser(null);

    setLoginEmail("");
    setLoginPassword("");
    setShowPassword(false);
    setSelectedRole("doctor");

    setActivePage("Dashboard");
    setSidebarOpen(false);
    setSearchTerm("");
    setSelectedReport(null);
    setShowUpdateForm(false);
    setEditingUpdateId(null);
  }

  /* =========================
     GENERAL FUNCTIONS
  ========================= */

  function navigateTo(page) {
    setActivePage(page);
    setSidebarOpen(false);
    setSearchTerm("");
  }

  function markReportReviewed(reportId) {
    setReports((currentReports) =>
      currentReports.map((report) =>
        report.id === reportId
          ? { ...report, status: "Reviewed" }
          : report
      )
    );

    setSelectedReport(null);
  }

  function markReferralReviewed(referralId) {
    setReferrals((currentReferrals) =>
      currentReferrals.map((referral) =>
        referral.id === referralId
          ? { ...referral, status: "Reviewed" }
          : referral
      )
    );
  }

  /* =========================
     HEALTH UPDATE FUNCTIONS
  ========================= */

  function saveHealthUpdates(updatedUpdates) {
    setHealthUpdates(updatedUpdates);

    try {
      localStorage.setItem(
        "asha-sahay-health-updates",
        JSON.stringify(updatedUpdates)
      );
    } catch (error) {
      console.error("Could not save health updates:", error);
      alert("Could not save the update in this browser.");
    }
  }

  function handleUpdateFormChange(event) {
    const { name, value } = event.target;

    setUpdateForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  }

  function openAddUpdateForm() {
    setEditingUpdateId(null);

    setUpdateForm({
      title: "",
      category: "Health Awareness",
      description: "",
      date: new Date().toISOString().slice(0, 10),
      village: "All Villages",
    });

    setShowUpdateForm(true);
  }

  function openEditUpdateForm(update) {
    setEditingUpdateId(update.id);

    setUpdateForm({
      title: update.title,
      category: update.category,
      description: update.description,
      date: update.date,
      village: update.village,
    });

    setShowUpdateForm(true);
  }

  function handlePublishUpdate(event) {
    event.preventDefault();

    if (
      !updateForm.title.trim() ||
      !updateForm.description.trim() ||
      !updateForm.date
    ) {
      alert("Please fill in the title, description, and date.");
      return;
    }

    if (editingUpdateId) {
      const updatedUpdates = healthUpdates.map((update) =>
        update.id === editingUpdateId
          ? {
              ...update,
              ...updateForm,
            }
          : update
      );

      saveHealthUpdates(updatedUpdates);
    } else {
      const newUpdate = {
        id: `HU-${Date.now()}`,
        ...updateForm,
        createdAt: new Date().toISOString(),
      };

      saveHealthUpdates([newUpdate, ...healthUpdates]);
    }

    setShowUpdateForm(false);
    setEditingUpdateId(null);
  }

  function deleteHealthUpdate(updateId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this health update?"
    );

    if (!confirmed) return;

    const updatedUpdates = healthUpdates.filter(
      (update) => update.id !== updateId
    );

    saveHealthUpdates(updatedUpdates);
  }

  /* =========================
     LOGIN PAGE
  ========================= */

  function renderLoginPage() {
    return (
      <div className="login-page">
        <div className="login-background-shape login-shape-one" />
        <div className="login-background-shape login-shape-two" />

        <div className="login-card">
          <div className="login-brand">
            <div className="login-brand-icon">
              <Stethoscope size={28} />
            </div>

            <div>
              <h1 style={{ color: "#183b36", fontWeight: 800 }}>
                ASHA Sahay
              </h1>

              <p>Community Healthcare Portal</p>
            </div>
          </div>

          <div className="login-heading">
            <span
              className="login-eyebrow"
              style={{ color: "#167d68", fontWeight: 700 }}
            >
              WELCOME BACK
            </span>

            <h2 style={{ color: "#183b36", fontWeight: 700 }}>
              Sign in to your account
            </h2>

            <p>
              Connecting community health workers with healthcare
              professionals.
            </p>
          </div>

          <div className="login-role-selector">
            <button
              type="button"
              className={`login-role-card ${
                selectedRole === "doctor" ? "selected" : ""
              }`}
              onClick={() => setSelectedRole("doctor")}
            >
              <div className="login-role-icon">
                <Stethoscope size={22} />
              </div>

              <strong style={{ color: "#183b36", fontWeight: 700 }}>
                Doctor
              </strong>

              <span>Healthcare professional</span>
            </button>

            <button
              type="button"
              className={`login-role-card ${
                selectedRole === "asha" ? "selected" : ""
              }`}
              onClick={() => setSelectedRole("asha")}
            >
              <div className="login-role-icon">
                <HeartPulse size={22} />
              </div>

              <strong style={{ color: "#183b36", fontWeight: 700 }}>
                ASHA Worker
              </strong>

              <span>Community health worker</span>
            </button>
          </div>

          <form className="login-form" onSubmit={handleLogin}>
            <label>
              Email or Username

              <input
                type="text"
                value={loginEmail}
                onChange={(event) =>
                  setLoginEmail(event.target.value)
                }
                placeholder={
                  selectedRole === "doctor"
                    ? "Enter your doctor email"
                    : "Enter your ASHA username"
                }
                autoComplete="username"
                required
              />
            </label>

            <label>
              Password

              <div className="login-password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  value={loginPassword}
                  onChange={(event) =>
                    setLoginPassword(event.target.value)
                  }
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="login-password-toggle"
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                  onClick={() =>
                    setShowPassword((current) => !current)
                  }
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </label>

            <button type="submit" className="login-submit-button">
              Sign In
              <ChevronRight size={18} />
            </button>
          </form>

          <div className="login-demo-note">
            <AlertCircle size={15} />

            <span>
              Demo credentials: doctor@sahay.com / doctor123 or
              asha@sahay.com / asha123
            </span>
          </div>

          <div className="login-footer">
            <span>ASHA Sahay</span>
            <span>Supporting community healthcare</span>
          </div>
        </div>
      </div>
    );
  }

  /* =========================
     DASHBOARD
  ========================= */

  function renderDashboard() {
    return (
      <>
        <div className="dashboard-welcome">
          <div>
            <span className="dashboard-eyebrow">
              {dashboardEyebrow}
            </span>

            <h1>Welcome, {roleTitle}</h1>

            <p>{dashboardDescription}</p>
          </div>

          <div className="dashboard-date">
            <CalendarDays size={17} />

            {new Date().toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </div>
        </div>

        <div className="stats-grid dashboard-stats">
          <StatCard
            icon={<Users size={19} />}
            label="Total Patients"
            value={patients.length}
            caption="Registered patients"
          />

          <StatCard
            icon={<AlertCircle size={19} />}
            iconClass="pending-icon"
            label="Pending Reports"
            value={pendingReports}
            caption="Awaiting review"
          />

          <StatCard
            icon={<FileText size={19} />}
            iconClass="referral-icon"
            label="Pending Referrals"
            value={pendingReferrals}
            caption="Need follow-up"
          />

          <StatCard
            icon={<CheckCircle2 size={19} />}
            iconClass="reviewed-icon"
            label="Reviewed Reports"
            value={reports.length - pendingReports}
            caption="Reports reviewed"
          />
        </div>

        <section className="dashboard-card">
          <div className="section-header">
            <div>
              <h2>
                <AlertCircle size={18} />
                Needs Attention
              </h2>

              <p>Items that may need your review</p>
            </div>
          </div>

          <div className="attention-list">
            {pendingReports > 0 && (
              <button
                className="attention-item"
                onClick={() => navigateTo("Symptom Reports")}
              >
                <div className="attention-icon">
                  <ClipboardList size={19} />
                </div>

                <div className="attention-info">
                  <strong>Symptom reports awaiting review</strong>
                  <span>Review submitted patient symptoms</span>
                </div>

                <span className="attention-count">
                  {pendingReports}
                </span>

                <ChevronRight size={17} />
              </button>
            )}

            {pendingReferrals > 0 && (
              <button
                className="attention-item"
                onClick={() => navigateTo("Referrals")}
              >
                <div className="attention-icon attention-referral-icon">
                  <FileText size={19} />
                </div>

                <div className="attention-info">
                  <strong>Referrals awaiting follow-up</strong>
                  <span>Check referral progress and status</span>
                </div>

                <span className="attention-count">
                  {pendingReferrals}
                </span>

                <ChevronRight size={17} />
              </button>
            )}

            {pendingReports === 0 && pendingReferrals === 0 && (
              <div className="dashboard-empty">
                <CheckCircle2 size={22} />
                <p>All caught up!</p>
              </div>
            )}
          </div>
        </section>

        <section className="dashboard-card">
          <div className="section-header">
            <div>
              <h2>Recent Symptom Reports</h2>
              <p>Latest patient symptom submissions</p>
            </div>

            <button
              className="text-button"
              onClick={() => navigateTo("Symptom Reports")}
            >
              View all <ChevronRight size={15} />
            </button>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>REPORT ID</th>
                  <th>PATIENT</th>
                  <th>SYMPTOMS</th>
                  <th>DATE</th>
                  <th>STATUS</th>
                </tr>
              </thead>

              <tbody>
                {reports.map((report) => (
                  <tr key={report.id}>
                    <td>{report.id}</td>
                    <td className="patient-name">{report.patient}</td>
                    <td>{report.symptoms}</td>
                    <td>{report.date}</td>
                    <td>
                      <StatusBadge status={report.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="dashboard-card">
          <div className="section-header">
            <div>
              <h2>Quick Actions</h2>
              <p>Go directly to a portal section</p>
            </div>
          </div>

          <div className="quick-actions">
            <QuickAction
              icon={<Users size={20} />}
              title="View Patients"
              description="Open patient directory"
              onClick={() => navigateTo("Patients")}
            />

            <QuickAction
              icon={<ClipboardList size={20} />}
              title="Review Reports"
              description="Check symptom submissions"
              onClick={() => navigateTo("Symptom Reports")}
            />

            <QuickAction
              icon={<FileText size={20} />}
              title="Manage Referrals"
              description="Track patient referrals"
              onClick={() => navigateTo("Referrals")}
            />
          </div>
        </section>
      </>
    );
  }

  /* =========================
     PATIENTS PAGE
  ========================= */

  function renderPatients() {
    const filteredPatients = patients.filter((patient) =>
      `${patient.name} ${patient.id} ${patient.village}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

    return (
      <>
        <PageHeading
          title="Patients"
          description="View and search registered patients."
        />

        <section className="content-card">
          <div className="section-header">
            <h2>Patient Directory</h2>

            <SearchBox
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search patients..."
            />
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>PATIENT ID</th>
                  <th>NAME</th>
                  <th>VILLAGE</th>
                </tr>
              </thead>

              <tbody>
                {filteredPatients.map((patient) => (
                  <tr key={patient.id}>
                    <td>{patient.id}</td>
                    <td className="patient-name">{patient.name}</td>
                    <td>{patient.village}</td>
                  </tr>
                ))}

                {filteredPatients.length === 0 && (
                  <EmptyRow
                    message="No patients found."
                    colSpan={3}
                  />
                )}
              </tbody>
            </table>
          </div>
        </section>
      </>
    );
  }

  /* =========================
     SYMPTOM REPORTS PAGE
  ========================= */

  function renderReports() {
    const filteredReports = reports.filter((report) =>
      `${report.id} ${report.patient} ${report.patientId} ${report.village} ${report.symptoms}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

    return (
      <>
        <PageHeading
          title="Symptom Reports"
          description="Review symptoms submitted by ASHA workers."
        />

        <section className="content-card">
          <div className="section-header">
            <h2>Submitted Reports</h2>

            <SearchBox
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search reports..."
            />
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>REPORT ID</th>
                  <th>PATIENT</th>
                  <th>PATIENT ID</th>
                  <th>VILLAGE</th>
                  <th>SYMPTOMS</th>
                  <th>DATE</th>
                  <th>STATUS</th>
                  <th>ACTION</th>
                </tr>
              </thead>

              <tbody>
                {filteredReports.map((report) => (
                  <tr key={report.id}>
                    <td>{report.id}</td>
                    <td className="patient-name">{report.patient}</td>
                    <td>{report.patientId}</td>
                    <td>{report.village}</td>
                    <td>{report.symptoms}</td>
                    <td>{report.date}</td>
                    <td>
                      <StatusBadge status={report.status} />
                    </td>
                    <td>
                      <button
                        className="text-button"
                        onClick={() => setSelectedReport(report)}
                      >
                        View details
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredReports.length === 0 && (
                  <EmptyRow
                    message="No reports found."
                    colSpan={8}
                  />
                )}
              </tbody>
            </table>
          </div>
        </section>
      </>
    );
  }

  /* =========================
     REFERRALS PAGE
  ========================= */

  function renderReferrals() {
    const filteredReferrals = referrals.filter((referral) =>
      `${referral.id} ${referral.patient} ${referral.patientId} ${referral.village} ${referral.reason}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

    return (
      <>
        <PageHeading
          title="Referrals"
          description="Track patient referrals and follow-up status."
        />

        <div className="stats-grid">
          <StatCard
            icon={<FileText size={19} />}
            label="Total Referrals"
            value={referrals.length}
          />

          <StatCard
            icon={<AlertCircle size={19} />}
            iconClass="pending-icon"
            label="Pending"
            value={pendingReferrals}
          />

          <StatCard
            icon={<CheckCircle2 size={19} />}
            iconClass="reviewed-icon"
            label="Reviewed"
            value={referrals.length - pendingReferrals}
          />
        </div>

        <section className="content-card">
          <div className="section-header">
            <h2>Referral Records</h2>

            <SearchBox
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search referrals..."
            />
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>REFERRAL ID</th>
                  <th>PATIENT</th>
                  <th>PATIENT ID</th>
                  <th>VILLAGE</th>
                  <th>REASON</th>
                  <th>DATE</th>
                  <th>STATUS</th>
                  <th>ACTION</th>
                </tr>
              </thead>

              <tbody>
                {filteredReferrals.map((referral) => (
                  <tr key={referral.id}>
                    <td>{referral.id}</td>
                    <td className="patient-name">{referral.patient}</td>
                    <td>{referral.patientId}</td>
                    <td>{referral.village}</td>
                    <td>{referral.reason}</td>
                    <td>{referral.date}</td>
                    <td>
                      <StatusBadge status={referral.status} />
                    </td>
                    <td>
                      {referral.status === "Pending" ? (
                        <button
                          className="text-button"
                          onClick={() =>
                            markReferralReviewed(referral.id)
                          }
                        >
                          Mark reviewed
                        </button>
                      ) : (
                        <span className="reviewed-message">
                          Reviewed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}

                {filteredReferrals.length === 0 && (
                  <EmptyRow
                    message="No referrals found."
                    colSpan={8}
                  />
                )}
              </tbody>
            </table>
          </div>
        </section>
      </>
    );
  }

  /* =========================
     COMMUNITY HEALTH UPDATES
  ========================= */

  function renderHealthUpdates() {
    return (
      <>
        <PageHeading
          title="Health Updates"
          description="Create and share health information with the community."
        />

        <section className="content-card">
          <div className="section-header">
            <div>
              <h2>
                <HeartPulse size={18} />
                Community Health Updates
              </h2>

              <p>
                Publish health awareness messages, reminders, and camp
                announcements for ASHA workers.
              </p>
            </div>

            <button
              className="primary-button"
              onClick={openAddUpdateForm}
            >
              <Plus size={17} />
              Add Health Update
            </button>
          </div>

          {showUpdateForm && (
            <form
              className="health-update-form"
              onSubmit={handlePublishUpdate}
            >
              <h3>
                {editingUpdateId
                  ? "Edit Health Update"
                  : "Create Health Update"}
              </h3>

              <div className="update-form-grid">
                <label>
                  Update Title

                  <input
                    type="text"
                    name="title"
                    value={updateForm.title}
                    onChange={handleUpdateFormChange}
                    placeholder="Enter update title"
                    required
                  />
                </label>

                <label>
                  Category

                  <select
                    name="category"
                    value={updateForm.category}
                    onChange={handleUpdateFormChange}
                  >
                    <option>Health Awareness</option>
                    <option>Vaccination</option>
                    <option>Maternal Health</option>
                    <option>Child Health</option>
                    <option>Nutrition</option>
                    <option>Health Camp</option>
                    <option>General Announcement</option>
                  </select>
                </label>

                <label>
                  Date

                  <input
                    type="date"
                    name="date"
                    value={updateForm.date}
                    onChange={handleUpdateFormChange}
                    required
                  />
                </label>

                <label>
                  Village

                  <select
                    name="village"
                    value={updateForm.village}
                    onChange={handleUpdateFormChange}
                  >
                    <option>All Villages</option>

                    {[...new Set(
                      initialPatients.map((patient) => patient.village)
                    )]
                      .sort()
                      .map((village) => (
                        <option key={village} value={village}>
                          {village}
                        </option>
                      ))}
                  </select>
                </label>

                <label className="update-description-field">
                  Description

                  <textarea
                    name="description"
                    value={updateForm.description}
                    onChange={handleUpdateFormChange}
                    placeholder="Write the health information or announcement..."
                    rows={4}
                    required
                  />
                </label>
              </div>

              <div className="update-form-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setShowUpdateForm(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="primary-button">
                  <Save size={16} />

                  {editingUpdateId
                    ? "Save Changes"
                    : "Publish Update"}
                </button>
              </div>
            </form>
          )}

          {healthUpdates.length === 0 ? (
            <div className="health-updates-empty">
              <div className="placeholder-icon">
                <Megaphone size={28} />
              </div>

              <h3>No health updates published yet</h3>

              <p>
                Add your first community health update to share important
                information with ASHA workers.
              </p>

              {!showUpdateForm && (
                <button
                  className="secondary-button"
                  onClick={openAddUpdateForm}
                >
                  <Plus size={16} />
                  Create First Update
                </button>
              )}
            </div>
          ) : (
            <div className="health-updates-list">
              {healthUpdates.map((update) => (
                <article
                  className="health-update-card"
                  key={update.id}
                >
                  <div className="health-update-card-top">
                    <span className="health-update-category">
                      <HeartPulse size={14} />
                      {update.category}
                    </span>

                    <span className="health-update-date">
                      {new Date(
                        `${update.date}T00:00:00`
                      ).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <h3>{update.title}</h3>

                  <p className="health-update-description">
                    {update.description}
                  </p>

                  <div className="health-update-card-bottom">
                    <span className="health-update-village">
                      <Users size={14} />
                      {update.village}
                    </span>

                    <div className="health-update-actions">
                      <button
                        className="text-button"
                        onClick={() => openEditUpdateForm(update)}
                      >
                        <Pencil size={14} />
                        Edit
                      </button>

                      <button
                        className="text-button delete-update-button"
                        onClick={() => deleteHealthUpdate(update.id)}
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </>
    );
  }

  /* =========================
     PAGE SWITCHER
  ========================= */

  function renderCurrentPage() {
    switch (activePage) {
      case "Patients":
        return renderPatients();

      case "Symptom Reports":
        return renderReports();

      case "Referrals":
        return renderReferrals();

      case "Health Updates":
        return renderHealthUpdates();

      default:
        return renderDashboard();
    }
  }

  /* =========================
     LOGIN CHECK
  ========================= */

  if (!isLoggedIn) {
    return renderLoginPage();
  }

  /* =========================
     APP LAYOUT
  ========================= */

  return (
    <div className="app">
      <aside
        className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}
      >
        <div className="sidebar-brand">
          <div className="brand-icon">
            <Stethoscope size={22} />
          </div>

          <div>
            <h2>ASHA Sahay</h2>

            <p>
              {activeRole === "doctor"
                ? "Doctor Portal"
                : "Community Health Portal"}
            </p>
          </div>

          <button
            className="sidebar-close"
            aria-label="Close sidebar"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <p className="nav-label">MAIN MENU</p>

          {navigation.map(({ name, icon: Icon }) => (
            <button
              key={name}
              className={`nav-item ${
                activePage === name ? "active" : ""
              }`}
              onClick={() => navigateTo(name)}
            >
              <Icon size={18} />
              <span>{name}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="doctor-avatar">
            {getUserInitials(currentUser?.name)}
          </div>

          <div>
            <strong>{currentUser?.name || "User"}</strong>
            <span>{roleDescription}</span>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="main-content">
        <header className="topbar">
          <div className="topbar-title">
            <button
              className="menu-button"
              aria-label="Open sidebar"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>

            <strong>{activePage}</strong>

            <span className="topbar-divider">/</span>

            <span>ASHA Sahay</span>
          </div>

          <div className="topbar-right">
            <div className="demo-badge">
              <span>●</span> {roleTitle}
            </div>

            <button
              className="logout-button"
              onClick={handleLogout}
              title="Log out"
            >
              <LogOut size={15} />
              Log out
            </button>

            <button
              className="icon-button"
              aria-label="Notifications"
            >
              <Bell size={18} />
            </button>
          </div>
        </header>

        <div className="page-content">
          {renderCurrentPage()}
        </div>

        <footer className="app-footer">
          <span>
            {activeRole === "doctor"
              ? "ASHA Sahay Doctor Portal"
              : "ASHA Sahay Community Health Portal"}
          </span>

          <span>Supporting community healthcare</span>
        </footer>
      </main>

      {/* REPORT DETAILS MODAL */}

      {selectedReport && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedReport(null)}
        >
          <div
            className="modal-card"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <span className="dashboard-eyebrow">
                  SYMPTOM REPORT
                </span>

                <h2>{selectedReport.id}</h2>
              </div>

              <button
                className="icon-button"
                aria-label="Close report"
                onClick={() => setSelectedReport(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <p>
                <strong>Patient:</strong> {selectedReport.patient}
              </p>

              <p>
                <strong>Patient ID:</strong> {selectedReport.patientId}
              </p>

              <p>
                <strong>Village:</strong> {selectedReport.village}
              </p>

              <p>
                <strong>Symptoms:</strong> {selectedReport.symptoms}
              </p>

              <p>
                <strong>Date:</strong> {selectedReport.date}
              </p>

              <p>
                <strong>Status:</strong> {selectedReport.status}
              </p>
            </div>

            <div className="modal-footer">
              <button
                className="secondary-button"
                onClick={() => setSelectedReport(null)}
              >
                Close
              </button>

              {selectedReport.status === "Pending" && (
                <button
                  className="primary-button"
                  onClick={() =>
                    markReportReviewed(selectedReport.id)
                  }
                >
                  Mark as reviewed
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================
   REUSABLE COMPONENTS
========================= */

function StatCard({
  icon,
  iconClass = "",
  label,
  value,
  caption,
}) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${iconClass}`}>
        {icon}
      </div>

      <p>{label}</p>

      <h2>{value}</h2>

      {caption && (
        <span className="stat-caption">{caption}</span>
      )}
    </div>
  );
}

function PageHeading({ title, description }) {
  return (
    <div className="page-heading">
      <div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </div>
  );
}

function SearchBox({ value, onChange, placeholder }) {
  return (
    <label className="search-box">
      <Search size={16} />

      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}

function StatusBadge({ status }) {
  const className =
    status === "Pending"
      ? "status-pending"
      : status === "Reviewed" || status === "Active"
      ? "status-reviewed"
      : "";

  return (
    <span className={`status-badge ${className}`}>
      {status}
    </span>
  );
}

function QuickAction({
  icon,
  title,
  description,
  onClick,
}) {
  return (
    <button className="quick-action" onClick={onClick}>
      {icon}

      <span>
        <strong>{title}</strong>
        <small>{description}</small>
      </span>

      <ChevronRight size={16} />
    </button>
  );
}

function EmptyRow({ message, colSpan }) {
  return (
    <tr>
      <td colSpan={colSpan} className="empty-state">
        {message}
      </td>
    </tr>
  );
}

export default App;