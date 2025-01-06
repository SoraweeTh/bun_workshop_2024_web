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

    useEffect(() => {
        fetchDevices();
        fetchRepairRecord();
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

    const fetchRepairRecord = async () => {
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
                title: 'Save Data',
                text: 'Saved successful',
                timer: 1000
            });
            closeModal();
            fetchRepairRecord();
        } catch (err: any) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.message,
            })
        }
    }

    const getStatusName = (status: string) => {
        switch (status) {
            case 'active':
                return 'Active';
            case 'pending':
                return 'Pending';
            case 'repairing':
                return 'Repairing';
            case 'done':
                return 'Completed';
            case 'cancel':
                return 'Cancel';
            case 'complete':
                return 'End Job';
            default:
                return 'waiting repair';
        }
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
            fetchRepairRecord();
        }
    }

    return (
        <>
            <div className="card">
                <h1>Repair Record</h1>
                <div className="card-body">
                    <button className="btn-primary" onClick={openModal}>
                        <i className="fa-solid fa-plus mr-2"></i>
                        Add data
                    </button>

                    <table className="table mt-3">
                        <thead>
                            <tr>
                                <th>Customer Name</th>
                                <th>Phone</th>
                                <th>Devices</th>
                                <th>Problem</th>
                                <th>Start Date</th>
                                <th>End Job Date</th>
                                <th>Status</th>
                                <th style={{width: '150px'}}></th>
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
                                    <td>
                                        <button className="btn-edit"
                                            onClick={() => handleEdit(repairRecord)}>
                                            <i className="fa-solid fa-edit"></i>
                                        </button>
                                        <button className="btn-delete"
                                            onClick={() => handleDelete(repairRecord.id)}>
                                            <i className="fa-solid fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal title="Add Repairing" 
                isOpen={showModal} 
                onClose={() => closeModal()} size="xl">
                <div className="flex gap-4">
                    <div className="w-1/2">
                        <div>Customer Name</div>
                        <input type="text" 
                            value={customerName} 
                            onChange={(e) => setCustomerName(e.target.value)} 
                            className="form-control w-full" />
                    </div>
                    <div className="w-1/2">
                        <div>Phone Number</div>
                        <input type="text" 
                            value={customerPhone} 
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            className="form-control w-full" />
                    </div>
                </div>

                <div className="mt-4">Device Name (In the system)</div>
                <select className="form-control w-full" value={deviceId}
                    onChange={(e) => handleDeviceChange(e.target.value)}>
                    <option value="">--- select devices ---</option>
                    {devices.map((device: any) => (
                        <option value={device.id} key={device.id}>
                            {device.name}
                        </option>
                    ))}
                </select>

                <div className="mt-4">Device Name (Outside)</div>
                <input type="text"
                    value={deviceName}
                    onChange={(e) => setDeviceName(e.target.value)}
                    className="form-control w-full" />

                <div className="flex gap-4 mt-4">
                    <div className="w-1/2">
                        <span>Barcode</span>
                        <input type="text"
                            value={deviceBarcode} 
                            onChange={(e) => setDeviceBarcode(e.target.value)}
                            className="form-control w-full" />
                    </div>
                    <div className="w-1/2">
                        <span>Serial</span>
                        <input type="text"
                            value={deviceSerial}
                            onChange={(e) => setDeviceSerial(e.target.value)}
                            className="form-control w-full" />
                    </div>
                </div>

                <div className="mt-4">Expiration Date</div>
                <input type="date"
                    value={expireDate}
                    onChange={(e) => setExpireDate(e.target.value)}
                    className="form-control w-full" />

                <div className="mt-4">Problem</div>
                <textarea className="form-control w-full"
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}></textarea>

                <button className="btn-primary mt-4" onClick={() => handleSave()}>
                    <i className="fa-solid fa-check mr-3"></i>
                    Save
                </button>
            </Modal>
        </>
    );
}

