// src/pages/ProfileSettings.jsx
import { useEffect, useRef, useState } from "react";
import { useProfile } from "../context/ProfileContext.jsx";

const MAX_BYTES = 2 * 1024 * 1024; // 2 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export default function ProfileSettings() {
  const { profile, setProfile } = useProfile();

  const normalized = {
    studentId: profile.studentId || "",
    name: profile.name || "",
    username: profile.username || "",
    password: profile.password || "",
    yearLevel: profile.yearLevel || "",
    email: profile.email || "",
    organization: "CCS", // fixed value, no dropdown
    faculty: profile.faculty || "College of Computer Studies",
    position: profile.position || "Officer",
    avatar: profile.avatar || "",
  };

  const [form, setForm] = useState(normalized);
  const [preview, setPreview] = useState(normalized.avatar);
  const [error, setError] = useState("");
  const fileRef = useRef(null);

  useEffect(() => {
    const next = {
      ...normalized,
      ...profile,
      organization: "CCS", // keep fixed
    };
    setForm(next);
    setPreview(next.avatar);
    setError("");
    if (fileRef.current) fileRef.current.value = "";
  }, [profile]);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function onPickFile(e) {
    setError("");
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Please upload a JPG, PNG, WEBP, or GIF image.");
      if (fileRef.current) fileRef.current.value = "";
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("Image is too large. Max size is 2 MB.");
      if (fileRef.current) fileRef.current.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setPreview(String(reader.result));
    reader.readAsDataURL(file);
  }

  function onRemovePhoto() {
    setPreview("");
    setError("");
    if (fileRef.current) fileRef.current.value = "";
  }

  function onSave() {
    if (error) return;
    setProfile({
      ...profile,
      studentId: form.studentId,
      name: form.name,
      username: form.username,
      password: form.password,
      yearLevel: form.yearLevel,
      email: form.email,
      organization: "CCS", // locked value
      faculty: form.faculty,
      position: "Officer",
      avatar: preview,
    });
    alert("Profile saved!");
  }

  function onCancel() {
    setForm({ ...profile, organization: "CCS" });
    setPreview(profile.avatar || "");
    setError("");
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div className="card">
      <h2 className="section-title">Edit Profile</h2>
      <div className="divider" />

      <div className="form-grid">
        <label>Student ID</label>
        <input
          name="studentId"
          value={form.studentId}
          onChange={onChange}
          placeholder="Enter student ID"
        />

        <label>Full Name</label>
        <input
          name="name"
          value={form.name}
          onChange={onChange}
          placeholder="Enter full name"
        />

        <label>Username</label>
        <input
          name="username"
          value={form.username}
          onChange={onChange}
          placeholder="Enter username"
        />

        <label>Password</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={onChange}
          placeholder="Enter password"
        />

        <label>Year Level</label>
        <select name="yearLevel" value={form.yearLevel} onChange={onChange}>
          <option value="">Select year level</option>
          <option>1st Year</option>
          <option>2nd Year</option>
          <option>3rd Year</option>
          <option>4th Year</option>
        </select>

        <label>Email</label>
        <input
          name="email"
          value={form.email}
          onChange={onChange}
          placeholder="Enter email"
        />

        <label>Organization</label>
        <input
          name="organization"
          value="CCS"
          disabled
          readOnly
        />

        <label>Faculty</label>
        <input
          name="faculty"
          value={form.faculty}
          disabled
          readOnly
        />

        <label>Role</label>
        <input value="Officer" disabled readOnly />

        <label>Profile Photo</label>
        <div className="upload-col">
          <div className="upload-row">
            <input
              ref={fileRef}
              type="file"
              accept={ALLOWED_TYPES.join(",")}
              onChange={onPickFile}
            />
            {preview && <img src={preview} alt="Preview" className="avatar-preview" />}
          </div>

          <div className="help">Allowed: JPG, PNG, WEBP, GIF — up to 2 MB.</div>
          {error && <div className="error">{error}</div>}

          <div className="upload-actions">
            <button className="btn pill" onClick={onRemovePhoto} disabled={!preview}>
              Remove Photo
            </button>
          </div>
        </div>
      </div>

      <div className="actions">
        <button className="btn pill" onClick={onSave} disabled={Boolean(error)}>
          Save Changes
        </button>
        <button className="btn pill" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}
