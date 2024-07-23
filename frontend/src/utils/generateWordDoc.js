import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell } from "docx";
import { saveAs } from "file-saver";
import { getSharedData } from './reportData';
import { sharedStyles } from './styles';

const generateWordDoc = (user) => {
  const data = getSharedData(user);

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: data.header,
                bold: true,
                size: sharedStyles.header.fontSize * 2,
              }),
            ],
            alignment: 'center',
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Personal Information",
                bold: true,
                size: sharedStyles.sectionHeader.fontSize * 2,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun(`Email: ${data.personalInfo.email}`),
              new TextRun({
                size: sharedStyles.text.fontSize * 2,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun(`Phone: ${data.personalInfo.phone}`),
              new TextRun({
                size: sharedStyles.text.fontSize * 2,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun(`Address: ${data.personalInfo.address}`),
              new TextRun({
                size: sharedStyles.text.fontSize * 2,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Education",
                bold: true,
                size: sharedStyles.sectionHeader.fontSize * 2,
              }),
            ],
          }),
          ...data.education.map(edu => new Paragraph({
            children: [
              new TextRun(edu),
              new TextRun({
                size: sharedStyles.text.fontSize * 2,
              }),
            ],
          })),
          new Paragraph({
            children: [
              new TextRun({
                text: "Professional Experience",
                bold: true,
                size: sharedStyles.sectionHeader.fontSize * 2,
              }),
            ],
          }),
          ...data.professionalExperience.map(exp => [
            new Paragraph({
              children: [
                new TextRun(exp.title),
                new TextRun({
                  text: ` ${exp.period}`,
                  italics: true,
                  size: sharedStyles.subText.fontSize * 2,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun("Responsibilities:"),
                new TextRun({
                  size: sharedStyles.subText.fontSize * 2,
                }),
              ],
            }),
            ...exp.responsibilities.map(res => new Paragraph({
              children: [
                new TextRun(`- ${res}`),
                new TextRun({
                  size: sharedStyles.subText.fontSize * 2,
                }),
              ],
            })),
          ]).flat(),
          new Paragraph({
            children: [
              new TextRun({
                text: "Simple Table",
                bold: true,
                size: sharedStyles.sectionHeader.fontSize * 2,
              }),
            ],
          }),
          new Table({
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph("Header1")],
                  }),
                  new TableCell({
                    children: [new Paragraph("Header2")],
                  }),
                  new TableCell({
                    children: [new Paragraph("Header3")],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph("Row1Col1")],
                  }),
                  new TableCell({
                    children: [new Paragraph("Row1Col2")],
                  }),
                  new TableCell({
                    children: [new Paragraph("Row1Col3")],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph("Row2Col1")],
                  }),
                  new TableCell({
                    children: [new Paragraph("Row2Col2")],
                  }),
                  new TableCell({
                    children: [new Paragraph("Row2Col3")],
                  }),
                ],
              }),
            ],
          }),
        ],
      },
    ],
  });

  Packer.toBlob(doc).then((blob) => {
    saveAs(blob, "document.docx");
  }).catch((error) => {
    console.error("Error generating Word document:", error);
  });
};

export default generateWordDoc;
