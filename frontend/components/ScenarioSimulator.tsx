"use client";

import { useState, useEffect } from "react";
import { TrendingUp, RefreshCw, Layers } from "lucide-react";

interface ScenarioSimulatorProps {
    currentSales: number;
}

export default function ScenarioSimulator({ currentSales }: ScenarioSimulatorProps) {
    const [priceChange, setPriceChange] = useState(0);
    const [churnChange, setChurnChange] = useState(0);
    const [projectedSales, setProjectedSales] = useState(currentSales);

    useEffect(() => {
        const newSales = currentSales * (1 + priceChange / 100) * (1 - churnChange / 100);
        setProjectedSales(newSales);
    }, [priceChange, churnChange, currentSales]);

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(val);
    };

    return (
        <div className="bg-white p-8 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100">
            <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-2.5 rounded-xl shadow-sm">
                        <Layers className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">What-If Analysis</h3>
                        <p className="text-sm text-gray-500">Simulate price changes and customer retention</p>
                    </div>
                </div>
                <button
                    onClick={() => { setPriceChange(0); setChurnChange(0); }}
                    className="text-xs font-medium text-gray-500 hover:text-gray-900 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    <RefreshCw className="w-3.5 h-3.5" /> Reset Default
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                {/* Controls */}
                <div className="md:col-span-2 space-y-8">
                    {/* Price Slider */}
                    <div>
                        <div className="flex justify-between mb-4">
                            <label className="text-sm font-semibold text-gray-700">Price Increase Strategy</label>
                            <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                                +{priceChange}%
                            </span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="50"
                            step="1"
                            value={priceChange}
                            onChange={(e) => setPriceChange(Number(e.target.value))}
                            className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-blue-700"
                        />
                        <div className="flex justify-between text-xs text-gray-400 mt-2 font-medium">
                            <span>Current Price</span>
                            <span>Aggressive (+50%)</span>
                        </div>
                    </div>

                    {/* Churn Slider */}
                    <div>
                        <div className="flex justify-between mb-4">
                            <label className="text-sm font-semibold text-gray-700">Churn Reduction Goal</label>
                            <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-md">
                                -{churnChange}%
                            </span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="30"
                            step="1"
                            value={churnChange}
                            onChange={(e) => setChurnChange(Number(e.target.value))}
                            className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-green-600 hover:accent-green-700"
                        />
                        <div className="flex justify-between text-xs text-gray-400 mt-2 font-medium">
                            <span>Current Retention</span>
                            <span>Optimized (-30%)</span>
                        </div>
                    </div>
                </div>

                {/* Result Card */}
                <div className="bg-gray-50 rounded-xl p-8 flex flex-col justify-center items-center text-center border border-gray-100 relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-sm text-gray-500 font-medium mb-2 uppercase tracking-wide">Projected Revenue</p>
                        <div className="text-4xl font-extrabold text-gray-900 tracking-tight my-2">
                            {formatCurrency(projectedSales)}
                        </div>

                        <div className="h-px w-12 bg-gray-200 mx-auto my-4"></div>

                        {projectedSales > currentSales ? (
                            <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-green-600 bg-white px-3 py-1 rounded-full shadow-sm border border-gray-100">
                                <TrendingUp className="w-4 h-4" />
                                +{formatCurrency(projectedSales - currentSales)} Gain
                            </div>
                        ) : (
                            <span className="text-gray-400 text-sm font-medium">Adjust sliders to simulate growth</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
