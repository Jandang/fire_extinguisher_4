/* eslint-disable react/prop-types */
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import Table from '../Table/Table'
import Header from '../../layouts/Header/Header'
// import Tasks from './Page/Tasks/Tasks'
import './Guest.css'
import fireExtinguisher from '../../../Data/fireExtinguisher'

// const role = {
//   superAdmin: "superAdmin",
//   user: "user"
// }
function GuestBranch({ name_surname }) {

  //   function organizeBranchData(data) {
  //     // Initialize the branch structure
  //     const branchStructure = {
  //         mainBranch: {
  //             name: "Bank A",
  //             fireExtinguishers: [],
  //             statistics: {
  //                 totalExtinguishers: 0,
  //                 byStatus: {
  //                     Report: 0,
  //                     Assign: 0,
  //                     Confirmed: 0
  //                 },
  //                 byBrand: {
  //                     Imperial: 0,
  //                     SUNSAFETY: 0
  //                 }
  //             }
  //         },
  //         subBranches: {
  //             "Bank B": {
  //                 fireExtinguishers: [],
  //                 statistics: {
  //                     totalExtinguishers: 0,
  //                     byStatus: {
  //                         Report: 0,
  //                         Assign: 0,
  //                         Confirmed: 0
  //                     },
  //                     byBrand: {
  //                         Imperial: 0,
  //                         SUNSAFETY: 0
  //                     }
  //                 }
  //             },
  //             "Bank C": {
  //                 fireExtinguishers: [],
  //                 statistics: {
  //                     totalExtinguishers: 0,
  //                     byStatus: {
  //                         Report: 0,
  //                         Assign: 0,
  //                         Confirmed: 0
  //                     },
  //                     byBrand: {
  //                         Imperial: 0,
  //                         SUNSAFETY: 0
  //                     }
  //                 }
  //             },
  //             "Bank D": {
  //                 fireExtinguishers: [],
  //                 statistics: {
  //                     totalExtinguishers: 0,
  //                     byStatus: {
  //                         Report: 0,
  //                         Assign: 0,
  //                         Confirmed: 0
  //                     },
  //                     byBrand: {
  //                         Imperial: 0,
  //                         SUNSAFETY: 0
  //                     }
  //                 }
  //             }
  //         }
  //     };

  //     // Process each fire extinguisher
  //     data.forEach(extinguisher => {
  //         // Determine which branch object to update
  //         let targetBranch = extinguisher.site === "Bank A" 
  //             ? branchStructure.mainBranch 
  //             : branchStructure.subBranches[extinguisher.site];

  //         // Add extinguisher to appropriate branch
  //         targetBranch.fireExtinguishers.push(extinguisher);

  //         // Update statistics
  //         targetBranch.statistics.totalExtinguishers++;
  //         targetBranch.statistics.byStatus[extinguisher.status]++;
  //         targetBranch.statistics.byBrand[extinguisher.brand]++;
  //     });

  //     // Add relationships between branches
  //     Object.keys(branchStructure.subBranches).forEach(branchName => {
  //         branchStructure.subBranches[branchName].parentBranch = "Bank A";
  //     });

  //     return branchStructure;
  // }
  // const data = organizeBranchData(fireExtinguisher);
  const data = fireExtinguisher;
  // const userRole = role.superAdmin
  return (
    <div className='App-container'>
      <Header name_surname={name_surname} />
      <div className='in-container'>


        <div className="info-container-main">
          {/* คอลัมน์สำหรับ Branch และ Tasks */}
          <div className="left-column">

          </div>

          {/* Table จะอยู่ด้านขวา */}
          <div className="right-column">
            <Table data={data} />

            {/* {
            userRole == "superAdmin" ? (
                <TableAdminData/>
            ) : (
                <Table/>
            )
          } */}

          </div>
        </div>
      </div>
    </div>


  );
}

export default GuestBranch;