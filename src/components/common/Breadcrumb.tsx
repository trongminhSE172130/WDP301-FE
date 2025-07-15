import React from 'react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = '' }) => {
  return (
    <nav className={`mb-6 ${className}`}>
      <ol className="flex items-center space-x-2 text-sm text-gray-500">
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <li>
              {item.href ? (
                <a href={item.href} className="hover:text-blue-600 transition-colors">
                  {item.label}
                </a>
              ) : (
                <span className="text-gray-900 truncate">{item.label}</span>
              )}
            </li>
            {index < items.length - 1 && <li>/</li>}
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
