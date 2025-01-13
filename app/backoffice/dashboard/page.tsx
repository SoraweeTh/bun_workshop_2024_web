'use client';

import { useState, useEffect } from "react";
import config from "@/app/config";
import axios from "axios";
import Swal from "sweetalert2";
import Chart from 'apexcharts';
import dayjs from "dayjs";

export default function Page() {
    const [totalRepairRecord, setTotalRepairRecord] = useState(0);
    const [totalRepairRecordNotComplete, setTotalRepairRecordNotComplete] = useState(0);
    const [totalRepairRecordComplete, setTotalRepairRecordComplete] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [listYear, setListYear] = useState<number[]>([]);
    const [listMonth, setListMonth] = useState([
        'January', 'February', 'March', 'April', 'May', 'June', 
        'July', 'August', 'September', 'October', 'November', 'December'
    ]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYearChartMonthlyIncome, setSelectedYearChartMonthlyIncome] = useState(0);
    const [listMonthlyIncome, setListMonthlyIncome] = useState([]);

    useEffect(() => {
        const currentYear = dayjs().year();
        const currentMonth = dayjs().month();
        const listYear = Array.from({ length: 5 }, (_, i) => currentYear - i);
        setListYear(listYear);
        setSelectedYear(currentYear);
        setSelectedMonth(currentMonth);
        setSelectedYearChartMonthlyIncome(currentYear);
        fetchData();
    }, []);

    const fetchData = async () => {
        fetchDataDailyIncome();
        fetchDataMonthlyIncome();
    };

    const renderChartDailyIncome = (data: number[]) => {
        const options = {
            chart: { type: 'bar', height: 250, background: 'white' },
            series: [{ data: data }],
            xaxis: {
                categories: Array.from({ length: 31 }, (_, i) => `${i + 1}`)
            },
        };
        const chartDailyIncome = document.getElementById('chartDailyIncome');
        
        if (chartDailyIncome) {
            const chart = new Chart(chartDailyIncome, options);
            chart.render();
        }
    }

    const renderChartMonthlyIncome = (data: number[]) => {
        const options = {
            chart: { type: 'bar', height: 300, background: 'white' },
            series: [{ data: data }],
            xaxis: {
                categories: [
                    'January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'
                ]
            }
        };
        const chartMonthlyIncome = document.getElementById('chartMonthlyIncome');
        
        if (chartMonthlyIncome) {
            const chart = new Chart(chartMonthlyIncome, options);
            chart.render();
        }
    }
    
    const renderChartPie = (
        totalRepairRecordComplete: number,
        totalRepairRecordNotComplete: number
    ) => {
        const data = [totalRepairRecordComplete, totalRepairRecordNotComplete];
        const options = {
            chart: { type: 'pie', height: 300, background: 'white' },
            series: data,
            colors: ['#15803d', '#4b5563'],
            labels: ['งานซ่อมเสร็จ', 'งานกำลังซ่อม']
        }
        const chartPie = document.getElementById('chartPie');
        const chart = new Chart(chartPie, options);
        chart.render();
    }

    const fetchDataDailyIncome = async () => {
        const params = {
            year: selectedYear,
            month: selectedMonth + 1
        }
        
        const response = await axios.get(`${config.apiUrl}/api/repairRecord/dashboard`, {
            params: params
        });
        setTotalRepairRecord(response.data.totalRepairRecord);
        setTotalRepairRecordComplete(response.data.totalRepairRecordComplete);
        setTotalRepairRecordNotComplete(response.data.totalRepairRecordNotComplete);
        setTotalAmount(response.data.totalAmount);
        
        let listDailyIncome = [];
        for (let i = 0; i < response.data.listDailyIncome.length; i++) {
            listDailyIncome.push(response.data.listDailyIncome[i].amount);
        }
        renderChartDailyIncome(listDailyIncome);
        renderChartPie(
            response.data.totalRepairRecordComplete,
            response.data.totalRepairRecordNotComplete
        );
    }

    const fetchDataMonthlyIncome = async () => {
        try {
            const params = {
                year: selectedYearChartMonthlyIncome,
            }
            const response = await axios.get(`${config.apiUrl}/api/repairRecord/monthlyIncome`, {
                params: params
            });

            let listMonthlyIncome = [];
            for (let i = 0; i < response.data.length; i++) {
                listMonthlyIncome.push(response.data[i].amount);
            }

            renderChartMonthlyIncome(listMonthlyIncome);
        } catch (err: any) {
            Swal.fire({
                icon: 'error',
                title: 'การดึงข้อมูลล้มเหลว',
                text: err.message
            });
        }
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
            <div className="flex mb-3 mt-2 gap-4 items-end">
                <div className="w-[100px]">
                    <div>Year</div>
                    <select className="form-control" onChange={(e) => setSelectedYear(parseInt(e.target.value))}>
                        {listYear.map((year, index) => (
                            <option key={index} value={year}>{year}</option>
                        ))}
                    </select>
                </div>
                <div className="w-[100px]">
                    <div>Month</div>
                    <select className="form-control" onChange={(e) => setSelectedMonth(parseInt(e.target.value))}>
                        {listMonth.map((month, index) => (
                            <option key={index} value={month}>{month}</option>
                        ))}
                    </select>
                </div>
                <div className="w-[200px] ms-5">
                    <button className="btn" style={{paddingRight:'20px', paddingLeft:'10px'}} onClick={fetchDataDailyIncome}>
                        <i className="fa-solid fa-magnifying-glass mr-2"></i>
                        show result
                    </button>
                </div>
            </div>
            <div id="chartDailyIncome"></div>

            <div className="text-2xl font-bold mt-5 mb-2">Monthly Income</div>
            <select className="form-control mb-2 mt-2" onChange={(e) => setSelectedYearChartMonthlyIncome(parseInt(e.target.value))}>
                {listYear.map((year, index) => (
                    <option key={index} value={year}>{year}</option>
                ))}
            </select>
            <button className="btn ms-2" style={{paddingRight:'20px', paddingLeft:'10px'}} onClick={fetchDataMonthlyIncome}>
                <i className="fa-solid fa-magnifying-glass mr-2"></i>
                show result
            </button>

            <div className="flex gap-4 mt-2">
                <div className="w-2/3">
                    <div id="chartMonthlyIncome"></div>
                </div>
                <div className="w-1/3">
                    <div id="chartPie"></div>
                </div>
            </div>
        </>
    );
}