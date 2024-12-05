'use client';

import { useState } from "react";
import Swal from "sweetalert2";
import { config } from "../../config";
import axios from "axios";

export default function Page() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSave = async () => {
        if (username == '') {
            Swal.fire({
                title: 'Please fill in username',
                icon: 'error',
            });
            return;
        }

        if (password !== '' && confirmPassword !== '') {
            if (password !== confirmPassword) {
                Swal.fire({
                    title: 'Password does not match',
                    icon: 'error',
                });
                return;
            }
        }

        try {
            const payload = {
                username: username,
                password: password
            }

            const headers = {
                'Authorization': `Bearer ${localStorage.getItem(config.tokenKey)}`
            }

            const response = await axios.put(`${config.apiUrl}/api/user/update`, payload, {
                headers: headers
            });

            if (response.data.message == 'success') {
                Swal.fire({
                    title: 'Updated successful',
                    icon: 'success',
                    timer: 1000
                });
            }
        } catch (err: any) {
            Swal.fire({
                title: 'Something wrong',
                icon: 'error',
                text: err.message
            });
        }
    }

    return (
        <div className="card">
            <h1>Profile</h1>
            <div className="card-body">
                <div>Username</div>
                <input type="text" className="form-control" value={username}
                    onChange={(e) => setUsername(e.target.value)} />
                
                <div className="mt-3">Password (leave blank if you don't want to change it)</div>
                <input type="password" className="form-control" value={password}
                    onChange={(e) => setPassword(e.target.value)} />
            
                <div className="mt-3">New Password Confirmation (leave blank if you don't want to change it)</div>
                <input type="password" className="form-control" value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)} />
            
                <button className="btn-primary" onClick={handleSave}>
                    <i className="fa-solid fa-check mr-3"></i>
                    Save
                </button>
            
            </div>
        </div>
    );
}