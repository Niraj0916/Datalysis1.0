"use client";

import { useState } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';

export default function DatasetUpload({ onUploadSuccess }: { onUploadSuccess: (data: any) => void }) {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
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

        setIsUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("http://localhost:8000/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Upload failed");
            }

            const data = await response.json();
            onUploadSuccess(data);
        } catch (err) {
            setError("Failed to upload file. Please try again.");
            console.error(err);
        } finally {
            setIsUploading(false);
        }
    };

    const downloadTemplate = () => {
        const csvContent = "Date,Category,Amount\n2023-01-01,Groceries,50.00\n2023-01-02,Electronics,120.00";
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "template.csv";
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
                    ${isDragging
                        ? "border-blue-500 bg-blue-50/50 scale-[1.01]"
                        : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-lg hover:shadow-gray-100"
                    }
                `}
            >
                <div className="flex flex-col items-center gap-6 relative z-10">
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
                        {isUploading ? (
                            <>Processing...</>
                        ) : (
                            <>Select CSV File <ArrowRight className="w-4 h-4 opacity-50" /></>
                        )}
                    </label>
                </div>
            </div>

            <div className="mt-6 flex justify-center">
                <button
                    onClick={downloadTemplate}
                    className="text-sm text-gray-400 hover:text-gray-700 transition-colors flex items-center gap-1.5 px-4 py-2 hover:bg-gray-100 rounded-lg"
                >
                    <FileText className="w-4 h-4" /> Download Example Template
                </button>
            </div>

            {error && (
                <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center justify-center gap-2 animate-fade-in">
                    <AlertCircle className="w-4 h-4" /> {error}
                </div>
            )}
        </div>
    );
}
