const express = require("express");
const router = express.Router();
const PDFDocument = require("pdfkit");
const ExcelJS = require("exceljs");
const db = require("../db");

// === Gerar PDF ===
router.get("/:pacienteId/pdf", (req, res) => {
    const { pacienteId } = req.params;

    db.get("SELECT * FROM pacientes WHERE id = ?", [pacienteId], (err, paciente) => {
        if (err || !paciente)
            return res.status(404).json({ error: "Paciente não encontrado" });

        db.all("SELECT * FROM medicamentos WHERE paciente_id = ?", [pacienteId], (err, medicamentos) => {
            if (err) return res.status(500).json({ error: err.message });

            // === Data e nome formatado ===
            const dataAtual = new Date().toLocaleDateString("pt-BR").replace(/\//g, "-");
            const nomeArquivo = `relatorio__paciente_${paciente.nome.replace(/\s+/g, "_")}__${dataAtual}.pdf`;

            // === Criar documento PDF ===
            const doc = new PDFDocument({ margin: 50 });
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", `attachment; filename=${nomeArquivo}`);
            doc.pipe(res);

            // === Cabeçalho ===
            doc
                .fontSize(18)
                .text("Relatório do Paciente", { align: "center", underline: true });
            doc.moveDown(0.5);
            doc.fontSize(10).text(`Data de emissão: ${dataAtual}`, { align: "center" });
            doc.moveDown(1.5);

            // === Dados do paciente ===
            doc.fontSize(14).text(`Nome: ${paciente.nome}`);
            doc.fontSize(12)
                .text(`Idade: ${paciente.idade} anos`)
                .text(`Peso: ${paciente.peso} kg`)
                .text(`Altura: ${paciente.altura} m`)
                .text(`E-mail: ${paciente.email || "-"}`)
                .text(`Telefone: ${paciente.telefone || "-"}`)
                .moveDown();

            // === Histórico / Descrição ===
            doc.fontSize(14).text("Descrição / Histórico:", { underline: true });
            doc.moveDown(0.5);
            doc.fontSize(12).text(paciente.descricao || "Nenhum histórico registrado.", {
                align: "justify",
            });
            doc.moveDown();

            // === Medicamentos ===
            if (medicamentos.length > 0) {
                doc.fontSize(14).text("Medicamentos Cadastrados:", { underline: true });
                doc.moveDown(0.5);

                // Cabeçalho da "tabela"
                const startX = 50;
                let currentY = doc.y;
                const col = {
                    nome: startX,
                    dosagem: 180,
                    freq: 280,
                    qtd: 360,
                    validade: 420
                };

                doc.fontSize(12)
                    .text("Nome", col.nome, currentY)
                    .text("Dosagem", col.dosagem, currentY)
                    .text("Freq. (h)", col.freq, currentY)
                    .text("Qtd.", col.qtd, currentY)
                    .text("Validade", col.validade, currentY);

                currentY += 15;
                doc.moveTo(startX, currentY - 5).lineTo(550, currentY - 5).stroke();

                // Linhas de medicamentos
                medicamentos.forEach((m) => {
                    doc.fontSize(11)
                        .text(m.nome || "-", col.nome, currentY)
                        .text(m.dosagem || "-", col.dosagem, currentY)
                        .text(m.frequencia || "-", col.freq, currentY)
                        .text(m.quantidade || "-", col.qtd, currentY)
                        .text(m.validade || "-", col.validade, currentY);
                    currentY += 15;
                });

                doc.moveDown(1);
                doc.fontSize(12).text("Observações:");
                medicamentos.forEach((m, i) => {
                    if (m.descricao)
                        doc.text(`${i + 1}. ${m.nome}: ${m.descricao}`, { align: "justify" });
                });
            } else {
                doc.text("Nenhum medicamento cadastrado.");
            }

            // === Rodapé ===
            doc.moveDown(2);
            doc
                .fontSize(10)
                .text("Sistema: Hora do Remédio", { align: "center" })
                .text(`Relatório gerado automaticamente em ${dataAtual}`, {
                    align: "center",
                });

            doc.end();
        });
    });
});

// === Gerar Excel ===
router.get("/:pacienteId/excel", (req, res) => {
    const { pacienteId } = req.params;

    db.get("SELECT * FROM pacientes WHERE id = ?", [pacienteId], (err, paciente) => {
        if (err || !paciente) return res.status(404).json({ error: "Paciente não encontrado" });

        db.all("SELECT * FROM medicamentos WHERE paciente_id = ?", [pacienteId], async (err, medicamentos) => {
            if (err) return res.status(500).json({ error: err.message });

            const workbook = new ExcelJS.Workbook();
            const sheet = workbook.addWorksheet("Relatório");

            // Data formatada
            const dataAtual = new Date().toLocaleDateString("pt-BR").replace(/\//g, "-");

            // Nome do arquivo
            const nomeArquivo = `relatorio__paciente_${paciente.nome.replace(/\s+/g, "_")}__${dataAtual}.xlsx`;

            // Cabeçalho principal
            sheet.addRow([`Relatório do Paciente: ${paciente.nome}`]);
            sheet.addRow([`Data do Relatório: ${dataAtual}`]);
            sheet.addRow([]);

            // Dados do paciente
            sheet.addRow(["DADOS DO PACIENTE"]);
            sheet.addRow(["Campo", "Valor"]);
            sheet.addRow(["Nome", paciente.nome]);
            sheet.addRow(["Idade", paciente.idade]);
            sheet.addRow(["Peso (kg)", paciente.peso]);
            sheet.addRow(["Altura (m)", paciente.altura]);
            sheet.addRow(["E-mail", paciente.email || "-"]);
            sheet.addRow(["Telefone", paciente.telefone || "-"]);
            sheet.addRow(["Descrição / Histórico", paciente.descricao || "-"]);
            sheet.addRow([]);

            // Medicamentos
            sheet.addRow(["MEDICAMENTOS CADASTRADOS"]);
            sheet.addRow([]);
            sheet.addRow(["Nome", "Dosagem", "Frequência (h)", "Quantidade", "Validade", "Descrição"]);

            if (medicamentos.length > 0) {
                medicamentos.forEach((m) => {
                    sheet.addRow([
                        m.nome,
                        m.dosagem || "-",
                        m.frequencia || "-",
                        m.quantidade || "-",
                        m.validade || "-",
                        m.descricao || "-",
                    ]);
                });
            } else {
                sheet.addRow(["Nenhum medicamento cadastrado."]);
            }

            // Formatação básica
            sheet.getRow(1).font = { bold: true, size: 14 };
            sheet.getRow(4).font = { bold: true };
            sheet.getRow(12).font = { bold: true };
            sheet.getRow(15).font = { bold: true };

            sheet.columns = [
                { width: 25 },
                { width: 25 },
                { width: 18 },
                { width: 15 },
                { width: 18 },
                { width: 40 },
            ];

            // Envio do arquivo
            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.setHeader("Content-Disposition", `attachment; filename=${nomeArquivo}`);

            await workbook.xlsx.write(res);
            res.end();
        });
    });
});

module.exports = router;