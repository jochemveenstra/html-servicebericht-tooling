
import { useState, useRef } from "react";
import { motion } from "framer-motion";

export default function HtmlServiceberichtGenerator() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const previewRef = useRef(null);

  const htmlHeader = `<table bgcolor="#ebf7fe" border="0" cellpadding="0" cellspacing="0" width="100%">[...]<br><br>Beste %%FIRSTNAME%%,<br><br>`;
  const htmlFooter = `<br><br>Met vriendelijke groet,<br>Klantenservice dé VakantieDiscounter<br>&nbsp;</p></td></tr></table>...</table>%%[ENDIF]%%%%[ENDIF]%%`;

  const generateHTML = () => {
    const paragraphs = input.trim().split(/\n{2,}/);
    const htmlBlocks = paragraphs
      .filter(p => p.trim())
      .map(p => `<p>${p.trim()}</p>\n<p>&nbsp;</p>`);
    const coreContent = htmlBlocks.join("\n").replace(/<p>&nbsp;<\/p>\n?$/, "");
    const finalOutput = `${htmlHeader}\n${coreContent}\n${htmlFooter}`;
    setOutput(finalOutput);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output).then(() => alert("HTML gekopieerd!"));
  };

  const insertLink = () => {
    const selection = window.getSelection();
    const selectedText = selection.toString();
    if (!selectedText) return alert("Selecteer eerst de tekst waar je een link van wilt maken.");
    const url = prompt("Plak hier de link URL:", "https://");
    const title = prompt("Geef een titel voor de link:", selectedText);
    if (!url || !title) return;
    const anchor = `<a alias="${title}" conversion="false" data-linkto="https://" href="${url}" style="font-weight:bold; color:#37b0f2; text-decoration:underline;" title="${title}">${title}</a>`;
    setInput(prev => prev.replace(selectedText, anchor));
  };

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>HTML Servicebericht Generator</h1>
      <p style={{ marginBottom: '1rem', color: '#555' }}>
        Plak hieronder je servicebericht tekst. Elke alinea wordt automatisch HTML. Selecteer tekst om een link toe te voegen.
      </p>
      <div style={{ marginBottom: '0.5rem' }}>
        <button onClick={insertLink}>Voeg link toe</button>
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={10}
        style={{ width: '100%', padding: '1rem', fontSize: '1rem' }}
        placeholder="Plak hier je tekst..."
      />
      <button
        onClick={generateHTML}
        style={{ marginTop: '1rem', padding: '0.75rem 1.5rem', fontSize: '1rem', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '4px' }}
      >
        Genereer HTML
      </button>

      {output && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{ marginTop: '2rem' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.5rem' }}>Gegenereerde HTML</h2>
            <button onClick={copyToClipboard}>Kopieer HTML</button>
          </div>
          <textarea
            value={output}
            readOnly
            rows={output.split("\n").length}
            style={{ width: '100%', fontFamily: 'monospace', padding: '1rem', fontSize: '0.9rem' }}
          />
          <h2 style={{ fontSize: '1.5rem', marginTop: '2rem' }}>Live Preview</h2>
          <div
            ref={previewRef}
            style={{ border: '1px solid #ccc', padding: '1rem', backgroundColor: '#fff' }}
            dangerouslySetInnerHTML={{ __html: output }}
          ></div>
        </motion.div>
      )}
    </div>
  );
}
