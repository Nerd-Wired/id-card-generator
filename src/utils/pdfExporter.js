import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Delay to allow rendering
const wait = (ms) => new Promise((res) => setTimeout(res, ms));

export const exportToPDF = async (cardRefs) => {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'px',
    format: [595, 842], // A4 size
  });

  const images = [];

  for (let i = 0; i < cardRefs.length; i++) {
    const ref = cardRefs[i];
    if (!ref) continue;

    try {
      console.log(`Rendering card ${i + 1}/${cardRefs.length}...`);
      

      const canvas = await html2canvas(ref, {
        useCORS: true,
        scale: 1.2, // SAFE scale
        width: 500,
        height: 600,
      });

      const imgData = canvas.toDataURL('image/png');
      console.log(`✅ Image length: ${imgData.length}`);

      // Sanity check: skip overly large image
      if (imgData.length > 5_000_000) {
        console.warn(`⚠️ Skipping image ${i + 1} due to size.`);
        continue;
      }

      images.push(imgData);
    } catch (err) {
      console.error(`❌ Failed to render card ${i + 1}`, err);
    }
  }

  if (images.length === 0) {
    alert('No ID cards rendered. Check if cards are visible.');
    return;
  }

  const positions = [
    { x: 30, y: 30 },
    { x: 310, y: 30 },
    { x: 30, y: 430 },
    { x: 310, y: 430 },
  ];

  images.forEach((img, i) => {
    const pos = positions[i % 4];
    pdf.addImage(img, 'PNG', pos.x, pos.y, 250, 350);

    const isLast = i === images.length - 1;
    const isPageEnd = (i + 1) % 4 === 0;

    if (isPageEnd && !isLast) {
      pdf.addPage();
    }
  });

  pdf.save('ID_Cards.pdf');
};
