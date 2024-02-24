import PropTypes from 'prop-types';
import React, { useState , useEffect} from 'react';
// import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import XLSXStyle from 'xlsx-js-style';
import styled from 'styled-components';
const Button=styled.button`
    border: none;
    background-color: #037903;
    color: #fff;
    width: 90px;
    margin-left: 16px;
    padding: 6px 2px;
    font-size: 1rem;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.5s;
    i {
      margin-right:8px;
    };

    &:hover{
      background-color: #0bc90b;
    }
`;

const ButtonDisabled = styled.button`
    border: none;
    color: #fff;
    background-color: #2c2c2c;
    width: 90px;
    margin-left: 16px;
    cursor: not-allowed;
    padding: 6px 2px;
    font-size: 1rem;
    border-radius: 5px;
    cursor: not-allowed;
    transition: all 0.5s;
    i {
      margin-right:8px;
    };
`;

export const ExportAllStudent = ({apiData, fileName, groupData}) => {
  const [data, setData] = useState(true);
  useEffect(() => {
    if(apiData && apiData.length > 0){
      setData(true);
    }else{
      setData(false);
    }
  }, [apiData]);

  
  const excelDataFun=()=>{

    exportToCSV(apiData, fileName);

  };


  const styles = {
    headerGroupPart: {
      font: { bold: true, sz: 15 },
      fill: { patternType: 'solid', fgColor: { rgb: 'D8D8D8' }},
      alignment: { horizontal: 'center', vertical: 'center' }
    },
    header: {
      font: { bold: true, sz: 13 },
      fill: { patternType: 'solid', fgColor: { rgb: 'D8D8D8' }},
      alignment: { horizontal: 'center', vertical: 'center' }
    },
    cell: {
      alignment: { horizontal: 'center' }
    },
    // origin: {
    //   font: { color: { rgb: 'FF0000' }, bold: true }
    // }
  };


  const exportToCSV = (apiData) => {
    const ws = XLSX.utils.json_to_sheet(apiData);
    const range = XLSX.utils.decode_range(ws['!ref']);

  // Apply the header style
  for (let c = range.s.c; c <= range.e.c; c++) {
    const cell = XLSX.utils.encode_cell({ r: range.s.r, c });
    ws[cell].s = styles.header;
  }

  // Apply the body style
  for (let r = range.s.r + 1; r <= range.e.r; r++) {
    for (let c = range.s.c; c <= range.e.c; c++) {
      const cell = XLSX.utils.encode_cell({ r, c });
      ws[cell].s = styles.cell;
    }
  }
    let wscols = [
      {wch:10},
      {wch:35},
      {wch:35},
      {wch:45},
      {wch:25},
      {wch:50},
    ];

    ws['!cols'] = wscols;
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSXStyle.writeFile(wb, `${groupData} o'quvchilari.xlsx`);
  };

  return (
    <div>
      {
        data  ? (<Button onClick={excelDataFun}> <i className="fa-regular fa-file-excel"></i> Excel </Button>) : (<ButtonDisabled disabled><i className="fa-regular fa-file-excel"></i> Excel </ButtonDisabled>)
      }

    </div>
  );
};
ExportAllStudent.propTypes={
    fileName : PropTypes.string.isRequired,
    apiData :PropTypes.array.isRequired,
    groupData :PropTypes.string.isRequired,

};


