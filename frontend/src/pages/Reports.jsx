import React, { useEffect, useState, useRef } from "react";
import GlassCard from "../components/GlassCard";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { motion } from "framer-motion";

import {
  FileText,
  Download,
  Share2,
  Printer,
  Search,
  Filter
} from "lucide-react";

import {
  getReports,
  downloadReport,
} from "../services/report";

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [search, setSearch] = useState("");
  const reportRef = useRef(null);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const data = await getReports();
      setReports(data);
      if (data.length > 0) {
        setSelectedReport(data[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownload = async () => {
    if (!selectedReport) return;

    try {
      const pdf = await downloadReport(selectedReport._id);
      const url = window.URL.createObjectURL(
        new Blob([pdf], { type: "application/pdf" })
      );
      const link = document.createElement("a");
      link.href = url;
      link.download = `NeuroBridge_Report_${selectedReport._id}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Unable to download report.");
    }
  };

  // Print Function
  const handlePrint = () => {
    const content = document.getElementById("pdf-report-content");

    if (!content) return;

    const printWindow = window.open("", "_blank");

    printWindow.document.write(`
      <html>
        <head>
          <title>NeuroBridge Report</title>
          <style>
            body { font-family: sans-serif; padding: 20px; }
            h1, h2, h3 { color: #333; }
            p { line-height: 1.5; color: #555; }
          </style>
        </head>
        <body>
          ${content.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  // Share Function
  const handleShare = async () => {
    if (!selectedReport) return;

    const shareText = `
NeuroBridge AI Report

Student: ${selectedReport.student_name !== "Unknown Student" ? selectedReport.student_name : selectedReport.student_id}

Report Type: ${selectedReport.report_type}

Risk: ${
      selectedReport.risk ||
      selectedReport.risk_level ||
      "Low"
    }
`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "NeuroBridge AI Report",
          text: shareText,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      alert("Report copied to clipboard.");
    }
  };

  const exportPDF = async () => {
    const element = document.getElementById("pdf-report-content");
    if (!element || !selectedReport) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#0a0f1c"
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 10;
      const imgWidth = pageWidth - (margin * 2);
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", margin, margin, imgWidth, imgHeight);
      pdf.save(`${(selectedReport.possible_condition || selectedReport.report_type || "Report").replace(/\s+/g, "_")}_Report.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  // Helper function to safely parse dates from ID or fallback to current date
  const formatDate = (id, options = {}) => {
    if (!id || id.length < 8) return new Date().toLocaleDateString();
    const timestamp = parseInt(id.substring(0, 8), 16) * 1000;
    const date = new Date(isNaN(timestamp) ? Date.now() : timestamp);
    return options.includeTime ? date.toLocaleString() : date.toLocaleDateString();
  };

  // Helper to map emotion to a basic emoji (if available)
  const getEmotionEmoji = (emotion) => {
    if (!emotion) return "😐";
    const lower = emotion.toLowerCase();
    if (lower.includes("happy") || lower.includes("joy")) return "😊";
    if (lower.includes("sad") || lower.includes("depress")) return "😔";
    if (lower.includes("ang")) return "😠";
    if (lower.includes("fear") || lower.includes("anxi")) return "😰";
    return "🧠";
  };

  // Helper to determine what to show for the student's identity
  const getStudentDisplayName = (report) => {
    if (report.student_name && report.student_name !== "Unknown Student") {
      return report.student_name;
    }
    if (report.student_id && report.student_id !== "undefined") {
      return `ID: ${report.student_id}`;
    }
    return "Unknown Student";
  };

  return (
    <div className="pl-64 pt-8 p-8 min-h-screen flex gap-6">
      {/* Sidebar - Search & Report List */}
      <div className="w-96 flex flex-col gap-4">
        <GlassCard className="p-4 flex gap-2 items-center">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search reports..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-sm w-full"
          />
          <Filter className="w-4 h-4 text-gray-400 cursor-pointer" />
        </GlassCard>

        <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {reports
            .filter((report) => {
              if (!search) return true;
              return (
                report.student_name?.toLowerCase().includes(search.toLowerCase()) ||
                report.student_id?.toLowerCase().includes(search.toLowerCase()) ||
                report.possible_condition?.toLowerCase().includes(search.toLowerCase()) ||
                report.risk_level?.toLowerCase().includes(search.toLowerCase()) ||
                report.risk?.toLowerCase().includes(search.toLowerCase())
              );
            })
            .map((report, index) => {
              const risk = report.risk_level || report.risk || "Low";
              const isHigh = risk.toLowerCase() === "high";
              const isMedium = risk.toLowerCase() === "moderate" || risk.toLowerCase() === "medium";
              
              return (
                <motion.div
                  key={report._id}
                  onClick={() => setSelectedReport(report)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className={`border rounded-3xl p-6 transition-all cursor-pointer ${
                    selectedReport?._id === report._id
                      ? "bg-primary/10 border-primary shadow-lg shadow-primary/20"
                      : "bg-white/5 border-white/10 hover:border-cyan-400/40"
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold text-lg mb-1">
                        {getStudentDisplayName(report)}
                      </h4>
                      <p className="text-sm text-cyan-400 capitalize">
                        📄 {report.possible_condition || `${report.report_type} Report`}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                      {formatDate(report._id)}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-4 text-xs font-medium">
                    {report.emotion && (
                      <span className="bg-white/5 border border-white/10 text-gray-300 px-3 py-1 rounded-full capitalize">
                        {getEmotionEmoji(report.emotion)} {report.emotion}
                      </span>
                    )}

                    <span 
                      className={`px-3 py-1 rounded-full ${
                        isHigh ? "bg-red-500/20 text-red-400" :
                        isMedium ? "bg-yellow-500/20 text-yellow-400" :
                        "bg-green-500/20 text-green-400"
                      }`}
                    >
                      {isHigh ? "🔴" : isMedium ? "🟡" : "🟢"} {risk} Risk
                    </span>

                    {report.confidence && (
                      <span className="bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded-full">
                        🎯 {report.confidence}% Confidence
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
        </div>
      </div>

      {/* Main Content - Preview Panel */}
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Report Preview</h2>
          <div className="flex gap-3">
            
            <button 
              onClick={handlePrint}
              disabled={!selectedReport}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Printer className="w-4 h-4" /> Print
            </button>
            
            <button 
              onClick={handleShare}
              disabled={!selectedReport}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Share2 className="w-4 h-4" /> Share
            </button>
            
            <button
              onClick={handleDownload}
              disabled={!selectedReport}
              className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/80 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download size={18} />
              Export PDF
            </button>

          </div>
        </div>

        {/* Dynamic AI Screening Details Panel */}
        <GlassCard className="flex-1 bg-[#0a0f1c] overflow-y-auto mb-6 flex flex-col">
          {reports.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-24 m-auto">
              <div className="w-28 h-28 rounded-full bg-cyan-500/10 flex items-center justify-center mb-6">
                <FileText size={55} className="text-cyan-400" />
              </div>
              <h2 className="text-2xl font-bold mb-3">
                No Reports Yet
              </h2>
              <p className="text-gray-400 max-w-md leading-7">
                Run an AI Communication or Screening analysis. 
                NeuroBridge AI will automatically generate personalized reports here.
              </p>
            </div>
          ) : !selectedReport ? (
             <div className="flex flex-col items-center justify-center h-full text-gray-400 text-center">
               <p>Select a report from the list to preview.</p>
             </div>
          ) : (
            <div id="pdf-report-content" className="max-w-3xl mx-auto py-8 px-6 w-full">
              <div className="flex items-center gap-3 border-b border-white/10 pb-6 mb-8">
                <FileText className="w-8 h-8 text-primary" />
                <div>
                  <h1 className="text-2xl font-bold">
                    NeuroBridge AI Screening Report
                  </h1>
                  <p className="text-cyan-400 mt-2">
                    Student : {getStudentDisplayName(selectedReport)}
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    {formatDate(selectedReport._id, { includeTime: true })}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Report Type :{" "}
                    <span className="text-cyan-400 capitalize">
                      {selectedReport.report_type}
                    </span>
                  </p>
                </div>
              </div>

              {/* Conditional Field Display based on Report Type */}
              <div className="space-y-8">
                {selectedReport.report_type === "screening" ? (
                  <>
                    <section>
                      <h3 className="text-lg font-semibold text-accent mb-2">
                        Teacher Observation
                      </h3>
                      <p className="text-gray-300">{selectedReport.observations || "N/A"}</p>
                    </section>

                    <section>
                      <h3 className="text-lg font-semibold text-accent mb-2">
                        Possible Condition
                      </h3>
                      <p className="text-gray-300">{selectedReport.possible_condition || "N/A"}</p>
                    </section>

                    <section>
                      <h3 className="text-lg font-semibold text-accent mb-2">
                        Risk Level
                      </h3>
                      <div className="mt-2">
                        <span className={`px-4 py-2 rounded-full font-semibold ${
                          (selectedReport.risk_level || selectedReport.risk) === "High" ? "bg-red-500/20 text-red-400" :
                          (selectedReport.risk_level || selectedReport.risk) === "Moderate" ? "bg-yellow-500/20 text-yellow-400" :
                          "bg-green-500/20 text-green-400"
                        }`}>
                          {selectedReport.risk_level || selectedReport.risk || "Low"}
                        </span>
                      </div>
                    </section>

                    <section>
                      <h3 className="text-lg font-semibold text-accent mb-2">
                        Confidence
                      </h3>
                      <p className="text-gray-300">{selectedReport.confidence || "0"}%</p>
                    </section>

                    <section>
                      <h3 className="text-lg font-semibold text-accent mb-2">
                        Strengths
                      </h3>
                      <p className="text-gray-300">{selectedReport.strengths || "N/A"}</p>
                    </section>

                    <section>
                      <h3 className="text-lg font-semibold text-accent mb-2">
                        Recommendation
                      </h3>
                      <div className="text-gray-300 leading-relaxed">
                        {Array.isArray(selectedReport.recommendations) 
                          ? selectedReport.recommendations.map((r, i) => <span key={i} className="block">• {r}</span>) 
                          : (selectedReport.recommendations || selectedReport.recommendation || "N/A")}
                      </div>
                    </section>
                  </>
                ) : (
                  <>
                    <section>
                      <h3 className="text-lg font-semibold text-accent mb-2">
                        Student Message
                      </h3>
                      <p className="text-gray-300 italic">"{selectedReport.student_text || "N/A"}"</p>
                    </section>

                    <section>
                      <h3 className="text-lg font-semibold text-accent mb-2">
                        Simplified Meaning
                      </h3>
                      <p className="text-gray-300">{selectedReport.simplified || "N/A"}</p>
                    </section>

                    <section>
                      <h3 className="text-lg font-semibold text-accent mb-2">
                        Detected Emotion
                      </h3>
                      <p className="text-gray-300 capitalize">{selectedReport.emotion || "N/A"}</p>
                    </section>

                    <section>
                      <h3 className="text-lg font-semibold text-accent mb-2">
                        Risk
                      </h3>
                      <div className="mt-2">
                        <span className={`px-4 py-2 rounded-full font-semibold ${
                          (selectedReport.risk || selectedReport.risk_level) === "High" ? "bg-red-500/20 text-red-400" :
                          (selectedReport.risk || selectedReport.risk_level) === "Moderate" ? "bg-yellow-500/20 text-yellow-400" :
                          "bg-green-500/20 text-green-400"
                        }`}>
                          {selectedReport.risk || selectedReport.risk_level || "Low"}
                        </span>
                      </div>
                    </section>

                    <section>
                      <h3 className="text-lg font-semibold text-accent mb-2">
                        Teacher Suggestion
                      </h3>
                      <p className="text-gray-300 leading-relaxed">{selectedReport.suggestion || "N/A"}</p>
                    </section>

                    <section>
                      <h3 className="text-lg font-semibold text-accent mb-2">
                        Confidence
                      </h3>
                      <p className="text-gray-300">{selectedReport.confidence || "0"}%</p>
                    </section>
                  </>
                )}
              </div>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}