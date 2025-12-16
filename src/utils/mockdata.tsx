// TODO: DELETE MOCKUP DATA

import type { Customer, CustomerType, PO, PoStatus } from "../types/types";

// TODO: content TBD
export let PO_STATUSES: PoStatus[] = [
    { poStatusID: 1, poStatusName: "open po" },
    { poStatusID: 2, poStatusName: "dealing" },
    { poStatusID: 3, poStatusName: "closed" },
    { poStatusID: 4, poStatusName: "failed" },
    { poStatusID: 5, poStatusName: "backlog" },
];

export let CUSTOMER_TYPES: CustomerType[] = [
    { customerTypeID: 1, customerTypeName: "ประเภทที่ 1" },
    { customerTypeID: 2, customerTypeName: "ประเภทที่ 2" },
    { customerTypeID: 3, customerTypeName: "ประเภทที่ 3" },
]

export let CUSTOMERS: Customer[] = [
    { customerID: "CUS-2025-000001", customerName: "luk ka #1", address: "addr #1", customerTypeID: 1 },
    { customerID: "CUS-2025-000002", customerName: "luk ka #2", address: "addr #2", customerTypeID: 2 },
    { customerID: "CUS-2025-000003", customerName: "luk ka #3", address: "addr #3", customerTypeID: 3 },
    { customerID: "CUS-2025-000004", customerName: "luk ka #4", address: "addr #4", customerTypeID: 1 },
    { customerID: "CUS-2025-000005", customerName: "luk ka #5", address: "addr #5", customerTypeID: 2 },
    { customerID: "CUS-2025-000006", customerName: "luk ka #6", address: "addr #6", customerTypeID: 3 },
    { customerID: "CUS-2025-000007", customerName: "luk ka #7", address: "addr #7", customerTypeID: 1 },
    { customerID: "CUS-2025-000008", customerName: "luk ka #8", address: "addr #8", customerTypeID: 2 },
    { customerID: "CUS-2025-000009", customerName: "luk ka #9", address: "addr #9", customerTypeID: 3 },
    { customerID: "CUS-2025-000010", customerName: "luk ka #10", address: "addr #10", customerTypeID: 1 },
];

export let POs: PO[] = [
    { poID: "PO-20251006-000001", customerID: "CUS-2025-000001", taskID: "TASK-20250903-000003", poStatusID: 1, createAt: new Date(2025, 9, 6), poAttachmentID: null },
    { poID: "PO-20251006-000002", customerID: "CUS-2025-000002", taskID: "TASK-20250906-000006", poStatusID: 1, createAt: new Date(2025, 9, 6), poAttachmentID: null },
    { poID: "PO-20251006-000003", customerID: "CUS-2025-000003", taskID: "TASK-20250909-000009", poStatusID: 1, createAt: new Date(2025, 9, 6), poAttachmentID: null },
    { poID: "PO-20251006-000004", customerID: "CUS-2025-000002", taskID: "TASK-20250912-000012", poStatusID: 1, createAt: new Date(2025, 9, 6), poAttachmentID: null },
];

/**
 * Performs a one-to-many left join on two arrays of objects.
 * @param {object} options - The join configuration.
 * @param {object[]} options.leftArray - The primary array (e.g., users).
 * @param {object[]} options.rightArray - The array to join from (e.g., posts).
 * @param {string} options.leftKey - The name of the key in the left array's objects.
 * @param {string} options.rightKey - The name of the key in the right array's objects.
 * @param {string} options.newPropName - The name for the new property that will hold the matched items.
 * @returns {object[]} A new array with the joined data.
 */
// TODO: make this sheesh typescript
// TODO: make this join just the field we want instead of the whole object
// TODO: make this extension function of Object[] or abstact this to other file
export function leftJoinOne2One(leftArray, rightArray, leftKey, rightKey, newPropName) {
    return leftArray.map(leftItem => {
        // For each item on the left, find all matching items on the right
        const matches = rightArray.find(rightItem =>
            leftItem[leftKey] === rightItem[rightKey]
        );

        // Return the original left item, plus the new property with the matched items
        return {
            ...leftItem,
            [newPropName]: matches,
        };
    });
}
