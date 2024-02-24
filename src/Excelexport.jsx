import PropTypes from 'prop-types';
import React, { useState, useContext } from 'react';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';
import { Context } from './index';
import http from './http/index';
import Snackbar from './components/Snackbar/Snackbar';
import { Button } from '@mui/material';

// const Button = styled.button`
//     border: none;
//     background-color: #037903;
//     color: #fff;
//     width: 90px;
//     margin-left: 16px;
//     padding: 6px 2px;
//     font-size: 1rem;
//     border-radius: 5px;
//     cursor: pointer;
//     transition: all 0.5s;
//     i {
//       margin-right:8px;
//     };

//     &:hover{
//       background-color: #0bc90b;
//     }
// `;

// const ButtonDisabled = styled.button`
//     border: none;
//     color: #fff;
//     background-color: #2c2c2c;
//     border-radius: 5px;
//     width: 90px;
//     margin-left: 16px;
//     cursor: not-allowed;
//     padding: 6px 2px;
//     font-size: 1rem;
//     .loadingBtn {
//       margin-right:8px;
//     };
// `;

export const ExportToExcel = ({ fileName, dateStart, dateEnd, closeModal }) => {
  const navigate = useNavigate();
  const { user } = useContext(Context);
  const [open, setOpen] = useState(false);
  const fileType =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = '.xlsx';

  const excelDataFun = () => {
    closeModal();
    http
      .post(import.meta.env.VITE_API_URL + 'api/payment/excel/list', {
        'startDate': dateStart,
        'endDate': dateEnd
      })
      .then((res) => {
        if (res.data && res.data.length > 0) {
          exportToCSV(res.data, fileName);
        } else {
          setOpen(true);
        }
      })
      .catch((error) => {
        if (
          error.response.data.message == 'ro\'yxattan o\'tmagan foydalanuvchi!'
        ) {
          user.setIsAuth(false);
          localStorage.clear();
          navigate('/');
        } else {
          console.log(error);
        }
      });

  };



  const exportToCSV = (apiData, fileName) => {
    const ws = XLSX.utils.json_to_sheet(apiData);
    let wscols = [

      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 25 },
      { wch: 20 },
      { wch: 20 },
      { wch: 25 },
    ];
    ws['!cols'] = wscols;
    XLSX.utils.sheet_add_aoa(ws, [['Ismi', 'Familyasi']], { origin: 'A1' });
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <div>
      <Button sx={{ mt: 3, pt: 1, pb: 1 }}
        fullWidth
        className="buy_btn_modal"
        variant="contained" onClick={excelDataFun}>Excel</Button>
      <Snackbar
        open={open}
        onClose={handleClose}
        severity={'error'}
        massage={'To\'lov haqidagi ma\'lumotlar mavjud emas'}
      />

    </div>
  );
};


ExportToExcel.propTypes = {
  fileName: PropTypes.string.isRequired,
  dateStart: PropTypes.string.isRequired,
  dateEnd: PropTypes.string.isRequired,
  closeModal: PropTypes.func.isRequired
};