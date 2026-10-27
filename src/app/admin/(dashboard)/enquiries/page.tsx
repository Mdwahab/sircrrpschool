"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Users,
  Search,
  Phone,
  Mail,
  Loader2,
  AlertCircle,
  RefreshCw,
  X,
  Shield,
  Send,
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
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    try {
      const res = await fetch("/api/admin/enquiries", { signal: controller.signal });
      clearTimeout(timeout);

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || `HTTP ${res.status}: Failed to load enquiries`);
      }

      setEnquiries(Array.isArray(data.enquiries) ? data.enquiries : []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load enquiries.";
      setErrorMsg(message);
    } finally {
      clearTimeout(timeout);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    const fetchEnquiries = async () => {
      try {
        const res = await fetch("/api/admin/enquiries");
        const data = await res.json();
        if (!ignore && data.success) {
          setEnquiries(Array.isArray(data.enquiries) ? data.enquiries : []);
        }
      } catch (err: unknown) {
        if (!ignore) {
          const message = err instanceof Error ? err.message : "Failed to load enquiries.";
          setErrorMsg(message);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    fetchEnquiries();
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
          notes: note !== undefined ? note : selectedEnquiry?.notes,
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
      } else {
        alert(data.error || "Failed to update enquiry status.");
      }
    } catch {
      alert("Failed to update enquiry status.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleSaveNote = async () => {
    if (!selectedEnquiry) return;
    await handleUpdateStatus(selectedEnquiry.id, selectedEnquiry.status, staffNote);
    setStaffNote("");
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
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FFFFFF] text-[#567C8D] border border-[#567C8D]">
            New Enquiry
          </span>
        );
      case "contacted":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FFFFFF] text-[#2F4156] border border-[#C8D9E6]">
            Contacted
          </span>
        );
      case "enrolled":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FFFFFF] text-[#2F4156] border-2 border-[#567C8D]">
            Enrolled
          </span>
        );
      case "closed":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FFFFFF] text-[#2F4156] border border-[#C8D9E6]">
            Closed
          </span>
        );
    }
  };

  const countByStatus = (status: string) => {
    if (status === "all") return enquiries.length;
    return enquiries.filter((e) => e.status === status).length;
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#C8D9E6] pb-5">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#2F4156] flex items-center gap-2.5">
            <Users className="w-6 h-6 text-[#567C8D]" />
            <span>Admission Enquiries Registry</span>
          </h1>
          <p className="text-xs text-[#2F4156] mt-1 font-semibold">
            Manage inbound parent admission queries, update contact statuses, and log administrative follow-ups.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={loadData}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FFFFFF] border-2 border-[#C8D9E6] text-[#2F4156] text-xs font-bold hover:bg-[#FFFFFF] hover:border-[#567C8D] transition-all cursor-pointer disabled:opacity-50 shadow-xs"
            title="Refresh enquiries"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#567C8D] ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>

          <div className="flex items-center gap-2 text-xs text-[#2F4156] font-bold bg-[#FFFFFF] px-3 py-2 rounded-xl border-2 border-[#C8D9E6]">
            <Shield className="w-4 h-4 text-[#567C8D]" />
            <span>Restricted Authorized View</span>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            aria-label="Search enquiries by student, parent, phone, or grade"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student, parent, phone, or grade..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#FFFFFF] border-2 border-[#C8D9E6] text-[#2F4156] placeholder-[#000000]/50 text-xs focus:border-[#567C8D] focus:ring-2 focus:ring-[#567C8D]/20 transition-all shadow-xs outline-none font-medium"
          />
          <Search className="w-4 h-4 text-[#567C8D] absolute left-3 top-3" />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { id: "all", label: "All" },
            { id: "new", label: "New" },
            { id: "contacted", label: "Contacted" },
            { id: "enrolled", label: "Enrolled" },
            { id: "closed", label: "Closed" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === tab.id
                  ? "bg-[#567C8D] text-[#2F4156] shadow-xs"
                  : "bg-[#FFFFFF] text-[#2F4156] hover:bg-[#FFFFFF] border-2 border-[#C8D9E6]"
              }`}
            >
              {tab.label} ({countByStatus(tab.id)})
            </button>
          ))}
        </div>
      </div>

      {/* Actionable Error State with Retry */}
      {errorMsg && !loading && (
        <div className="p-4 rounded-xl bg-[#FFFFFF] border-2 border-[#567C8D] text-[#2F4156] text-xs flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-[#567C8D] flex-shrink-0" />
            <span className="font-bold">{errorMsg}</span>
          </div>
          <button
            type="button"
            onClick={loadData}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#567C8D] hover:bg-[#1E2B3A] text-[#2F4156] font-bold text-xs cursor-pointer transition-colors border border-[#2F4156]"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="py-20 text-center text-[#2F4156] text-sm flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-[#567C8D]" />
          <span className="font-semibold">Loading admission enquiries registry...</span>
        </div>
      ) : filteredEnquiries.length === 0 ? (
        /* Empty State */
        <div className="bg-[#FFFFFF] rounded-2xl p-12 text-center border-2 border-[#C8D9E6] shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#FFFFFF] border border-[#C8D9E6] mx-auto flex items-center justify-center text-[#567C8D]">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-[#2F4156] font-serif font-bold text-base">No enquiries found</h3>
          <p className="text-[#2F4156] text-xs max-w-md mx-auto">
            {searchQuery
              ? `No enquiries matched your search for "${searchQuery}".`
              : statusFilter !== "all"
              ? `No enquiries found with status "${statusFilter}".`
              : "No admission enquiries have been registered yet."}
          </p>
        </div>
      ) : (
        /* Enquiries Table */
        <div className="bg-[#FFFFFF] rounded-2xl border-2 border-[#C8D9E6] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FFFFFF] border-b-2 border-[#C8D9E6] text-[#2F4156] uppercase tracking-wider font-bold">
                <tr>
                  <th className="px-5 py-3.5">Candidate &amp; Parent</th>
                  <th className="px-5 py-3.5">Class / Grade</th>
                  <th className="px-5 py-3.5">Contact Details</th>
                  <th className="px-5 py-3.5">Date Received</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#C8D9E6]">
                {filteredEnquiries.map((enq) => (
                  <tr
                    key={enq.id}
                    onClick={() => {
                      setSelectedEnquiry(enq);
                      setStaffNote(enq.notes || "");
                    }}
                    className="hover:bg-[#FFFFFF] transition-colors cursor-pointer"
                  >
                    <td className="px-5 py-4">
                      <div className="font-bold text-[#2F4156] text-sm">{enq.student_name}</div>
                      <div className="text-[#2F4156] text-[11px] mt-0.5">
                        Parent: <span className="text-[#2F4156] font-bold">{enq.parent_name}</span>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="font-bold text-[#2F4156]">{enq.grade_applying}</span>
                      <div className="text-[10px] text-[#2F4156] font-mono">Session {enq.academic_year}</div>
                    </td>

                    <td className="px-5 py-4 space-y-0.5">
                      <div className="flex items-center gap-1.5 text-[#2F4156] font-mono font-bold">
                        <Phone className="w-3 h-3 text-[#567C8D]" />
                        <span>{enq.phone}</span>
                      </div>
                      {enq.email && (
                        <div className="flex items-center gap-1.5 text-[#2F4156] text-[11px]">
                          <Mail className="w-3 h-3 text-[#2F4156]" />
                          <span>{enq.email}</span>
                        </div>
                      )}
                    </td>

                    <td className="px-5 py-4 text-[#2F4156] text-[11px] whitespace-nowrap font-medium">
                      {new Date(enq.created_at).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    <td className="px-5 py-4">
                      {getStatusBadge(enq.status)}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEnquiry(enq);
                          setStaffNote(enq.notes || "");
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#FFFFFF] text-[#2F4156] border border-[#C8D9E6] hover:border-[#567C8D] font-bold text-[11px] cursor-pointer shadow-xs"
                      >
                        View &amp; Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail / Status Management Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2F4156]/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-[#FFFFFF] border-2 border-[#C8D9E6] rounded-2xl max-w-xl w-full p-6 sm:p-7 shadow-2xl relative my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b-2 border-[#C8D9E6] pb-4 mb-5">
              <div>
                <span className="text-[10px] uppercase font-mono text-[#567C8D] font-bold tracking-wider block">
                  Enquiry Ref: {selectedEnquiry.id}
                </span>
                <h3 className="text-xl font-serif font-bold text-[#2F4156] mt-1">
                  {selectedEnquiry.student_name}
                </h3>
                <p className="text-xs text-[#2F4156]">
                  Application for <strong className="text-[#2F4156]">{selectedEnquiry.grade_applying}</strong> | Session {selectedEnquiry.academic_year}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="p-1.5 rounded-lg text-[#2F4156] hover:text-[#2F4156] hover:bg-[#FFFFFF] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Contact Card */}
              <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#C8D9E6] space-y-2">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[#2F4156] text-[11px]">Parent / Guardian:</span>
                    <p className="text-[#2F4156] font-bold mt-0.5">{selectedEnquiry.parent_name}</p>
                  </div>
                  <div>
                    <span className="text-[#2F4156] text-[11px]">Contact Mobile:</span>
                    <p className="text-[#2F4156] font-mono font-bold mt-0.5 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#567C8D]" />
                      <a href={`tel:${selectedEnquiry.phone}`} className="hover:underline">
                        {selectedEnquiry.phone}
                      </a>
                    </p>
                  </div>
                </div>

                {selectedEnquiry.email && (
                  <div className="pt-2 border-t border-[#C8D9E6]">
                    <span className="text-[#2F4156] text-[11px]">Parent Email:</span>
                    <p className="text-[#2F4156] mt-0.5">
                      <a href={`mailto:${selectedEnquiry.email}`} className="text-[#2F4156] hover:underline font-bold">
                        {selectedEnquiry.email}
                      </a>
                    </p>
                  </div>
                )}
              </div>

              {/* Parent Message */}
              {selectedEnquiry.message && (
                <div className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#C8D9E6]">
                  <span className="text-[#2F4156] text-[11px] font-bold block mb-1">Parent Message / Note:</span>
                  <p className="text-[#2F4156] italic leading-relaxed">{selectedEnquiry.message}</p>
                </div>
              )}

              {/* Status Selector */}
              <div>
                <label className="block text-xs font-bold text-[#2F4156] uppercase tracking-wider mb-2">
                  Update Candidate Status
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(["new", "contacted", "enrolled", "closed"] as EnquiryStatus[]).map((status) => (
                    <button
                      key={status}
                      type="button"
                      disabled={updatingStatus}
                      onClick={() => handleUpdateStatus(selectedEnquiry.id, status)}
                      className={`px-3 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                        selectedEnquiry.status === status
                          ? "bg-[#567C8D] text-[#2F4156] shadow-xs border border-[#2F4156]"
                          : "bg-[#FFFFFF] text-[#2F4156] hover:bg-[#FFFFFF] border border-[#C8D9E6]"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Staff Internal Notes */}
              <div>
                <label className="block text-xs font-bold text-[#2F4156] uppercase tracking-wider mb-1.5">
                  Internal Administrative Follow-up Notes
                </label>
                <textarea
                  rows={3}
                  value={staffNote}
                  onChange={(e) => setStaffNote(e.target.value)}
                  placeholder="Record call outcome, interaction schedule, or document verification status..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFFFF] border-2 border-[#C8D9E6] text-[#2F4156] text-xs focus:border-[#567C8D] focus:ring-2 focus:ring-[#567C8D]/20 outline-none font-medium"
                />
                <div className="flex justify-end mt-2">
                  <button
                    type="button"
                    onClick={handleSaveNote}
                    disabled={updatingStatus}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#567C8D] text-[#2F4156] hover:bg-[#1E2B3A] font-bold text-xs cursor-pointer disabled:opacity-50 shadow-xs border border-[#2F4156]"
                  >
                    {updatingStatus ? (
                      <Loader2 className="w-3 h-3 animate-spin text-[#2F4156]" />
                    ) : (
                      <Send className="w-3 h-3 text-[#2F4156]" />
                    )}
                    <span>Save Note</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t-2 border-[#C8D9E6] flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="px-5 py-2 rounded-xl bg-[#FFFFFF] border-2 border-[#C8D9E6] text-[#2F4156] hover:bg-[#FFFFFF] text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
