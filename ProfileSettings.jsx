import { useEffect, useRef, useState } from "react";
import { useProfile } from "../context/ProfileContext.jsx";

const MAX_BYTES = 2 * 1024 * 1024; // 2 MB limit
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export default function ProfileSettings() {
  const { profile, setProfile } = useProfile();
  const [form, setForm] = useState(profile);
  const [preview, setPreview] = useState(profile.avatar || "");
  const [error, setError] = useState("");
  const fileRef = useRef(null);

  useEffect(() => {
    setForm(profile);
    setPreview(profile.avatar || "");
  }, [profile]);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function onPickFile(e) {
    setError("");
    const file = e.target.files?.[0];
    if (!file) return;

    // Type check
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Please upload a JPG, PNG, WEBP, or GIF image.");
      // clear input so user can re-pick
      if (fileRef.current) fileRef.current.value = "";
      return;
    }

    // Size check
    if (file.size > MAX_BYTES) {
      setError("Image is too large. Max size is 2 MB.");
      if (fileRef.current) fileRef.current.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setPreview(String(reader.result)); // data URL
    reader.readAsDataURL(file);
  }

  function onRemovePhoto() {
    setPreview("");
    setError("");
    if (fileRef.current) fileRef.current.value = "";
  }

  function onSave() {
    if (error) return; // do not save if invalid
    setProfile({ ...form, avatar: preview });
    alert("Profile saved!");
  }

  function onCancel() {
    setForm(profile);
    setPreview(profile.avatar || "");
    setError("");
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div className="card">
      <h2 className="section-title">Edit Profile</h2>
      <div className="divider" />

      <div className="form-grid">
        <label>Full Name :</label>
        <input name="name" value={form.name || ""} onChange={onChange} placeholder="Enter full name" />

        <label>Email :</label>
        <input name="email" value={form.email || ""} onChange={onChange} placeholder="Enter email" />

        <label>Password :</label>
        <input type="password" name="password" value={form.password || ""} onChange={onChange} placeholder="Enter password" />

        <label>Organization (Drop down button)</label>
        <select name="organization" value={form.organization || ""} onChange={onChange}>
          <option>CCS</option>
          <option>COE</option>
          <option>CHS</option>
          <option>COL</option>
          <option>CAS</option>
          <option>CCJ</option>
          <option>CBA</option>
        </select>

        <label>Role (Drop down button)</label>
        <select name="position" value={form.position || ""} onChange={onChange}>
          <option>Officer</option>
          <option>Member</option>
          <option>Admin</option>
        </select>

        {/* Attachment / Photo upload */}
        <label>Profile Photo (Attachment)</label>
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

          <div className="help">
            Allowed: JPG, PNG, WEBP, GIF — up to 2 MB.
          </div>

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
        <button className="btn pill" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}
