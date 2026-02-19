"use client";

import { useState } from "react";
import DatasetUpload from "@/components/DatasetUpload";
import Dashboard from "@/components/Dashboard";
import { FileText, Bell, Hexagon } from "lucide-react";

export default function Home() {
  const [data, setData] = useState<any>(null);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">

          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Hexagon className="w-5 h-5 text-white stroke-[2.5]" />
              </div>
              <span className="text-xl font-bold tracking-tight text-gray-900">datalysis</span>
            </div>

            {/* Desktop Nav Links */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-gray-500">
              <span className="px-4 py-1.5 bg-gray-900 text-white rounded-full text-xs font-bold tracking-wide shadow-sm">Dashboard</span>
            </nav>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-5">
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 border-2 border-white shadow-md hover:scale-105 transition-transform cursor-pointer"></div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1600px] mx-auto w-full px-6 py-8">

        {/* Page Header */}
        <div className="flex flex-col items-center justify-center text-center mb-12 animate-fade-in-up">
          <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/30 mb-6 transform rotate-3 hover:rotate-6 transition-transform duration-500 text-white">
            <Hexagon className="w-8 h-8 stroke-[2]" />
          </div>
          <h1 className="text-6xl font-black text-gray-900 mb-4 tracking-tight leading-none">
            {data ? "Overview" : "Datalysis 1.0"}
          </h1>
          <p className="text-xl text-gray-400 font-semibold max-w-2xl">Empowering Decisions Through Analytics</p>
        </div>

        {!data ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center animate-scale-in">
            <div className="max-w-2xl mx-auto space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Datalysis</h2>
                <p className="text-gray-500">Upload your transaction data to generate a realtime dashboard with KPIs, trends, AI insights, and customer segmentation.</p>
              </div>
              <DatasetUpload onUploadSuccess={(uploadedData) => setData(uploadedData)} />
            </div>
          </div>
        ) : (
          <div className="animate-fade-in space-y-6">
            <div className="flex items-center justify-between bg-blue-50 p-4 rounded-xl border border-blue-100">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-blue-600" />
                <span className="text-blue-900 font-medium">Viewing Report: <strong>{data.filename}</strong></span>
              </div>
              <button
                onClick={() => setData(null)}
                className="text-sm text-blue-600 font-medium hover:underline hover:text-blue-700 transition-colors px-3 py-1 rounded-lg hover:bg-blue-100"
              >
                Upload New File
              </button>
            </div>

            <Dashboard data={data} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-4 text-center">
        <p className="text-xs text-gray-400">Built with ❤️ by Datalysis &mdash; Empowering Decisions Through Analytics</p>
      </footer>
    </div>
  );
}
