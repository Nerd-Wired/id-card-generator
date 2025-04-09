import React, { useRef, useState, useEffect } from 'react';
import { exportToPDF } from './utils/pdfExporter';
import { excelParser } from './utils/excelParser';
import IDCard from './components/IDCard';

function App() {
  const [cards, setCards] = useState([]);
  const cardRefs = useRef([]);

  // Adjust the number of refs when cards change
  useEffect(() => {
    cardRefs.current = cardRefs.current.slice(0, cards.length);
  }, [cards]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    excelParser(file, (data) => {
      setCards(data);
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>🪪 Upload Centre Incharge Excel Sheet</h2>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px',
          marginTop: '30px',
        }}
      >
        {cards.map((item, index) => (
          <div key={index} ref={(el) => (cardRefs.current[index] = el)}>
            <IDCard
              serialNo={item['S.No.']}
              centreCode={item['Code']}
              centreName={item['Centre Name']}
              name={item['Name']}
              contact={item['Contact No.']}
            />
          </div>
        ))}
      </div>

      {cards.length > 0 && (
        <button
          onClick={() => exportToPDF(cardRefs.current)}
          style={{
            marginTop: '30px',
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          📥 Download PDF
        </button>
      )}

      <div style={{ marginTop: '20px', color: '#666' }}>
        ⚠️ Excel Sheet should have column names: <b>'S.No.'</b>, <b>'Code'</b>, <b>'Centre Name'</b>, <b>'Name'</b>, <b>'Contact No.'</b>
      </div>
    </div>
  );
}

export default App;
