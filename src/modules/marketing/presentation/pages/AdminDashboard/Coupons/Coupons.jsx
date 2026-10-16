import React, { useMemo, useState } from "react";
import "./Coupons.css";
import {
  Calendar, CheckCircle2, Eye, Filter, Plus,
  Search, SearchX, Tag, Users, X
} from "lucide-react";
import { Badge, getStatusTone } from "../common/Badge";
import { Metric } from "../common/Metric";
import { DetailField, InlineDetailView } from "../common/DetailSection";

export function Coupons({
  coupons,
  setCoupons,
  setNotice
}) {
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showCreate, setShowCreate] = useState(false);

  // Form state
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState("15%");
  const [validUntil, setValidUntil] = useState("31 Dec 2026");
  const [maxUsage, setMaxUsage] = useState("500");
  const [description, setDescription] = useState("");

  const filtered = useMemo(() => {
    return coupons.filter(c => {
      const matchSearch = `${c.code} ${c.description || ""}`
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchStatus = statusFilter === "All" || c.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [coupons, search, statusFilter]);

  const activeCount = coupons.filter(c => c.status === "Active").length;
  const totalUses = coupons.reduce((acc, c) => acc + (c.usageCount || 0), 0);

  function handleCreate(e) {
    e.preventDefault();
    if (!code.trim()) return;

    const newCoupon = {
      id: `cpn-${Date.now()}`,
      code: code.trim().toUpperCase(),
      discount,
      discountType: discount.includes("%") ? "Percentage" : "Fixed Amount",
      validUntil,
      usageCount: 0,
      maxUsage: Number(maxUsage) || 500,
      status: "Active",
      description: description.trim() || "Promotional coupon code"
    };

    setCoupons(prev => [newCoupon, ...prev]);
    setSelectedCoupon(newCoupon);
    setShowCreate(false);
    setNotice(`Coupon ${newCoupon.code} created and activated.`);
    setCode("");
    setDescription("");
  }

  function handleToggleStatus(id) {
    setCoupons(prev =>
      prev.map(c => {
        if (c.id === id) {
          const next = c.status === "Active" ? "Expired" : "Active";
          const updated = { ...c, status: next };
          if (selectedCoupon && selectedCoupon.id === id) {
            setSelectedCoupon(updated);
          }
          return updated;
        }
        return c;
      })
    );
    setNotice("Coupon status updated.");
  }

  function handleExtend(id) {
    setCoupons(prev =>
      prev.map(c => {
        if (c.id === id) {
          const updated = { ...c, validUntil: "31 Jan 2027", status: "Active" };
          if (selectedCoupon && selectedCoupon.id === id) {
            setSelectedCoupon(updated);
          }
          return updated;
        }
        return c;
      })
    );
    setNotice(`Coupon validity extended to 31 Jan 2027.`);
  }

  return (
    <>
      <div className="metrics-grid four">
        <Metric label="ACTIVE COUPONS" value={String(14 + activeCount - 3)} foot="Platform promotions" icon={Tag} />
        <Metric label="REDEMPTIONS" value={(1284 + totalUses).toLocaleString("en-IN")} foot="Applied at checkout" icon={Users} />
        <Metric label="EXPIRING SOON" value="3" foot="Review validity" icon={Calendar} tone="warning" />
        <Metric label="DISCOUNT TYPES" value="Fixed & %" foot="Course & subscription" icon={CheckCircle2} />
      </div>

      {showCreate && (
        <form className="card onboard-form inline-form" onSubmit={handleCreate}>
          <div className="form-head">
            <div>
              <h2>Create Promotional Coupon</h2>
              <p>Configure percentage or fixed discount, redemption limits, and validity.</p>
            </div>
            <button type="button" className="icon-button" onClick={() => setShowCreate(false)} aria-label="Close">
              <X size={18} />
            </button>
          </div>

          <div className="form-grid">
            <label>
              Coupon Code *
              <input
                value={code}
                onChange={e => setCode(e.target.value.toUpperCase())}
                required
                placeholder="e.g. FESTIVE20"
              />
            </label>
            <label>
              Discount Value *
              <input
                value={discount}
                onChange={e => setDiscount(e.target.value)}
                required
                placeholder="e.g. 20% or ₹1,000 OFF"
              />
            </label>
            <label>
              Valid Until *
              <input
                value={validUntil}
                onChange={e => setValidUntil(e.target.value)}
                required
                placeholder="e.g. 31 Dec 2026"
              />
            </label>
            <label>
              Max Usage Limit
              <input
                type="number"
                value={maxUsage}
                onChange={e => setMaxUsage(e.target.value)}
                min="1"
              />
            </label>
            <label>
              Description / Terms
              <input
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="e.g. Special student holiday discount"
              />
            </label>
          </div>

          <div className="form-actions">
            <button className="primary" type="submit">
              <CheckCircle2 size={16} /> Save & Activate Coupon
            </button>
            <button type="button" className="secondary" onClick={() => setShowCreate(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {selectedCoupon ? (
        <InlineDetailView
          title={`Coupon: ${selectedCoupon.code}`}
          subtitle={`Discount: ${selectedCoupon.discount} · Valid until ${selectedCoupon.validUntil}`}
          status={selectedCoupon.status}
          id={selectedCoupon.id}
          onBack={() => setSelectedCoupon(null)}
          actions={
            <>
              <button
                className="secondary btn-sm"
                onClick={() => handleToggleStatus(selectedCoupon.id)}
              >
                {selectedCoupon.status === "Active" ? "Deactivate Coupon" : "Activate Coupon"}
              </button>
              <button
                className="primary btn-sm"
                onClick={() => handleExtend(selectedCoupon.id)}
              >
                Extend +30 Days
              </button>
            </>
          }
        >
          <div className="detail-grid">
            <div className="detail-col">
              <h3>Coupon Parameters</h3>
              <div className="detail-fields-list">
                <DetailField label="Promotional Code" value={selectedCoupon.code} mono />
                <DetailField label="Discount Value" value={selectedCoupon.discount} />
                <DetailField label="Discount Type" value={selectedCoupon.discountType} />
                <DetailField label="Expiration Date" value={selectedCoupon.validUntil} />
                <DetailField label="Status">
                  <Badge tone={getStatusTone(selectedCoupon.status)}>{selectedCoupon.status}</Badge>
                </DetailField>
              </div>
            </div>

            <div className="detail-col">
              <h3>Usage Statistics</h3>
              <div className="detail-fields-list">
                <DetailField label="Total Redemptions" value={`${selectedCoupon.usageCount} times`} />
                <DetailField label="Max Permitted Uses" value={`${selectedCoupon.maxUsage} redemptions`} />
                <DetailField label="Quota Consumed">
                  <div className="progress-inline">
                    <div className="progress">
                      <i style={{ width: `${Math.min(100, (selectedCoupon.usageCount / selectedCoupon.maxUsage) * 100)}%` }} />
                    </div>
                    <span>{Math.round((selectedCoupon.usageCount / selectedCoupon.maxUsage) * 100)}%</span>
                  </div>
                </DetailField>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>Terms of Promotion</h3>
            <p className="detail-prose">{selectedCoupon.description}</p>
          </div>
        </InlineDetailView>
      ) : (
        <section className="card">
          <div className="table-heading">
            <div className="heading-left">
              <h2>Discount Coupons & Promotions</h2>
              <Badge>{filtered.length} shown</Badge>
            </div>
            <button className="primary btn-sm" onClick={() => setShowCreate(true)}>
              <Plus size={15} /> Create Coupon
            </button>
          </div>

          <div className="filter-toolbar">
            <div className="search-field">
              <Search size={16} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search coupon code or description..."
              />
              {search && (
                <button className="clear-btn" onClick={() => setSearch("")}>
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="filter-group">
              <label>Status:</label>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Expired">Expired</option>
              </select>
            </div>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Discount</th>
                  <th>Valid Until</th>
                  <th>Redemptions</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr
                    key={c.id}
                    className="hoverable-row"
                    onClick={() => setSelectedCoupon(c)}
                  >
                    <td className="font-mono"><strong>{c.code}</strong></td>
                    <td><Badge tone="blue">{c.discount}</Badge></td>
                    <td><small>{c.validUntil}</small></td>
                    <td>{c.usageCount} / {c.maxUsage}</td>
                    <td><Badge tone={getStatusTone(c.status)}>{c.status}</Badge></td>
                    <td>
                      <button
                        className="secondary btn-sm"
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedCoupon(c);
                        }}
                      >
                        <Eye size={13} /> Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="empty">
              <SearchX size={28} />
              <p>No coupons found matching your criteria.</p>
            </div>
          )}
        </section>
      )}
    </>
  );
}
