"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  Phone,
  Mail,
  Calendar,
  Loader2,
  FileCheck,
} from "lucide-react";
import { AdmissionEnquiry, EnquiryStatus } from "@/lib/db/types";

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<AdmissionEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedEnquiry, setSelectedEnquiry] = useState<AdmissionEnquiry | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [staffNote, setStaffNote] = useState("");

  useEffect(() => {
    let ignore = false;
    async function loadData() {
      try {
        const res = await fetch("/api/admin/enquiries");
        const data = await res.json();
        if (!ignore && data.success) {
          setEnquiries(data.enquiries);
        }
      } catch {
        // Error handling
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    loadData();
    return () => {
      ignore = true;
    };
  }, []);

  const handleUpdateStatus = async (
    enquiryId: string,
    newStatus: EnquiryStatus,
    note?: string
  ) => {
    try {
      setUpdatingStatus(true);
      const res = await fetch("/api/admin/enquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: enquiryId,
          status: newStatus,
          notes: note,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setEnquiries((prev) =>
          prev.map((e) => (e.id === enquiryId ? data.enquiry : e))
        );
        if (selectedEnquiry && selectedEnquiry.id === enquiryId) {
          setSelectedEnquiry(data.enquiry);
        }
      }
    } catch {
      alert("Failed to update enquiry status.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const filteredEnquiries = enquiries.filter((e) => {
    const matchesSearch =
      e.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.parent_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.phone.includes(searchQuery) ||
      e.grade_applying.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ? true : e.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: EnquiryStatus) => {
    switch (status) {
      case "new":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-950/80 text-amber-300 border border-amber-500/40">
            ★ New Enquiry
          </span>
        );
      case "contacted":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-950/80 text-blue-300 border border-blue-500/40">
            Contacted
          </span>
        );
      case "enrolled":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
            Enrolled
          </span>
        );
      case "closed":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
            Closed
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-serif font-bold text-white flex items-center gap-2.5">
            <Users className="w-6 h-6 text-[#D4AF37]" />
            <span>Admission Enquiries Registry</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage inbound parent admission queries, update contact statuses, and log administrative follow-ups.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium bg-emerald-950/50 px-3 py-1.5 rounded-lg border border-emerald-600/30">
          <FileCheck className="w-4 h-4" />
          <span>Restricted Authorized View</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by student, parent, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-lg bg-[#081830] border border-slate-700 text-white text-xs placeholder-slate-500 focus:border-[#D4AF37]"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400">Filter Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-[#081830] border border-slate-700 text-white text-xs focus:border-[#D4AF37]"
          >
            <option value="all">All Enquiries ({enquiries.length})</option>
            <option value="new">New ({enquiries.filter((e) => e.status === "new").length})</option>
            <option value="contacted">Contacted ({enquiries.filter((e) => e.status === "contacted").length})</option>
            <option value="enrolled">Enrolled ({enquiries.filter((e) => e.status === "enrolled").length})</option>
            <option value="closed">Closed ({enquiries.filter((e) => e.status === "closed").length})</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-slate-400 text-sm flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-[#D4AF37]" />
          <span>Loading admission enquiries...</span>
        </div>
      ) : filteredEnquiries.length === 0 ? (
        <div className="glass-card rounded-xl p-10 text-center border border-slate-800 text-slate-400">
          No enquiries matching current search or status filters.
        </div>
      ) : (
        <div className="glass-card rounded-xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#040C18] text-[#D4AF37] uppercase tracking-wider text-[11px] border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4 font-bold">Candidate &amp; Parent</th>
                  <th className="py-3.5 px-4 font-bold">Class of Interest</th>
                  <th className="py-3.5 px-4 font-bold">Contact Details</th>
                  <th className="py-3.5 px-4 font-bold">Submission Date</th>
                  <th className="py-3.5 px-4 font-bold">Status</th>
                  <th className="py-3.5 px-4 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredEnquiries.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-4 align-top">
                      <strong className="text-white block font-semibold text-sm">
                        {e.student_name}
                      </strong>
                      <span className="text-slate-400 text-xs">
                        Parent: {e.parent_name}
                      </span>
                    </td>

                    <td className="py-4 px-4 align-top max-w-xs">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#0E2548] text-[#D4AF37] border border-[#D4AF37]/30 block w-max">
                        {e.grade_applying}
                      </span>
                      <span className="text-[11px] text-slate-400 mt-1 block">
                        Session: {e.academic_year}
                      </span>
                    </td>

                    <td className="py-4 px-4 align-top whitespace-nowrap">
                      <a
                        href={`tel:${e.phone}`}
                        className="flex items-center gap-1.5 text-[#D4AF37] hover:underline font-semibold"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>{e.phone}</span>
                      </a>
                      {e.email && (
                        <a
                          href={`mailto:${e.email}`}
                          className="flex items-center gap-1.5 text-slate-400 hover:text-white mt-1 text-[11px]"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span>{e.email}</span>
                        </a>
                      )}
                    </td>

                    <td className="py-4 px-4 align-top whitespace-nowrap text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        <span>{new Date(e.created_at).toLocaleDateString("en-IN")}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4 align-top whitespace-nowrap">
                      {getStatusBadge(e.status)}
                    </td>

                    <td className="py-4 px-4 align-top text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedEnquiry(e);
                          setStaffNote(e.notes || "");
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#0E2548] hover:bg-[#143566] text-[#D4AF37] border border-[#D4AF37]/30 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Details &amp; Notes
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Enquiry Details & Status Update Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-[#07172F] border border-[#D4AF37]/40 rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative my-8 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-serif font-bold text-white">
                  Enquiry Dossier: {selectedEnquiry.student_name}
                </h3>
                <span className="text-xs text-slate-400">
                  Ref ID: <strong className="font-mono text-white">{selectedEnquiry.id}</strong>
                </span>
              </div>
              <div>{getStatusBadge(selectedEnquiry.status)}</div>
            </div>

            {/* Candidate Summary */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-[#081830] p-4 rounded-xl border border-slate-800">
              <div>
                <span className="text-slate-400 block">Candidate Name:</span>
                <strong className="text-white text-sm">{selectedEnquiry.student_name}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Grade of Interest:</span>
                <strong className="text-[#D4AF37] text-sm">{selectedEnquiry.grade_applying}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Parent / Guardian:</span>
                <strong className="text-white">{selectedEnquiry.parent_name}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Phone Number:</span>
                <a href={`tel:${selectedEnquiry.phone}`} className="text-[#D4AF37] font-semibold">
                  {selectedEnquiry.phone}
                </a>
              </div>
              {selectedEnquiry.email && (
                <div className="col-span-2">
                  <span className="text-slate-400 block">Email:</span>
                  <span className="text-slate-200">{selectedEnquiry.email}</span>
                </div>
              )}
            </div>

            {/* Parent Message */}
            {selectedEnquiry.message ? (
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                  Parent Message / Notes:
                </span>
                <div className="p-3 rounded-lg bg-[#081830] border border-slate-700/80 text-xs text-slate-200 leading-relaxed italic">
                  &ldquo;{selectedEnquiry.message}&rdquo;
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">No specific parent note entered.</p>
            )}

            {/* Status Change Selector */}
            <div className="pt-2 border-t border-slate-800">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Update Candidate Status:
              </label>
              <div className="flex flex-wrap gap-2">
                {(["new", "contacted", "enrolled", "closed"] as EnquiryStatus[]).map((st) => (
                  <button
                    key={st}
                    type="button"
                    disabled={updatingStatus}
                    onClick={() => handleUpdateStatus(selectedEnquiry.id, st, staffNote)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize cursor-pointer transition-all ${
                      selectedEnquiry.status === st
                        ? "bg-[#D4AF37] text-[#07172F] font-bold shadow-sm"
                        : "bg-[#081830] text-slate-300 hover:bg-[#0E2548] border border-slate-700"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Staff Internal Follow-up Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Internal Staff Notes:
              </label>
              <textarea
                rows={2}
                value={staffNote}
                onChange={(e) => setStaffNote(e.target.value)}
                placeholder="Log contact outcome, dispatched prospectus, fee consultation notes..."
                className="w-full px-3 py-2 rounded-lg bg-[#081830] border border-slate-700 text-white text-xs focus:border-[#D4AF37]"
              />
              <button
                type="button"
                disabled={updatingStatus}
                onClick={() =>
                  handleUpdateStatus(selectedEnquiry.id, selectedEnquiry.status, staffNote)
                }
                className="mt-2 px-3 py-1.5 rounded-lg bg-[#0E2548] hover:bg-[#143566] text-[#D4AF37] border border-[#D4AF37]/30 text-xs font-semibold cursor-pointer"
              >
                {updatingStatus ? "Saving Note..." : "Save Note"}
              </button>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 cursor-pointer"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
