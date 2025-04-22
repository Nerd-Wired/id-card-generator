import React from 'react';
import './IDCard.css';

const IDCard = ({ serialNo, centreCode, centreName, name, contact,examName,examDate }) => {
  return (
    <div className="idcard">
        <div className="text-overlay serial-no">{serialNo}</div>
      <div className="text-overlay name">{name}</div>
      <div className="text-overlay centre-code">{centreCode}</div>
      <div className="text-overlay centre-name">{centreName}</div>
      <div className="text-overlay contact">{contact}</div>
      <div className="text-overlay exam-name">{examName}</div>
      <div className="text-overlay exam-date">{examDate}</div>
      
    </div>
  );
};

export default IDCard;
