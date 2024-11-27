import { IoIosWarning } from "react-icons/io";

function AlertPass() {
    return (
        <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1000,
            border: '1.5px solid #dc3545',
            borderRadius: '10px',
            padding: '10px 15px',
            backgroundColor: '#fae3e5',
            color: '#dc3545',
            width: '300px',
            height: '70px',
            display: 'flex',
            justifyContent: 'left',
            alignItems: 'center',
        }}>
            <div style={{ fontSize: '30px', color: '#dc3545' }}>
                <IoIosWarning /> &nbsp;
            </div>
            <div>รหัสผ่านไม่ถูกต้อง !</div>
        </div>
    );
}

export default AlertPass;