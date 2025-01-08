'use client';

import { useState, useEffect } from "react";
import dayjs from "dayjs";
import axios from "axios";
import config from "@/app/config";

export default function Page() {
    const [startDate, setStartDate] = useState(dayjs().format('YYYY-MM-DD'));
    const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'));
    const [listIncome, setListIncome] = useState<any[]>([]);

    useEffect(() => {
        fetchIncome();
    }, []);

    const fetchIncome = async () => {
        const response = await axios.get(`${config.apiUrl}/api/income/report/${startDate}/${endDate}`);
        setListIncome(response.data);
    }

    return (
        <div className="card">
                <h1>รายงานรายได้</h1>
                <div className="card-body">
                    <div className="flex gap-4 items-center">
                        <div className="w-[65px] text-right">จากวันที่</div>
                        <div className="w-[200px]">
                            <input type="date" className="form-control w-full"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)} />
                        </div>
                        
                        <div className="w-[65px] text-right">ถึงวันที่</div>
                        <div className="w-[200px]">
                            <input type="date" className="form-control w-full"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)} />
                        </div>

                        <div className="w-[200px]">
                            <button className="btn-primary" style={{marginTop: "7px"}}
                                onClick={fetchIncome}>
                                <i className="fa-solid fa-search mr-2"></i>
                                ค้นหา
                            </button>
                        </div>
                    </div>

                    <table className="table table-bordered table-striped mt-4">
                        <thead>
                            <tr>
                                <th>ชื่อลูกค้า</th>
                                <th>เบอร์โทรศัพท์</th>
                                <th>อุปกรณ์</th>
                                <th>วันที่แจ้งซ่อม</th>
                                <th>วันที่ชำระเงิน</th>
                                <th>จำนวนเงิน</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listIncome.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.customerName}</td>
                                    <td>{item.customerPhone}</td>
                                    <td>{item.deviceName}</td>
                                    <td>{dayjs(item.createAt).format('DD/MM/YYYY')}</td>
                                    <td>{dayjs(item.payDate).format('DD/MM/YYYY')}</td>
                                    <td>{item.amount.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
        </div>
    )
}

