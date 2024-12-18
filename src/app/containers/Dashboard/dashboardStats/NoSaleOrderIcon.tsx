import React from "react"

export default ({
    className = ''
}) => (
    <svg xmlns="http://www.w3.org/2000/svg" style={{marginInline: 'auto'}} width="162" height="162" viewBox="0 0 162 162" className={className} >
        <g transform="translate(-281 -172)">
            <text transform="translate(307 257)" fill="#000" stroke="rgba(0,0,0,0)" strokeWidth="1" fontSize="14" fontFamily="Roboto-Medium, Roboto" fontWeight="500">
                <tspan x="0" y="0">No Data Available</tspan>
            </text>
            <g transform="translate(281 172)" fill="none" stroke="#dfe1e5" strokeWidth="20">
                <circle cx="81" cy="81" r="81" stroke="none" />
                <circle cx="81" cy="81" r="71" fill="none" />
            </g>
        </g>
    </svg>
)