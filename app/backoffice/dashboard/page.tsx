'use client';

import { useState, useEffect } from "react";
import config from "@/app/config";
import axios from "axios";
import Swal from "sweetalert2";
import Chart from 'apexcharts';

export default function Page() {
    const [totalRepairRecord, setTotalRepairRecord] = useState(0);
    const [totalRepairRecordNotComplete, setTotalRepairRecordNotComplete] = useState(0);
    const [totalRepairRecordComplete, setTotalRepairRecordComplete] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0); 

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const response = await axios.get(`${config.apiUrl}/api/repairRecord/dashboard`);
        setTotalRepairRecord(response.data.totalRepairRecord);
        setTotalRepairRecordComplete(response.data.totalRepairRecordComplete);
        setTotalRepairRecordNotComplete(response.data.totalRepairRecordNotComplete);
        setTotalAmount(response.data.totalAmount);
        
        renderChartDailyIncome();
        renderChartMonthlyIncome();
        renderChartPie(
            response.data.totalRepairRecordComplete,
            response.data.totalRepairRecordNotComplete
        );
    };

    const renderChartDailyIncome = () => {
        const data = Array.from({ length: 31 }, () => Math.floor(Math.random() * 10000));
        const options = {
            chart: { type: 'bar', height: 250, background: 'white' },
            series: [{ data: data }],
            xaxis: {
                categories: Array.from({ length: 31 }, (_, i) => `${i + 1}`)
            },
        };
        const chartDailyIncome = document.getElementById('chartDailyIncome');
        const chart = new Chart(chartDailyIncome, options);
        chart.render();
    }

    const renderChartMonthlyIncome = () => {
        const data = Array.from({ length: 12 }, () => Math.floor(Math.random() * 10000));
        const options = {
            chart: { type: 'bar', height: 280, background: 'white' },
            series: [{ data: data }],
            xaxis: {
                categories: ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December']
            }
        };
        const chartMonthlyIncome = document.getElementById('chartMonthlyIncome');
        const chart = new Chart(chartMonthlyIncome, options);
        chart.render();
    }
    
    const renderChartPie = (
        totalRepairRecordComplete: number,
        totalRepairRecordNotComplete: number
    ) => {
        const data = [totalRepairRecordComplete, totalRepairRecordNotComplete];
        const options = {
            chart: { type: 'pie', height: 275, background: 'white' },
            series: data,
            colors: ['#15803d', '#4b5563'],
            labels: ['งานซ่อมเสร็จ', 'งานกำลังซ่อม']
        }
        const chartPie = document.getElementById('chartPie');
        const chart = new Chart(chartPie, options);
        chart.render();
    }

    return (
        <>
            <div className="text-2xl font-bold">Dashboard</div>
            <div className="flex gap-4 mt-5">
                <div className="w-1/4 bg-indigo-700 p-4 rounded-lg text-right">
                    <div className="text-xl font-bold">งานซ่อมทั้งหมด</div>
                    <div className="text-2xl font-bold">{totalRepairRecord}</div>
                </div>
                <div className="w-1/4 bg-green-700 p-4 rounded-lg text-right">
                    <div className="text-xl font-bold">งานซ่อมเสร็จ</div>
                    <div className="text-2xl font-bold">{totalRepairRecordComplete}</div>
                </div>
                <div className="w-1/4 bg-gray-600 p-4 rounded-lg text-right">
                    <div className="text-xl font-bold">งานกำลังซ่อม</div>
                    <div className="text-2xl font-bold">{totalRepairRecordNotComplete}</div>
                </div>
                <div className="w-1/4 bg-yellow-600 p-4 rounded-lg text-right">
                    <div className="text-xl font-bold">รายได้เดือนนี้</div>
                    <div className="text-2xl font-bold">{totalAmount.toLocaleString()}</div>
                </div>
            </div>

            <div className="text-2xl font-bold mt-5">Daily Income</div>
            <div id="chartDailyIncome"></div>

            <div className="flex gap-4">
                <div className="w-2/3">
                    <div className="text-2xl font-bold mt-5 mb-2">Monthly Income</div>
                    <div id="chartMonthlyIncome"></div>
                </div>
                <div className="w-1/3">
                    <div className="text-2xl font-bold mt-5 mb-2">All Repair Record</div>
                    <div id="chartPie"></div>
                </div>
            </div>

            
        </>
    );
}