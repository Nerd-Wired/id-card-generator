import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const wait = (ms) => new Promise((res) => setTimeout(res, ms));

export const exportToPDF = async (cardRefs) => {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'px',
    format: [595, 842], // A4 size in pixels
  });

  const images = [];

  for (let i = 0; i < cardRefs.length; i++) {
    const ref = cardRefs[i];
    if (!ref) continue;

    try {
      console.log(`Rendering card ${i + 1}/${cardRefs.length}...`);

      const canvas = await html2canvas(ref, {
        useCORS: true,
        scale: 1.5,
      });

      let imgData = canvas.toDataURL('image/png');
      console.log(`✅ Image length: ${imgData.length}`);

      if (imgData.length > 5_000_000) {
        console.warn(`⚠️ Skipping image ${i + 1} due to size.`);
        continue;
      }

      if (imgData.length > 3_000_000) {
        imgData = canvas.toDataURL('image/jpeg', 0.7);
        console.log(`Compressed image ${i + 1} to JPEG.`);
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

  // Slightly larger cards but still 4 per page
  const cardWidth = 280;
  const cardHeight = 450;

  const positions = [
    { x: 25, y: 25 },
    { x: 300, y: 25 },
    { x: 25, y: 430 },
    { x: 300, y: 430 },
  ];

  images.forEach((img, i) => {
    const pos = positions[i % 4];
    pdf.addImage(img, 'PNG', pos.x, pos.y, cardWidth, cardHeight);

    const isLast = i === images.length - 1;
    const isPageEnd = (i + 1) % 4 === 0;

    if (isPageEnd && !isLast) {
      pdf.addPage();
    }
  });

  pdf.save('ID_Cards.pdf');
};
