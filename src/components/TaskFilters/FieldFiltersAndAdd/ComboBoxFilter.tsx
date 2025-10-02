// function ComboBoxFilter({ label, onChange }: { label: string, onChange: (React.ChangeEventHandler) => void }) {
//     return (
//         <>
//
//             <div>
//                 <label className="text-sm font-medium text-gray-700 mb-1 block">
//                     {label}
//                 </label>
//                 <select
//                     onChange={onChange}
//                     className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
//                 >
//                     <option value={""}>-- ทีมทั้งหมด --</option>
//                     {teamNameList.map((opt) => (
//                         <option key={opt.teamID} value={opt.teamID}>
//                             {opt.teamName}
//                         </option>
//                     ))}
//                 </select>
//             </div>
//         </>
//     );
//
// }
//
// export default ComboBoxFilter;
//
//
//
// onChange = {(e) => setTeamIDFilter(Number(e.target.value))}
// className = "w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
//     >
//     <option value={""}>-- ทีมทั้งหมด --</option>
// {
//     teamNameList.map((opt) => (
//         <option key={opt.teamID} value={opt.teamID}>
//             {opt.teamName}
//         </option>
//     ))
// }
