import Link from "next/link";

export function Sidebar() {
    const menuItems = [
        {
            title: 'Dashboard', 
            href: 'dashboard', 
            icon: 'fa-solid fa-chart-simple'
        },
        {
            title: 'Staff Member',
            href: '/dashboard/user',
            icon: 'fa-solid fa-users'
        },
        {
            title: 'Repair Record',
            href: '/dashboard/repair-record',
            icon: 'fa-solid fa-screwdriver'
        },
        {
            title: 'Repair Status',
            href: '/dashboard/repair-status',
            icon: 'fa-solid fa-gear'
        },
        {
            title: 'Mechanic Report',
            href: '/dashboard/mechanic-report',
            icon: 'fa-solid fa-right-from-bracket'
        },
        {
            title: 'Income Report',
            href: '/dashboard/income-report',
            icon: 'fa-solid fa-money-bill'
        },
        {
            title: 'Devices',
            href: '/dashboard/devices',
            icon: 'fa-solid fa-box'
        },
        {
            title: 'Company',
            href: '/dashboard/company',
            icon: 'fa-solid fa-shop'
        }
    ];
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