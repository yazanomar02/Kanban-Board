import React from 'react';

const Card = ({
    children,
    title,
    subtitle,
    actions,
    footer,
    hoverable = false,
    className = '',
    padding = true,
    ...props
}) => {
    return (
        <div
            className={`
        bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700
        ${hoverable ? 'hover:shadow-lg transition-shadow duration-200' : 'shadow-sm'}
        ${className}
      `}
            {...props}
        >
            {/* Header */}
            {(title || subtitle || actions) && (
                <div className="border-b border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            {title && (
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {title}
                                </h3>
                            )}
                            {subtitle && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    {subtitle}
                                </p>
                            )}
                        </div>
                        {actions && <div className="flex items-center gap-2">{actions}</div>}
                    </div>
                </div>
            )}

            {/* Content */}
            <div className={padding ? 'p-6' : ''}>
                {children}
            </div>

            {/* Footer */}
            {footer && (
                <div className="border-t border-gray-200 dark:border-gray-700 p-6">
                    {footer}
                </div>
            )}
        </div>
    );
};

export default Card;