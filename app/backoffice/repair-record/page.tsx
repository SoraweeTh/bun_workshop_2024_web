'use client';

import { useState, useEffect } from "react";
import Modal from "@/app/components/modal";
import Swal from "sweetalert2";
import config from "../../config";
import axios from "axios";
import dayjs from "dayjs";

export default function Page() {
    const [devices, setDevices] = useState([]);
    const [repairRecords, setRepairRecords] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [deviceName, setDeviceName] = useState('');
    const [deviceBarcode, setDeviceBarcode] = useState('');
    const [deviceSerial, setDeviceSerial] = useState('');
    const [problem, setProblem] = useState('');
    const [solving, setSolving] = useState('');
    const [deviceId, setDeviceId] = useState('');
    const [expireDate, setExpireDate] = useState('');
    const [id, setId] = useState(0);
    const [statusList, setStatusList] = useState([
        {value: 'active', label: 'รอซ่อม'},
        {value: 'pending', label: 'รอลูกค้ายืนยัน'},
        {value: 'repairing', label: 'กำลังซ่อม'},
        {value: 'done', label: 'ซ่อมเสร็จ'},
        {value: 'cancel', label: 'ยกเลิก'},
        {value: 'complete', label: 'ลูกค้ามารับอุปกรณ์'},
    ]);

    // 
    //  รับเครื่อง 
    //
    const [showModalReceive, setShowModalReceive] = useState(false);
    const [receiveCustomer, setReceiveCustomer] = useState('');
    const [receiveAmount, setReceiveAmount] = useState(0);
    const [receiveId, setReceiveId] = useState(0);

    useEffect(() => {
        fetchDevices();
        fetchRepairRecords();
    }, []);

    const fetchDevices = async () => {
        const response = await axios.get(`${config.apiUrl}/api/device/list`);
        setDevices(response.data);
    }

    const openModal = () => {
        setShowModal(true);
    }

    const closeModal = () => {
        setShowModal(false);
        setId(0);
    }

    const fetchRepairRecords = async () => {
        const response = await axios.get(`${config.apiUrl}/api/repairRecord/list`);
        setRepairRecords(response.data);
    }

    const handleDeviceChange = (deviceId: string) => {
        const device = (devices as any).find((device: any) => device.id === parseInt(deviceId));
        if (device) {
            setDeviceId(device.id);
            setDeviceName(device.name);
            setDeviceBarcode(device.barcode);
            setDeviceSerial(device.serial);
            setExpireDate(dayjs(device.expire_date).format('YYYY-MM-DD'));
        } else {
            setDeviceId('');
            setDeviceName('');
            setDeviceBarcode('');
            setDeviceSerial('');
            setExpireDate('');
        }
    }

    const handleSave = async () => {
        const payload = {
            customerName: customerName,
            customerPhone: customerPhone,
            deviceId: deviceId == '' ? undefined : deviceId,
            deviceName: deviceName,
            deviceBarcode: deviceBarcode,
            deviceSerial: deviceSerial,
            expireDate: expireDate == '' ? undefined : new Date(expireDate),
            problem: problem,
            solving: solving,
        }

        try {
            if (id == 0) {
                await axios.post(`${config.apiUrl}/api/repairRecord/create`, payload);
            } else {
                await axios.put(`${config.apiUrl}/api/repairRecord/update/${id}`, payload);
                setId(0);
            }
            
            Swal.fire({
                icon: 'success',
                title: 'บันทึกข้อมูล',
                text: 'บันทึกข้อมูลสำเร็จ',
                timer: 2000
            });
            closeModal();
            fetchRepairRecords();
        } catch (err: any) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.message,
            });
        }
    }

    const getStatusName = (status: string) => {
        const statusObj = statusList.find((item: any) => item.value === status);
        return statusObj?.label ?? 'รอซ่อม';
    }

    const handleEdit = (repairRecord: any) => {
        setId(repairRecord.id);
        setCustomerName(repairRecord.customerName);
        setCustomerPhone(repairRecord.customerPhone);
        if (repairRecord.deviceId) {
            setDeviceId(repairRecord.deviceId);
        }
        setDeviceName(repairRecord.deviceName);
        setDeviceBarcode(repairRecord.deviceBarcode);
        setDeviceSerial(repairRecord.deviceSerial);
        setExpireDate(dayjs(repairRecord.expireDate).format('YYYY-MM-DD'));
        setProblem(repairRecord.problem);
        openModal();
    }

    const handleDelete = async (id: number) => {
        const button = await config.confirmDialog();
        if (button.isConfirmed) {
            await axios.delete(`${config.apiUrl}/api/repairRecord/delete/${id}`);
            fetchRepairRecords();
        }
    }

    const openModalReceive = (repairRecord: any) => {
        setShowModalReceive(true);
        setReceiveCustomer(repairRecord.customerName);
        setReceiveAmount(0);
        setReceiveId(repairRecord.id);
    }

    const closeModalReceive = () => {
        setShowModalReceive(false);
        setReceiveId(0);
    }

    const handleReceive = async () => {
        const payload = {
            id: receiveId,
            amount: receiveAmount
        }
        try {
            await axios.put(`${config.apiUrl}/api/repairRecord/receive`, payload);
            Swal.fire({
                icon: 'success',
                title: 'บันทึกข้อมูล',
                text: 'บันทึกข้อมูลสำเร็จ',
                timer: 2000
            });
        } catch (err: any) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.message
            })
        }
        
        fetchRepairRecords();
        closeModalReceive();
    }

    return (
        <>
            <div className="card">
                <h1>บันทึกการซ่อม</h1>
                <div className="card-body">
                    <button className="btn-primary" onClick={openModal}>
                        <i className="fa-solid fa-plus mr-2"></i>
                        เพิ่มอุปกรณ์
                    </button>

                    <table className="table mt-3">
                        <thead>
                            <tr>
                                <th>ชื่อลูกค้า</th>
                                <th>เบอร์โทรศัพท์</th>
                                <th>อุปกรณ์</th>
                                <th>อาการ</th>
                                <th>วันที่รับซ่อม</th>
                                <th>วันที่ซ่อมเสร็จ</th>
                                <th>สถานะ</th>
                                <th>ค่าบริการ</th>
                                <th style={{width: '330px'}}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {repairRecords.map((repairRecord: any, index: number) => (
                                <tr key={index}>
                                    <td>{repairRecord.customerName}</td>
                                    <td>{repairRecord.customerPhone}</td>
                                    <td>{repairRecord.deviceName}</td>
                                    <td>{repairRecord.problem}</td>
                                    <td>{dayjs(repairRecord.createAt).format('DD/MM/YYYY')}</td>
                                    <td>{repairRecord.endJobDate ? dayjs(repairRecord.endJobDate).format('DD/MM/YYYY') : '-'}</td>
                                    <td>{getStatusName(repairRecord.status)}</td>
                                    <td>{repairRecord.amount?.toLocaleString('th-TH')}</td>
                                    <td>
                                        <button className="btn-edit"
                                            onClick={() => openModalReceive(repairRecord)}>
                                            <i className="fa-solid fa-check mr-2"></i>
                                            รับเครื่อง
                                        </button>
                                        <button className="btn-edit"
                                            onClick={() => handleEdit(repairRecord)}>
                                            <i className="fa-solid fa-edit mr-2"></i>
                                            แก้ไข
                                        </button>
                                        <button className="btn-delete"
                                            onClick={() => handleDelete(repairRecord.id)}>
                                            <i className="fa-solid fa-trash mr-2"></i>
                                            ลบ
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal title="เพิ่มการซ่อม" 
                isOpen={showModal} 
                onClose={() => closeModal()} size="xl">
                <div className="flex gap-4">
                    <div className="w-1/2">
                        <div>ชื่อลูกค้า</div>
                        <input type="text" 
                            value={customerName} 
                            onChange={(e) => setCustomerName(e.target.value)} 
                            className="form-control w-full" />
                    </div>
                    <div className="w-1/2">
                        <div>เบอร์โทรศัพท์</div>
                        <input type="text" 
                            value={customerPhone} 
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            className="form-control w-full" />
                    </div>
                </div>

                <div className="mt-4">อุปกรณ์ (ในระบบ)</div>
                <select className="form-control w-full" value={deviceId}
                    onChange={(e) => handleDeviceChange(e.target.value)}>
                    <option value="">--- เลือกอุปกรณ์ ---</option>
                    {devices.map((device: any) => (
                        <option value={device.id} key={device.id}>
                            {device.name}
                        </option>
                    ))}
                </select>

                <div className="mt-4">อุปกรณ์ (นอกระบบ)</div>
                <input type="text"
                    value={deviceName}
                    onChange={(e) => setDeviceName(e.target.value)}
                    className="form-control w-full" />

                <div className="flex gap-4 mt-4">
                    <div className="w-1/2">
                        <span>บาร์โค้ด</span>
                        <input type="text"
                            value={deviceBarcode} 
                            onChange={(e) => setDeviceBarcode(e.target.value)}
                            className="form-control w-full" />
                    </div>
                    <div className="w-1/2">
                        <span>รหัสอุปกรณ์</span>
                        <input type="text"
                            value={deviceSerial}
                            onChange={(e) => setDeviceSerial(e.target.value)}
                            className="form-control w-full" />
                    </div>
                </div>

                <div className="mt-4">วันที่สิ้นสุด</div>
                <input type="date"
                    value={expireDate}
                    onChange={(e) => setExpireDate(e.target.value)}
                    className="form-control w-full" />

                <div className="mt-4">อาการ</div>
                <textarea className="form-control w-full"
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}></textarea>

                <button className="btn-primary mt-4" onClick={() => handleSave()}>
                    <i className="fa-solid fa-check mr-3"></i>
                    บันทึก
                </button>
            </Modal>

            <Modal title="รับเครื่อง"
                isOpen={showModalReceive}
                onClose={() => closeModalReceive()} size="xl">
                <div className="flex gap-4">
                    <div className="w-1/2">
                        <div>ชื่อลูกค้า</div>
                        <input type="text" className="form-control w-full disabled" readOnly
                            value={receiveCustomer} />
                    </div>
                    <div className="w-1/2">
                    <div>ค่าบริการ</div>
                        <input type="number" className="form-control w-full"
                            value={receiveAmount}
                            onChange={(e) => setReceiveAmount(Number(e.target.value))} />
                    </div>
                </div>

                <div>
                    <button className="btn-primary mt-4" onClick={handleReceive}>
                        <i className="fa-solid fa-check mr-3"></i>
                        บันทึก
                    </button>
                </div>
            </Modal>
        </>
    );
}

