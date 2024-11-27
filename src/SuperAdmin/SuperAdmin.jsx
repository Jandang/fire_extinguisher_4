/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useState, useMemo } from "react";
import DataTable from "react-data-table-component";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Search01Icon } from "hugeicons-react";
import Dropdown from "react-bootstrap/Dropdown";

import users from "../Data/users";
import fireExtinguisher from "../Data/fireExtinguisher";
import ManageUser from "../SuperAdmin/Manage/ManageUser.jsx";
import BranchSelector from "../SuperAdmin/branch/branchSelector.jsx";
import "./superAdmin.css";

const SuperAdmin = ({
  name_surname,
  setToken,
  setRole,
  setUsername,
  setName_surname,
}) => {
  const [isManageUnitModalOpen, setManageUnitModalOpen] = useState(false);
  const [isManageUserModalOpen, setManageUserModalOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState("Bank A");
  const [selectedStatus, setSelectedStatus] = useState("ทั้งหมด");
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const logout = () => {
    setToken("");
    setRole("");
    setUsername("");
    setName_surname("");

    ["authToken", "userRole", "username", "nameSurname"].forEach((item) =>
      localStorage.removeItem(item)
    );
    window.location.href = "/";
  };

  const handleManageUnitClick = () => {
    setManageUnitModalOpen(true);
  };

  const handleManageUnitSubmit = () => {
    const newUnitData = {
      branchID: document.querySelector("input[placeholder='Branch ID']").value,
      branchName: document.querySelector("input[placeholder='Branch Name']")
        .value,
      subBranchID: document.querySelector("input[placeholder='Sub Branch ID']")
        .value,
      subBranchName: document.querySelector(
        "input[placeholder='Sub Branch Name']"
      ).value,
      totalCount: document.querySelector("input[placeholder='จำนวนถัง']").value,
      serialNumber: document.querySelector("input[placeholder='Serail number']")
        .value,
    };

    // บันทึกข้อมูลลงใน localStorage
    const existingData = JSON.parse(localStorage.getItem("UnitManage")) || [];
    localStorage.setItem(
      "UnitManage",
      JSON.stringify([...existingData, newUnitData])
    );

    alert("บันทึกข้อมูลหน่วยงานสำเร็จ!");
    handleCloseModal(); // ปิด Modal
  };

  const handleManageUserClick = () => {
    setManageUserModalOpen(true);
  };
  const handleManageUserSubmit = (userData) => {
    // ดึงข้อมูลจาก localStorage
    const existingData = localStorage.getItem("userData");

    // แปลงข้อมูลเดิม (ถ้ามี) หรือสร้าง Array ว่าง
    const parsedData = existingData ? JSON.parse(existingData) : [];
    //รวมข้อมูล
    const allUsers = [...users, ...parsedData];

    // เช็คว่าข้อมูลที่ส่งเข้ามาซ้ำหรือไม่
    const isDuplicate = allUsers.some(
      (user) => user.username === userData.username
    );

    if (isDuplicate) {
      alert("ข้อมูลนี้มีอยู่แล้วในระบบ!");
      return; // หยุดการทำงานหากข้อมูลซ้ำ
    }

    // เพิ่มข้อมูลใหม่เข้าไปใน Array
    parsedData.push(userData);

    // บันทึกข้อมูลทั้งหมด (Array ที่อัปเดตแล้ว) ลงใน localStorage
    localStorage.setItem("userData", JSON.stringify(parsedData));

    alert("บันทึกข้อมูลผู้ใช้งานสำเร็จ!");
  };

  const handleCloseModal = () => {
    setManageUnitModalOpen(false);
    setManageUserModalOpen(false);
  };

  const [searchQuery, setSearchQuery] = useState(""); // Track search query

  const data = {
    "Bank A": fireExtinguisher.filter((item) => item.site === "Bank A"),
    "Bank B": fireExtinguisher.filter((item) => item.site === "Bank B"),
    "Bank C": fireExtinguisher.filter((item) => item.site === "Bank C"),
    "Bank D": fireExtinguisher.filter((item) => item.site === "Bank D"),
  };

  const COLORS = ["#198754", "#FFC107", "#DC3545"];

  const branchStructure = {
    "Bank A": {
      name: "Bank",
      subBranches: [
        { name: "A", code: "Bank A" },
        { name: "B", code: "Bank B" },
        { name: "C", code: "Bank C" },
        { name: "D", code: "Bank D" },
      ],
    },
  };

  const filterByStatus = (extinguishers) => {
    if (selectedStatus === "ทั้งหมด") {
      return extinguishers;
    }
    return extinguishers.filter(
      (extinguisher) => extinguisher.status === selectedStatus
    );
  };

  // Generate sample chart data
  const chartData = [
    {
      name: "ตรวจสอบแล้ว",
      value: data[selectedBranch].filter((item) => item.status === "Confirmed")
        .length,
    },
    {
      name: "รอดำเนินการ",
      value: data[selectedBranch].filter((item) => item.status === "Assign")
        .length,
    },
    {
      name: "ยังไม่ได้ตรวจสอบ",
      value: data[selectedBranch].filter((item) => item.status === "Report")
        .length,
    },
  ];
  // console.log(chartData);

  const filteredItems = useMemo(() => {
    // ดึงข้อมูลตามสาขาที่เลือกและสถานะ
    let filteredData = filterByStatus(data[selectedBranch]);

    // ถ้ามีข้อความค้นหา (filterText) ให้กรองข้อมูลเพิ่มเติม
    if (filterText) {
      const lowerText = filterText.toLowerCase();
      return filteredData.filter((item) => {
        return (
          (item.serialNumber &&
            item.serialNumber.toLowerCase().includes(lowerText)) ||
          (item.status && item.status.toLowerCase().includes(lowerText))
        );
      });
    }

    return filteredData;
  }, [selectedBranch, selectedStatus, filterText, data]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Confirmed":
        return <span className="badge bg-success">ตรวจสอบแล้ว</span>;
      case "Assign":
        return <span className="badge bg-warning">รอดำเนินการ</span>;
      default:
        return <span className="badge bg-danger">ยังไม่ได้ตรวจสอบ</span>;
    }
  };

  const columns = [
    {
      name: "S/N",
      selector: (row) => row.serialNumber,
      sortable: true,
    },
    {
      name: "Brand",
      selector: (row) => row.brand,
      sortable: true,
    },
    {
      name: "MFD",
      selector: (row) => row.mfd,
      sortable: true,
    },
    {
      name: "EXP",
      selector: (row) => row.exp,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      cell: (row) => getStatusBadge(row.status),
    },
  ];

  const customStyles = {
    table: {
      style: {
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        border: "1px solid #473366",
      },
    },
    headRow: {
      style: {
        backgroundColor: "#FD6E2B",
        borderTopStyle: "solid",
        borderTopWidth: "1px",
        borderTopColor: "#FD6E2B",
        color: "#FFFFFF",
      },
    },
    headCells: {
      style: {
        fontSize: "0.9rem",
        fontWeight: "600",
        color: "",
        paddingLeft: "1rem",
        paddingRight: "1rem",
      },
    },
    cells: {
      style: {
        paddingLeft: "1rem",
        paddingRight: "1rem",
      },
    },
  };

  const paginationComponentOptions = {
    rowsPerPageText: "แถวต่อหน้า:",
    rangeSeparatorText: "จาก",
    selectAllRowsItem: true,
    selectAllRowsItemText: "ทั้งหมด",
  };

  const subHeaderComponent = (
    <div className="d-flex w-100 justify-content-between align-items-center mb-3">
      <div className="d-flex align-items-center">
        <div className="position-relative">
          <input
            type="text"
            placeholder="  ค้นหา..."
            className="form-control form-control-sm ps-4"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            style={{
              borderRadius: "8px",
              padding: "0.5rem",
              fontSize: "0.875rem",
            }}
          />
          <Search01Icon
            className="position-absolute text-muted"
            style={{
              left: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "16px",
              height: "16px",
            }}
          />
        </div>
        {filterText && (
          <button
            className="btn btn-sm btn-light ms-2"
            onClick={() => {
              setFilterText(""); // ล้างข้อความค้นหา
              setResetPaginationToggle(!resetPaginationToggle); // รีเซ็ตหน้า pagination
            }}
            style={{ borderRadius: "8px" }}
          >
            ล้างการค้นหา
          </button>
        )}
      </div>
      <div className="d-flex align-items-center">
        <label htmlFor="statusFilter" className="me-2 mb-0">
          สถานะ:
        </label>
        <select
          id="statusFilter"
          className="form-select form-select-sm"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          style={{ borderRadius: "8px", fontSize: "0.875rem" }}
        >
          <option value="ทั้งหมด">ทั้งหมด</option>
          <option value="Confirmed">ตรวจสอบแล้ว</option>
          <option value="Assign">รอดำเนินการ</option>
          <option value="Report">ยังไม่ได้ตรวจสอบ</option>
        </select>
      </div>
    </div>
  );

  return (
    <div className="container-fluid">
      {/* header logo username */}
      <header className="navbarSuperAdmin">
        <div className="whiteLogo">
          <img src="/img/whiteLogo.png" className="logo" alt="Logo" />
        </div>
        <div className="user-menu">
          <div>
            <Dropdown className="dropdown">
              <Dropdown.Toggle className="no-hover no-caret" style={{width: '100%',boxShadow: 'none'}}>
                <span
                  className="user bi bi-person-circle"
                  style={{ fontSize: "20px" }}
                >
                  &nbsp;{name_surname}
                </span>
              </Dropdown.Toggle>
              <Dropdown.Menu
                className="custom-dropdown-menu"
                align="end" // จัดตำแหน่งให้ dropdown อยู่ขวามือ
              >
                <Dropdown.Item
                  className="logout bi bi-box-arrow-left"
                  onClick={logout}
                >
                  &nbsp; Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </header>

      {/* จัดการสาขา จัดการหน่วยงาน */}
      <body>
        <div className="SA-container">
          <div className="manage-bar">
            <button
              className="manage-unit-button"
              onClick={handleManageUnitClick}
            >
              จัดการหน่วยงาน
            </button>
            <button
              className="manage-user-button"
              onClick={handleManageUserClick}
            >
              จัดการผู้ใช้งาน
            </button>
          </div>

          {/* Manage Unit Modal */}
          {isManageUnitModalOpen && (
            <div className="modal-overlay">
              <div className="modal-popup">
                <button className="close-button" onClick={handleCloseModal}>
                  &times;
                </button>
                <h2>จัดการหน่วยงาน</h2>
                <label>รหัสสำนักงานใหญ่ :</label>
                <input type="number" placeholder="Branch ID" />

                <label>ชื่อสำนักงานใหญ่ :</label>
                <input type="text" placeholder="Branch Name" />

                <label>รหัสสำนักงานสาขาย่อย :</label>
                <input type="number" placeholder="Sub Branch ID" />

                <label>ชื่อสำนักงานสาขาย่อย :</label>
                <input type="text" placeholder="Sub Branch Name" />

                <label>จำนวนถัง :</label>
                <input type="number" placeholder="จำนวนถัง" />

                <label>S/N :</label>
                <input type="text" placeholder="Serail number" />

                <button
                  className="confirm-button"
                  onClick={handleManageUnitSubmit}
                >
                  ยืนยัน
                </button>
              </div>
            </div>
          )}

          {/* Manage User Modal */}
          {isManageUserModalOpen && (
            <ManageUser
              handleCloseModal={handleCloseModal}
              handleManageUserSubmit={handleManageUserSubmit}
            />
          )}
        </div>
      </body>

      {/* แดชบอร์ด */}
      <div className="row">
        {/* Left Column - Branch Selector and Chart */}
        <div className="col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="card-title mb-3">Branch Selector</h5>
              <BranchSelector
                branchStructure={branchStructure}
                setSelectedBranch={setSelectedBranch}
              />

              <h5 className="card-title mt-5 mb-3">Tasks Performance</h5>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData}
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column - DataTable */}
        <div className="col-md-8">
          <div className="card shadow-sm border-0">
            {/* <div className="card-header">
              <h5 className="mb-0">Fire Extinguisher Table</h5>
            </div> */}
            <div className="card-body">
              <DataTable
                columns={columns}
                data={filteredItems}
                pagination
                paginationComponentOptions={paginationComponentOptions}
                paginationResetDefaultPage={resetPaginationToggle}
                customStyles={customStyles}
                responsive
                highlightOnHover
                pointerOnHover
                striped
                persistTableHead
                subHeader
                subHeaderComponent={subHeaderComponent}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdmin;
