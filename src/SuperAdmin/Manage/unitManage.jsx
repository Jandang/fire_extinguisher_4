import { useState } from 'react';

function UnitManage() {
  const [formData, setFormData] = useState({
    branchID: '',
    branchName: '',
    subBranchID: '',
    subBranchName: '',
    totalCount: '',
    serialNumber: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('unitManage', JSON.stringify(formData));
    alert('ข้อมูลถูกบันทึกเรียบร้อยแล้ว!');
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2 style={{ textAlign: 'center' }}>จัดการหน่วยงาน</h2>
      <form onSubmit={handleSubmit}>
        <label>
          รหัสสำนักงานใหญ่:
          <input
            type="text"
            name="branchID"
            value={formData.branchID}
            onChange={handleChange}
            placeholder="Branch ID"
            style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
          />
        </label>
        <label>
          ชื่อสำนักงานใหญ่:
          <input
            type="text"
            name="branchName"
            value={formData.branchName}
            onChange={handleChange}
            placeholder="Branch Name"
            style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
          />
        </label>
        <label>
          รหัสสำนักงานสาขาย่อย:
          <input
            type="text"
            name="subBranchID"
            value={formData.subBranchID}
            onChange={handleChange}
            placeholder="Sub Branch ID"
            style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
          />
        </label>
        <label>
          ชื่อสำนักงานสาขาย่อย:
          <input
            type="text"
            name="subBranchName"
            value={formData.subBranchName}
            onChange={handleChange}
            placeholder="Sub Branch Name"
            style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
          />
        </label>
        <label>
          จำนวนถัง:
          <input
            type="number"
            name="totalCount"
            value={formData.totalCount}
            onChange={handleChange}
            placeholder="จำนวนถัง"
            style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
          />
        </label>
        <label>
          S/N:
          <input
            type="text"
            name="serialNumber"
            value={formData.serialNumber}
            onChange={handleChange}
            placeholder="Serial number"
            style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
          />
        </label>
        <button type="submit" style={{ backgroundColor: '#FF5722', color: '#fff', border: 'none', padding: '10px', borderRadius: '4px', cursor: 'pointer' }}>
          ยืนยัน
        </button>
      </form>
    </div>
  );
}

export default UnitManage;
