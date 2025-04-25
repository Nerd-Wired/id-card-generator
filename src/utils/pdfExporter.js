import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Delay to allow rendering (not used but kept if you want to add a wait between renders)
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
        scale: 1.2, // Higher quality
      });

      let imgData = canvas.toDataURL('image/png');
      console.log(`✅ Image length: ${imgData.length}`);

      // Skip overly large images for safety
      if (imgData.length > 5_000_000) {
        console.warn(`⚠️ Skipping image ${i + 1} due to size.`);
        continue;
      }

      // Compress the image if it's too large
      if (imgData.length > 3_000_000) {
        imgData = canvas.toDataURL('image/jpeg', 0.7); // Compress image to 70% quality
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

  // Layout for 4 cards per A4 page with spacing
  const cardWidth = 260; // Card width (in pixels)
  const cardHeight = 350; // Card height (in pixels)

  const maxImageWidth = 500; // Set a max width (in pixels) for card image
  const maxImageHeight = 700; // Set a max height (in pixels) for card image

  const positions = [
    { x: 40, y: 40 },
    { x: 295, y: 40 },
    { x: 40, y: 440 },
    { x: 295, y: 440 },
  ];

  // Loop through the images to place them on the PDF
  images.forEach((img, i) => {
    const pos = positions[i % 4];

    // Resize the image to fit within the card dimensions while maintaining aspect ratio
    let imgWidth = cardWidth;
    let imgHeight = (imgWidth / cardWidth) * cardHeight;

    // If the image is too large, scale it down
    if (imgWidth > maxImageWidth) {
      imgWidth = maxImageWidth;
      imgHeight = (imgWidth / cardWidth) * cardHeight;
    }
    if (imgHeight > maxImageHeight) {
      imgHeight = maxImageHeight;
      imgWidth = (imgHeight / cardHeight) * cardWidth;
    }

    // Add the image to the PDF at the correct position
    pdf.addImage(img, 'PNG', pos.x, pos.y, imgWidth, imgHeight);

    const isLast = i === images.length - 1;
    const isPageEnd = (i + 1) % 4 === 0;

    // Add a new page if we reach the end of a set of 4 cards
    if (isPageEnd && !isLast) {
      pdf.addPage();
    }
  });

  // Save the generated PDF
  pdf.save('ID_Cards.pdf');
};
