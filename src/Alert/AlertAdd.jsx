
import { FaCheck } from "react-icons/fa6";

function AlertAdd() {
    return ( 
        <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1000,
            border: '1.5px solid #13795b',
            borderRadius: '10px',
            padding: '10px 15px',
            backgroundColor: '#b6f4e1',
            color: '#13795b',
            width: '300px',
            height: '70px',
            display: 'flex',
            justifyContent: 'left',
            alignItems: 'center',
        }}>
            <div style={{ fontSize: '30px', color: '#13795b' }}>
            <FaCheck /> &nbsp;
            </div>
            <div>เพิ่มผู้ใช้สําเร็จ !</div>
        </div>
     );
}

export default AlertAdd;