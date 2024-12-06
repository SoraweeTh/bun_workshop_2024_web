'use client';

import { useState, useEffect } from "react";
import config from "@/app/config";
import Swal from "sweetalert2";
import axios from "axios";
import Modal from "@/app/components/modal";
import dayjs from "dayjs";

export default function Page() {
    const [devices, setDevices] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [barcode, setBarcode] = useState('');
    const [serial, setSerial] = useState('');
    const [name, setName] = useState('');
    const [expiredDate, setExpiredDate] = useState('');
    const [remark, setRemark] = useState('');
    const [id, setId] = useState(0);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get(`${config.apiUrl}/api/device/list`);
            setDevices(response.data);
        } catch (err: any) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.message,
            });
        }
    }

    const handleShowModal = () => {
        setShowModal(true);
    }

    const handleCloseModel = () => {
        setShowModal(false);
    }

    const handleSave = async () => {
        try {
            const payload = {
                barcode: barcode,
                serial: serial,
                name: name,
                expiredDate: new Date(expiredDate),
                remark: remark
            }

            if (id == 0) {
                await axios.post(`${config.apiUrl}/api/device/create`, payload);
            } else {
                await axios.put(`${config.apiUrl}/api/device/update/${id}`, payload);
            }

            setShowModal(false);
            setBarcode('');
            setSerial('');
            setName('');
            setExpiredDate('');
            setRemark('');
            setId(0);

            fetchData();
        } catch (err: any) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.message,
            });
        }
    }

    const handleEdit = async (item: any) => {
        setId(item.id);
        setBarcode(item.barcode);
        setSerial(item.serial);
        setName(item.name);
        setExpiredDate(item.expiredDate);
        setRemark(item.remark);

        handleShowModal();
    }

    const handleDelete = async (id: string) => {
        try {
            const button = await config.confirmDialog();

            if (button.isConfirmed) {
                await axios.delete(`${config.apiUrl}/api/device/remove/${id}`);
                fetchData();
            }
        } catch (err: any) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.message,
            });
        }
    }

    return (
        <div className="card">
            <h1>Devices List</h1>
            <div className="card-body">
                <button className="btn btn-primary" onClick={handleShowModal}>
                    <i className="fa-solid fa-plus mr-2"></i>
                    Add
                </button>

                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Device Name</th>
                            <th>Barcode</th>
                            <th>Serial No.</th>
                            <th>Expired Date</th>
                            <th>Remark</th>
                            <th style={{width: '130px'}}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {devices.map((item: any) => (
                            <tr key={item.id}>
                                <td>{item.name}</td>
                                <td>{item.barcode}</td>
                                <td>{item.serial}</td>
                                <td>{dayjs(item.expiredDate).format('DD/MM/YYYY')}</td>
                                <td>{item.remark}</td>
                                <td>
                                    <button className="btn-edit" 
                                        onClick={() => handleEdit(item)}>
                                        <i className="fa-solid fa-pen-to-square"></i>
                                    </button>
                                    <button className="btn-delete" 
                                        onClick={() => handleDelete(item.id)}>
                                        <i className="fa-solid fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal title="Device List" isOpen={showModal} onClose={handleCloseModel}>
                <div className="form-group">
                    <div>Barcode</div>
                    <input type="text" className="form-control" value={barcode} 
                        onChange={(e) => setBarcode(e.target.value)} />
                    <div className="mt-3">Serial No.</div>
                    <input type="text" className="form-control" value={serial} 
                        onChange={(e) => setSerial(e.target.value)} />
                    <div className="mt-3">Device Name</div>
                    <input type="text" className="form-control" value={name} 
                        onChange={(e) => setName(e.target.value)} />
                    <div className="mt-3">Expired Date</div>
                    <input type="date" className="form-control" value={expiredDate} 
                        onChange={(e) => setExpiredDate(e.target.value)} />
                    <div className="mt-3">Remark</div>
                    <input type="text" className="form-control" value={remark} 
                        onChange={(e) => setRemark(e.target.value)} />

                    <button className="btn btn-primary mt-3" onClick={handleSave}>
                        <i className="fa-solid fa-check mr-3"></i>
                        Save
                    </button>
                </div>
            </Modal>
        </div>
    );
}

