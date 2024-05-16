// pages/index.tsx

import React, { FC, useCallback, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getStaticProps } from "^/utils/getStaticProps";

import { BASE_URL } from "^/config/env";
import useGetPurchaseById from "@/hooks/purchase/useGetPurchaseById";
import Loading from "@/components/Loading";
import moment from "moment";
import "moment/locale/id"; // Import Indonesian locale
import { capitalizeStr } from "^/utils/capitalizeStr";
import { useTranslations } from "next-intl";
import { getStaticPaths } from "^/utils/getStaticPaths";

import Terbilang from "terbilang-ts";

// Extend jsPDF interface to include lastAutoTable property
interface CustomJsPDF extends jsPDF {
  lastAutoTable?: typeof autoTable;
}

const PurchPdfPage: FC = () => {
  const t = useTranslations("");

  const { purch: purchase, purchLoading: loading } = useGetPurchaseById();

  const generatePDF = useCallback(() => {
    let cc = purchase
      ? purchase.items.map((obj: any, idx: number) => [
          idx + 1, // Assuming this value is constant
          obj.item.name, // item name
          "kg", // Assuming this value is constant
          obj.quantity, // quantity
          obj.item.price, // price
          obj.discount, // discount
          obj.total, // total
        ])
      : [];

    const totalSum =
      cc.reduce((sum: number, item: any) => sum + item[6], 0) ?? 0;
    cc = cc &&
      cc.length && [
        ...cc,
        [
          {
            content: `Total `,
            colSpan: 6,
            rowSpan: 2,
            styles: { halign: "right" },
          },
          { content: `${Math.round(totalSum)}`, styles: { halign: "left" } },
        ],
      ];

    const doc = new jsPDF() as CustomJsPDF;
    let yPos = 10; // Initial y position

    //header section

    // Add image
    // addImage(imageData, format, x, y, width, height, alias, compression, rotation)
    doc.addImage(`${BASE_URL}/logo.png`, "PNG", 90, 5, 30, 30); // Adjust x, y, width, height according to your needs
    yPos += 5;

    // company name
    doc.setFontSize(20);
    doc.text("Anugerah Tani Makmur", 70, yPos + 24);
    yPos += 24;

    // Draw a separator line
    const x1Line1 = 10;
    const x2Line1 = 200;
    const x1Line2 = 20;
    const x2Line2 = 190;
    const yLine1 = yPos + 4;
    yPos += 4;
    const yLine2 = yPos + 2;
    yPos += 2;

    // line(x1, y1, x2, y2) - coordinates of start and end points
    doc.line(x1Line1, yLine1, x2Line1, yLine1); // Coordinates in mm (from left, from top, to right, to same vertical position)
    doc.line(x1Line2, yLine2, x2Line2, yLine2); // Coordinates in mm (from left, from top, to right, to same vertical position)

    // end of header section

    // body section

    // po no text
    const txtPoNo = `Purchase Order : ${purchase.poNo}`;
    const xTxtPoNo = 65;

    doc.setFontSize(15);
    doc.text(txtPoNo, xTxtPoNo, yPos + 10);
    yPos += 10;

    const textWidth = doc.getTextWidth(txtPoNo);
    const lineHeight = 0.5;
    doc.setLineWidth(lineHeight);
    doc.line(xTxtPoNo, yPos + 1.5, xTxtPoNo + textWidth, yPos + 1.5); // Slightly below the text

    yPos += 10;

    // po header detail
    const xColonStart = 60;
    doc.setFontSize(10);
    doc.text(`Tanggal PO `, 30, yPos);
    doc.text(` : `, xColonStart, yPos);
    doc.text(
      `${moment(purchase.date).locale("id").format("DD MMMM YYYY")}`,
      70,
      yPos
    );
    doc.text(`Kepada Yth.`, 130, yPos);

    yPos += 5;

    doc.text(`Purchase Order `, 30, yPos);
    doc.text(` : `, xColonStart, yPos);
    doc.text(`${purchase.poNo}`, 70, yPos);
    doc.text(`${purchase.supplier.company}`, 130, yPos);

    yPos += 5;

    doc.text(`Perihal `, 30, yPos);
    doc.text(` : `, xColonStart, yPos);
    doc.text(`${capitalizeStr("order pupuk")}`, 70, yPos);
    doc.text(`${purchase.supplier.address}`, 130, yPos);

    yPos += 5;

    doc.text(`Pembayaran `, 30, yPos);
    doc.text(` : `, xColonStart, yPos);
    doc.text(`${purchase.purchPaymentMethod}`, 70, yPos);
    doc.text(`${purchase.supplier.city ?? ""}`, 130, yPos);

    yPos += 12;
    doc.text(`Permintaan pembelian barang sebagai berikut :  `, 30, yPos);

    yPos += 10;

    autoTable(doc, {
      startY: yPos,
      theme: "grid",
      headStyles: {
        fillColor: [125, 224, 119], // Red fill color for headers
        textColor: [0, 0, 0], // White text color for headers
        fontStyle: "bold",
      },
      head: [
        [
          "No",
          "Nama Item",
          "Satuan",
          capitalizeStr(t("PurchasePage.quantity")),
          capitalizeStr(t("PurchasePage.discount")),
          "Harga Satuan",
          capitalizeStr(t("PurchasePage.total")),
        ],
      ],
      body: cc,
    });

    const autotableLastY = (doc.lastAutoTable as any)?.finalY;

    yPos = autotableLastY;
    yPos += 10;
    doc.text(
      `Demikian Purchase Order ini kami buat atas perhatian dan kerjasamanya kami ucapkan terima kasih.`,
      30,
      yPos
    );

    yPos += 10;
    doc.text(`Terbilang : `, 30, yPos);

    yPos += 5;
    doc.text(`# ${Terbilang(Math.round(totalSum))} : #`, 30, yPos);

    yPos += 10;
    doc.text(`Catatan : `, 30, yPos);

    yPos += 5;
    doc.text(`1. Harga Included PPN 11%`, 30, yPos);

    yPos += 5;
    doc.text(
      `2. Harga FOT Gudang PT. Pupuk Kalimantan Timur, Surabaya`,
      30,
      yPos
    );

    yPos += 5;
    doc.text(
      `3. Konfirmasi DO Pengiriman : Bapak Didik ( Hp. 081216909936)`,
      30,
      yPos
    );

    yPos += 10;
    doc.text(`Surabaya, 04 Januari 2023`, 30, yPos);

    yPos += 5;
    doc.text(`Hormat Kami,`, 30, yPos);
    doc.text(`Tim Program,`, 130, yPos);

    yPos += 5;
    doc.text(`Anugerah Tani Makmur`, 30, yPos);

    yPos += 30;
    doc.text(`Didik Triari Anoegroho`, 30, yPos);

    let totalPages = 1;

    // Get the default page height
    const pageHeight = doc.internal.pageSize.height;

    // Add footer to each page
    for (let i = 1; i <= totalPages; i++) {
      // Go to the specified page
      doc.setPage(i);

      // Set position for footer text
      const footerX = 40;
      const footerY = pageHeight - 10; // Adjust this value as needed
      const footerText = `Griya Kebraon Manis Selatan 1 / 22, Karangpilang - Surabaya | Telp 0812 1690 9936`;

      // Add footer text
      doc.text(footerText, footerX, footerY);
    }

    doc.save(`${purchase.poNo}.pdf`);
  }, [purchase, t]);

  useEffect(() => {
    if (loading == false && purchase) {
      generatePDF();
    }
  }, [generatePDF, loading, purchase]);

  return <div>{loading && <Loading />}</div>;
};

export { getStaticPaths, getStaticProps };

export default PurchPdfPage;
