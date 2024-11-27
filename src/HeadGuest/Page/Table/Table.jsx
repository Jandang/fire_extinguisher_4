/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useMemo } from 'react';
import DataTable from 'react-data-table-component';
import fireExtinguisher from '../../../Data/fireExtinguisher';
import BranchSelector from '../branch/BranchSelector';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Search01Icon } from 'hugeicons-react';
import { Modal, Button, Form } from 'react-bootstrap';
import './Table.css';
import AlertWarning from '../../../Alert/AlertWarning';
import AlertSave from '../../../Alert/AlertSave';

const COLORS = ['#13795b', '#ffc107', '#dc3545', '#FF8042'];

const Table = () => {
  const [selectedBranch, setSelectedBranch] = useState('Bank A');
  const [selectedStatus, setSelectedStatus] = useState("ทั้งหมด");
  const [filterText, setFilterText] = useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [modalInput, setModalInput] = useState('');
  const [reporterName, setReporterName] = useState('');

  const getLocalStorageData = () => {
    const localData = JSON.parse(localStorage.getItem('fireExtinguisher')) || [];
    return localData;
  };

  const mergedData = useMemo(() => {
    const localData = getLocalStorageData();
    const combinedData = [...fireExtinguisher];

    localData.forEach((localItem) => {
      const index = combinedData.findIndex(
        (item) => item.serialNumber === localItem.serialNumber
      );
      if (index !== -1) {
        combinedData[index] = localItem; // ใช้ข้อมูลจาก LocalStorage หากซ้ำ
      } else {
        combinedData.push(localItem); // เพิ่มข้อมูลใหม่เข้าไป
      }
    });

    return combinedData;
  }, [fireExtinguisher]);


  const data = useMemo(() => {
    return {
      "Bank A": mergedData.filter(item => item.site === "Bank A"),
      "Bank B": mergedData.filter(item => item.site === "Bank B"),
      "Bank C": mergedData.filter(item => item.site === "Bank C"),
      "Bank D": mergedData.filter(item => item.site === "Bank D")
    };
  }, [mergedData]);

  const branchStructure = {
    "Bank A": {
      name: "Bank",
      subBranches: [
        { name: "A", code: "Bank A" },
        { name: "B", code: "Bank B" },
        { name: "C", code: "Bank C" },
        { name: "D", code: "Bank D" }
      ]
    }
  };

  const chartData = [
    { name: 'ตรวจสอบแล้ว', value: data[selectedBranch].filter(item => item.status === "Confirmed").length },
    { name: 'รอดำเนินการ', value: data[selectedBranch].filter(item => item.status === "Assign").length },
    { name: 'ยังไม่ได้ตรวจสอบ', value: data[selectedBranch].filter(item => item.status === "Report").length }
  ];

  const filterByStatus = (extinguishers) => {
    if (selectedStatus === "ทั้งหมด") {
      return extinguishers;
    }
    return extinguishers.filter(extinguisher => extinguisher.status === selectedStatus);
  };

  const filteredItems = useMemo(() => {
    let filteredData = filterByStatus(data[selectedBranch]);

    if (filterText) {
      return filteredData.filter(item => {
        return (
          item.serialNumber.toLowerCase().includes(filterText.toLowerCase()) ||
          item.brand.toLowerCase().includes(filterText.toLowerCase()) ||
          item.mfd.toLowerCase().includes(filterText.toLowerCase()) ||
          item.exp.toLowerCase().includes(filterText.toLowerCase()) ||
          item.status.toLowerCase().includes(filterText.toLowerCase())
        );
      });
    }

    return filteredData;
  }, [selectedBranch, selectedStatus, filterText, data]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
        return <span className="badge bg-success">ตรวจสอบแล้ว</span>;
      case 'Assign':
        return <span className="badge bg-warning">รอดำเนินการ</span>;
      default:
        return <span className="badge bg-danger">ยังไม่ได้ตรวจสอบ</span>;
    }
  };

  const columns = [
    {
      name: 'S/N',
      selector: row => row.serialNumber,
      sortable: true,
    },
    {
      name: 'Brand',
      selector: row => row.brand,
      sortable: true,
    },
    {
      name: 'MFD',
      selector: row => row.mfd,
      sortable: true,
    },
    {
      name: 'EXP',
      selector: row => row.exp,
      sortable: true,
    },
    {
      name: 'Status',
      selector: row => row.status,
      sortable: true,
      cell: row => getStatusBadge(row.status),
    },
  ];

  const paginationComponentOptions = {
    rowsPerPageText: 'แถวต่อหน้า:',
    rangeSeparatorText: 'จาก',
    selectAllRowsItem: true,
    selectAllRowsItemText: 'ทั้งหมด',
  };

  const handleRowClick = (row) => {
    setSelectedRow(row);
    setShowModal(true);
    setModalInput('');
    setReporterName('');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRow(null);
  };

  const handleModalInputChange = (e) => {
    setModalInput(e.target.value);
  };
  const handleModalInputName = (e) => {
    setReporterName(e.target.value);
  };

  const [isalertNo, setIsalertNo] = useState(false);
  const [isalertYes, setIsalertYes] = useState(false);

  const handleModalSubmit = () => {
    if (!modalInput.trim() && !reporterName.trim()) {
      setIsalertNo(true);
      setTimeout(() => setIsalertNo(false), 1500);
      return;
    }

    // อัปเดตข้อมูลที่เกี่ยวข้อง
    const updatedRow = {
      ...selectedRow,
      status: "Report", // เปลี่ยนสถานะเป็น "Report"
      reportDetails: modalInput,
      reporter: reporterName // เก็บข้อมูลที่กรอก
    };

    // ดึงข้อมูลจาก localStorage
    const localData = mergedData.filter(item => item.serialNumber == selectedRow.serialNumber);

    // อัปเดตข้อมูลใน localStorage
    const updatedData = localData.map(item =>
      item.serialNumber === selectedRow.serialNumber ? updatedRow : item
    );

    // บันทึกข้อมูลที่อัปเดตลงใน localStorage
    localStorage.setItem("fireExtinguisher", JSON.stringify(updatedData));

    // แจ้งผู้ใช้ว่ารีพอร์ตเสร็จแล้ว
    setIsalertYes(true);
    setTimeout(() => {
      setIsalertYes(false)
      // ปิดโมดัลหลังจากบันทึก
      handleCloseModal();
    }, 1500);

  };


  const subHeaderComponent = (
    <div className="d-flex w-100 justify-content-between align-items-center" style={{ height: '100%' }}>
      <div className="d-flex align-items-center" style={{ height: '40px', margin: '5px' }}>
        <div className="search-container">
          <input
            type="text"
            placeholder="ค้นหา..."
            className="form-control form-control-sm search-input d-flex align-items-center mb-0"
            value={filterText}
            onChange={e => setFilterText(e.target.value)}
          />
          <Search01Icon className="search-icon" />
        </div>
        {filterText && (
          <button
            className="btn btn-sm btn-light ms-2 clear-button"
            onClick={() => {
              setFilterText('');
              setResetPaginationToggle(!resetPaginationToggle);
            }}
          >
            ล้างการค้นหา
          </button>
        )}
      </div>
      <div className="d-flex align-items-center">
        <label htmlFor="statusFilter" className="me-2 d-flex align-items-center" style={{ height: '40px' }}>สถานะ:</label>
        <select
          id="statusFilter"
          style={{ margin: '0' }}
          className="form-select form-select-sm status-select"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="ทั้งหมด">ทั้งหมด</option>
          <option value="Confirmed">ตรวจสอบแล้ว</option>
          <option value="Assign">รอดำเนินการ</option>
          <option value="Report">ยังไม่ได้ตรวจสอบ</option>
        </select>
      </div>
    </div>
  );

  const conditionLabels = {
    group1: 'สภาพของถังดับเพลิง',
    group2: 'ความดันของถังดับเพลิง',
    group3: 'หัวฉีดและวาล์ว',
    group4: 'สลักนิรภัยและซีลป้องกัน',
    group5: 'ตำแหน่งการติดตั้ง',
  }

  return (
    <div className="">
      <div className="">
        <div className="row" style={{ width: "100%", margin: "auto" }}>
          <div className="">
            <div className="row g-4">
              {/* Left Column */}
              <div className="col-md-4">
                <div className="dashboard-card">
                  <div className="dashboard-card-body">
                    <h5 className="dashboard-title">เลือกสาขา</h5>
                    <BranchSelector branchStructure={branchStructure} setSelectedBranch={setSelectedBranch} />

                    <h5 className="dashboard-title mt-5">Tasks Performance</h5>
                    <div className="">
                      <ResponsiveContainer width="" height={300}>
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
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="col-md-8">
                <div className="dashboard-card">
                  <div className="dashboard-card-body">
                    <h5 className="dashboard-title">Fire Extinguisher Table</h5>
                    <div className="table-container">
                      <DataTable
                        columns={columns}
                        data={filteredItems}
                        pagination
                        paginationComponentOptions={paginationComponentOptions}
                        paginationResetDefaultPage={resetPaginationToggle}
                        responsive
                        highlightOnHover
                        pointerOnHover
                        striped
                        persistTableHead
                        subHeader
                        subHeaderComponent={subHeaderComponent}
                        onRowClicked={handleRowClick}
                        className="custom-datatable"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered className="dashboard-modal">
        <Modal.Header closeButton>
          <Modal.Title>Fire Extinguisher Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRow && (
            <div className="modal-content-wrapper">
              <p><strong>Serial Number:</strong> {selectedRow.serialNumber}</p>
              <p><strong>Brand:</strong> {selectedRow.brand}</p>
              <p><strong>MFD:</strong> {selectedRow.mfd}</p>
              <p><strong>EXP:</strong> {selectedRow.exp}</p>
              <p><strong>Status:</strong> {selectedRow.status}</p>
              <p><strong>ตรวจสอบล่าสุด:</strong> {selectedRow.lastDate || '-'}</p>
              <br />
              <p><strong>รายละเอียด</strong></p>
              {selectedRow && selectedRow.conditions ? (
                <div className="checklist">
                  {Object.entries(selectedRow.conditions).map(([key, value]) => (
                    <div className="item" key={key}>
                      <label style={{ fontWeight: 'bold', fontSize: '18px' }}>{conditionLabels[key]}:</label>
                      <input type="checkbox" checked={value === "pass"} disabled /> ผ่าน
                      <input type="checkbox" checked={value !== "pass"} disabled /> ไม่ผ่าน
                    </div>
                  ))}
                </div>
              ) : (
                <div className="checklist">ไม่มีข้อมูลสถานะการตรวจสอบ</div>
              )}
              <Form.Group className="mb-3">
                <Form.Label style={{ fontWeight: 'bold', fontSize: '18px', textAlign: 'left', width: '100%' }}>รายงานปัญหา</Form.Label>
                <Form.Control
                  className='reporterName'
                  type="text"
                  placeholder="ชื่อผู้รายงาน"
                  value={reporterName}
                  onChange={handleModalInputName}
                />
                <Form.Control
                  className='reporterDetails'
                  type="text"
                  placeholder="รายละเอียด"
                  value={modalInput}
                  onChange={handleModalInputChange}
                />
              </Form.Group>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleModalSubmit}>
            รายงานปัญหา
          </Button>
        </Modal.Footer>

        {/* Modal Alert */}
        {isalertNo && (
          <div>
            <AlertWarning />
          </div>
        )}
        {isalertYes && (
          <div>
            <AlertSave />
          </div>
        )}

      </Modal>
    </div>
  );
};

export default Table;