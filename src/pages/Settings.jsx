export default function Settings() {
  return (
    <div className="container py-5 text-white">

      <h1 className="mb-4">
        Settings
      </h1>

      <div className="glass-card p-4 rounded-4">

        <div className="mb-4">
          <h5>Appearance</h5>

          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
            />
            <label className="form-check-label">
              Dark Mode
            </label>
          </div>
        </div>

        <div className="mb-4">
          <h5>Notifications</h5>

          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
            />
            <label className="form-check-label">
              Email Notifications
            </label>
          </div>
        </div>

        <div className="mb-4">
          <h5>Security</h5>

          <button className="btn btn-outline-info">
            Change Password
          </button>
        </div>

      </div>
    </div>
  )
}