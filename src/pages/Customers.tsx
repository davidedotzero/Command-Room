import { useEffect, useState } from "react";
import { API } from "../services/api";
import type { DetailedCustomer, DetailedPO } from "../types/types";
import { formatDateYYYY_MM_DD } from "../utils/functions";

// TODO: only dealers team can see this page

function Customers() {
    const [customers, setCustomers] = useState<DetailedCustomer[]>([]);
    const [poCountGroupByCustomerID, setPoCountGroupByCustomerID] = useState({});
    const [pos, setPos] = useState<DetailedPO[]>([]);

    const fetchData = async () => {
        const resCustomers = await API.getAllCustomersDetailed();
        const resPoCountGroupByCustomerID = await API.countCustomersPOs();
        const resPOs = await API.getAllPOsDetailed();

        setCustomers(resCustomers);
        setPoCountGroupByCustomerID(resPoCountGroupByCustomerID);
        setPos(resPOs);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            <div className="grid grid-cols-5 gap-2 pb-8 border-b">
                {
                    customers.map((customer) => {
                        return (
                            <div className="border border-transparent rounded-md bg-white p-5 text-md shadow-sm hover:shadow-md hover:cursor-pointer" title="ดูรายละเอียดลูกค้า">
                                <p>{customer.customerName}</p>
                                <p>{customer.customerID}</p>
                                <p>{customer.address}</p>
                                <p>{customer.customerType.customerTypeName}</p>
                                <p>
                                    {"จำนนวน PO ทั้งหมด : " +
                                        (poCountGroupByCustomerID[customer.customerID] || "0")
                                    }
                                </p>
                            </div>
                        );
                    })
                }
            </div>

            <div className="mt-8">
                <h1>PO ทั้งหมด</h1>
                <div className="overflow-x-auto rounded-lg shadow-md border border-gray-300">
                    <table className="w-full text-sm text-left text-gray-700">
                        <thead className="text-xs text-gray-800 uppercase bg-gray-100">
                            <tr>
                                <th scope="col" className="px-6 py-3">date</th>
                                <th scope="col" className="px-6 py-3">รหัส PO</th>
                                <th scope="col" className="px-6 py-3">รหัสลูกค้า</th>
                                <th scope="col" className="px-6 py-3">ชื่อลูกค้า</th>
                                <th scope="col" className="px-6 py-3">status</th>
                                <th scope="col" className="px-6 py-3">TaskID</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                pos.map(po => {
                                    return (
                                        <tr className="bg-white border-b border-gray-300 hover:bg-gray-50">
                                            <td className="px-6 py-4">{formatDateYYYY_MM_DD(po.createAt)}</td>
                                            <td className="px-6 py-4">{po.poID}</td>
                                            <td className="px-6 py-4">{po.customerID}</td>
                                            <td className="px-6 py-4">{po.customer.customerName}</td>
                                            <td className="px-6 py-4">{po.poStatus.poStatusName}</td>
                                            <td className="px-6 py-4">{po.taskID}</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default Customers;
