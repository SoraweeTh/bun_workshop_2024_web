'use client';

import { useState } from "react";
import Modal from "@/app/components/modal";
import Swal from "sweetalert2";
import config from "../../config";
import axios from "axios";

export default function Page() {
    const [showModal, setShowModal] = useState(false);
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [deviceName, setDeviceName] = useState('');
    const [deviceBarcode, setDeviceBarcode] = useState('');
    const [deviceSerial, setDeviceSerial] = useState('');
    const [problem, setProblem] = useState('');
    const [solving, setSolving] = useState('');
    const [deviceId, setDeviceId] = useState('');

    const openModal = () => {
        setShowModal(true);
    }

    const closeModal = () => {
        setShowModal(false);
    }

    return (
        <>
            <div className="card">
                <h1>Repair Record</h1>
                <div className="card-body">
                    <button className="btn-primary" onClick={openModal}>
                        <i className="fa-solid fa-plus mr-3"></i>
                        Add Reparing
                    </button>
                </div>
            </div>

            <Modal title="Add Repairing" 
                isOpen={showModal} 
                onClose={() => closeModal()} size="xl">
                <div className="flex gap-4">
                    <div className="w-1/2">
                        <div>Customer Name</div>
                        <input type="text" className="form-control w-full" />
                    </div>
                    <div className="w-1/2">
                        <div>Customer Phone</div>
                        <input type="text" className="form-control w-full" />
                    </div>
                </div>
            </Modal>
        </>
    );
}

