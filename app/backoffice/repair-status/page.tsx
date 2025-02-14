'use client';

import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import config from "@/app/config";
import Modal from "@/app/components/modal";
import dayjs from "dayjs";

export default function Page() {

    const [repairRecords, setRepairRecords] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [id, setId] = useState(0);
    const [status, setStatus] = useState('');
    const [solving, setSolving] = useState('');
    const [statusList, setStatusList] = useState([
        {value: 'active', label: 'รอซ่อม'},
        {value: 'pending', label: 'รอลูกค้ายืนยัน'},
        {value: 'repairing', label: 'กำลังซ่อม'},
        {value: 'done', label: 'ซ่อมเสร็จ'},
        {value: 'cancel', label: 'ยกเลิก'},
        {value: 'complete', label: 'ลูกค้ามารับอุปกรณ์'},
    ]);
    const [statusForFilter, setStatusForFilter] = useState('');
    const [tmpRepairRecords, setTmpRepairRecords] = useState([]);
    const [engineers, setEngineers] = useState([]);
    const [engineerId, setEngineerId] = useState(0);

    useEffect(() => {
        fetchRepairRecords();
        fetchEngineers();
    }, []);

    const fetchEngineers = async () => {
        try {
            const response = await axios.get(`${config.apiUrl}/api/user/listEngineer`);
            setEngineers(response.data);
            setEngineerId(response.data[0].id)
        } catch (err: any) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.message,
            })
        }
    }

    const fetchRepairRecords = async () => {
        try {
            const response = await axios.get(`${config.apiUrl}/api/repairRecord/list`);
            setRepairRecords(response.data);
            setTmpRepairRecords(response.data);
        } catch (err: any) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.message
            });
        }
    }

    const getStatusName = (status: string) => {
        const statusObj = statusList.find((item: any) => item.value === status);
        return statusObj?.label ?? 'รอซ่อม';
    }

    const handleEdit = (id: number) => {
        const repairRecord = repairRecords.find((repairRecord: any) => repairRecord.id === id) as any;
        if (repairRecord) {
            // setEngineerId(repairRecord?.engineerId ?? 0);
            setId(id);
            setStatus(repairRecord?.status ?? '');
            setSolving(repairRecord?.solving ?? '')
            setShowModal(true);
        }
    }

    const handleSave = async () => {
        try {
            const payload = {
                status: status,
                solving: solving,
                engineerId: engineerId,
            }
            await axios.put(`${config.apiUrl}/api/repairRecord/updateStatus/${id}`, payload);
            Swal.fire({
                icon: 'success',
                title: 'บันทึกข้อมูล',
                text: 'บันทึกข้อมูลสำเร็จ',
                timer: 2000
            });
            fetchRepairRecords();
            setShowModal(false);
        } catch (err: any) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.message
            });
        }
    }

    const handleFilter = (statusForFilter: string) => {
        if (statusForFilter) {
            const filterRecords = tmpRepairRecords.filter((repairRecord: any) => repairRecord.status === statusForFilter);
            setRepairRecords(filterRecords);
            setStatusForFilter(statusForFilter);
        } else {
            setRepairRecords(tmpRepairRecords);
            setStatusForFilter('');
        }
    }

    return (
        <>
            <div className="card">
                <h1>สถานะการซ่อม</h1>
                <div>
                    เลือกสถานะ
                    <select className="form-control ml-3"
                        value={statusForFilter}
                        onChange={(e) => handleFilter(e.target.value)}
                        >
                        <option value="">--- ทั้งหมด ---</option>
                        {statusList.map((item: any) => (
                            <option value={item.value} key={item.value}>{item.label}</option>
                        ))}
                    </select>
                </div>
                <div className="card-body">
                    <table className="table mt-3">
                        <thead>
                            <tr>
                                <th>ช่างซ่อม</th>
                                <th>ชื่อลูกค้า</th>
                                <th>เบอร์โทรศัพท์</th>
                                <th>อุปกรณ์</th>
                                <th>อาการ</th>
                                <th>วันที่รับซ่อม</th>
                                <th>วันที่ซ่อมเสร็จ</th>
                                <th>สถานะ</th>
                                <th style={{width: '230px'}}>จัดการสถานะ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {repairRecords.map((repairRecord: any) => (
                                <tr key={repairRecord.id}>
                                    <td>{repairRecord.engineer?.username ?? '-'}</td>
                                    <td>{repairRecord.customerName}</td>
                                    <td>{repairRecord.customerPhone}</td>
                                    <td>{repairRecord.deviceSerial}</td>
                                    <td>{repairRecord.problem}</td>
                                    <td>{dayjs(repairRecord.createAt).format('DD/MM/YYYY')}</td>
                                    <td>{repairRecord.endJobDate ? dayjs(repairRecord.endJobDate).format('DD/MM/YYYY') : '-'}</td>
                                    <td>{getStatusName(repairRecord.status)}</td>
                                    <td>
                                        <button className="btn-edit"
                                            onClick={() => handleEdit(repairRecord.id)}>
                                            <i className="fa-solid fa-edit mr-1"></i>
                                            ปรับสถานะ
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal title="ปรับสถานะ" isOpen={showModal} onClose={() => setShowModal(false)}>
                <div>
                    <div className="flex gap-4">
                        <div className="w-1/2">
                        <div>เลือกสถานะ</div>
                            <div>
                                <select className="form-control w-full"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}>
                                    {statusList.map((item: any) => (
                                        <option value={item.value} key={item.value}>{item.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="w-1/2">
                        <div>เลือกช่างซ่อม</div>
                            <div>
                                <select className="form-control w-full"
                                    value={engineerId}
                                    onChange={(e) => setEngineerId(Number(e.target.value))}>
                                    <option value="">--- เลือกช่างซ่อม ---</option>
                                    {engineers.map((engineer: any) => (
                                        <option value={engineer.id} key={engineer.id}>{engineer.username}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-3">
                        <div>การแก้ไข</div>
                        <textarea className="form-control w-full" rows={5}
                            value={solving} 
                            onChange={(e) => setSolving(e.target.value)}></textarea>
                    </div>
                    <button className="btn-primary mt-3"
                        onClick={handleSave}>
                        <i className="fa-solid fa-check mr-3"></i>
                        บันทึก
                    </button>
                </div>
            </Modal>
        </>
    )
}

