'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";
import config from "@/app/config";
import Swal from "sweetalert2";

export function Sidebar() {
    const [userLevel, setUserLever] = useState('');

    useEffect(() => {
        fetchUserLevel();
    }, [])

    const fetchUserLevel = async () => {
        try {
            const token = localStorage.getItem(config.tokenKey);
            const response = await axios.get(`${config.apiUrl}/api/user/level`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            setUserLever(response.data);
        } catch (err: any) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.message
            });
        }
    }

    let menuItems: any[] = [];

    if (userLevel === 'admin') {
        menuItems = [
            { title: 'Dashboard', href: '/backoffice/dashboard', icon: 'fa-solid fa-chart-simple' },
            { title: 'Staff Member', href: '/backoffice/user', icon: 'fa-solid fa-users' },
            { title: 'Repair Record', href: '/backoffice/repair-record', icon: 'fa-solid fa-screwdriver' },
            { title: 'Repair Status', href: '/backoffice/repair-status', icon: 'fa-solid fa-gear' },
            { title: 'Income Report', href: '/backoffice/income-report', icon: 'fa-solid fa-money-bill' },
            { title: 'Devices Info', href: '/backoffice/device', icon: 'fa-solid fa-box' },
            { title: 'Company', href: '/backoffice/company', icon: 'fa-solid fa-shop' }
        ]
    } else if (userLevel === 'user') {
        menuItems = [
            { title: 'Repair Record', href: '/backoffice/repair-record', icon: 'fa-solid fa-screwdriver' },
        ]
    } else if (userLevel === 'engineer') {
        menuItems = [
            { title: 'Repair Status', href: '/backoffice/repair-status', icon: 'fa-solid fa-gear' },
        ]
    }

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <i className="fa-solid fa-user text-4xl mr-5"></i>
                <h1 className="text-xl font-bold">Bun Service 2025</h1>
            </div>
            <nav className="sidebar-nav">
                <ul>
                    {menuItems.map((item) => (
                        <li key={item.title}>
                            <Link href={item.href} className="sidebar-item">
                            <i className={`${item.icon} mr-2`}></i>
                            {item.title}</Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
}