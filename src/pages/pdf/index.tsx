import { useEffect } from "react";
import { jsPDF } from "jspdf";

const PDFPage = () => {
  useEffect(() => {
    generatePDF();
  }, []);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Hello world!", 10, 10);
    doc.save("example.pdf");
  };

  return (
    <div>
      <h1>PDF Generation</h1>
      <p>PDF will be generated automatically.</p>
    </div>
  );
};

export default PDFPage;
