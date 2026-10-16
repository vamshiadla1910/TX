import React, { useMemo, useState } from "react";
import "./Payments.css";
import {
  ArrowDownLeft, ArrowUpRight, CheckCircle2, Download,
  Eye, Filter, RefreshCw, Search, SearchX, Wallet, X, XCircle
} from "lucide-react";
import { Badge, getStatusTone } from "../common/Badge";
import { Metric } from "../common/Metric";
import { DetailField, InlineDetailView } from "../common/DetailSection";

export function Payments({
  payments,
  setPayments,
  setNotice
}) {
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  const filtered = useMemo(() => {
    return payments.filter(p => {
      const matchSearch = `${p.txnId} ${p.customer} ${p.invoiceId} ${p.gateway}`
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchStatus = statusFilter === "All" || p.status === statusFilter;
      const matchType = typeFilter === "All" || p.type.toLowerCase().includes(typeFilter.toLowerCase());
      return matchSearch && matchStatus && matchType;
    });
  }, [payments, search, statusFilter, typeFilter]);

  function handleRefund(txnId) {
    setPayments(prev =>
      prev.map(p => {
        if (p.id === txnId) {
          const updated = {
            ...p,
            status: "Refunded",
            settlementStatus: "Refund Processed"
          };
          if (selectedTxn && selectedTxn.id === txnId) {
            setSelectedTxn(updated);
          }
          return updated;
        }
        return p;
      })
    );
    setNotice(`Full refund processed for transaction ${selectedTxn?.txnId || txnId}. Gateway reversed.`);
  }

  function handleReconcile(txnId) {
    setPayments(prev =>
      prev.map(p => {
        if (p.id === txnId) {
          const updated = { ...p, settlementStatus: "Settled & Reconciled" };
          if (selectedTxn && selectedTxn.id === txnId) {
            setSelectedTxn(updated);
          }
          return updated;
        }
        return p;
      })
    );
    setNotice(`Transaction ${selectedTxn?.txnId} reconciled with bank settlement batch.`);
  }

  function handleDownloadInvoice(txn) {
    const csvContent = "data:text/csv;charset=utf-8," +
      `Transaction ID,Customer,Type,Amount,Platform Fee,Payout,Gateway,Date,Status,Invoice ID\n` +
      `"${txn.txnId}","${txn.customer}","${txn.type}","${txn.amount}","${txn.platformFee}","${txn.payoutAmount}","${txn.gateway}","${txn.date}","${txn.status}","${txn.invoiceId}"\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${txn.invoiceId}_receipt.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setNotice(`Receipt downloaded for ${txn.invoiceId}.`);
  }

  function handleRunReconciliation() {
    setPayments(prev =>
      prev.map(p => ({
        ...p,
        settlementStatus: "Settled & Reconciled"
      }))
    );
    setNotice("Platform reconciliation complete. All 5 payment gateway settlement batches reconciled.");
  }

  return (
    <>
      <div className="metrics-grid four">
        <Metric label="PLATFORM GMV" value="₹1.42Cr" foot="▲ 8.4% monthly" icon={Wallet} />
        <Metric label="PLATFORM REVENUE" value="₹41.6L" foot="29.3% blended take" icon={ArrowUpRight} />
        <Metric label="INSTRUCTOR PAYOUTS" value="₹1.01Cr" foot="Disbursed this cycle" icon={ArrowDownLeft} />
        <Metric label="SETTLEMENT HEALTH" value="100% OK" foot="0 webhook exceptions" icon={CheckCircle2} />
      </div>

      {selectedTxn ? (
        <InlineDetailView
          title={`Transaction: ${selectedTxn.txnId}`}
          subtitle={`${selectedTxn.type} · Customer: ${selectedTxn.customer}`}
          status={selectedTxn.status}
          id={selectedTxn.id}
          onBack={() => setSelectedTxn(null)}
          actions={
            <>
              {selectedTxn.status === "Successful" && (
                <button
                  className="secondary btn-sm btn-danger"
                  onClick={() => handleRefund(selectedTxn.id)}
                >
                  <XCircle size={14} /> Process Full Refund
                </button>
              )}
              {selectedTxn.settlementStatus !== "Settled & Reconciled" && (
                <button
                  className="secondary btn-sm"
                  onClick={() => handleReconcile(selectedTxn.id)}
                >
                  <CheckCircle2 size={14} /> Mark Reconciled
                </button>
              )}
              <button
                className="primary btn-sm"
                onClick={() => handleDownloadInvoice(selectedTxn)}
              >
                <Download size={14} /> Download Receipt CSV
              </button>
            </>
          }
        >
          <div className="detail-grid">
            <div className="detail-col">
              <h3>Transaction Breakdown</h3>
              <div className="detail-fields-list">
                <DetailField label="Transaction Reference" value={selectedTxn.txnId} mono />
                <DetailField label="Customer / Account" value={selectedTxn.customer} />
                <DetailField label="Transaction Category" value={selectedTxn.type} />
                <DetailField label="Invoice Number" value={selectedTxn.invoiceId} mono />
                <DetailField label="Payment Gateway" value={selectedTxn.gateway} />
                <DetailField label="Timestamp" value={selectedTxn.date} />
              </div>
            </div>

            <div className="detail-col">
              <h3>Financial Settlement & Split</h3>
              <div className="detail-fields-list">
                <DetailField label="Gross Amount" value={selectedTxn.amount}>
                  <strong className="text-large">{selectedTxn.amount}</strong>
                </DetailField>
                <DetailField label="Platform Revenue Cut" value={selectedTxn.platformFee} />
                <DetailField label="Net Disbursed Payout" value={selectedTxn.payoutAmount} />
                <DetailField label="Settlement Status">
                  <Badge tone={selectedTxn.settlementStatus?.includes("Settled") ? "success" : "warning"}>
                    {selectedTxn.settlementStatus}
                  </Badge>
                </DetailField>
                <DetailField label="Payment Status">
                  <Badge tone={getStatusTone(selectedTxn.status)}>{selectedTxn.status}</Badge>
                </DetailField>
              </div>
            </div>
          </div>
        </InlineDetailView>
      ) : (
        <section className="card">
          <div className="table-heading">
            <div className="heading-left">
              <h2>Payment Collections & Payout Batches</h2>
              <Badge>{filtered.length} transactions</Badge>
            </div>
            <button className="secondary btn-sm" onClick={handleRunReconciliation}>
              <RefreshCw size={14} /> Run Platform Reconciliation
            </button>
          </div>

          <div className="filter-toolbar">
            <div className="search-field">
              <Search size={16} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search transaction ID, customer, invoice..."
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
                <option value="Successful">Successful</option>
                <option value="Refunded">Refunded</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Type:</label>
              <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
                <option value="All">All Categories</option>
                <option value="Subscription">Tenant Subscription</option>
                <option value="Licensing">Course Licensing</option>
                <option value="Course Purchase">Individual Purchase</option>
                <option value="Refund">Refund</option>
              </select>
            </div>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Txn ID</th>
                  <th>Customer</th>
                  <th>Type</th>
                  <th>Gross Amount</th>
                  <th>Platform Cut</th>
                  <th>Payout</th>
                  <th>Gateway</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr
                    key={p.id}
                    className="hoverable-row"
                    onClick={() => setSelectedTxn(p)}
                  >
                    <td className="font-mono">{p.txnId}</td>
                    <td><strong>{p.customer}</strong></td>
                    <td>{p.type}</td>
                    <td><strong>{p.amount}</strong></td>
                    <td>{p.platformFee}</td>
                    <td>{p.payoutAmount}</td>
                    <td>{p.gateway}</td>
                    <td><small>{p.date}</small></td>
                    <td><Badge tone={getStatusTone(p.status)}>{p.status}</Badge></td>
                    <td>
                      <button
                        className="secondary btn-sm"
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedTxn(p);
                        }}
                      >
                        <Eye size={13} /> Details
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
              <p>No transactions match your search filter.</p>
            </div>
          )}
        </section>
      )}
    </>
  );
}
