import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

const API = "http://localhost:8080/api";

const emptyForm = {
  name: "",
  description: "",
  latitude: "",
  longitude: "",
  intensity: "",
  date: "",
  precautions: "",
  riskGroup: "",
  reportedBy: ""
};

export default function AdminCrimes() {
  const [crimes, setCrimes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editRow, setEditRow] = useState(emptyForm);
  const [error, setError] = useState("");

  const headers = useMemo(
    () => [
      "id",
      "name",
      "description",
      "latitude",
      "longitude",
      "intensity",
      "date",
      "precautions",
      "riskGroup",
      "reportedBy"
    ],
    []
  );


  const riskGroups = [
    "Women",
    "Children",
    "Students",
    "Travelers",
    "Elderly",
    "General Public",
  ];


  // Load all crimes
  const loadCrimes = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.get(`${API}/crimes`);
      setCrimes(data || []);
    } catch (e) {
      setError(e?.response?.data || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCrimes();
  }, []);

  const onChange = (e, setter = setForm) => {
    const { name, value } = e.target;
    setter((s) => ({ ...s, [name]: value }));
  };

  const validateRow = (row) => {
    if (!row.name?.trim()) return "Name is required";
    if (!row.description?.trim()) return "Description is required";
    if (!row.date) return "Date is required";
    if (!row.riskGroup?.trim()) return "Risk group is required";
    if (!row.reportedBy?.trim()) return "Reported By is required";

    const lat = Number(row.latitude);
    const lng = Number(row.longitude);
    const inty = parseInt(row.intensity, 10);

    if (Number.isNaN(lat) || lat < -90 || lat > 90)
      return "Latitude must be between -90 and 90";
    if (Number.isNaN(lng) || lng < -180 || lng > 180)
      return "Longitude must be between -180 and 180";
    if (Number.isNaN(inty) || inty < 0)
      return "Intensity must be a non-negative integer";

    return null;
  };

  const addCrime = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const msg = validateRow(form);
    if (msg) {
      setSaving(false);
      setError(msg);
      return;
    }

    try {
      const payload = {
        ...form,
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
        intensity: parseInt(form.intensity, 10)
      };
      await axios.post(`${API}/crimes/add`, payload);
      setForm(emptyForm);
      await loadCrimes();
    } catch (e) {
      setError(e?.response?.data || e.message);
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (row) => {
    setEditingId(row.id);
    setEditRow({
      ...row,
      latitude: String(row.latitude),
      longitude: String(row.longitude),
      intensity: String(row.intensity)
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditRow(emptyForm);
  };

  const saveEdit = async (id) => {
    const msg = validateRow(editRow);
    if (msg) {
      setError(msg);
      return;
    }
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...editRow,
        latitude: Number(editRow.latitude),
        longitude: Number(editRow.longitude),
        intensity: parseInt(editRow.intensity, 10)
      };
      await axios.put(`${API}/crimes/${id}`, payload);
      setEditingId(null);
      setEditRow(emptyForm);
      await loadCrimes();
    } catch (e) {
      setError(e?.response?.data || e.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteCrime = async (id) => {
    if (!window.confirm("Delete this crime record?")) return;
    setError("");
    try {
      await axios.delete(`${API}/crimes/${id}`);
      await loadCrimes();
    } catch (e) {
      setError(e?.response?.data || e.message);
    }
  };

  const uploadCsv = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please choose a CSV file first.");
      return;
    }
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      await axios.post(`${API}/crimes/upload-csv`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setFile(null);
      e.target.reset?.();
      await loadCrimes();
    } catch (err) {
      setError(err?.response?.data || err.message);
    } finally {
      setUploading(false);
    }
  };

  const downloadCsv = async () => {
    try {
      const res = await axios.get(`${API}/crimes/download-csv`, {
        responseType: "blob"
      });
      const blobUrl = window.URL.createObjectURL(
        new Blob([res.data], { type: "text/csv" })
      );
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = "crimes_export.csv";
      a.click();
      window.URL.revokeObjectURL(blobUrl);
    } catch (e) {
      setError(e?.response?.data || e.message);
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h3 className="m-0">Admin • Crime Data</h3>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-primary" onClick={loadCrimes} disabled={loading}>
            {loading ? "Refreshing..." : "Refresh"}
          </button>
          <button className="btn btn-success" onClick={downloadCsv}>
            Export CSV
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger d-flex justify-content-between align-items-center" role="alert">
          <span>{error}</span>
          <button type="button" className="btn-close" onClick={() => setError("")} />
        </div>
      )}

      {/* Add new crime */}
      <div className="card mb-4">
        <div className="card-header">Add Crime</div>
        <div className="card-body">
          <form className="row g-3" onSubmit={addCrime}>
            <div className="col-md-4">
              <label className="form-label">Name</label>
              <input className="form-control" name="name" value={form.name} onChange={onChange} />
            </div>
            <div className="col-md-8">
              <label className="form-label">Description</label>
              <input className="form-control" name="description" value={form.description} onChange={onChange} />
            </div>
            <div className="col-md-4">
              <label className="form-label">Latitude</label>
              <input className="form-control" name="latitude" value={form.latitude} onChange={onChange} />
            </div>
            <div className="col-md-4">
              <label className="form-label">Longitude</label>
              <input className="form-control" name="longitude" value={form.longitude} onChange={onChange} />
            </div>
            <div className="col-md-4">
              <label className="form-label">Intensity</label>
              <input className="form-control" name="intensity" value={form.intensity} onChange={onChange} />
            </div>
            <div className="col-md-4">
              <label className="form-label">Date</label>
              <input type="datetime-local" className="form-control" name="date" value={form.date} onChange={onChange} />
            </div>
            <div className="col-md-4">
              <label className="form-label">Risk Group</label>
              <select className="form-select" name="riskGroup" value={form.riskGroup} onChange={onChange} required>
              <option value="">Select Risk Group</option>
              {riskGroups.map((group) => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
            </div>
            <div className="col-md-4">
              <label className="form-label">Reported By</label>
              <input className="form-control" name="reportedBy" value={form.reportedBy} onChange={onChange} />
            </div>
            <div className="col-12">
              <label className="form-label">Precautions</label>
              <textarea className="form-control" name="precautions" rows="2" value={form.precautions} onChange={onChange}></textarea>
            </div>
            <div className="col-12">
              <button className="btn btn-primary" type="submit" disabled={saving}>
                {saving ? "Saving..." : "Add"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Bulk Upload */}
      <div className="card mb-4">
        <div className="card-header">Bulk Upload (CSV)</div>
        <div className="card-body">
          <form className="row g-3" onSubmit={uploadCsv}>
            <div className="col-md-8">
              <input
                className="form-control"
                type="file"
                accept=".csv"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <div className="form-text">
                CSV headers must be: <code>name,description,latitude,longitude,intensity,date,precautions,riskGroup,reportedBy</code>
              </div>
            </div>
            <div className="col-md-4">
              <button className="btn btn-warning w-100" type="submit" disabled={uploading}>
                {uploading ? "Uploading..." : "Upload CSV"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Crime Table */}
      <div className="card">
        <div className="card-header">All Crimes</div>
        <div className="table-responsive">
          <table className="table table-striped table-hover m-0">
            <thead className="table-light">
              <tr>
                {headers.map((h) => (
                  <th key={h} className="text-capitalize">{h}</th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {crimes.length === 0 && (
                <tr>
                  <td colSpan={headers.length + 1} className="text-center py-4">
                    {loading ? "Loading..." : "No data"}
                  </td>
                </tr>
              )}
              {crimes.map((row) => (
                <tr key={row.id}>
                  {headers.map((h) => (
                    <td key={h}>
                      {editingId === row.id ? (
                        <input
                          className="form-control form-control-sm"
                          name={h}
                          value={editRow[h] || ""}
                          onChange={(e) => onChange(e, setEditRow)}
                        />
                      ) : (
                        row[h]
                      )}
                    </td>
                  ))}
                  <td className="d-flex gap-2">
                    {editingId === row.id ? (
                      <>
                        <button className="btn btn-sm btn-success" onClick={() => saveEdit(row.id)}>
                          Save
                        </button>
                        <button className="btn btn-sm btn-secondary" onClick={cancelEdit}>
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="btn btn-sm btn-primary" onClick={() => startEdit(row)}>
                          Edit
                        </button>
                        <button className="btn btn-sm btn-danger" onClick={() => deleteCrime(row.id)}>
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
