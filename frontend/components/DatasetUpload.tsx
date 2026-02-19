"use client";

import { useState } from 'react';
import { Upload, FileText, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';

export default function DatasetUpload({ onUploadSuccess }: { onUploadSuccess: (data: any) => void }) {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState("");
    const [error, setError] = useState<string | null>(null);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setIsDragging(true);
        } else if (e.type === "dragleave") {
            setIsDragging(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = async (file: File) => {
        if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
            setError("Please upload a CSV file.");
            return;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            setError("File too large. Maximum size is 10MB.");
            return;
        }

        setIsUploading(true);
        setError(null);
        setUploadProgress("Uploading file...");

        const formData = new FormData();
        formData.append("file", file);

        try {
            setUploadProgress("Processing & cleaning data...");

            const response = await fetch("http://localhost:8000/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.detail || `Server error (${response.status})`);
            }

            setUploadProgress("Generating analytics...");
            const data = await response.json();

            // Short delay for smooth transition
            await new Promise(resolve => setTimeout(resolve, 400));
            onUploadSuccess(data);
        } catch (err: any) {
            if (err.message.includes("Failed to fetch") || err.message.includes("NetworkError")) {
                setError("Cannot connect to the server. Make sure the backend is running on port 8000.");
            } else {
                setError(err.message || "Failed to upload file. Please try again.");
            }
            console.error(err);
        } finally {
            setIsUploading(false);
            setUploadProgress("");
        }
    };

    const downloadTemplate = () => {
        const csvContent = "Date,Category,Amount\n2023-01-01,Groceries,50.00\n2023-01-02,Electronics,120.00\n2023-01-15,Groceries,35.50\n2023-02-01,Clothing,89.99\n2023-02-10,Electronics,249.00\n2023-02-20,Food,42.00\n2023-03-05,Groceries,67.30\n2023-03-12,Electronics,159.99\n2023-03-28,Clothing,115.00\n2023-04-01,Food,28.50";
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "datalysis_template.csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`
                    relative group transition-all duration-300 ease-in-out
                    border-2 rounded-2xl p-12 text-center
                    ${isUploading
                        ? "border-blue-400 bg-blue-50/30 pointer-events-none"
                        : isDragging
                            ? "border-blue-500 bg-blue-50/50 scale-[1.01]"
                            : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-lg hover:shadow-gray-100"
                    }
                `}
            >
                <div className="flex flex-col items-center gap-6 relative z-10">
                    {isUploading ? (
                        /* Upload Progress State */
                        <>
                            <div className="p-4 rounded-full bg-blue-100">
                                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-xl font-bold text-gray-900">Analyzing your data...</h3>
                                <p className="text-blue-600 text-sm font-medium animate-pulse">
                                    {uploadProgress}
                                </p>
                                {/* Progress bar animation */}
                                <div className="w-48 mx-auto h-1.5 bg-blue-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full animate-progress" />
                                </div>
                            </div>
                        </>
                    ) : (
                        /* Default Upload State */
                        <>
                            <div className={`
                                p-4 rounded-full transition-colors duration-300
                                ${isDragging ? "bg-blue-100" : "bg-gray-100 group-hover:bg-blue-50"}
                            `}>
                                <Upload className={`w-8 h-8 ${isDragging ? "text-blue-600" : "text-gray-400 group-hover:text-blue-500"}`} />
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                    Click to upload or drag & drop
                                </h3>
                                <p className="text-gray-500 text-sm max-w-sm mx-auto">
                                    Upload your transaction history (CSV). We'll automatically identify columns for Date, Amount, and Category.
                                </p>
                            </div>

                            <input
                                type="file"
                                accept=".csv"
                                onChange={handleFileInput}
                                className="hidden"
                                id="file-upload"
                            />
                            <label
                                htmlFor="file-upload"
                                className="
                                    px-8 py-3 bg-gray-900 text-white font-medium rounded-xl 
                                    hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5 
                                    active:translate-y-0 transition-all cursor-pointer flex items-center gap-2
                                "
                            >
                                Select CSV File <ArrowRight className="w-4 h-4 opacity-50" />
                            </label>
                        </>
                    )}
                </div>
            </div>

            <div className="mt-6 flex justify-center">
                <button
                    onClick={downloadTemplate}
                    disabled={isUploading}
                    className="text-sm text-gray-400 hover:text-gray-700 transition-colors flex items-center gap-1.5 px-4 py-2 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <FileText className="w-4 h-4" /> Download Example Template
                </button>
            </div>

            {error && (
                <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-xl text-sm flex items-start gap-3 animate-fade-in border border-red-100">
                    <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-red-500" />
                    <div>
                        <p className="font-semibold">Upload Failed</p>
                        <p className="text-red-600 mt-0.5">{error}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
