/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useMemo } from 'react';
import fireExtinguisher from '../../../Data/fireExtinguisher';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Modal, Button, Form } from 'react-bootstrap';
import AlertWarning from '../../../Alert/AlertWarning';
import AlertSave from '../../../Alert/AlertSave';



const COLORS = ['#28a745', '#ffc107', '#dc3545', '#FF8042'];

const Table = () => {
  const [selectedStatus, setSelectedStatus] = useState("ทั้งหมด");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
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
  // Using "Bank A" as the default branch, you can change this to any other branch
  const selectedBranch = "Bank A";


  const data = {
    "Bank A": mergedData.filter(item => item.site === "Bank A"),
    "Bank B": mergedData.filter(item => item.site === "Bank B"),
    "Bank C": mergedData.filter(item => item.site === "Bank C"),
    "Bank D": mergedData.filter(item => item.site === "Bank D")
  };

  const filterByStatus = (extinguishers) => {
    if (selectedStatus === "ทั้งหมด") {
      return extinguishers;
    }
    return extinguishers.filter(extinguisher => extinguisher.status === selectedStatus);
  };

  const paginate = (extinguishers) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return extinguishers.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(filterByStatus(data[selectedBranch]).length / itemsPerPage);

  // Generate sample chart data
  const chartData = [
    { name: 'ตรวจสอบแล้ว', value: data[selectedBranch].filter(item => item.status === "Confirmed").length },
    { name: 'รอดำเนินการ', value: data[selectedBranch].filter(item => item.status === "Assign").length },
    { name: 'ยังไม่ได้ตรวจสอบ', value: data[selectedBranch].filter(item => item.status === "Report").length }
  ];

  const handleSerialClick = (extinguisher) => {
    setSelectedRow(extinguisher); // อัปเดตถังที่ถูกเลือก
    setShowModal(true); // เปิดป๊อปอัพ
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
    const localData = getLocalStorageData();

    // อัปเดตข้อมูลใน localStorage
    const updatedData = localData.map(item =>
      item.serialNumber === selectedRow.serialNumber ? updatedRow : item
    );

    // ตรวจสอบว่าข้อมูลใหม่นี้เป็นรายการใหม่หรืออัปเดต
    const isExisting = localData.some(item => item.serialNumber === selectedRow.serialNumber);

    // ถ้าไม่พบใน localStorage ให้เพิ่มรายการใหม่เข้าไป
    if (!isExisting) {
      updatedData.push(updatedRow);
    }

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


  const conditionLabels = {
    group1: 'สภาพของถังดับเพลิง',
    group2: 'ความดันของถังดับเพลิง',
    group3: 'หัวฉีดและวาล์ว',
    group4: 'สลักนิรภัยและซีลป้องกัน',
    group5: 'ตำแหน่งการติดตั้ง',
  }

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Left Column - Chart */}
        <div className="col-md-4 bg-light p-4" style={{ border: '1px solid #476633', borderRadius: '10px' }}>
          <h4>Tasks Performance</h4>
          <h5 className="mb-1">Bank A</h5>
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
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Sector
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={60}
                fill="#8884d8"
              />
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Right Column - Table */}
        <div className="col-md-8">
          <div className="card" style={{ border: '1px solid #476633', borderRadius: '10px' }}>
            <div className="card-header">
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="mb-0">Fire Extinguisher Table</h4>
                <div className="d-flex align-items-center">
                  <label htmlFor="statusFilter" className="me-2 mb-0">Filter by status:</label>
                  <select
                    id="statusFilter"
                    className="form-select form-select-sm"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    <option value="ทั้งหมด">ทั้งหมด</option>
                    <option value="Confirmed">ตรวจสอบแล้ว</option>
                    <option value="Assign">รอดำเนินการ</option>
                    <option value="Report">ยังไม่ได้ตรวจสอบ</option>
                  </select>
                </div>
                <div className="d-flex align-items-center">
                  <label htmlFor="itemsPerPage" className="me-2 mb-0">Items per page:</label>
                  <select
                    id="itemsPerPage"
                    className="form-select form-select-sm"
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="tableCup">
              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead>
                    <tr>
                      <th style={{ backgroundColor: '#FD6E2B', color: 'white' }}>S/N</th>
                      <th style={{ backgroundColor: '#FD6E2B', color: 'white' }}>Brand</th>
                      <th style={{ backgroundColor: '#FD6E2B', color: 'white' }}>MFD</th>
                      <th style={{ backgroundColor: '#FD6E2B', color: 'white' }}>EXP</th>
                      <th style={{ backgroundColor: '#FD6E2B', color: 'white' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginate(filterByStatus(data[selectedBranch])).length > 0 ? (
                      paginate(filterByStatus(data[selectedBranch])).map((extinguisher, index) => (
                        <tr
                          key={index}
                          onClick={() => { handleSerialClick(extinguisher) }}>
                          <td>{extinguisher.serialNumber}</td>
                          <td>{extinguisher.brand}</td>
                          <td>{extinguisher.mfd}</td>
                          <td>{extinguisher.exp}</td>
                          <td>
                            {extinguisher.status === "Confirmed" ? (
                              <span className="badge bg-success">ตรวจสอบแล้ว</span>
                            ) : extinguisher.status === "Assign" || extinguisher.status === "Assigned" ? (
                              <span className="badge bg-warning">รอดำเนินการ</span>
                            ) : (
                              <span className="badge bg-danger">ยังไม่ได้ตรวจสอบ</span>
                            )}
                          </td>
                        </tr>

                      ))

                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center">No data</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {selectedStatus === "ทั้งหมด" && (
                <nav aria-label="Page navigation">
                  <ul className="pagination justify-content-end">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button className="page-link" onClick={() => setCurrentPage(1)}>First</button>
                    </li>
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
                    </li>
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
                    </li>
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button className="page-link" onClick={() => setCurrentPage(totalPages)}>Last</button>
                    </li>
                  </ul>
                </nav>
              )}
            </div>
          </div>
        </div>
      </div>
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
