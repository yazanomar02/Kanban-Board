import React from 'react';

const Input = ({
    type = 'text',
    label,
    name,
    value,
    onChange,
    placeholder,
    error,
    helperText,
    required = false,
    disabled = false,
    readOnly = false,
    className = '',
    prefix,
    suffix,
    ...props
}) => {
    const inputId = name || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label
                    htmlFor={inputId}
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <div className="relative">
                {prefix && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 dark:text-gray-400">{prefix}</span>
                    </div>
                )}

                <input
                    id={inputId}
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    readOnly={readOnly}
                    required={required}
                    className={`
            w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors
            ${error
                            ? 'border-red-300 focus:ring-red-500 dark:border-red-600'
                            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:focus:border-blue-500'
                        }
            ${disabled || readOnly ? 'bg-gray-100 text-gray-500 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400' : 'bg-white dark:bg-gray-700 dark:text-white'}
            ${prefix ? 'pl-10' : ''}
            ${suffix ? 'pr-10' : ''}
          `}
                    {...props}
                />

                {suffix && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 dark:text-gray-400">{suffix}</span>
                    </div>
                )}
            </div>

            {(error || helperText) && (
                <p className={`mt-1 text-sm ${error ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>
                    {error || helperText}
                </p>
            )}
        </div>
    );
};

export default Input;