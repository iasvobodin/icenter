type cabinets = {
    'wo': string,
    'cab name': string
}

// export type projectType = {
//     'id': string,
//     'status': 'open' | 'closed',
//     'info': {
//         'base': {
//             'Project Name': string,
//             'SZ №': string,
//             'PM': string,
//             'Buyer': string,
//             'Contract Administrator': string,
//             'Buyout Administrator': string,
//             'Lead Engineer': string
//         },
//         'extends': {
//             'Specific requirement field': string,
//             'senior fitter': string,
//             'status project': string,
//             'Hours calculated': string,
//             'Hours actual': string,
//             'Comments field': string,
//             'Shipping date': string
//         }
//     },
//     'cabinets': cabinets[],
// }

export type projectType = {
    "id": string,
    "status": "open" | 'closed',
    "info": {
        "base": {
            "Project Name": string,
            "SZ №": string,
            "PM": string,
            "Buyer": string,
            "Contract Administrator": string,
            "Buyout Administrator": string,
            "Lead Engineer": string
        },
        "extends": {
            "Specific requirement field": string,
            "senior fitter": string,
            "status project": string,
            "Hours calculated": string,
            "Hours actual": string,
            "Comments field": string,
            "Shipping date": string
        }
    },
    'cabinets': cabinets[],
}