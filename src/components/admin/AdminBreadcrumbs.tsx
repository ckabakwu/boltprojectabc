import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  name: string;
  href: string;
}

const AdminBreadcrumbs = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const breadcrumbs: BreadcrumbItem[] = [
      { name: 'Admin', href: '/admin/dashboard' }
    ];

    let currentPath = '';
    pathSegments.slice(1).forEach((segment, index) => {
      currentPath += `/${segment}`;
      // Use index in key to ensure uniqueness
      breadcrumbs.push({
        name: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
        href: `/admin${currentPath}`
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol role="list" className="flex items-center space-x-2">
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={`${breadcrumb.href}-${index}`}>
            <div className="flex items-center">
              {index > 0 && (
                <ChevronRight className="flex-shrink-0 h-4 w-4 text-gray-400 mx-2" />
              )}
              <Link
                to={breadcrumb.href}
                className={`text-sm font-medium ${
                  index === breadcrumbs.length - 1
                    ? 'text-gray-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                aria-current={index === breadcrumbs.length - 1 ? 'page' : undefined}
              >
                {breadcrumb.name}
              </Link>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default AdminBreadcrumbs;