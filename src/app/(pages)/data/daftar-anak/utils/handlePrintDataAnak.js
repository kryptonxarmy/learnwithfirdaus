// utils/handlePrint.js
export const handlePrint = (children, selectedSemester, selectedAcademicYear, semesters, academicYears) => {
  const printContent = document.getElementById("print-area").innerHTML;
  const iframe = document.createElement("iframe");
  iframe.style.position = "absolute";
  iframe.style.width = "0px";
  iframe.style.height = "0px";
  iframe.style.border = "none";
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow.document;
  const currentDate = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Get dynamic semester and academic year names
  const selectedSemesterName = selectedSemester ? 
    semesters.find(s => s.id.toString() === selectedSemester.toString())?.number || "Semua" : 
    "Semua";
  
  const selectedAcademicYearName = selectedAcademicYear ? 
    academicYears.find(y => y.id.toString() === selectedAcademicYear.toString())?.year || "Semua Tahun Ajar" : 
    "Semua Tahun Ajar";

  // Convert semester number to text (Ganjil/Genap)
  const semesterText = selectedSemesterName === "1" ? "Ganjil" : 
                      selectedSemesterName === "2" ? "Genap" : 
                      selectedSemesterName === "Semua" ? "Semua Semester" : 
                      `Semester ${selectedSemesterName}`;

  doc.write(`
    <html>
      <head>
        <title>Daftar Anak - TPA Duta Firdaus</title>
        <meta charset="UTF-8">
        <style>
          @page {
            margin: 2cm 1.5cm;
            size: A4;
          }
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body { 
            font-family: 'Times New Roman', serif;
            font-size: 12px;
            line-height: 1.4;
            color: #2c2c2c;
            background: white;
          }

          /* Header Section */
          .document-header {
            border-bottom: 3px solid #1e40af;
            padding-bottom: 20px;
            margin-bottom: 30px;
            position: relative;
          }

          .header-top {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 15px;
          }

          .logo-section {
            display: flex;
            align-items: center;
          }

          .logo-placeholder {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #1e40af, #3b82f6);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 24px;
            margin-right: 15px;
          }

          .company-info h1 {
            font-size: 24px;
            font-weight: 700;
            color: #1e40af;
            margin-bottom: 3px;
            letter-spacing: 0.5px;
          }

          .company-info p {
            font-size: 11px;
            color: #64748b;
            margin-bottom: 2px;
          }

          .document-meta {
            text-align: right;
            font-size: 10px;
            color: #64748b;
          }

          .document-meta .doc-number {
            font-weight: 600;
            color: #1e40af;
            font-size: 11px;
          }

          /* Title Section */
          .document-title {
            text-align: center;
            margin-bottom: 25px;
            padding: 15px 0;
            background: linear-gradient(90deg, #f8fafc, #e2e8f0, #f8fafc);
            border-radius: 6px;
          }

          .document-title h2 {
            font-size: 20px;
            font-weight: 700;
            color: #1e293b;
            margin-bottom: 5px;
            text-transform: uppercase;
            letter-spacing: 1px;
          }

          .document-title .subtitle {
            font-size: 12px;
            color: #64748b;
            font-style: italic;
          }

          /* Info Section */
          .info-section {
            display: flex;
            justify-content: space-between;
            margin-bottom: 25px;
            padding: 15px;
            background: #f8fafc;
            border-left: 4px solid #1e40af;
            border-radius: 0 6px 6px 0;
          }

          .info-item {
            text-align: center;
          }

          .info-item .label {
            font-size: 10px;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 3px;
          }

          .info-item .value {
            font-size: 14px;
            font-weight: 600;
            color: #1e293b;
          }

          /* Table Styles */
          .table-container {
            margin-bottom: 30px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            border-radius: 8px;
            overflow: hidden;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 11px;
          }

          thead {
            background: linear-gradient(135deg, #1e40af, #3b82f6);
            color: white;
          }

          th {
            padding: 12px 8px;
            text-align: center;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.3px;
            font-size: 10px;
            border-right: 1px solid rgba(255,255,255,0.2);
          }

          th:last-child {
            border-right: none;
          }

          tbody tr {
            border-bottom: 1px solid #e2e8f0;
          }

          tbody tr:nth-child(even) {
            background-color: #f8fafc;
          }

          tbody tr:hover {
            background-color: #e2e8f0;
          }

          td {
            padding: 10px 8px;
            text-align: center;
            vertical-align: middle;
            border-right: 1px solid #e2e8f0;
          }

          td:last-child {
            border-right: none;
          }

          td:first-child {
            font-weight: 600;
            color: #1e293b;
          }

          /* Summary Section */
          .summary-section {
            margin-top: 25px;
            padding: 15px;
            background: #f8fafc;
            border-radius: 6px;
            border: 1px solid #e2e8f0;
          }

          .summary-title {
            font-size: 12px;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .summary-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .total-count {
            font-size: 14px;
            font-weight: 700;
            color: #1e40af;
          }

          /* Footer */
          .document-footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #e2e8f0;
            display: flex;
            justify-content: space-between;
            align-items: end;
          }

          .footer-left {
            font-size: 10px;
            color: #64748b;
          }

          .signature-section {
            text-align: center;
            min-width: 200px;
          }

          .signature-title {
            font-size: 11px;
            color: #1e293b;
            margin-bottom: 50px;
            font-weight: 600;
          }

          .signature-line {
            border-bottom: 1px solid #1e293b;
            margin-bottom: 5px;
            height: 1px;
          }

          .signature-name {
            font-size: 11px;
            color: #1e293b;
            font-weight: 600;
          }

          .signature-title-below {
            font-size: 10px;
            color: #64748b;
          }

          /* Print specific */
          @media print {
            body {
              -webkit-print-color-adjust: exact;
              color-adjust: exact;
            }
            
            .page-break {
              page-break-before: always;
            }
          }

          /* Watermark */
          .watermark {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 120px;
            color: rgba(30, 64, 175, 0.03);
            font-weight: 900;
            z-index: -1;
            pointer-events: none;
          }
        </style>
      </head>
      <body>
        <div class="watermark">TPA DUTA FIRDAUS</div>
        
        <div class="document-header">
          <div class="header-top">
            <div class="logo-section">
              <div class="logo-placeholder">TDF</div>
              <div class="company-info">
                <h1>TPA DUTA FIRDAUS</h1>
                <p>Yayasan Baitush Sholihin Bandung, Kanayakan Dalam No.06 Bandung</p>
                <p>Telp/Fax: (022) 2512386 | Email: info@tpadutafirdaus.ac.id</p>
              </div>
            </div>
            <div class="document-meta">
              <div class="doc-number">DOC/TDF/ANAK/${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, "0")}/${String(new Date().getDate()).padStart(2, "0")}</div>
              <div>Tanggal Cetak: ${currentDate}</div>
              <div>Halaman 1 dari 1</div>
            </div>
          </div>
        </div>

        <div class="document-title">
          <h2>Daftar Anak Didik Aktif</h2>
          <div class="subtitle">Tahun Ajaran ${selectedAcademicYearName} - ${semesterText}</div>
        </div>

        <div class="info-section">
          <div class="info-item">
            <div class="label">Total Anak</div>
            <div class="value">${children.length} Orang</div>
          </div>
          <div class="info-item">
            <div class="label">Status</div>
            <div class="value">Aktif</div>
          </div>
          <div class="info-item">
            <div class="label">Semester</div>
            <div class="value">${semesterText}</div>
          </div>
          <div class="info-item">
            <div class="label">Tahun Ajaran</div>
            <div class="value">${selectedAcademicYearName}</div>
          </div>
        </div>

        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th style="width: 5%;">No</th>
                <th style="width: 25%;">Nama Anak</th>
                <th style="width: 20%;">Nama Orang Tua</th>
                <th style="width: 15%;">Nomor Induk</th>
                <th style="width: 15%;">Tanggal Lahir</th>
                <th style="width: 20%;">Kelompok Usia</th>
              </tr>
            </thead>
            <tbody>
              ${children
                .map(
                  (child, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td style="text-align: left; padding-left: 12px;">${child.name}</td>
                  <td style="text-align: left; padding-left: 12px;">${child.parent.user.name}</td>
                  <td>${child.studentId}</td>
                  <td>${new Date(child.birthDate).toLocaleDateString("id-ID")}</td>
                  <td>${child.class.name}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </div>

        <div class="summary-section">
          <div class="summary-title">Ringkasan</div>
          <div class="summary-content">
            <div>
              <strong>Total Anak Didik Aktif:</strong> <span class="total-count">${children.length} Orang</span>
            </div>
            <div style="font-size: 10px; color: #64748b;">
              Data per ${currentDate}
            </div>
          </div>
        </div>

        <div class="document-footer">
          <div class="footer-left">
            <div><strong>TPA Duta Firdaus</strong></div>
            <div>Dokumen ini digenerate secara otomatis oleh sistem</div>
            <div>© ${new Date().getFullYear()} TPA Duta Firdaus. All rights reserved.</div>
          </div>
          
        </div>
      </body>
    </html>
  `);

  doc.close();
  iframe.contentWindow.print();
  document.body.removeChild(iframe);
};